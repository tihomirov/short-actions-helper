import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Stack } from '@mui/material';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { isString } from 'remote-shortcuts-common/src/utils';

import { PendingCommandForm } from '../../../../common';
import { useStores } from '../../hooks';
import { Command, CommandsType } from '../../types';
import { CommandForm as CommandFormType, commandSchema } from './command-schema';
import { CommandFormActions } from './CommandFormActions';
import { CommandFormHostname } from './CommandFormHostname';
import { CommandFormName } from './CommandFormName';
import { getPredefinedName } from './getPredefinedName';

type CommandFormProps = Readonly<{
  command: PendingCommandForm | Command | undefined;
}>;

export const CommandForm: FC<CommandFormProps> = ({ command }) => {
  const navigate = useNavigate();
  const { commandStore, tabStore } = useStores();
  const defaultHostname = commandStore.commandsType === CommandsType.Hostname ? tabStore.hostname : undefined;
  const { name, actions, hostname } = command || {};
  const predefinedName = getPredefinedName(name, actions) ?? '';
  const [loading, setLoading] = useState(false);
  const [savingError, setSavingError] = useState<string | undefined>(undefined);
  const form = useForm<CommandFormType>({
    resolver: zodResolver(commandSchema),
    defaultValues: {
      // TODO:refactor
      _id: command && ('_id' in command ? command._id : undefined),
      hostname: hostname ?? defaultHostname,
      name: name || predefinedName,
      actions: actions ? [...actions] : [{}],
    },
  });
  const { formState, handleSubmit, watch } = form;
  const { isSubmitted, isValid } = formState;
  const submitDisabled = loading || !!savingError || (isSubmitted && !isValid);

  const onSubmit = handleSubmit(async (form) => {
    setLoading(true);

    if (form.hostname?.trim() === '') {
      form.hostname = undefined;
    }

    const error = isString(form._id)
      ? await commandStore.updateCommand(form as Command)
      : await commandStore.createCommand(form);

    if (error) {
      setSavingError(error);
      setLoading(false);
    } else {
      await commandStore.removePendingCommand();
      navigate(`/`);
    }
  });

  const onCancel = useCallback(async () => {
    await commandStore.removePendingCommand();
    navigate(`/`);
  }, [navigate]);

  useEffect(() => {
    const subscription = watch(() => setSavingError(undefined));
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <FormProvider {...form}>
      <Box component="form" noValidate autoComplete="false" onSubmit={onSubmit}>
        <CommandFormActions />
        <CommandFormName />
        <CommandFormHostname />
        <Stack justifyContent="center" spacing={2} direction="row" mt={2}>
          <Button variant="outlined" size="medium" type="submit" disabled={submitDisabled}>
            Save Command
          </Button>
          <Button variant="text" size="medium" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </FormProvider>
  );
};
