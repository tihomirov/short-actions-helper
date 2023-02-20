import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { useStores } from '../../hooks';
import s from './style.scss';

type HeaderProps = Readonly<{
  hostname?: string;
}>;

export const Header: FC<HeaderProps> = observer(({ hostname }) => {
  const navigate = useNavigate();
  const { userStore } = useStores();
  const { currentUser } = userStore;

  const onLogout = useCallback(async () => {
    await userStore.logout();
    navigate('login');
  }, [navigate, userStore]);

  return (
    <header className={s.header}>
      <div className={s.headerLink}>
        <div className={s.headerTitle}>Remote Shortcuts</div>
        {hostname !== undefined && <span className={s.headerSubTitle}>{hostname}</span>}
      </div>
      {currentUser && <Avatar onClick={onLogout}>{currentUser.email[0].toUpperCase()}</Avatar>}
    </header>
  );
});
