import React from 'react'
import { render } from 'react-dom'
import {
  createMemoryRouter,
  RouterProvider,
} from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import { Root } from './routes/Root'
import { Home, loader as homeLoader } from './routes/Home'
import { NewCommand } from './routes/NewCommand'


const router = createMemoryRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        loader: homeLoader,
        element: <Home />,
      },
      {
        path: "commands/new",
        element: <NewCommand />,
      },
    ],
  },
]);

const root = document.querySelector('#root')

render(
  (
    <React.StrictMode>
      <CssBaseline />
      <RouterProvider router={router} />
    </React.StrictMode>
  ), 
  root
);
