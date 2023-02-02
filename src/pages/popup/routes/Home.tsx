import React, { FC } from 'react'
import { useLoaderData, Link, Navigate } from "react-router-dom";
import { tabsService, commandService } from '../services';

type LoaderData = Readonly<{
  currentTabHostname: string | undefined;
  hasPendingInterceptedElement: boolean;
}>;

export async function loader(): Promise<LoaderData> {

  const [currentTabHostname, pendingInterceptedElement] = await Promise.all([
    tabsService.getCurrentTabHostname(),
    commandService.getPendingInterceptedElement()
  ]);
  return { 
    currentTabHostname,
    hasPendingInterceptedElement: !!pendingInterceptedElement,
  };
}

export const Home: FC = () => {
  const { currentTabHostname, hasPendingInterceptedElement } = useLoaderData() as LoaderData;

  if (hasPendingInterceptedElement) {
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
