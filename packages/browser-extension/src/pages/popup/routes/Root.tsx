import { Handyman } from '@mui/icons-material';
import { Box, CircularProgress, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from '../components/header';
import { useStores } from '../hooks';
import s from './style.scss';

export const Root: FC = observer(() => {
  const { tabStore, userStore, commandStore, connectionStore } = useStores();
  const loading = userStore.currentUserLoading || tabStore.currentTabLoading || commandStore.isPendingCommandLoading;

  if (connectionStore.hasConnectionError) {
    return (
      <div className={s.app}>
        <Box
          width="100%"
          height="100%"
          padding="12px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Handyman sx={{ position: 'absolute', top: '48px' }} />
          <Typography textAlign="center" variant="h4">
            Something wend wrong.
          </Typography>
          <Typography textAlign="center" variant="h6">
            We are fixing it!
          </Typography>
        </Box>
      </div>
    );
  }

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
