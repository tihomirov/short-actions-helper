import React, { FC } from 'react';
import { Commands } from '../../types';
import { CommandItem } from '../command-item';
import { NewCommandButton } from '../new-command-button';

type CommandsListProps = Readonly<{
  commands: Commands;
}>;

export const CommandsList: FC<CommandsListProps> = ({ commands }) => {
  if (commands.length === 0) {
    return (
      <>
        <h3>There are no Commands yet</h3>
        <NewCommandButton />
      </>
    );
  }

  return (
    <>
      {commands.map((command, index) => (
        <CommandItem key={index} command={command} />
      ))}
      <NewCommandButton />
    </>
  );
};
