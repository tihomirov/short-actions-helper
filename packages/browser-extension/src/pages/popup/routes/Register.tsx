import React, { FC, useState, useCallback, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { Navigate, useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, TextField, Stack } from '@mui/material';
import { useStores } from '../hooks';

export const Register: FC = observer(() => {
  const navigate = useNavigate();
  const { userStore } = useStores();
  const [loading, setLoading] = useState(false);
  const [registerForm, setRegisterFrom] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const onRegister = useCallback(async () => {
    const { email, password, confirmPassword } = registerForm;
    if (!email || !password) {
      return;
    }
    if (password !== confirmPassword) {
      return;
    }

    setLoading(true);
    await userStore.register(email, password);
    setLoading(false);
  }, [userStore, registerForm]);

  const onLogin = useCallback(async () => navigate('/login'), [navigate]);

  const onEmailChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    setRegisterFrom((prev) => ({
      ...prev,
      email,
    }));
  }, []);

  const onPasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    setRegisterFrom((prev) => ({
      ...prev,
      password,
    }));
  }, []);

  const onConfirmPasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = event.target.value;
    setRegisterFrom((prev) => ({
      ...prev,
      confirmPassword,
    }));
  }, []);

  if (userStore.currentUser) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <Box>
      <FormControl fullWidth margin="normal">
        <TextField
          id="login-form-email"
          label="Your Email"
          variant="standard"
          value={registerForm.email}
          onChange={onEmailChange}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          id="login-form-password"
          label="Password"
          variant="standard"
          type="password"
          value={registerForm.password}
          onChange={onPasswordChange}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          id="login-form-confirm-password"
          label="Confirm Password"
          variant="standard"
          type="password"
          value={registerForm.confirmPassword}
          onChange={onConfirmPasswordChange}
        />
      </FormControl>
      <Stack justifyContent="center" spacing={2} direction="row" mt={2}>
        <Button variant="outlined" size="medium" onClick={onRegister} disabled={loading}>
          Submit
        </Button>
        <Button variant="text" size="medium" onClick={onLogin} disabled={loading}>
          Back to Login
        </Button>
      </Stack>
    </Box>
  );
});
