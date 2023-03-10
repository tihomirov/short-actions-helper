import { TextField } from '@mui/material';
import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useWatch } from 'react-hook-form';

import { CommandForm } from './command-schema';

export const CommandFormName: FC = () => {
  const { control, formState, register } = useFormContext<CommandForm>();
  const commandName = useWatch({
    control,
    name: 'name',
  });
  const { errors } = formState;

  return (
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
  );
};
