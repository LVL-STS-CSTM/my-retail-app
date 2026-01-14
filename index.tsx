
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Find the root DOM element where the React app will be mounted.
const rootElement = document.getElementById('root');
if (!rootElement) {
  // This error is thrown if the 'root' element is not found in the index.html file.
  throw new Error("Could not find root element to mount to");
}

// Create a root for the React application.
const root = ReactDOM.createRoot(rootElement);

// Render the main App component into the root element.
// React.StrictMode is a wrapper that helps with highlighting potential problems in an application.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);