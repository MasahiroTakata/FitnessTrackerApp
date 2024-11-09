import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polyline, Line, G, Text as SvgText } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 画面の幅を取得する
const { width } = Dimensions.get('window');
// 折れ線グラフのコンポーネント
const LineChart = () => {
  const height = 200; // グラフの高さ
  const padding = 20; // グラフの余白（画面の上下左右の端からの余白を設定している）
  const [data, setData] = useState<number[]>([]);
  // 初期表示時に呼ばれる
  useEffect(() => {
    const fetchData = async () => { // 非同期処理で、不具合が起きにくくしている
      try {
        const savedData = await AsyncStorage.getItem('exercises');
        if (savedData) {
          // オブジェクト形式に変換する(配列が取得できる) 
          const parsedData = JSON.parse(savedData);
          const durations = parsedData.map((item: { duration: string }) => parseInt(item.duration, 10));
          setData(durations);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    fetchData();
  }, []);

  const maxValue = Math.max(...data); // データの最大値を取得
  // 折れ線の座標を計算
  const points = data
    .map((value, index) => { // valueがdataに格納した数字、indexは配列の要素番号
      const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
      const y = height - (value / maxValue) * (height - 2 * padding) - padding;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* グリッドライン（x軸、y軸のこと）を描画 */}
        <G stroke="#ccc">
          <Line x1={padding} y1={padding} x2={padding} y2={height - padding} />
          <Line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} />
        </G>
        {/* 折れ線を描画 */}
        <Polyline
          points={points}
          fill="none"
          stroke="#007AFF"
          strokeWidth={3}
        />
        {/* データラベルを描画 */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
          const y = height - (value / maxValue) * (height - 2 * padding) - padding;
          return (
            <SvgText
              key={index}
              x={x}
              y={y - 7}
              fontSize="10"
              fill="#333"
              textAnchor="middle"
            >
              {value}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
});

export default LineChart;