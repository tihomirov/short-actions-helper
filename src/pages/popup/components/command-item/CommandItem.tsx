import React, { FC, useCallback } from "react";
import { Command } from "../../types";
import { actionService } from "../../services";

type CommandProps = Readonly<{
  command: Command;
}>

export const CommandItem: FC<CommandProps> = ({ command }) => {
  const onRun = useCallback(() => {
    actionService.runActions(command.actions)
  }, [command]);

  return (
    <div>
      <div>Command: {command.name}</div>
      <button onClick={onRun}>Run</button>
    </div>
  )
}