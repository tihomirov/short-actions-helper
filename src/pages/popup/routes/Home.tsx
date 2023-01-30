import React, { FC } from 'react'
import { useLoaderData, Link } from "react-router-dom";
import { tabsService } from '../services';

type LoaderData = Readonly<{
  currentTabHostname: string | undefined;
}>;

export async function loader(): Promise<LoaderData> {
  const currentTabHostname = await tabsService.getCurrentTabHostname();
  return { currentTabHostname };
}

export const Home: FC = () => {
  const { currentTabHostname } = useLoaderData() as LoaderData;

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
