import { AuthFooter } from '@/components/auth/auth-footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearError, signup } from '@/store/slices/authSlice';
import { authStyles } from '@/styles/auth.styles';
import { validateEmail, validateName, validatePassword } from '@/utils/validation';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
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
      Alert.alert('Signup Failed', error);
      dispatch(clearError());
    }
  }, [error]);

  const handleSignup = async () => {
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);

    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    if (nameErr || emailErr || passwordErr) {
      setNameError(nameErr);
      setEmailError(emailErr);
      setPasswordError(passwordErr);
      return;
    }

    dispatch(signup({ name, email, password }));
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
          <Text variant="title">Sign Up</Text>
          <Text variant="subtitle">Please create a new account</Text>
        </RView>

        <RView style={authStyles.form}>
          <Image 
            source={require('@/assets/images/Logo.png')} 
            style={authStyles.logo}
            contentFit="contain"
          />
          
          <Input
            label="NAME"
            placeholder="John Doe"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setNameError(null);
            }}
            error={nameError || undefined}
          />

          <Input
            label="EMAIL"
            placeholder="example@gmail.com"
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
            label="PASSWORD"
            placeholder="••••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(null);
            }}
            error={passwordError || undefined}
          />

          <Button 
            title={isLoading ? "SIGNING UP..." : "SIGN UP"}
            onPress={handleSignup}
            style={authStyles.primaryButton}
            disabled={isLoading}
          />

          <AuthFooter 
            text="Already have an account?"
            linkText="LOG IN"
            href="/(auth)/login"
          />
        </RView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
