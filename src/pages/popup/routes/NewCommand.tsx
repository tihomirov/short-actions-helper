import { Box } from '@mui/material';
import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { CommandForm } from '../components/command-form';
import { useStores } from '../hooks';

export const NewCommand: FC = observer(() => {
  const { commandStore } = useStores();

  if (commandStore.isPendingCommandLoading) {
    return <span>Loading...</span>;
  }

  return (
    <Box component="form" noValidate autoComplete="off">
      <CommandForm pendingCommand={commandStore.pendingCommand} />
    </Box>
  );
});
