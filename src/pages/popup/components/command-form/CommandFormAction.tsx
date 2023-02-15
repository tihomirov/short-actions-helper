import React, { FC, useCallback } from 'react';
import { FormControl, Select, MenuItem, InputLabel, SelectChangeEvent } from '@mui/material';
import {
  ElementEvent,
  SupportedAction,
  ActionType,
  DocumentContentAction,
  TabEventType,
  TabAction,
} from '../../../../common';
import { DocumentContentActionForm } from './DocumentContentActionForm';
import { TabActionForm } from './TabActionForm';

const actionTypeNames: Record<ActionType, string> = {
  [ActionType.DocumentContentAction]: 'Document Content Action',
  [ActionType.TabAction]: 'Tab Action',
};
const actionTypeElements = Object.values(ActionType);

type CommandFormActionProps = Readonly<{
  index: number;
  action: Partial<SupportedAction>;
  onActionChange: (index: number, action: Partial<SupportedAction>) => void;
  onSelectElement: () => void;
}>;

export const CommandFormAction: FC<CommandFormActionProps> = ({ index, action, onActionChange, onSelectElement }) => {
  const onActionTypeChange = useCallback(
    (event: SelectChangeEvent) => {
      const value = event.target.value as ActionType;
      if (value) {
        onActionChange(index, {
          ...action,
          type: value,
        });
      }
    },
    [action, index],
  );

  const onElementEventSet = useCallback(
    (elementEvent: ElementEvent) => {
      onActionChange(index, {
        ...action,
        elementEvent,
      } as DocumentContentAction);
    },
    [action, index],
  );

  const onSelectTabEventType = useCallback(
    (tabEvent: TabEventType) => {
      onActionChange(index, {
        ...action,
        tabEvent,
      } as TabAction);
    },
    [action, index],
  );

  return (
    <div>
      <FormControl size="small" margin="dense" sx={{ width: '35%' }}>
        <InputLabel id="form-new-command-action-type-label">Action Type</InputLabel>
        <Select
          labelId="form-new-command-action-label"
          value={action.type ?? ''}
          label="Action Type"
          onChange={onActionTypeChange}
        >
          {actionTypeElements.map((item) => (
            <MenuItem key={item} value={item}>
              {actionTypeNames[item]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {action.type === ActionType.DocumentContentAction && (
        <DocumentContentActionForm
          key={index}
          actionEvent={action.elementEvent}
          tagName={action.tagName}
          innerText={action.innerText}
          onElementEventSet={onElementEventSet}
          onSelectElement={onSelectElement}
        />
      )}
      {action.type === ActionType.TabAction && (
        <TabActionForm key={index} tabEventType={action.tabEvent} onSelectTabEventType={onSelectTabEventType} />
      )}
    </div>
  );
};
