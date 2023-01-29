import React, {FC, useEffect, useState} from "react";
import { commandService } from "../../services";
import { Commands } from "../../types";
import { CommandItem } from "../command-item";

export const CommandsList: FC = () => {
  const [commands, setCommands] = useState<Commands | undefined>(undefined)

  useEffect(() => {
    setCommands(commandService.getCommands())
  }, []);

  if(!commands) {
    return <div>Loading...</div>
  }

  return (
    <>
      {commands.map((command, index) => (
        <CommandItem key={index} command={command}/>
      ))}
    </>
  )
}