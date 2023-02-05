import React, { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useLoaderData, Navigate } from 'react-router-dom';
import { CommandsList } from '../components/commands-list';
import { tabsService, commandService } from '../services';
import { useStores } from '../hooks';

type LoaderData = Readonly<{
  hostname: string | undefined;
  hasPendingCommand: boolean;
}>;

export async function loader(): Promise<LoaderData> {
  const [hostname, pendingCommand] = await Promise.all([
    tabsService.getCurrentTabHostname(),
    commandService.getPendingCommand(),
  ]);

  return {
    hostname,
    hasPendingCommand: !!pendingCommand,
  };
}

export const Home: FC = observer(() => {
  const { hostname, hasPendingCommand } = useLoaderData() as LoaderData;
  const { commandStore } = useStores();

  useEffect(() => {
    if (!hostname) {
      return;
    }

    commandStore.loadCommands(hostname);
  }, []);

  if (!hostname) {
    return <div>This site is not availale for now</div>;
  }

  if (hasPendingCommand) {
    return <Navigate to={`commands/new`} replace={true} />;
  }

  if (commandStore.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CommandsList commands={commandStore.commands} hostname={hostname} />
    </>
  );
});
