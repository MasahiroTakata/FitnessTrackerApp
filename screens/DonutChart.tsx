import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import styles from '../styles/donutStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Exercise {
  id: number;
  name: string;
  category: number;
  duration: number;
  color: string;
}

const DonutChart : React.FC = () =>{
  const [exercises, setExercises] = useState<Exercise[]>([]); // 初期化
  // 初期表示時に呼ばれる
  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedExercises = await AsyncStorage.getItem('exercises');
        // JSON形式の文字列をオブジェクトに変換。これによりlengthでデータ数を取得できる
        const parsedExercises = JSON.parse(savedExercises);
        setExercises(parsedExercises);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    fetchData();
  }, []);

  // const data = [ // 指定する要素は決まっているっぽいが、要素の追加は可能
  //   { name: "A", population: 85, color: "tomato", legendFontColor: "#7F7F7F", legendFontSize: 15 },
  //   { name: "B", population: 65, color: "orange", legendFontColor: "#7F7F7F", legendFontSize: 15 },
  //   { name: "C", population: 55, color: "gold", legendFontColor: "#7F7F7F", legendFontSize: 15 },
  // ];
  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <PieChart
          data={exercises}
          width={700}
          height={200}
          chartConfig={{ // グラフの全体的なスタイル設定を行うオブジェクト
            backgroundColor: "#1cc910",
            backgroundGradientFrom: "#000",
            backgroundGradientTo: "#000",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor={"duration"} // data配列から、円グラフの割合を描く要素を指定する
          backgroundColor={"transparent"} // transparentを指定することで、背景を透明に設定
          paddingLeft={"100"}
          center={[75, 0]} // グラフの中心を整える（左上を始点としている）
          absolute // セグメント値（内訳みたいな説明が書かれたやつ）を中央に表示する
        />
        {/* ドーナツ中央部分 */}
        <View style={styles.centerText}>
        </View>
      </View>
    </View>
  );
};

export default DonutChart;