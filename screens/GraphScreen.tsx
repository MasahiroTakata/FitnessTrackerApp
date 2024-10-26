import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const GraphScreen: React.FC<any> = () => {
  const exerciseData = [
    { id: 1, name: 'ランニング', duration: 30 },
    { id: 2, name: 'サイクリング', duration: 45 },
    { id: 3, name: 'ヨガ', duration: 20 },
    { id: 4, name: '筋トレ', duration: 60 },
    { id: 5, name: 'ウォーキング', duration: 25 },
  ];
  // グラフ用のラベルとデータ
  const labels = exerciseData.map(exercise => exercise.name); // 各エクササイズの名前をラベルに
  const dataPoints = exerciseData.map(exercise => exercise.duration); // 各エクササイズの時間をデータに

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>エクササイズのグラフ</Text>

        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: dataPoints,
              },
            ],
          }}
          width={Dimensions.get('window').width - 32} // グラフの幅
          height={220} // グラフの高さ
          yAxisSuffix="分" // y軸の単位
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 0, // 小数点以下の桁数
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier // 滑らかな曲線
          style={styles.chart}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default GraphScreen;