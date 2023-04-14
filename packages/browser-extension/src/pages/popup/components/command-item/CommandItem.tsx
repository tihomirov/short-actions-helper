import { DeleteOutlineOutlined, EditOutlined, PlayArrowOutlined } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';
import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Command } from '../../../../common';
import { useStores } from '../../hooks';
import { commandRunnerService } from '../../services';

type CommandProps = Readonly<{
  command: Command;
}>;

export const CommandItem: FC<CommandProps> = ({ command }) => {
  const navigate = useNavigate();
  const { commandStore } = useStores();

  const onRun = useCallback(() => {
    commandRunnerService.runCommand(command);
  }, [command]);

  const onEdit = useCallback(() => {
    navigate(`commands/${command._id}`);
  }, [command, navigate]);

  const onDelete = useCallback(() => commandStore.removeCommand(command._id), [command]);

  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      marginBottom="12px"
      width="100%"
      sx={{
        background: '#fef6ec',
        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
      }}
    >
      <div style={{ marginLeft: '6px' }}>{command.name}</div>
      <Box>
        <Tooltip title="Delete" placement="top">
          <IconButton onClick={onDelete}>
            <DeleteOutlineOutlined />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit" placement="top">
          <IconButton onClick={onEdit}>
            <EditOutlined />
          </IconButton>
        </Tooltip>
        <Tooltip title="Run" placement="top">
          <IconButton onClick={onRun}>
            <PlayArrowOutlined />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
