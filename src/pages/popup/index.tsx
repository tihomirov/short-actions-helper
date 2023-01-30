import React from 'react'
import { render } from 'react-dom'
import {
  createMemoryRouter,
  RouterProvider,
} from "react-router-dom";
import {Root} from './routes/Root'
import {Commands, loader as commandsLoader} from './routes/Commands'
import {Home, loader as homeLoader} from './routes/Home'

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
        path: "commands/:hostname",
        loader: commandsLoader,
        element: <Commands />,
      },
    ],
  },
]);

const root = document.querySelector('#root')

render(
  (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  ), 
  root
);
