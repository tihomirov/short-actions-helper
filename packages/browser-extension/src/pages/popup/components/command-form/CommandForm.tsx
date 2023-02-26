import React, { FC, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Stack } from '@mui/material';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CommandFormActions } from './CommandFormActions';
import { getPredefinedName } from './getPredefinedName';
import { commandSchema, CommandForm as CommandFormType } from './command-schema';
import { CommandsType, PendingCommandForm } from '../../types';
import { useStores } from '../../hooks';

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
