import React, {FC} from "react";
import { Commands } from "../../types";
import { CommandItem } from "../command-item";

type CommandsListProps = Readonly<{
  commands: Commands;
}>;

export const CommandsList: FC<CommandsListProps> = ({commands}) => {
  return (
    <>
      {commands.map((command, index) => (
        <CommandItem key={index} command={command}/>
      ))}
    </>
  )
}