// App.js
import React from "react";
import './App.css';
import Dashboard from "./components/Dashboard.jsx";
import { SignalRProvider } from "./context/SignalRContext.jsx";

function App() {
  return (
    <div className="w-full min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <SignalRProvider>
        <Dashboard />
      </SignalRProvider>
    </div>
  );
}

export default App;