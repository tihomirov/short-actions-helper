import React, { FC, useCallback, useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from "react-router-dom";
import { commandService, tabsService } from "../services";
import { ElementData, ElementEvent } from '../../../common'
import { Command } from '../types'

export const NewCommand: FC = () => {
  const navigate = useNavigate();
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

  const onSubmitCommand = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const hostname = await tabsService.getCurrentTabHostname();

    if (!command || !hostname) {
      return;
    }

    await commandService.saveCommand(hostname, command);
    await removeInterceptedElement();
    await removePendingCommand();
    
    navigate(`/`)
  }, [command, removePendingCommand, removePendingCommand]);

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
      <h3>Add Command</h3>

      <form onSubmit={onSubmitCommand}>
        <label>Name:
          <input type="text" name="name" value={command.name} onChange={onCommandNameChange} />
        </label>

        {command.actions.map((action, index) => (
          <div key={index}>
            <span>Action {index + 1}</span>
            <span>Event {action.event}</span>
            <span>Element Tag Name {action.element?.tagName}</span>
            <span>Element Inner Text {action.element?.innerText}</span>
          </div>
        ))}

        <input type="submit" value="Save Command" />

      </form>

      <button onClick={interceptElement}>Intercept Element</button>
      <button onClick={removeInterceptedElement}>Remove Intercept Element</button>
      <button onClick={removePendingCommand}>Remove Pending Command</button>
    </>
  )
}
