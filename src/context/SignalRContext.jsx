import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';

const SignalRContext = createContext();

export const SignalRProvider = ({ children }) => {
    const connection = useRef(null);
    const [connectionState, setConnectionState] = useState('disconnected');
    const listeners = useRef(new Map());
  
    useEffect(() => {
      let isUnmounted = false;
    
      const initializeConnection = async () => {
        const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7100/backfillHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
        })
        // Add automatic reconnection settings
        .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
            if (retryContext.elapsedMilliseconds < 60000) {
            return Math.random() * 5000; // 0-5 seconds
            }
            return null; // Stop reconnecting
        }
        })
        .build();

        newConnection.on("HubError", error => {
            console.error("Hub error:", error);
          });
  
        newConnection.onreconnecting(error => {
          if (!isUnmounted) {
            console.warn("SignalR reconnecting:", error);
            setConnectionState('reconnecting');
          }
        });
  
        newConnection.onreconnected(connectionId => {
          if (!isUnmounted) {
            console.log("SignalR reconnected. New connection ID:", connectionId);
            setConnectionState('connected');
          }
        });
  
        try {
          // 3. Start LOCAL connection
          await newConnection.start();
          
          if (!isUnmounted) {
            // 4. Only assign to ref AFTER successful connection
            connection.current = newConnection;
            setConnectionState('connected');
            console.log("SignalR connected");
          }
        } catch (error) {
          if (!isUnmounted) {
            console.error("Error starting SignalR connection:", error);
          }
        }
      };
  
      initializeConnection();
  
      return () => {
        isUnmounted = true;
        if (connection.current) {
          connection.current.stop();
        }
      };
    }, []);
  
  const addListener = (eventName, callback) => {
    if (connection.current) {
      connection.current.on(eventName, callback);
      listeners.current.set(eventName, callback);
    }
  };

  const removeListener = (eventName) => {
    if (connection.current) {
      connection.current.off(eventName);
      listeners.current.delete(eventName);
    }
  };


  return (
    <SignalRContext.Provider value={{
      connection: connection.current,
      connectionState,
      addListener,
      removeListener,
      invoke: (method, ...args) => connection.current?.invoke(method, ...args)
    }}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error('useSignalR must be used within a SignalRProvider');
  }
  return context;
};