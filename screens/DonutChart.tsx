import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const DonutChart : React.FC = () =>{
  const data = [
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
          chartConfig={{
            backgroundColor: "#1cc910",
            backgroundGradientFrom: "#eff3ff",
            backgroundGradientTo: "#efefef",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"100"}
          center={[0, 0]} // グラフの中心を整える
          absolute // 値を中央に表示する
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // 画面の中心に配置
  },
  chartWrapper: {
    position: "relative", // ドーナツ中央部分を重ねるため
    justifyContent: "center",
    alignItems: "center", // グラフを中心に配置
    width: 200, // コンポーネント全体の横幅
    height: 200, // コンポーネント全体の縦幅
  },
  centerText: {
    position: "absolute",
    width: 100, // 中央の円のサイズ
    height: 100,
    borderRadius: 50, // 完全な円形にする
    backgroundColor: "white", // 背景色と同じ色
    justifyContent: "center",
    alignItems: "center",

  },
  centerTextTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  centerTextValue: {
    fontSize: 14,
    color: "#7F7F7F",
  },
  donutHole: {
    position: "absolute",
    width: 100, // 中央の円のサイズ
    height: 100,
    borderRadius: 50, // 完全な円形にする
    backgroundColor: "white", // 背景色と同じ色
    justifyContent: "center",
    alignItems: "center",
  },
  donutText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default DonutChart;