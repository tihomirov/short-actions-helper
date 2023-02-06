import React, { FC, useCallback } from 'react';
import { ElementEvent, TabAction } from '../../../../common';
import { CommandFormAction } from './CommandFormAction';

type CommandFormProps = Readonly<{
  actions: ReadonlyArray<Partial<TabAction>>;
  onActionsChange: (actions: Array<Partial<TabAction>>) => void;
  onSelectElement: () => void;
}>;

export const CommandFormActions: FC<CommandFormProps> = ({ actions, onActionsChange, onSelectElement }) => {
  const onElementEventSet = useCallback(
    (index: number, elementEvent: ElementEvent) => {
      onActionsChange([
        ...actions.slice(0, index),
        {
          ...actions[index],
          elementEvent,
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
          actionEvent={action.elementEvent}
          tagName={action.tagName}
          innerText={action.innerText}
          onElementEventSet={onElementEventSet}
          onSelectElement={onSelectElement}
        />
      ))}
    </>
  );
};
