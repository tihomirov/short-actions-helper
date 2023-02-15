import React, { FC, useCallback } from 'react';
import { SupportedAction } from '../../../../common';
import { CommandFormAction } from './CommandFormAction';

type CommandFormProps = Readonly<{
  actions: ReadonlyArray<Partial<SupportedAction>>;
  onActionsChange: (actions: Array<Partial<SupportedAction>>) => void;
  onSelectElement: () => void;
}>;

export const CommandFormActions: FC<CommandFormProps> = ({ actions, onActionsChange, onSelectElement }) => {
  const onActionChange = useCallback(
    (index: number, action: Partial<SupportedAction>) => {
      onActionsChange([
        ...actions.slice(0, index),
        {
          ...action,
        },
        ...actions.slice(index + 1),
      ]);
    },
    [actions, onActionsChange],
  );

  return (
    <>
      {actions.map((action, index) => (
        <CommandFormAction
          key={index}
          index={index}
          action={action}
          onActionChange={onActionChange}
          onSelectElement={onSelectElement}
        />
      ))}
    </>
  );
};
