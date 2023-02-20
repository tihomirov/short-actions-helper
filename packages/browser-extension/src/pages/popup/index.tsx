import React from 'react';
import { render } from 'react-dom';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { Root } from './routes/Root';
import { Login } from './routes/Login';
import { Home } from './routes/Home';
import { NewCommand } from './routes/NewCommand';
import { StoreProvider, RootStore } from './stores';
import { Register } from './routes/Register';

const router = createMemoryRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'commands/new',
        element: <NewCommand />,
      },
    ],
  },
]);

const root = document.querySelector('#root');
const rootStore = new RootStore();

render(
  <React.StrictMode>
    <StoreProvider store={rootStore}>
      <CssBaseline />
      <RouterProvider router={router} />
    </StoreProvider>
  </React.StrictMode>,
  root,
);
