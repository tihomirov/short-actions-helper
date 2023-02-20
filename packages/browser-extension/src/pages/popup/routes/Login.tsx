import React, { FC, useState, useCallback, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { Navigate, useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, TextField } from '@mui/material';
import { useStores } from '../hooks';

export const Login: FC = observer(() => {
  const navigate = useNavigate();
  const { userStore } = useStores();
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginFrom] = useState({
    email: '',
    password: '',
  });

  const onLogin = useCallback(async () => {
    const { email, password } = loginForm;
    if (!email || !password) {
      return;
    }

    setLoading(true);
    await userStore.login(email, password);
    setLoading(false);
  }, [userStore, loginForm]);

  const onRegister = useCallback(async () => navigate('/register'), [navigate]);

  const onEmailChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    setLoginFrom((prev) => ({
      ...prev,
      email,
    }));
  }, []);

  const onPasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    setLoginFrom((prev) => ({
      ...prev,
      password,
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
          value={loginForm.email}
          onChange={onEmailChange}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          id="login-form-password"
          label="Password"
          variant="standard"
          type="password"
          value={loginForm.password}
          onChange={onPasswordChange}
        />
      </FormControl>
      <Button variant="outlined" size="medium" onClick={onLogin} disabled={loading}>
        Login
      </Button>
      <Button variant="text" size="medium" onClick={onRegister} disabled={loading}>
        Register
      </Button>
    </Box>
  );
});
