import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Stack, TextField } from '@mui/material';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useStores } from '../../hooks';
import { CommandsType, PendingCommandForm } from '../../types';
import { CommandForm as CommandFormType, commandSchema } from './command-schema';
import { CommandFormActions } from './CommandFormActions';
import { getPredefinedName } from './getPredefinedName';

type CommandFormProps = Readonly<{
  pendingCommand: PendingCommandForm | undefined;
}>;

export const CommandForm: FC<CommandFormProps> = ({ pendingCommand }) => {
  const navigate = useNavigate();
  const { commandStore, tabStore } = useStores();
  const defaultHostname = commandStore.commandsType === CommandsType.Hostname ? tabStore.hostname : undefined;
  const { name, actions, hostname } = pendingCommand || {};
  const predefinedName = getPredefinedName(name, actions) ?? '';
  const [loading, setLoading] = useState(false);
  const [savingError, setSavingError] = useState<string | undefined>(undefined);
  const form = useForm<CommandFormType>({
    resolver: zodResolver(commandSchema),
    defaultValues: {
      hostname: hostname ?? defaultHostname,
      name: name ?? predefinedName ?? '',
      actions: actions ? [...actions] : [{}],
    },
  });
  const { control, register, formState, handleSubmit, reset, watch } = form;
  const { errors, isSubmitted, isValid } = formState;
  const submitDisabled = loading || !!savingError || (isSubmitted && !isValid);
  const commandName = useWatch({
    control,
    name: 'name',
  });

  const onSubmit = handleSubmit(async (form) => {
    setLoading(true);

    const error = await commandStore.saveCommand(form);

    if (error) {
      setSavingError(error);
    } else {
      await commandStore.removePendingCommand();
      reset();
      navigate(`/`);
    }

    setLoading(false);
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
        <TextField
          InputLabelProps={{ shrink: commandName ? true : false }}
          sx={{ mt: 2 }}
          id="form-new-command-name"
          label="Command Name"
          variant="standard"
          fullWidth
          required
          error={!!errors.name}
          helperText={errors.name?.message ?? ''}
          {...register('name')}
        />
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
