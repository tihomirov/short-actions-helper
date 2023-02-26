import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { FC, useCallback } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { ActionType } from '../../../../common';
import { CommandForm } from './command-schema';
import { DocumentContentActionForm } from './DocumentContentActionForm';
import { TabActionForm } from './TabActionForm';

const actionTypeNames: Record<ActionType, string> = {
  [ActionType.DocumentContentAction]: 'Document Content Action',
  [ActionType.TabAction]: 'Tab Action',
};
const actionTypeElements = Object.values(ActionType);

type CommandFormActionProps = Readonly<{
  index: number;
}>;

export const CommandFormAction: FC<CommandFormActionProps> = ({ index }) => {
  const { control, resetField } = useFormContext<CommandForm>();
  const {
    field,
    fieldState: { error },
  } = useController({
    name: `actions.${index}.type`,
    control,
  });

  const onTypeChange = useCallback(
    (value: SelectChangeEvent<ActionType>) => {
      resetField(`actions.${index}`, {
        keepDirty: true,
        keepTouched: true,
        keepError: true,
      });
      field.onChange(value);
    },
    [index, resetField, field.onChange],
  );

  return (
    <div>
      <FormControl size="small" margin="dense" sx={{ width: '35%' }} error={!!error}>
        <InputLabel id="form-new-command-action-label">Action Type</InputLabel>
        <Select
          labelId="form-new-command-action-label"
          label="Action Type"
          value={field.value ?? ''}
          onChange={onTypeChange}
        >
          {actionTypeElements.map((item) => (
            <MenuItem key={item} value={item}>
              {actionTypeNames[item]}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{error.message}</FormHelperText>}
      </FormControl>
      {field.value === ActionType.DocumentContentAction && <DocumentContentActionForm index={index} />}
      {field.value === ActionType.TabAction && <TabActionForm index={index} />}
    </div>
  );
};
