import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { CommandItem } from '../command-item';
import { NewCommandButton } from '../new-command-button';
import { useStores } from '../../hooks';

export const CommandsList: FC = observer(() => {
  const { commandStore } = useStores();

  if (commandStore.isLoading) {
    return <div>Loading...</div>;
  }

  if (commandStore.commands.length === 0) {
    return (
      <>
        <h3>There are no Commands yet</h3>
        <NewCommandButton />
      </>
    );
  }

  return (
    <>
      {commandStore.commands.map((command, index) => (
        <CommandItem key={index} command={command} />
      ))}
      <NewCommandButton />
    </>
  );
});
