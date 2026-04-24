import { explorerStyles } from '@/styles/screens/explorer.styles';
import React from 'react';
import { Text, View } from 'react-native';

export default function Explorer() {
  return (
    <View style={explorerStyles.container}>
      <Text style={explorerStyles.text}>Explorer Tab</Text>
    </View>
  );
}