import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';

import { CommandForm } from '../components/command-form';
import { useStores } from '../hooks';

export const NewCommand: FC = observer(() => {
  const { commandStore } = useStores();

  if (commandStore.isPendingCommandLoading) {
    return <span>Loading...</span>;
  }

  return <CommandForm pendingCommand={commandStore.pendingCommand} />;
});
