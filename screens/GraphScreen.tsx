// HomeScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import LineChart from '../components/LineChart';

const GraphScreen: React.FC = () => {
  // サンプルデータ（エクササイズの時間などを想定）
  const exerciseData = [10, 20, 15, 30, 40, 25, 35];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>エクササイズ進捗</Text>
      <LineChart data={exerciseData} />
      <Button title="戻る" onPress={() => console.log('戻るボタンが押されました')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default GraphScreen;