import React, { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useLoaderData, Navigate } from 'react-router-dom';
import { CommandsList } from '../components/commands-list';
import { commandService } from '../services';
import { useStores } from '../hooks';

type LoaderData = Readonly<{
  hasPendingCommand: boolean;
}>;

export async function loader(): Promise<LoaderData> {
  const pendingCommand = await commandService.getPendingCommand();

  return {
    hasPendingCommand: !!pendingCommand,
  };
}

export const Home: FC = observer(() => {
  const { hasPendingCommand } = useLoaderData() as LoaderData;
  const { commandStore } = useStores();

  useEffect(() => {
    commandStore.loadCommands();
  }, []);

  if (hasPendingCommand) {
    return <Navigate to={`commands/new`} replace={true} />;
  }

  if (commandStore.isLoading) {
    return <div>Loading...</div>;
  }

  return <CommandsList commands={commandStore.commands} />;
});
