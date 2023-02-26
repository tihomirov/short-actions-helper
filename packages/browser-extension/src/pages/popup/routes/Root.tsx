import { Box, CircularProgress } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from '../components/header';
import { useStores } from '../hooks';
import s from './style.scss';

export const Root: FC = observer(() => {
  const { tabStore, userStore, commandStore } = useStores();
  const loading = userStore.currentUserLoading || tabStore.currentTabLoading || commandStore.isPendingCommandLoading;

  return (
    <div className={s.app}>
      <Header hostname={tabStore.hostname} />
      <Box width="100%" height="100%" padding="12px" display="flex" flexDirection="column">
        {loading ? (
          <Box margin="auto">
            <CircularProgress />
          </Box>
        ) : (
          <Outlet />
        )}
      </Box>
    </div>
  );
});
