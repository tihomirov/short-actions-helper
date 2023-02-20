import React, { FC, useState, useCallback, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, Button } from '@mui/material';
import { ActionType, assertUnreachable, SupportedAction, truncate } from '../../../../common';
import { CommandFormActions } from './CommandFormActions';
import { Command, CommandsType, PendingCommandForm } from '../../types';
import { useStores } from '../../hooks';

type CommandFormProps = Readonly<{
  pendingCommand: PendingCommandForm | undefined;
}>;

export const CommandForm: FC<CommandFormProps> = ({ pendingCommand }) => {
  const navigate = useNavigate();
  const { commandStore, messageChannelStore, tabStore } = useStores();
  const [command, setCommand] = useState<PendingCommandForm>(() => {
    const { name, actions, hostname } = pendingCommand || {};
    const predefinedName = getPredefinedName(name, actions) ?? '';
    const defaultHostname = commandStore.commandsType === CommandsType.Hostname ? tabStore.hostname : undefined;

    return {
      hostname: hostname ?? defaultHostname,
      name: name ? name : predefinedName,
      actions: actions ? [...actions] : [{}],
    };
  });

  const onSelectElement = useCallback(async () => {
    await commandStore.savePendingCommand(command);
    await messageChannelStore.runInterceptElementMode();
  }, [command]);

  const onNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setCommand((prevCommand) => ({
      ...prevCommand,
      name: event.target.value,
    }));
  }, []);

  const onActionsChange = useCallback((actions: Array<Partial<SupportedAction>>) => {
    setCommand((prevCommand) => {
      const predefinedName = getPredefinedName(prevCommand.name, actions);
      const usePredefinedName = !prevCommand.name && predefinedName;

      return {
        ...prevCommand,
        name: usePredefinedName ? predefinedName : prevCommand.name,
        actions,
      };
    });
  }, []);

  const onSave = useCallback(async () => {
    // TODO validate form
    if (!command.name) {
      return;
    }

    if (command.actions.length === 0) {
      return;
    }

    // for (const action of command.actions) {
    //   if (!action.elementEvent || !action.tagName) {
    //     return;
    //   }
    // }

    await commandStore.saveCommand(command as Omit<Command, 'id'>);
    await commandStore.removePendingCommand();

    navigate(`/`);
  }, [navigate, command]);

  const onCancel = useCallback(async () => {
    await commandStore.removePendingCommand();
    navigate(`/`);
  }, [navigate]);

  return (
    <>
      <CommandFormActions
        actions={command.actions}
        onActionsChange={onActionsChange}
        onSelectElement={onSelectElement}
      />
      <FormControl fullWidth margin="normal">
        <TextField
          id="form-new-command-name"
          label="Set Your Command Name First"
          variant="standard"
          value={command.name}
          onChange={onNameChange}
        />
      </FormControl>
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

function getPredefinedName(name?: string, actions?: Array<Partial<SupportedAction>>): string | undefined {
  if (name || !actions || actions.length !== 1) {
    return undefined;
  }

  const [action] = actions;

  if (action.type === undefined) {
    return undefined;
  }

  switch (action.type) {
    case ActionType.DocumentContentAction: {
      const { tagName, innerText, elementEvent } = action;
      return elementEvent && tagName ? `${elementEvent}: <${tagName}> ${truncate(innerText ?? '')}` : undefined;
    }
    case ActionType.TabAction: {
      const { tabEvent } = action;
      return tabEvent !== undefined ? `${tabEvent} Tab` : undefined;
    }
    default:
      assertUnreachable(action.type);
  }
}
