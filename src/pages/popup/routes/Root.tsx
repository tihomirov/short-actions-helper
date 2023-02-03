import React, { FC, useEffect, useState } from 'react'
import { Outlet, Link } from "react-router-dom";
import { tabsService } from '../services';
import s from './style.scss'

export const Root: FC = () => {
  const [hostname, setHostname] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchHostname = async () => {
      const currentTabHostname = await tabsService.getCurrentTabHostname();
      setHostname(currentTabHostname)
    };

    void fetchHostname();
  }, []);

  if (!hostname) {
    return null
  }

  return (
    <div className={s.app}>
      <header className={s.header}>
        <Link className={s.headerLink} to="/">
          <div className={s.headerTitle}>Lazy Actions Widget</div>
          <span className={s.headerSubTitle}>{hostname}</span>
        </Link>
      </header>
      <Outlet />
    </div>
  )
}
