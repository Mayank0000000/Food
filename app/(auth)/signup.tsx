import { AuthFooter } from '@/components/auth/auth-footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Text } from '@/components/ui/text';
import { authStyles } from '@/styles/auth.styles';
import React, { useState } from 'react';
import { View } from 'react-native';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    console.log('Signup:', { name, email, password });
  };

  return (
    <View style={authStyles.container}>
      <View style={authStyles.header}>
        <Text variant="title">Sign Up</Text>
        <Text variant="subtitle">Please create a new account</Text>
      </View>

      <View style={authStyles.form}>
        <Input
          label="NAME"
          placeholder="John Doe"
          value={name}
          onChangeText={setName}
        />

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
          title="SIGN UP" 
          onPress={handleSignup}
          style={authStyles.primaryButton}
        />

        <AuthFooter 
          text="Already have an account?"
          linkText="LOG IN"
          href="/(auth)/login"
        />
      </View>
    </View>
  );
}
