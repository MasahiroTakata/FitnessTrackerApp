import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import styles from '../styles/donutStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExerciseItem from './ExerciseItem';
import { CategoryRecords } from '@/constants/CategoryRecords'
import { Exercise } from '@/types/exercise';
import { summarizedExercises } from '@/types/summarizedExercises';
import commonStyles from '../styles/commonStyles';
import dayjs from 'dayjs';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';

type DonutChartProps = {
  selectedDateProp: string; // ← ここを必要に応じて型定義する（例: string や number や オブジェクト）
  navigation: NavigationProp<any>;
};

// type Props = {
//   navigation: NavigationProp<any>;
// };
// categoryから対応するlabelを取得する関数（propsがFlatListにて受け取ったカテゴリーID）
const getCategoryLabel = (category: number): string => {
  // catは、CategoryRecordsの１データのこと。findでcategoryを1行ずつ検索している
  const foundCategory = CategoryRecords.find((cat) => parseInt(cat.value, 10) === category);
  return foundCategory ? foundCategory.label : "不明"; // 該当するカテゴリーがなければ「不明」
};

const getExercisesbyYearMonth = async(selectedDateFormatted: string): Promise<summarizedExercises[]> => {
  try {
    const savedExercises = await AsyncStorage.getItem('exercises');
    const parsedExercises : Exercise[] = savedExercises ? JSON.parse(savedExercises) : [];
    const nowMonthExercises = parsedExercises.filter(exercise => exercise.exercisedDate.startsWith(selectedDateFormatted));
    // parsedExercisesからカテゴリーIDを重複なしで取得する
    const categoryList = nowMonthExercises.map(item => item.category);
    // Setクラスで重複なくカテゴリーを取得する
    const uniqueCategories = new Set(categoryList);
    // 重複のないカテゴリーIDを元に新しい配列を生成
    const summarizedExercises = Array.from(uniqueCategories).map(categoryId => {
      // 同じカテゴリーIDのデータを取得
      const exercisesInCategory = nowMonthExercises.filter(item => item.category === categoryId);
      // mapで取得したcategoryIdで、colorを取得する
      const color = CategoryRecords.find((cat) => parseInt(cat.value, 10) === parseInt(categoryId,10))?.['graphColor'];
      // durationの合計値を計算
      const totalDuration = exercisesInCategory.reduce((sum, item) => sum + item.duration, 0);
      // 新しいオブジェクトとして返す
      return {
        category: parseInt(categoryId, 10),
        duration: totalDuration,
        color: color,
      };
    });

    return summarizedExercises;
  } catch (error) {
    console.error('Failed to load data:', error);
    return [];
  }
};

const DonutChart: React.FC<any> = ({ selectedDateProp, navigation } : DonutChartProps) =>{
  // ナビゲーションの型を定義
  // type RootStackParamList = {
  //   Home: { selectedMonth: string };
  // };
  // type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
  // navigation = useNavigation<NavigationProp>();
console.log(navigation);
  const [summarizedExercises, setSummarizedExercises] = useState<summarizedExercises[]>([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const isFirstRender = useRef(true);

  const handlePrevMonth = () => {
    setSelectedDate((prev) => prev.subtract(1, "month"));
  };
  const handleNextMonth = () => {
    setSelectedDate((prev) => prev.add(1, "month"));
  };
  // 初期表示時に呼ばれる
  useEffect(() => {
    const fetchData = async () => {
      const formattedDate = dayjs(selectedDateProp).format('YYYY-MM');
      setSelectedDate(dayjs(formattedDate));
    };
    fetchData();
  }, []);
  // 年月が変更された時に呼び出すuseEffect関数
  useEffect(() => {
    const getSelectedYearMonth = async () => {

      if (isFirstRender.current) {
        // 初回レンダー時は実行せず、フラグを false にする
        isFirstRender.current = false;
        return;
      }

      const summarizedExercises = await getExercisesbyYearMonth(selectedDate.format("YYYY-MM"));
      setSummarizedExercises(summarizedExercises);
    };
    getSelectedYearMonth();
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <TouchableOpacity onPress={handlePrevMonth} style={{ padding: 10 }}>
          <Text style={{ fontSize: 20 }}>◀︎</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: "bold", marginHorizontal: 20 }}>
          {selectedDate.format("YYYY年MM月")}
        </Text>

        <TouchableOpacity onPress={handleNextMonth} style={{ padding: 10 }}>
          <Text style={{ fontSize: 20 }}>▶︎</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chartWrapper}>
        <PieChart
          data={summarizedExercises}
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
        data={ summarizedExercises }
        renderItem={({ item }) => (
          <ExerciseItem id={''} name={ getCategoryLabel(item.category) } duration={item.duration} color={item.color ? item.color : 'noData'} />
        )}
        keyExtractor={(item) => `${item.category}`}
      />
      <TouchableOpacity
        style={commonStyles.button}
        accessible={true}
        onPress={() => navigation.navigate('Home', { selectedMonth: dayjs(selectedDate).format('YYYY-MM') })}
        accessibilityRole="button">
        <Text style={commonStyles.buttonText}>戻る
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default DonutChart;