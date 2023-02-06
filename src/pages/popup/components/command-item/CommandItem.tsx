import React, { FC, useCallback, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { DeleteOutlineOutlined, PlayArrowOutlined } from '@mui/icons-material';
import { Command } from '../../types';
import { useStores } from '../../hooks';

type CommandProps = Readonly<{
  command: Command;
}>;

export const CommandItem: FC<CommandProps> = ({ command }) => {
  const { commandStore, messageChannelStore } = useStores();
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const onRun = useCallback(() => {
    messageChannelStore.runCommand(command);
  }, [command]);

  const onDelete = useCallback(async () => {
    setDeleteLoading(true);
    await commandStore.removeCommand(command);
    setDeleteLoading(false);
  }, [command]);

  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      marginBottom="12px"
      sx={{
        background: '#fef6ec',
        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
        pointerEvents: deleteLoading ? 'none' : undefined,
      }}
    >
      <div style={{ marginLeft: '6px' }}>{command.name}</div>
      <Box>
        <Tooltip title="Delete" placement="top">
          <IconButton onClick={onDelete}>
            <DeleteOutlineOutlined />
          </IconButton>
        </Tooltip>
        <Tooltip title="Run" placement="top">
          <IconButton onClick={onRun}>
            <PlayArrowOutlined />
          </IconButton>
        </Tooltip>
      </Box>
      {deleteLoading && (
        <Box position="absolute" width="100%" height="100%" sx={{ backgroundColor: 'gray', opacity: 0.7 }} />
      )}
    </Box>
  );
};
