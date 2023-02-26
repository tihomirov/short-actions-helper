import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { FC, useCallback } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { TabEventType } from '../../../../common';
import { CommandForm } from './command-schema';

const tabEventTypeNames: Record<TabEventType, string> = {
  [TabEventType.Close]: 'Close',
  [TabEventType.Reload]: 'Reload',
  [TabEventType.ToggleMute]: 'Toggle Mute',
};
const tabEventTypeElements = Object.values(TabEventType);

type TabActionFormProps = Readonly<{
  index: number;
}>;

export const TabActionForm: FC<TabActionFormProps> = ({ index }) => {
  const { control, getValues, setValue } = useFormContext<CommandForm>();
  const {
    field,
    fieldState: { error },
  } = useController({
    name: `actions.${index}.tabEvent`,
    control,
  });

  const onTabEventChange = useCallback(
    (value: SelectChangeEvent<TabEventType>) => {
      const commandName = getValues('name');
      const tabEventType = value.target.value as TabEventType;
      const tabEventName = tabEventTypeNames[tabEventType];

      field.onChange(value);

      if (!commandName) {
        setValue('name', `Tab: ${tabEventName}`, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }
    },
    [index, field.onChange],
  );

  return (
    <FormControl size="small" margin="dense" sx={{ width: 'calc(65% - 12px)', marginLeft: '12px' }} error={!!error}>
      <InputLabel id="form-new-command-action-type-label">Tab Event</InputLabel>
      <Select
        labelId="form-new-command-action-type-label"
        label="Tab Event"
        value={field.value ?? ''}
        onChange={onTabEventChange}
      >
        {tabEventTypeElements.map((eventType) => (
          <MenuItem key={eventType} value={eventType}>
            {tabEventTypeNames[eventType]}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
};
