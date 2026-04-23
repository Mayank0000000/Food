import { AuthFooter } from '@/components/auth/auth-footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Text } from '@/components/ui/text';
import { authStyles } from '@/styles/auth.styles';
import React, { useState } from 'react';
import { View } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login:', { email, password });
  };

  return (
    <View style={authStyles.container}>
      <View style={authStyles.header}>
        <Text variant="title">Log In</Text>
        <Text variant="subtitle">Please sign in to your existing account</Text>
      </View>

      <View style={authStyles.form}>
        <Input
          label="EMAIL"
          placeholder="example@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <PasswordInput
          label="PASSWORD"
          placeholder="••••••••••"
          value={password}
          onChangeText={setPassword}
        />

        <Button 
          title="LOG IN" 
          onPress={handleLogin}
          style={authStyles.primaryButton}
        />

        <AuthFooter 
          text="Don't have an account?"
          linkText="SIGN UP"
          href="/(auth)/signup"
        />
      </View>
    </View>
  );
}
