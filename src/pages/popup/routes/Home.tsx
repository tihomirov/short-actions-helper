import React, { FC } from 'react'
import { useLoaderData, Link, Navigate } from "react-router-dom";
import { tabsService, commandService } from '../services';

type LoaderData = Readonly<{
  currentTabHostname: string | undefined;
  hasPendingCommand: boolean;
}>;

export async function loader(): Promise<LoaderData> {

  const [currentTabHostname, pendingCommand] = await Promise.all([
    tabsService.getCurrentTabHostname(),
    commandService.getPendingCommand()
  ]);
  return { 
    currentTabHostname,
    hasPendingCommand: !!pendingCommand,
  };
}

export const Home: FC = () => {
  const { currentTabHostname, hasPendingCommand } = useLoaderData() as LoaderData;

  if (hasPendingCommand) {
    return <Navigate to={`commands/${currentTabHostname}/new`} replace={true} />
  }

  if (!currentTabHostname) {
    return (
      <div>This site is not availale</div>
    )
  }

  return (
    <>
      <h3>{currentTabHostname}</h3>
      <Link to={`commands/${currentTabHostname}`}>
        <div>Check all commands</div>
      </Link>
      <Link to={`commands/${currentTabHostname}/new`}>
        <div>Add comamnd</div>
      </Link>
    </>
  )
}
