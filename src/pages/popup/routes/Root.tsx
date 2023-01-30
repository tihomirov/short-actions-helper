import React, {FC} from 'react'
import { Outlet } from "react-router-dom";
import s from './style.scss'

export const Root: FC = () => {
  return (
    <div className={s.app}>
      <h1>Lazy Actions Widget</h1>
      <Outlet />
    </div>
  )
}
