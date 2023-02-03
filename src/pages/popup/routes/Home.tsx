import React, { FC } from 'react'
import { useLoaderData, Link, Navigate } from "react-router-dom";
import { CommandsList } from '../components/commands-list'
import { tabsService, commandService } from '../services';
import { Commands } from "../types";

type LoaderData = Readonly<{
  hostname: string | undefined;
  commands: Commands;
  hasPendingCommand: boolean;
}>;

export async function loader(): Promise<LoaderData> {
  const [hostname, pendingCommand] = await Promise.all([
    tabsService.getCurrentTabHostname(),
    commandService.getPendingCommand()
  ]);

  const commands = hostname ? await commandService.getCommands(hostname) : [];

  return { 
    hostname,
    commands,
    hasPendingCommand: !!pendingCommand,
  };
}

export const Home: FC = () => {
  const { hostname, hasPendingCommand, commands } = useLoaderData() as LoaderData;

  if (!hostname) {
    return (
      <div>This site is not availale</div>
    )
  }

  if (hasPendingCommand) {
    return <Navigate to={`commands/new`} replace={true} />
  }

  return (
    <>
      <CommandsList commands={commands} hostname={hostname}/>
      <Link to={`commands/new`}>New Comamnd</Link>
    </>
  )
}
