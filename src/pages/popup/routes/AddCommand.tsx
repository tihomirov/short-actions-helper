import React, { FC, useCallback, useState, useEffect, ChangeEvent } from 'react'
import { useParams } from "react-router-dom";
import { commandService, tabsService } from "../services";
import { ElementData, ElementEvent } from '../../../common'
import { Command } from '../types'

export const AddCommand: FC = () => {
  const { hostname } = useParams();
  const [command, setCommand] = useState<Command | undefined>(undefined);

  const interceptElement = useCallback(async () => {
    if (!command) {
      return;
    }
    await commandService.savePendingCommand(command)
    const response = await tabsService.runInterceptElement();

    if (response === 'ok') {
      console.log('Intercept', response);
      window.close();
    }
  }, [command]);

  const removeInterceptedElement = useCallback(async () => {
    await chrome.storage.sync.remove('__test_intercept_element');
  }, []);

  const removePendingCommand = useCallback(async () => {
    await chrome.storage.sync.remove('__test_pending_command');
  }, []);

  const onCommandNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (!command) {
      return;
    }

    setCommand({
      ...command,
      name: event.target.value,
    });
  }, [command]);

  useEffect(() => {
    const loadInterceptElement = async () => {
      console.log('!!! start getPendingCommand')
      const pendingCommand = await commandService.getPendingCommand();
      console.log('!!! end getPendingCommand', pendingCommand)
      setCommand(pendingCommand || {
        name: '',
        actions: [{
          event: ElementEvent.Click,
          element: {} as ElementData
        }]
      })
    }
    
    loadInterceptElement();
  }, [])

  if (!command) {
    return <span>Loading...</span>
  }

  return (
    <>
      <h3>Add Command to {hostname}</h3>

      <form>
        <label>Name:
          <input type="text" name="name" value={command.name} onChange={onCommandNameChange} />
        </label>
      </form>

      {command.actions.map((action, index) => (
        <div key={index}>
          <span>Action {index + 1}</span>
          <span>Event {action.event}</span>
          <span>Element Tag Name {action.element?.tagName}</span>
          <span>Element Inner Text {action.element?.innerText}</span>
        </div>
      ))}

      <input type="submit" value="Submit" />

      <button onClick={interceptElement}>Intercept Element</button>
      <button onClick={removeInterceptedElement}>Remove Intercept Element</button>
      <button onClick={removePendingCommand}>Remove Pending Command</button>
    </>
  )
}
