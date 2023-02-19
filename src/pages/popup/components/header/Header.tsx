import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import s from './style.scss';

type HeaderProps = Readonly<{
  hostname?: string;
}>;

export const Header: FC<HeaderProps> = ({ hostname }) => {
  return (
    <header className={s.header}>
      <Link className={s.headerLink} to="/">
        <div className={s.headerTitle}>Remote Shortcuts</div>
        {hostname !== undefined && <span className={s.headerSubTitle}>{hostname}</span>}
      </Link>
    </header>
  );
};
