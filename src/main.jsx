import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie'; // 1. Importar el proveedor
import { AuthProvider } from './context/Auth';
import { AppRouter } from './routes/Router.jsx'; 
import { ToastContainer } from 'react-toastify';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Envolver la aplicación con CookiesProvider */}
    <CookiesProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
          <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
      </AuthProvider>
    </CookiesProvider>
  </React.StrictMode>,
);