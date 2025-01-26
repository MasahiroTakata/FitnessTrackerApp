import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import styles from '../styles/donutStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExerciseItem from './ExerciseItem';
import { categories } from '../types/categories';
import { Exercise } from '@/types/exercise';
// categoryから対応するlabelを取得する関数（propsがFlatListにて受け取ったカテゴリーID）
const getCategoryLabel = (category: number): string => {
  // catは、categoriesの１データのこと。findでcategoriesを1行ずつ検索している
  const foundCategory = categories.find((cat) => parseInt(cat.value, 10) === category);
  return foundCategory ? foundCategory.label : "不明"; // 該当するカテゴリーがなければ「不明」
};

const getExercisesData = (savedExercises: string): Exercise[] => {
  // JSON形式の文字列をオブジェクトに変換。これによりlengthでデータ数を取得できる
  const parsedExercises = JSON.parse(savedExercises);
  // カテゴリーごとに合計時間を格納した配列をsetExercisesの引数とする
  // parsedExercisesからカテゴリーIDを重複なしで取得する
  const categoryList = parsedExercises.map(item => item.category);
  const uniqueCategories = new Set(categoryList);
  // 重複のないカテゴリーIDを元に新しい配列を生成
  const summarizedExercises = Array.from(uniqueCategories).map(categoryId => {
    // 同じカテゴリーIDのデータを取得
    const exercisesInCategory = parsedExercises.filter(item => item.category === categoryId);
    // mapで取得したcategoryIdで、colorを取得する
    const color = categories.find((cat) => parseInt(cat.value, 10) === categoryId)['graphColor'];
    // durationの合計値を計算
    const totalDuration = exercisesInCategory.reduce((sum, item) => sum + item.duration, 0);
    // 新しいオブジェクトとして返す
    return {
      category: categoryId,
      duration: totalDuration,
      color: color,
    };
  });

  return summarizedExercises;
};

const DonutChart : React.FC = () =>{
  const [exercises, setExercises] = useState<Exercise[]>([]); // 初期化
  // 初期表示時に呼ばれる
  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedExercises = await AsyncStorage.getItem('exercises');
        const summarizedExercises = getExercisesData(savedExercises);
        setExercises(summarizedExercises);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    fetchData();
  }, []);

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
          // absolute // セグメント値（内訳みたいな説明が書かれたやつ）を中央に表示する
          hasLegend={false}
        />
        {/* ドーナツ中央部分 */}
        <View style={styles.centerText}>
        </View>
      </View>
      <FlatList
        data={ exercises }
        renderItem={({ item }) => (
          <ExerciseItem name={ getCategoryLabel(item.category) } duration={item.duration} color={item.color} />
        )}
        keyExtractor={(item) => `${item.category}`}
      />
    </View>
  );
};

export default DonutChart;