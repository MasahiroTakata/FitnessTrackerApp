import React from 'react';
import { View, Text } from 'react-native';
import DonutChart from './DonutChart';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/commonStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationProp } from '@react-navigation/native';

// type DonutChartProps = {
//   selectedDateProp: string; // ← ここを必要に応じて型定義する（例: string や number や オブジェクト）
//   navigation: NavigationProp<any>;
// };

const GraphScreen: React.FC<any> = (state) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>エクササイズ割合</Text>
      <DonutChart selectedDateProp={state.route?.params.state} navigation={useNavigation}/>
    </View>
  );
};

export default GraphScreen;