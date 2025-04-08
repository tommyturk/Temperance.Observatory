// src/contexts/useSignalR.js
import { useContext } from 'react';
import { SignalRContext } from './SignalRContext';

export const useSignalR = () => {
  return useContext(SignalRContext);
};