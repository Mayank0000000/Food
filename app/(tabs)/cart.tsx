import { cartStyles } from '@/styles/screens/cart.styles';
import React from 'react';
import { Text, View } from 'react-native';

export default function Cart() {
  return (
    <View style={cartStyles.container}>
      <Text style={cartStyles.text}>Cart Tab</Text>
    </View>
  );
}