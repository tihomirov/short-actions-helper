import React, { FC } from "react";
import { Commands } from "../../types";
import { CommandItem } from "../command-item";

type CommandsListProps = Readonly<{
  commands: Commands;
  hostname: string;
}>;

export const CommandsList: FC<CommandsListProps> = ({ commands, hostname }) => {
  return (
    <>
      {commands.map((command, index) => (
        <CommandItem key={index} command={command} hostname={hostname}/>
      ))}
    </>
  )
}