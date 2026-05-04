import { AuthFooter } from '@/components/auth/auth-footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useCMS } from '@/hooks/useCMS';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearError, login } from '@/store/slices/authSlice';
import { authStyles } from '@/styles/auth.styles';
import { validateEmail, validatePassword } from '@/utils/validation';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export default function Login() {
  const { t } = useCMS();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      Alert.alert(t('errors.auth.loginFailed'), error);
      dispatch(clearError());
    }
  }, [error, t]);

  const handleLogin = async () => {
    setEmailError(null);
    setPasswordError(null);

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    if (emailErr || passwordErr) {
      setEmailError(emailErr);
      setPasswordError(passwordErr);
      return;
    }

    dispatch(login({ email, password }));
  };

  return (
    <KeyboardAvoidingView
      style={authStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={authStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <RView style={authStyles.header}>
          <Text variant="title">{t('auth.login.title')}</Text>
          <Text variant="subtitle">{t('auth.login.subtitle')}</Text>
        </RView>

        <RView style={authStyles.form}>
          <Image
            source={require('@/assets/images/Logo.png')}
            style={authStyles.logo}
            contentFit="contain"
          />

          <Input
            label={t('auth.login.emailLabel')}
            placeholder={t('auth.login.emailPlaceholder')}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError || undefined}
          />

          <PasswordInput
            label={t('auth.login.passwordLabel')}
            placeholder={t('auth.login.passwordPlaceholder')}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(null);
            }}
            error={passwordError || undefined}
          />

          <Button
            title={t('auth.login.loginButton')}
            onPress={handleLogin}
            style={authStyles.primaryButton}
            disabled={isLoading}
            loading={isLoading}
          />

          <AuthFooter
            text={t('auth.login.footerText')}
            linkText={t('auth.login.footerLink')}
            href="/(auth)/signup"
          />
        </RView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
