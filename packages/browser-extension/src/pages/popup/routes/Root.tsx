import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { Header } from '../components/header';
import { useStores } from '../hooks';
import s from './style.scss';

export const Root: FC = observer(() => {
  const { tabStore } = useStores();

  return (
    <div className={s.app}>
      <Header hostname={tabStore.hostname} />
      <Box width="100%" height="100%" padding="12px" display="flex" flexDirection="column">
        {tabStore.currentTabLoading ? (
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