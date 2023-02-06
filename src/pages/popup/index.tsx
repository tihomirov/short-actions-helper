import React from 'react';
import { render } from 'react-dom';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { Root } from './routes/Root';
import { Home } from './routes/Home';
import { NewCommand } from './routes/NewCommand';
import { StoreProvider, RootStore } from './stores';

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
