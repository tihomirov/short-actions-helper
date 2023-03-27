import { Checkbox, FormControlLabel } from '@mui/material';
import React, { ChangeEvent, FC, useCallback } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { useStores } from '../../hooks';
import { CommandForm } from './command-schema';

export const CommandFormHostname: FC = () => {
  const { tabStore } = useStores();
  const { control, setValue } = useFormContext<CommandForm>();
  const { field } = useController({
    name: `hostname`,
    control,
  });

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setValue('hostname', event.target.checked ? tabStore.hostname : ''),
    [setValue, tabStore.hostname],
  );

  if (!tabStore.hostname) {
    return null;
  }

  return (
    <FormControlLabel
      control={<Checkbox checked={!!field.value} onChange={onChange} />}
      label={`This Command is specific for ${tabStore.hostname}`}
    />
  );
};
