import { homeStyles } from '@/styles/screens/home.styles';
import React from 'react';
import { Text, View } from 'react-native';

export default function Home() {
  return (
    <View style={homeStyles.container}>
      <Text style={homeStyles.text}>Home Tab</Text>
    </View>
  );
}