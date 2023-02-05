import React, { FC, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, Button } from '@mui/material';
import { commandService, tabsService } from '../../services';
import { ElementEvent, ElementData } from '../../../../common';
import { CommandFormActions } from './CommandFormActions';
import { Command } from '../../types';

type CommandFormProps = Readonly<{
  pendingCommand: Partial<Command> | undefined;
}>;

export const CommandForm: FC<CommandFormProps> = ({ pendingCommand }) => {
  const navigate = useNavigate();
  const [command, setCommand] = useState<{
    name: string;
    actions: Array<{
      event?: ElementEvent;
      element?: Partial<ElementData>;
    }>;
  }>({
    name: pendingCommand?.name ?? '',
    actions: pendingCommand?.actions ? [...pendingCommand?.actions] : [{}],
  });

  const onSelectElement = useCallback(async () => {
    await commandService.savePendingCommand(command);

    const response = await tabsService.runInterceptElement();

    if (response === 'ok') {
      window.close();
    }
  }, [command]);

  const onNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setCommand((prevCommand) => ({
      ...prevCommand,
      name: event.target.value,
    }));
  }, []);

  const onActionsChange = useCallback(
    (
      actions: Array<{
        event?: ElementEvent;
        element?: Partial<ElementData>;
      }>,
    ) => {
      setCommand((prevCommand) => ({
        ...prevCommand,
        actions,
      }));
    },
    [],
  );

  const onSave = useCallback(async () => {
    const hostname = await tabsService.getCurrentTabHostname();

    if (!hostname) {
      navigate(`/`);
      return;
    }

    if (!command.name) {
      return;
    }

    if (command.actions.length === 0) {
      return;
    }

    await commandService.saveCommand(hostname, command as Command);

    await commandService.removePendingCommand();

    navigate(`/`);
  }, [navigate, command]);

  const onCancel = useCallback(async () => {
    await commandService.removePendingCommand();
    navigate(`/`);
  }, [navigate]);

  return (
    <>
      <FormControl fullWidth>
        <TextField
          id="form-new-command-name"
          label="Set Your Command Name First"
          variant="standard"
          value={command.name}
          onChange={onNameChange}
        />
      </FormControl>
      <CommandFormActions
        actions={command.actions}
        onActionsChange={onActionsChange}
        onSelectElement={onSelectElement}
      />
      <FormControl fullWidth margin="normal" sx={{ justifyContent: 'center', flexDirection: 'row', gap: '12px' }}>
        <Button variant="contained" onClick={onSave}>
          Save Command
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </FormControl>
    </>
  );
};
