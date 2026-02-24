import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import "primereact/resources/themes/lara-light-blue/theme.css"; // theme
import "primereact/resources/primereact.min.css"; // core

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
