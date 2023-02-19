import React, { FC, useEffect, SyntheticEvent, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { Tabs, Tab, Box } from '@mui/material';
import { CommandsList } from '../components/commands-list';
import { useStores } from '../hooks';
import { CommandsType } from '../types';

export const Home: FC = observer(() => {
  const { commandStore, tabStore } = useStores();

  const onChangeCommandsType = useCallback(
    (_event: SyntheticEvent, value: CommandsType) => commandStore.setCommandsType(value),
    [],
  );

  useEffect(() => {
    commandStore.loadPendingCommands();
  }, []);

  useEffect(() => {
    commandStore.loadCommands();
  }, [commandStore.commandsType]);

  if (commandStore.isPendingCommandLoading) {
    return <div>Loading...</div>;
  }

  if (commandStore.pendingCommand) {
    return <Navigate to={`commands/new`} replace={true} />;
  }

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={commandStore.commandsType} onChange={onChangeCommandsType}>
          <Tab value={CommandsType.General} label="General" />
          {tabStore.hostname && <Tab value={CommandsType.Hostname} label={tabStore.hostname} />}
        </Tabs>
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" paddingTop="6px">
        <CommandsList />
      </Box>
    </>
  );
});
