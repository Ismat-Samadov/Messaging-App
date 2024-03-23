import React from 'react';
import ReactDOM from 'react-dom/client';
import WebFont from 'webfontloader';
import AuthProvider from 'react-auth-kit/AuthProvider';
import createStore from 'react-auth-kit/createStore';
import { Toaster } from 'react-hot-toast';

import './index.css';

import Router from '../Router';

const store = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:'
});

WebFont.load({
  google: {
    families: ['Montserrat:300,400,700', 'Playfair Display:400,500,700']
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider store={store}>
      <Toaster toastOptions={{ style: { fontSize: '1.5rem', fontWeight: '400', fontFamily: 'Montserrat', marginTop: '3rem' } }} />
      <Router />
    </AuthProvider>
  </React.StrictMode>
);
