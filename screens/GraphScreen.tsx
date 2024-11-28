import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import LineChart from '../components/LineChart';
import DonutChart from './DonutChart';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/commonStyles';

const GraphScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>エクササイズ進捗</Text>
      <LineChart/>
      <DonutChart/>
      <TouchableOpacity
        style={styles.button}
        accessible={true}
        onPress={() => navigation.navigate('Home')}
        accessibilityRole="button">
        <Text style={styles.buttonText}>戻る
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GraphScreen;