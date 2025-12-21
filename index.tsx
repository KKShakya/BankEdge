import React from 'react';
import ReactDOM from 'react-dom/client';

// Initialize Firebase *before* importing the App component.
// This ensures that all Firebase services are ready before any UI component tries to use them.
import './services/firebase';
import App from './App';

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }
  
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error: any) {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: sans-serif;">
        <h1>Application Error</h1>
        <p style="color: red; margin-bottom: 1rem;">${error.message}</p>
        <p>This is likely caused by a missing or invalid Firebase configuration. Please check your <code>.env</code> file and make sure all the <code>VITE_FIREBASE_*</code> variables are set correctly.</p>
        <p>After creating or updating the file, you must restart your development server.</p>
      </div>
    `;
  }
  console.error(error);
}