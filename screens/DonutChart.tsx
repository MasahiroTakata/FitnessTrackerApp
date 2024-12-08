import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import styles from '../styles/donutStyles';

const DonutChart : React.FC = () =>{
  const data = [ // 指定する要素は決まっているっぽいが、要素の追加は可能
    { name: "A", population: 35, color: "tomato", legendFontColor: "#7F7F7F", legendFontSize: 15 },
    { name: "B", population: 40, color: "orange", legendFontColor: "#7F7F7F", legendFontSize: 15 },
    { name: "C", population: 25, color: "gold", legendFontColor: "#7F7F7F", legendFontSize: 15 },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <PieChart
          data={data}
          width={400}
          height={200}
          chartConfig={{ // グラフの全体的なスタイル設定を行うオブジェクト
            backgroundColor: "#1cc910",
            backgroundGradientFrom: "#000",
            backgroundGradientTo: "#000",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor={"population"} // data配列から、円グラフの割合を描く要素を指定する
          backgroundColor={"transparent"} // transparentを指定することで、背景を透明に設定
          paddingLeft={"100"}
          center={[0, 0]} // グラフの中心を整える（左上を始点としている）
          absolute // セグメント値（内訳みたいな説明が書かれたやつ）を中央に表示する
        />
        {/* ドーナツ中央部分 */}
        <View style={styles.centerText}>
          <Text style={styles.centerTextTitle}>Calories</Text>
          <Text style={styles.centerTextValue}>1200</Text>
        </View>
      </View>
    </View>
  );
};

export default DonutChart;