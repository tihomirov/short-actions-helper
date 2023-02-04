import React, { FC, useState, useEffect, useCallback } from 'react';
import { Box, TextField, FormControl, Select, MenuItem, Button, InputLabel, Tooltip, IconButton, SelectChangeEvent } from '@mui/material';
import { Colorize } from '@mui/icons-material';
import { commandService, tabsService } from "../services";
import { ElementEvent, Action } from '../../../common';
// import { Command } from '../types';

const elementEventNames: Record<ElementEvent, string> = {
  [ElementEvent.Click]: 'Click',
  [ElementEvent.Focus]: 'Focus',
}
const elementEvents = Object.values(ElementEvent);

export const NewCommand: FC = () => {
  // const navigate = useNavigate();
  const [loadingPendingCommand, setLoadingPendingCommand] = useState<boolean>(true);
  const [commandName, setCommandName] = useState<string>('');
  const [commandActions, setCommandActions] = useState<Array<Partial<Action>>>([]);
  // const [command, setCommand] = useState<Command>({
  //   name: '',
  //   actions: [{
  //     event: '',
  //     element: {
  //       tagName: '',
  //       innerText: '',
  //     }
  //   }]
  // });

  // const interceptElement = useCallback(async () => {
  //   if (!command) {
  //     return;
  //   }
  //   await commandService.savePendingCommand(command)
  //   const response = await tabsService.runInterceptElement();

  //   if (response === 'ok') {
  //     console.log('Intercept', response);
  //     window.close();
  //   }
  // }, [command]);

  const removeInterceptedElement = useCallback(async () => {
    await chrome.storage.sync.remove('__test_intercept_element');
  }, []);

  const removePendingCommand = useCallback(async () => {
    await chrome.storage.sync.remove('__test_pending_command');
  }, []);

  // const onCommandNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
  //   if (!command) {
  //     return;
  //   }

  //   setCommand({
  //     ...command,
  //     name: event.target.value,
  //   });
  // }, [command]);

  // const onSubmitCommand = useCallback(async (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   const hostname = await tabsService.getCurrentTabHostname();

  //   if (!command || !hostname) {
  //     return;
  //   }

  //   await commandService.saveCommand(hostname, command);
  //   await removeInterceptedElement();
  //   await removePendingCommand();
    
  //   navigate(`/`)
  // }, [command, removePendingCommand, removePendingCommand]);

  const onSelectElement = useCallback(async () => {
    await commandService.savePendingCommand({
      name: commandName,
      actions: commandActions as Array<Action>,
    })
    const response = await tabsService.runInterceptElement();

    if (response === 'ok') {
      console.log('Intercept', response);
      window.close();
    }
  }, [commandName, commandActions]);

  const onActionEventChange = useCallback((event: SelectChangeEvent) => {
    setCommandActions(prevActions => [{
      ...prevActions,
      event: event.target.value as ElementEvent
    }]);
  }, []);

  const onNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setCommandName(event.target.value)
  }, []);

  useEffect(() => {
    const loadInterceptElement = async () => {
      const pendingCommand = await commandService.getPendingCommand();
      console.log('!!! end getPendingCommand', pendingCommand)

      if (pendingCommand) {
        setCommandName(pendingCommand.name)
        setCommandActions([...pendingCommand.actions])
        // setCommand(pendingCommand)
      }

      setLoadingPendingCommand(false)
    }
    
    loadInterceptElement();
  }, [])

  if (loadingPendingCommand) {
    return <span>Loading...</span>
  }

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
    >
      <FormControl fullWidth>
        <TextField id="form-new-command-name" label="Set Your Command Name First" variant="standard" value={commandName} onChange={onNameChange} />
      </FormControl>
      <FormControl margin="normal" size="small" sx={{ width: '35%' }}>
        <InputLabel id="form-new-command-action-label">Action</InputLabel>
        <Select
          labelId="form-new-command-action-label"
          value={commandActions[0]?.event ?? ''}
          label="Action"
          onChange={onActionEventChange}
        >
          {elementEvents.map((event) => (
            <MenuItem key={event} value={event}>{elementEventNames[event]}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl margin="normal" sx={{ width: '65%', flexDirection: 'row', justifyContent: 'space-around',  alignItems: 'start' }}>
        <Box display="flex" justifyContent="center" flexDirection="column" fontSize="12px" paddingLeft="12px">
          {commandActions[0]?.element?.tagName ? (
            <>
              <Box>Tag Name: {commandActions[0]?.element?.tagName}</Box>
              <Box>Inner Text: {commandActions[0]?.element?.innerText}</Box>
            </>
          ) : (
            <Box>Click on icon and select element. After this open extentions again and finish creating command</Box>
          )}
        </Box>
        <Tooltip title="Select Element" placement="top">
          <IconButton onClick={onSelectElement}>
            <Colorize />
          </IconButton>
        </Tooltip>
      </FormControl>
      <FormControl fullWidth margin="normal" sx={{ justifyContent: 'center', flexDirection: 'row', gap: '12px' }}>
        <Button variant="contained">Save Command</Button>
        <Button variant="outlined">Cancel</Button>
      </FormControl>
      <button onClick={removeInterceptedElement}>Remove Intercept Element</button>
      <button onClick={removePendingCommand}>Remove Pending Command</button>
    </Box>
  )

  // return (
  //   <>
  //     <h3>Add Command</h3>

  //     <form onSubmit={onSubmitCommand}>
  //       <label>Name:
  //         <input type="text" name="name" value={command.name} onChange={onCommandNameChange} />
  //       </label>

  //       {command.actions.map((action, index) => (
  //         <div key={index}>
  //           <span>Action {index + 1}</span>
  //           <span>Event {action.event}</span>
  //           <span>Element Tag Name {action.element?.tagName}</span>
  //           <span>Element Inner Text {action.element?.innerText}</span>
  //         </div>
  //       ))}

  //       <input type="submit" value="Save Command" />

  //     </form>

  //     <button onClick={interceptElement}>Intercept Element</button>
  //     <button onClick={removeInterceptedElement}>Remove Intercept Element</button>
  //     <button onClick={removePendingCommand}>Remove Pending Command</button>
  //   </>
  // )
}
