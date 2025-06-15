import React from 'react';
import ReactDOM from 'react-dom/client';
import 'index.css'; // Importing global styles
import App from 'App'; // Importing your main App component

// Find the root div from the public/index.html file
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render your App component into the root div
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
