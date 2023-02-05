import React, { FC, useState, useEffect, useCallback } from 'react';
import { Box, TextField, FormControl, Select, MenuItem, Button, InputLabel, Tooltip, IconButton, SelectChangeEvent } from '@mui/material';
import { Colorize } from '@mui/icons-material';
import { commandService, tabsService } from "../services";
import { ElementEvent, Action } from '../../../common';
import { useNavigate } from 'react-router-dom';

const elementEventNames: Record<ElementEvent, string> = {
  [ElementEvent.Click]: 'Click',
  [ElementEvent.Focus]: 'Focus',
}
const elementEvents = Object.values(ElementEvent);

export const NewCommand: FC = () => {
  const navigate = useNavigate();
  const [loadingPendingCommand, setLoadingPendingCommand] = useState<boolean>(true);
  const [commandName, setCommandName] = useState<string>('');
  const [commandActions, setCommandActions] = useState<Array<Partial<Action>>>([]);

  const onSelectElement = useCallback(async () => {
    await commandService.savePendingCommand({
      name: commandName,
      actions: commandActions as Array<Action>,
    })

    const response = await tabsService.runInterceptElement();

    if (response === 'ok') {
      window.close();
    }
  }, [commandName, commandActions]);

  const onActionEventChange = useCallback((event: SelectChangeEvent) => {
    setCommandActions(prevActions => {
      return [{
        ...prevActions[0],
        event: event.target.value as ElementEvent
      }];
    });
  }, []);

  const onNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setCommandName(event.target.value)
  }, []);

  const onSave = useCallback(async () => {
    const hostname = await tabsService.getCurrentTabHostname();

    if (!hostname) {
      navigate(`/`);
      return;
    }

    await commandService.saveCommand(hostname, {
      name: commandName,
      // TODO: validate
      actions: commandActions as Array<Action>,
    });

    await commandService.removePendingCommand();

    navigate(`/`)
  }, [navigate, commandName, commandActions]);

  const onCancel = useCallback(async () => {
    await commandService.removePendingCommand();
    navigate(`/`)
  }, [navigate, commandName, commandActions]);

  useEffect(() => {
    const loadInterceptElement = async () => {
      const pendingCommand = await commandService.getPendingCommand();

      if (pendingCommand) {
        setCommandName(pendingCommand.name)
        setCommandActions([...pendingCommand.actions])
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
        <Button variant="contained" onClick={onSave}>Save Command</Button>
        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
      </FormControl>
    </Box>
  )
}
