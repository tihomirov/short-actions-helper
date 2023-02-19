import React, { FC, useCallback } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const NewCommandButton: FC = () => {
  const navigate = useNavigate();
  const goToNewCommand = useCallback(() => navigate('commands/new'), [navigate]);

  return (
    <Button variant="outlined" size="medium" onClick={goToNewCommand}>
      New Comamnd
    </Button>
  );
};
