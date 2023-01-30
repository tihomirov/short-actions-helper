import React, { FC } from 'react'
import { useLoaderData, LoaderFunctionArgs, useParams } from "react-router-dom";
import { CommandsList } from '../components/commands-list'
import { commandService } from "../services";
import { Commands as CommandsType } from "../types";

type LoaderData = Readonly<{
  commands: CommandsType;
}>;

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderData> {
  const { hostname } = params;

  if (!hostname) {
    return { commands: [] }
  }
    
  const commands = commandService.getCommands(hostname)
  return { commands };
}

export const Commands: FC = () => {
  const { hostname } = useParams();
  const { commands } = useLoaderData() as LoaderData;

  return (
    <>
      <h3>Commands List for {hostname}</h3>
      <CommandsList commands={commands}/>
    </>
  )
}
