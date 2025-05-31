/*
Стартира приложението и обвива го с AuthProvider, за да имаме достъп до потребителя във всички компоненти
*/

import React from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './router.jsx';
import { AuthProvider } from './context/AuthContext';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </React.StrictMode>
);
