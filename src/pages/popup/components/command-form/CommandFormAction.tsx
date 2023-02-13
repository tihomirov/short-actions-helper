import React, { FC, useCallback } from 'react';
import { Box, FormControl, Select, MenuItem, InputLabel, Tooltip, IconButton, SelectChangeEvent } from '@mui/material';
import { Colorize } from '@mui/icons-material';
import { ElementEvent } from '../../../../common';

const elementEventNames: Record<ElementEvent, string> = {
  [ElementEvent.Click]: 'Click',
  [ElementEvent.Focus]: 'Focus',
};
const elementEvents = Object.values(ElementEvent);

type CommandFormActionProps = Readonly<{
  index: number;
  onSelectElement: () => void;
  onElementEventSet: (index: number, elementEvent: ElementEvent) => void;
  actionEvent?: ElementEvent;
  tagName?: string;
  innerText?: string;
}>;

export const CommandFormAction: FC<CommandFormActionProps> = ({
  index,
  actionEvent,
  tagName,
  innerText,
  onSelectElement,
  onElementEventSet,
}) => {
  const onActionChange = useCallback(
    (event: SelectChangeEvent) => {
      const elementEvent = event.target.value as ElementEvent;
      if (elementEvent) {
        onElementEventSet(index, elementEvent);
      }
    },
    [onElementEventSet],
  );

  return (
    <div>
      <FormControl size="small" margin="dense" sx={{ width: '35%' }}>
        <InputLabel id="form-new-command-action-label">Action</InputLabel>
        <Select
          labelId="form-new-command-action-label"
          value={actionEvent ?? ''}
          label="Action"
          onChange={onActionChange}
        >
          {elementEvents.map((event) => (
            <MenuItem key={event} value={event}>
              {elementEventNames[event]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        margin="dense"
        sx={{
          width: '65%',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'start',
        }}
      >
        <Box display="flex" justifyContent="center" flexDirection="column" fontSize="12px" paddingLeft="12px">
          {tagName ? (
            <>
              <Box>Tag Name: {tagName}</Box>
              {innerText && <Box>Inner Text: {innerText}</Box>}
            </>
          ) : (
            <Box>Click on icon and select element. After this open extentions again and finish creating command</Box>
          )}
        </Box>
        <Tooltip title="Select Element" placement="top">
          <IconButton onClick={onSelectElement}>
            <Colorize />
          </IconButton>
        </Tooltip>
      </FormControl>
    </div>
  );
};
