import React, { FC, useCallback } from 'react';
import { FormControl, Select, MenuItem, InputLabel, SelectChangeEvent } from '@mui/material';
import { TabEventType } from '../../../../common';

const tabEventTypeNames: Record<TabEventType, string> = {
  [TabEventType.Close]: 'Close Tab',
  [TabEventType.Reload]: 'Reload Tab',
};
const tabEventTypeElements = Object.values(TabEventType);

type TabActionFormProps = Readonly<{
  tabEventType: TabEventType | undefined;
  onSelectTabEventType: (tabEventType: TabEventType) => void;
}>;

export const TabActionForm: FC<TabActionFormProps> = ({ tabEventType, onSelectTabEventType }) => {
  const onValueChange = useCallback(
    (event: SelectChangeEvent) => {
      const eventType = event.target.value as TabEventType;
      if (eventType) {
        onSelectTabEventType(eventType);
      }
    },
    [onSelectTabEventType],
  );

  return (
    <FormControl size="small" margin="dense" sx={{ width: 'calc(65% - 12px)', marginLeft: '12px' }}>
      <InputLabel id="form-new-command-action-type-label">Type</InputLabel>
      <Select
        labelId="form-new-command-action-type-label"
        value={tabEventType ?? ''}
        label="Type"
        onChange={onValueChange}
      >
        {tabEventTypeElements.map((eventType) => (
          <MenuItem key={eventType} value={eventType}>
            {tabEventTypeNames[eventType]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
