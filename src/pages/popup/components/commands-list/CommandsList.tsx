import React, { FC } from "react";
import { Box } from '@mui/material';
import { Commands } from "../../types";
import { CommandItem } from "../command-item";
import { NewCommandButton } from "../new-command-button";

type CommandsListProps = Readonly<{
  commands: Commands;
  hostname: string;
}>;

export const CommandsList: FC<CommandsListProps> = ({ commands, hostname }) => {
  if (commands.length === 0) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <h3>There are no Commands yet</h3>
        <NewCommandButton />
      </Box>
    )
  }

  return (
    <>
      {commands.map((command, index) => (
        <CommandItem key={index} command={command} hostname={hostname}/>
      ))}
      <NewCommandButton />
    </>
  )
}