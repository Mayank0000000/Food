import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { authStyles } from '@/styles/auth.styles';
import { Link } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
}

export function AuthFooter({ text, linkText, href }: AuthFooterProps) {
  return (
    <View style={authStyles.footerContainer}>
      <Text variant="body">{text} </Text>
      <Link href={href} asChild>
        <Button 
          title={linkText} 
          variant="outline"
          size="small"
          style={authStyles.secondaryButton}
        />
      </Link>
    </View>
  );
}
