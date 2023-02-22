import React, { FC, useState, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, TextField, Stack, Alert } from '@mui/material';
import { useStores } from '../hooks';

const loginSchema = object({
  email: string().min(1, 'Email is required').email('Email is invalid'),
  password: string()
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
});

type LoginForm = TypeOf<typeof loginSchema>;

export const Login: FC = observer(() => {
  const navigate = useNavigate();
  const { userStore } = useStores();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const {
    register,
    formState: { errors, isSubmitted, isValid },
    reset,
    handleSubmit,
    watch,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  const submitDisabled = loading || !!loginError || (isSubmitted && !isValid);

  const navigateToRegister = useCallback(async () => navigate('/register'), [navigate]);

  const onSubmit = handleSubmit(async (form) => {
    const { email, password } = form;

    setLoading(true);
    const errorText = await userStore.login(email, password);

    if (errorText) {
      setLoginError(errorText);
    } else {
      reset();
    }
    setLoading(false);
  });

  useEffect(() => {
    const subscription = watch(() => setLoginError(undefined));
    return () => subscription.unsubscribe();
  }, [watch]);

  if (userStore.currentUser) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <Box component="form" noValidate onSubmit={onSubmit}>
      {loginError && <Alert severity="error">{loginError}</Alert>}
      <TextField
        sx={{ mt: 2 }}
        id="login-form-email"
        label="Your Email"
        variant="standard"
        fullWidth
        required
        type="email"
        error={!!errors['email']}
        helperText={errors['email']?.message ?? ''}
        {...register('email')}
      />
      <TextField
        sx={{ mt: 2 }}
        id="login-form-password"
        label="Password"
        variant="standard"
        fullWidth
        required
        type="password"
        error={!!errors['password']}
        helperText={errors['password']?.message ?? ''}
        {...register('password')}
      />
      <Stack justifyContent="center" spacing={2} direction="row" mt={2}>
        <Button variant="outlined" size="medium" type="submit" disabled={submitDisabled}>
          Login
        </Button>
        <Button variant="text" size="medium" onClick={navigateToRegister} disabled={loading}>
          Register
        </Button>
      </Stack>
    </Box>
  );
});
