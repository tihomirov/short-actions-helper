import React, { FC, useCallback } from "react";
import { Command } from "../../types";
import { actionService, commandService } from "../../services";

type CommandProps = Readonly<{
  command: Command;
  hostname: string;
}>

export const CommandItem: FC<CommandProps> = ({ command, hostname }) => {

  const onRun = useCallback(() => {
    actionService.runActions(command.actions)
  }, [command]);

  const onDelete = useCallback(() => {
    commandService.deleteCommand(hostname, command)
  }, [command]);

  return (
    <div>
      <div>Command: {command.name}</div>
      <button onClick={onRun}>Run</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  )
}