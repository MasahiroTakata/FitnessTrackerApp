import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import styles from '../styles/donutStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExerciseItem from './ExerciseItem';
import { CategoryRecords } from '@/constants/CategoryRecords'
import { Exercise } from '@/types/exercise';
import { summarizedExercises } from '@/types/summarizedExercises';
import dayjs from 'dayjs';
import { useFocusEffect } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';

type DonutChartProps = {
  selectedDateProp?: string;       // フル日付文字列（例: '2025-10-14'）など
  selectedMonthProp?: string;      // 月指定（例: '2025-10'）が優先される
  navigation: NavigationProp<any>;
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
      const color = CategoryRecords.find((cat) => cat.value === categoryId)?.['graphColor'];
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
  } catch (error) {
    console.error('Failed to load data:', error);
    return [];
  }
};

const DonutChart: React.FC<any> = ({ selectedDateProp, selectedMonthProp, navigation } : DonutChartProps) =>{
  const [summarizedExercises, setSummarizedExercises] = useState<summarizedExercises[]>([]);
  // 初期 selectedDate は props または今日を元に決める
  const initialDate = selectedMonthProp
    ? dayjs(selectedMonthProp + '-01')
    : selectedDateProp
      ? dayjs(selectedDateProp)
      : dayjs();
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const isFirstRender = useRef(true);
  const params = useLocalSearchParams();

  const resolveDateFromProps = useCallback(() => {
    if (selectedMonthProp) return dayjs(selectedMonthProp + '-01');
    if (selectedDateProp) return dayjs(selectedDateProp);
    return dayjs();
  }, [selectedMonthProp, selectedDateProp]);

  // 空データ時に表示する単一スライス（見た目を保つため）
  const emptySlice = [
    {
      category: -1,
      duration: 1,
      color: '#e6e6e6',
      label: 'データなし',
    },
  ];

  // チャートに渡すデータ（空なら emptySlice を渡す）
  const chartData = summarizedExercises.length > 0 ? summarizedExercises : emptySlice;
 
   // 前月 / 次月ボタン用ハンドラ（state を dayjs で保持している想定）
   const handlePrevMonth = () => {
     setSelectedDate(prev => prev.subtract(1, 'month'));
   };
   const handleNextMonth = () => {
     setSelectedDate(prev => prev.add(1, 'month'));
   };
 
  // GraphScreenの画面を、違う画面から表示する際に呼び出す処理（初期表示でも使用）
  useFocusEffect(
    useCallback(() => {
      const fetchUpdatedAt = async () => {
        // フォーカス時は props を優先して selectedDate を設定
        setSelectedDate(resolveDateFromProps());
      };

      fetchUpdatedAt();
    }, [resolveDateFromProps])
  );

  // グラフボタンを押下した時の処理（同じタブを連続押下した場合も対応できる）
  useEffect(() => {
    if (params.reload) {
      setSelectedDate(resolveDateFromProps());
    }
  }, [params.reload, resolveDateFromProps]);
  
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
      <View style={styles.chartWrapper}>
        <>
          <PieChart
            data={chartData}
            width={700}
            height={200}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor={"duration"}
            backgroundColor={"transparent"}
            paddingLeft={"100"}
            center={[75, 0]}
            hasLegend={false}
            // empty の時でもセグメントが描画されるようにする
          />
          {/* 中央ラベル：データなしなら表示、データ有りなら任意の中央表示 */}
          <View style={styles.centerText}>
            {summarizedExercises.length === 0 ? (
              <Text style={{ fontSize: 14, color: '#666' }}>No Data</Text>
            ) : null}
          </View>
        </>
       </View>
      <FlatList
        data={ summarizedExercises }
        renderItem={({ item }) => (
          <ExerciseItem id={''} name={ '' } category={item.category} duration={item.duration} color={item.color ? item.color : 'noData'} navigation={navigation} />
        )}
        keyExtractor={(item) => `${item.category}`}
      />
    </View>
  );
};

export default DonutChart;