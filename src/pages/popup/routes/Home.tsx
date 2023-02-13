import React, { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { CommandsList } from '../components/commands-list';
import { useStores } from '../hooks';

export const Home: FC = observer(() => {
  const { commandStore } = useStores();

  useEffect(() => {
    commandStore.loadCommands();
    commandStore.loadPendingCommands();
  }, []);

  if (commandStore.isLoading || commandStore.isPendingCommandLoading) {
    return <div>Loading...</div>;
  }

  if (commandStore.pendingCommand) {
    return <Navigate to={`commands/new`} replace={true} />;
  }

  return <CommandsList commands={commandStore.commands} />;
});
