import { Box, Tab, Tabs } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { FC, SyntheticEvent, useCallback, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { CommandsList } from '../components/commands-list';
import { useStores } from '../hooks';
import { CommandsType } from '../types';

export const Home: FC = observer(() => {
  const { commandStore, tabStore, userStore } = useStores();

  const onChangeCommandsType = useCallback(
    (_event: SyntheticEvent, value: CommandsType) => commandStore.setCommandsType(value),
    [],
  );

  useEffect(() => {
    if (userStore.currentUser) {
      commandStore.loadCommands();
    }
  }, [commandStore.commandsType]);

  if (!userStore.currentUser) {
    return <Navigate to="login" replace={true} />;
  }

  if (commandStore.pendingCommand) {
    return <Navigate to={`commands/new`} replace={true} />;
  }

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={commandStore.commandsType} onChange={onChangeCommandsType}>
          <Tab value={CommandsType.All} label="All" />
          {tabStore.hostname && <Tab value={CommandsType.Hostname} label={tabStore.hostname} />}
        </Tabs>
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" paddingTop="6px">
        <CommandsList />
      </Box>
    </>
  );
});
