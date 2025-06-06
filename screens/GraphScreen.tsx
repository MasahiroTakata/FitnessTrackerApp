import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import DonutChart from './DonutChart';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/commonStyles';
import { StackNavigationProp } from '@react-navigation/stack';

const GraphScreen: React.FC<any> = (state) => {
  // ナビゲーションの型を定義
  type RootStackParamList = {
    Home: undefined;
  };
  type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>エクササイズ割合</Text>
      <DonutChart selectedDateProp={state.route?.params.state}/>
    </View>
  );
};

export default GraphScreen;