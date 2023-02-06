import React, { FC, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, Button } from '@mui/material';
import { tabsService, PendingCommand } from '../../services';
import { ElementEvent, ElementData } from '../../../../common';
import { CommandFormActions } from './CommandFormActions';
import { Command } from '../../types';
import { useStores } from '../../hooks';

type CommandFormProps = Readonly<{
  pendingCommand: PendingCommand | undefined;
}>;

export const CommandForm: FC<CommandFormProps> = ({ pendingCommand }) => {
  const navigate = useNavigate();
  const { commandStore } = useStores();
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
    await commandStore.savePendingCommand(command);

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
    if (!command.name) {
      return;
    }

    if (command.actions.length === 0) {
      return;
    }

    await commandStore.saveCommand(command as Command);
    await commandStore.removePendingCommand();

    navigate(`/`);
  }, [navigate, command]);

  const onCancel = useCallback(async () => {
    await commandStore.removePendingCommand();
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
