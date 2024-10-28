import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polyline, Line, G, Text as SvgText } from 'react-native-svg';

// 画面の幅を取得する
const { width } = Dimensions.get('window');

// 折れ線グラフのコンポーネント
const LineChart: React.FC<{ data: number[] }> = ({ data }) => {
  const height = 200; // グラフの高さ
  const padding = 20; // グラフの余白
  const maxValue = Math.max(...data); // データの最大値を取得

  // 折れ線の座標を計算
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
      const y = height - (value / maxValue) * (height - 2 * padding) - padding;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* グリッドラインを描画 */}
        <G stroke="#ccc">
          <Line x1={padding} y1={padding} x2={padding} y2={height - padding} />
          <Line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} />
        </G>

        {/* 折れ線を描画 */}
        <Polyline
          points={points}
          fill="none"
          stroke="#007AFF"
          strokeWidth={2}
        />

        {/* データラベルを描画 */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
          const y = height - (value / maxValue) * (height - 2 * padding) - padding;
          return (
            <SvgText
              key={index}
              x={x}
              y={y - 5}
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