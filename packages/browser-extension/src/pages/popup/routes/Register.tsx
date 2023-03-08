import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Stack, TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { object, string, TypeOf } from 'zod';

import { useStores } from '../hooks';

const registerSchema = object({
  email: string().min(1, 'Email is required').email('Email is invalid'),
  password: string()
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  confirmPassword: string()
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

type RegisterForm = TypeOf<typeof registerSchema>;

export const Register: FC = observer(() => {
  const navigate = useNavigate();
  const { userStore, authStore } = useStores();
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | undefined>(undefined);
  const {
    register,
    formState: { errors, isSubmitted, isValid },
    reset,
    handleSubmit,
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });
  const submitDisabled = loading || !!registerError || (isSubmitted && !isValid);

  const navigateToLogin = useCallback(async () => navigate('/login'), [navigate]);

  const onSubmit = handleSubmit(async (form) => {
    const { email, password } = form;

    setLoading(true);
    const errorText = await authStore.register(email, password);

    if (errorText) {
      setRegisterError(errorText);
    } else {
      reset();
    }
    setLoading(false);
  });

  useEffect(() => {
    const subscription = watch(() => setRegisterError(undefined));
    return () => subscription.unsubscribe();
  }, [watch]);

  if (userStore.currentUser) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <Box component="form" noValidate onSubmit={onSubmit}>
      {registerError && <Alert severity="error">{registerError}</Alert>}
      <TextField
        sx={{ mt: 2 }}
        id="register-form-email"
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
        id="register-form-password"
        label="Password"
        variant="standard"
        fullWidth
        required
        type="password"
        error={!!errors['password']}
        helperText={errors['password']?.message ?? ''}
        {...register('password')}
      />
      <TextField
        sx={{ mt: 2 }}
        id="register-form-confirm-password"
        label="Confirm Password"
        variant="standard"
        fullWidth
        required
        type="password"
        error={!!errors['confirmPassword']}
        helperText={errors['confirmPassword']?.message ?? ''}
        {...register('confirmPassword')}
      />
      <Stack justifyContent="center" spacing={2} direction="row" mt={2}>
        <Button variant="outlined" size="medium" type="submit" disabled={submitDisabled}>
          Submit
        </Button>
        <Button variant="text" size="medium" onClick={navigateToLogin} disabled={loading}>
          Back to Login
        </Button>
      </Stack>
    </Box>
  );
});
