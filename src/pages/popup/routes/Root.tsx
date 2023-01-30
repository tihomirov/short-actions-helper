import React, {FC} from 'react'
import { Outlet, Link } from "react-router-dom";
import s from './style.scss'

export const Root: FC = () => {
  return (
    <div className={s.app}>
      <Link to="/">
        <h1>Lazy Actions Widget</h1>
      </Link>
      <Outlet />
    </div>
  )
}
