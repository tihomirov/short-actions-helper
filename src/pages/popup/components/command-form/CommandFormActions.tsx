import React, { FC, useCallback } from 'react';
import { ElementEvent, ElementData } from '../../../../common';
import { CommandFormAction } from './CommandFormAction';

type ActionsFormValue = Array<{
  event?: ElementEvent;
  element?: Partial<ElementData>;
}>;

type CommandFormProps = Readonly<{
  actions: ActionsFormValue;
  onActionsChange: (actions: ActionsFormValue) => void;
  onSelectElement: () => void;
}>;

export const CommandFormActions: FC<CommandFormProps> = ({ actions, onActionsChange, onSelectElement }) => {
  const onActionSet = useCallback(
    (index: number, elementEvent: ElementEvent) => {
      const actoinsToUpdate = [...actions];

      if (!actoinsToUpdate[index]) {
        return;
      }

      actoinsToUpdate[index].event = elementEvent;

      onActionsChange(actoinsToUpdate);
    },
    [actions, onActionsChange],
  );

  return (
    <>
      {actions.map((action, index) => (
        <CommandFormAction
          key={index}
          index={index}
          actionEvent={action.event}
          tagName={action.element?.tagName}
          innerText={action.element?.innerText}
          onActionSet={onActionSet}
          onSelectElement={onSelectElement}
        />
      ))}
    </>
  );
};
