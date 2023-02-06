import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Outlet, Link } from 'react-router-dom';
import { Box } from '@mui/material';
import { useStores } from '../hooks';
import s from './style.scss';

export const Root: FC = observer(() => {
  const { tabStore } = useStores();

  if (tabStore.currentTabLoading) {
    return <div>Loading</div>;
  }

  if (tabStore.currentTabMissing) {
    return <div>Can not get current Browser Tab</div>;
  }

  return (
    <div className={s.app}>
      <header className={s.header}>
        <Link className={s.headerLink} to="/">
          <div className={s.headerTitle}>Lazy Actions Widget</div>
          <span className={s.headerSubTitle}>{tabStore.hostname}</span>
        </Link>
      </header>
      <Box padding="12px" display="flex" flexDirection="column">
        <Outlet />
      </Box>
    </div>
  );
});
