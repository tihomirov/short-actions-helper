import { Box, CircularProgress } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { Command } from '../../../common';
import { CommandForm } from '../components/command-form';
import { useStores } from '../hooks';

export const EditCommand: FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const { commandStore } = useStores();
  const [editCommand, setEditCommand] = useState<undefined | Command>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) {
      return;
    }

    setLoading(true);

    commandStore
      .getById(id)
      .then((command) => setEditCommand(command))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box margin="auto">
        <CircularProgress />
      </Box>
    );
  }

  if (!editCommand) {
    // show message
    return <Navigate to="/" replace={true} />;
  }

  return <CommandForm command={editCommand} />;
});
