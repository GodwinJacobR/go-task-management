// index.tsx or App.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './App.css';

// Log a message to verify a new instance is created for each tab
console.log('App initialized with tab ID:', Math.random().toString(36).substring(2, 10));

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);