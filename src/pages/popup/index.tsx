import React from 'react'
import { render } from 'react-dom'
import {
  createMemoryRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import {Root} from './routes/Root'
import {Commands} from './routes/Commands'

const router = createMemoryRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Navigate to="/commands" replace={true} />,
      },
      {
        path: "commands",
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
