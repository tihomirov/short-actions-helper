import { Colorize } from '@mui/icons-material';
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';
import { FormHelperText } from '@mui/material';
import React, { FC, useCallback } from 'react';
import { useController, useFormContext, useWatch } from 'react-hook-form';

import { ElementEvent } from '../../../../common';
import { useStores } from '../../hooks';
import { CommandForm } from './command-schema';

const elementEventNames: Record<ElementEvent, string> = {
  [ElementEvent.Click]: 'Click',
  [ElementEvent.Focus]: 'Focus',
};
const elementEvents = Object.values(ElementEvent);

type DocumentContentActionFormProps = Readonly<{
  index: number;
}>;

const actionElementProps = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as const;

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
  const innerHTMLValue = useWatch({ control, name: `actions.${index}.innerHTML` });
  const hrefValue = useWatch({ control, name: `actions.${index}.href` });
  const titleValue = useWatch({ control, name: `actions.${index}.title` });
  const srcValue = useWatch({ control, name: `actions.${index}.src` });

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
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          fontSize="12px"
          paddingLeft="12px"
          overflow="hidden"
        >
          {tagNameField.value ? (
            <>
              <Box {...actionElementProps}>Tag Name: {tagNameField.value}</Box>
              {innerTextValue && <Box {...actionElementProps}>Inner Text: {innerTextValue}</Box>}
              {innerHTMLValue && <Box {...actionElementProps}>Inner Html: {innerHTMLValue}</Box>}
              {hrefValue && <Box {...actionElementProps}>Link URL: {hrefValue}</Box>}
              {titleValue && <Box {...actionElementProps}>Title: {titleValue}</Box>}
              {srcValue && <Box {...actionElementProps}>Image URL: {srcValue}</Box>}
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
