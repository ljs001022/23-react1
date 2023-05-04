import React from 'react';
import ReactDOM from 'react-dom/client';
import LandingPage from './chapter_09/LandingPage';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LandingPage />
  </React.StrictMode>
);

reportWebVitals();
