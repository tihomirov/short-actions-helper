import { Avatar } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useStores } from '../../hooks';
import s from './style.scss';

type HeaderProps = Readonly<{
  hostname?: string;
}>;

export const Header: FC<HeaderProps> = observer(({ hostname }) => {
  const navigate = useNavigate();
  const { userStore, authStore } = useStores();
  const { currentUser } = userStore;

  const onLogout = useCallback(async () => {
    await authStore.logout();
    navigate('/login');
  }, [navigate, authStore]);

  const onTitleClick = useCallback(async () => navigate('/'), [navigate]);

  return (
    <header className={s.header}>
      <div className={s.headerLink}>
        <div className={s.headerTitle} onClick={onTitleClick}>
          Remote Shortcuts
        </div>
        {hostname !== undefined && <span className={s.headerSubTitle}>{hostname}</span>}
      </div>
      {currentUser && <Avatar onClick={onLogout}>{currentUser.email[0].toUpperCase()}</Avatar>}
    </header>
  );
});
