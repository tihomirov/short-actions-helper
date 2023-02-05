import { Box } from '@mui/material';
import React, { FC, useState, useEffect } from 'react';
import { CommandForm } from '../components/command-form';
import { commandService } from '../services';
import { Command } from '../types';

export const NewCommand: FC = () => {
  const [loadingPendingCommand, setLoadingPendingCommand] = useState<boolean>(true);
  const [pendingCommand, setPendingCommand] = useState<Partial<Command> | undefined>(undefined);

  useEffect(() => {
    const loadInterceptElement = async () => {
      const pendingCommand = await commandService.getPendingCommand();

      setPendingCommand(pendingCommand);
      setLoadingPendingCommand(false);
    };

    loadInterceptElement();
  }, []);

  if (loadingPendingCommand) {
    return <span>Loading...</span>;
  }

  return (
    <Box component="form" noValidate autoComplete="off">
      <CommandForm pendingCommand={pendingCommand} />
    </Box>
  );
};
