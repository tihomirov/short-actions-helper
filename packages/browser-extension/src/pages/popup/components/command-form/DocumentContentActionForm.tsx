import React, { FC, useCallback } from 'react';
import { Box, FormControl, Select, MenuItem, InputLabel, Tooltip, IconButton } from '@mui/material';
import { Colorize } from '@mui/icons-material';
import { ElementEvent } from '../../../../common';
import { useStores } from '../../hooks';
import { FormHelperText } from '@mui/material';
import { useWatch, useController, useFormContext } from 'react-hook-form';
import { CommandForm } from './command-schema';

const elementEventNames: Record<ElementEvent, string> = {
  [ElementEvent.Click]: 'Click',
  [ElementEvent.Focus]: 'Focus',
};
const elementEvents = Object.values(ElementEvent);

type DocumentContentActionFormProps = Readonly<{
  index: number;
}>;

export const DocumentContentActionForm: FC<DocumentContentActionFormProps> = ({ index }) => {
  const { commandStore, messageChannelStore } = useStores();
  const { control, getValues } = useFormContext<CommandForm>();
  const {
    field: elementEventField,
    fieldState: { error: elementEventError },
  } = useController({
    name: `actions.${index}.elementEvent`,
    control,
  });
  const {
    field: tagNameField,
    fieldState: { error: tagNameError },
  } = useController({
    name: `actions.${index}.tagName`,
    control,
  });
  const innerTextValue = useWatch({ control, name: `actions.${index}.innerText` });

  const onSelectElement = useCallback(async () => {
    const pendingCommand = getValues();
    await commandStore.savePendingCommand(pendingCommand);
    await messageChannelStore.runInterceptElementMode();
  }, []);

  return (
    <>
      <FormControl
        size="small"
        margin="dense"
        sx={{ width: 'calc(65% - 12px)', marginLeft: '12px' }}
        error={!!elementEventError}
      >
        <InputLabel id="form-new-command-action-label">Element Event</InputLabel>
        <Select
          labelId="form-new-command-action-label"
          label="Element Event"
          value={elementEventField.value ?? ''}
          onChange={elementEventField.onChange}
        >
          {elementEvents.map((event) => (
            <MenuItem key={event} value={event}>
              {elementEventNames[event]}
            </MenuItem>
          ))}
        </Select>
        {elementEventError && <FormHelperText>{elementEventError.message}</FormHelperText>}
      </FormControl>
      <FormControl
        margin="dense"
        sx={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'start',
        }}
        error={!!tagNameError}
      >
        <Box display="flex" justifyContent="center" flexDirection="column" fontSize="12px" paddingLeft="12px">
          {tagNameField.value ? (
            <>
              <Box>Tag Name: {tagNameField.value}</Box>
              {innerTextValue && <Box>Inner Text: {innerTextValue}</Box>}
            </>
          ) : (
            <FormHelperText>
              Click on icon and select element. After this open extentions again and finish creating command
            </FormHelperText>
          )}
        </Box>
        <Tooltip title="Select Element" placement="top">
          <IconButton onClick={onSelectElement}>
            <Colorize />
          </IconButton>
        </Tooltip>
      </FormControl>
    </>
  );
};
