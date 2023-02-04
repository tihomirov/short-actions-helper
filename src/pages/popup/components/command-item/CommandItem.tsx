import React, { FC, useCallback } from "react";
import { Box, IconButton, SxProps, Tooltip } from '@mui/material';
import { DeleteOutlineOutlined, PlayArrowOutlined } from '@mui/icons-material';
import { Command } from "../../types";
import { actionService, commandService } from "../../services";

type CommandProps = Readonly<{
  command: Command;
  hostname: string;
}>

const commandItemStyles: SxProps = { 
  background: '#fef6ec', 
  boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'
};

export const CommandItem: FC<CommandProps> = ({ command, hostname }) => {

  const onRun = useCallback(() => {
    actionService.runActions(command.actions)
  }, [command]);

  const onDelete = useCallback(() => {
    commandService.deleteCommand(hostname, command)
  }, [command]);

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="12px" sx={commandItemStyles}>
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
    </Box>
  )
}