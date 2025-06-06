import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ExerciseItem from './ExerciseItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/commonStyles';
import { Exercise } from '@/types/exercise';
import { Calendar, DateData } from 'react-native-calendars';
import { StackNavigationProp } from '@react-navigation/stack';
import dayjs from 'dayjs';

type DateObject = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

const HomeScreen: React.FC<any> = ({ route }) => { // screenコンポーネントの引数（props）として、自動的に提供される
  const today = new Date();
  const formatted = today
    .toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit", // デフォルトは１桁（1月だと1と表示される）、2-digitとすることで２桁としてくれる（１月なら01月）
      day: "2-digit",
    })
    .split("/") // スラッシュ区切りで配列で格納する
    .join("-"); // 配列に格納された値をハイフンで結合して文字列にする
  const [selectedDate, setSelectedDate] = useState(formatted); // 初期は今日の日付
  const [markedDateDatas, setMarkedDateDatas] = useState<
  Record<string, { selected: boolean; marked: boolean; dotColor: string }>
  >({});
  // ナビゲーションの型を定義
  type RootStackParamList = {
    Home: undefined;
    Graph: { state: string };
    AddExercise: { state: string };
  };
  type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
  const navigation = useNavigation<NavigationProp>();
  const isFirstRender = useRef(true);
  const isFirstRenderChangedMonth = useRef(true);
  const nowYearMonth = today
  .toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit", // デフォルトは１桁（1月だと1と表示される）、2-digitとすることで２桁としてくれる（１月なら01月）
  })
  .split("/") // スラッシュ区切りで配列で格納する
  .join("-"); // 配列に格納された値をハイフンで結合して文字列にする
  const [currentMonth, setCurrentMonth] = useState(nowYearMonth);
  // 日付ごとにグルーピングする用の型を用意
  type typeOfGroupedDay = {
    [date: string]: Exercise[]
  };
  const groupedByDay: typeOfGroupedDay = {};
  const [exercisesByDay, setExercisesByDay] = useState<typeOfGroupedDay> ({});

  // FlatListにアクセスするためのref（参照）を作成
  const flatListRef = useRef<FlatList>(null);
  // 日付が選択された時に呼ばれる関数コンポーネント
  // exercisesByDay: { date: '2025-05-10', exercises: Exercise[] }[]
  const handleDatePress = (selectedDate: string) => {
    const entries = Object.entries(exercisesByDay); // オブジェクトから配列に変換する
    const index = entries.findIndex(([date]) => date === selectedDate);
    // 該当のデータが見つかった且つ、refが正しくセットされているか？
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  useEffect(() => {
    if (route.params?.selectedMonth) {
      setCurrentMonth(route.params.selectedMonth);
    }
  }, [route.params?.selectedMonth]);

  useEffect(() => {
    if (isFirstRender.current) {
      // 初回レンダー時は実行せず、フラグを false にする
      isFirstRender.current = false;

      return;
    }

    const loadData = async () => {
      try {
        const savedExercises = await AsyncStorage.getItem('exercises');
        const parsedExercises : Exercise[]= savedExercises ? JSON.parse(savedExercises) : []; // JSON形式の文字列をオブジェクトに変換
        // データが１件も保存されていない場合
        if(parsedExercises == null){
          setExercisesByDay({});
        } else{
          // filterメソッドを使用してexercisedDateが、今月のデータを取得
          const nowMonthExercises = parsedExercises.filter(exercise => exercise.exercisedDate.startsWith(yearMonth));
  
          nowMonthExercises.forEach((exercise) => {
            const day = exercise.exercisedDate;
            // 要素がその日付である配列の存在チェック（なければ、その日付の配列を用意する）
            if (!groupedByDay[day]) {
              groupedByDay[day] = [];
            }
            // その日付の配列にデータを格納する
            groupedByDay[day].push(exercise);
          });
          // 日付のキーだけ取り出して、降順（新しい順）に並べ替え
          const sortedDates = Object.keys(groupedByDay).sort((a, b) => (a < b ? 1 : -1));
          // ソートされた順番で新しいオブジェクトを作る
          const sortedGroupedByDay: { [date: string]: Exercise[] } = {};
  
          sortedDates.forEach((date) => {
            sortedGroupedByDay[date] = groupedByDay[date];
          });
  
          setExercisesByDay(sortedGroupedByDay);
          /* カレンダーに印をつける実装 */
          // エクササイズが記録されている日付のリストを取得する
          const dateList = parsedExercises.map(item => item.exercisedDate);
          // Setクラスを使って、dateListの重複を排除している
          const uniqueDates = new Set(dateList);
          // uniqueDatesをArray.fromで配列に変換する
          // reduce関数で、{ 日付: オブジェクト }の形に変換&集積した
          const markedDates = Array.from(uniqueDates).reduce<Record<string, { selected: boolean; marked: boolean; dotColor: string }>>(
            (acc, date) => {
              acc[date as string] = { selected: false, marked: true, dotColor: 'blue' };
              return acc;
            },
            {}
          );
  
          setMarkedDateDatas(markedDates);
        }
      } catch (error) {
        console.error('Error loading data', error);
      }
    };
    const yearMonth = dayjs(route.params?.state).format('YYYY-MM');
    // 比較する
    if(yearMonth === currentMonth){
      loadData();
    } else{
      setCurrentMonth(yearMonth);
    }
  }, [route.params?.updatedAt]);

  // その年月のエクササイズ情報を取得する
  const getSelectedYearMonthDatas = async () => {
    try {
      const savedExercises = await AsyncStorage.getItem('exercises');
      const parsedExercises : Exercise[]= savedExercises ? JSON.parse(savedExercises) : []; // JSON形式の文字列をオブジェクトに変換
      // データが１件も保存されていない場合
      if(parsedExercises == null){
        setExercisesByDay({});
      } else{
        // filterメソッドを使用してexercisedDateが、今月のデータを取得
        const nowMonthExercises = parsedExercises.filter(exercise => exercise.exercisedDate.startsWith(currentMonth));

        nowMonthExercises.forEach((exercise) => {
          const day = exercise.exercisedDate;
          // 要素がその日付である配列の存在チェック（なければ、その日付の配列を用意する）
          if (!groupedByDay[day]) {
            groupedByDay[day] = [];
          }
          // その日付の配列にデータを格納する
          groupedByDay[day].push(exercise);
        });
        // 日付のキーだけ取り出して、降順（新しい順）に並べ替え
        const sortedDates = Object.keys(groupedByDay).sort((a, b) => (a < b ? 1 : -1));
        // ソートされた順番で新しいオブジェクトを作る
        const sortedGroupedByDay: { [date: string]: Exercise[] } = {};

        sortedDates.forEach((date) => {
          sortedGroupedByDay[date] = groupedByDay[date];
        });

        setExercisesByDay(sortedGroupedByDay);
        /* カレンダーに印をつける実装 */
        // エクササイズが記録されている日付のリストを取得する
        const dateList = parsedExercises.map(item => item.exercisedDate);
        // Setクラスを使って、dateListの重複を排除している
        const uniqueDates = new Set(dateList);
        // uniqueDatesをArray.fromで配列に変換する
        // reduce関数で、{ 日付: オブジェクト }の形に変換&集積した
        const markedDates = Array.from(uniqueDates).reduce<Record<string, { selected: boolean; marked: boolean; dotColor: string }>>(
          (acc, date) => {
            acc[date as string] = { selected: false, marked: true, dotColor: 'blue' };
            return acc;
          },
          {}
        );

        setMarkedDateDatas(markedDates);
      }
    } catch (error) {
      console.error('Error loading data', error);
    }

    // try {
    //   // 特定のキーに保存されたデータを削除する
    //   await AsyncStorage.removeItem('exercises');
    //   console.log('データが削除されました');
    // } catch (error) {
    //   console.log('データ削除エラー:', error);
    // }
  };

  useEffect(() => { // 日付変更と初期表示時に呼び出す
    getSelectedYearMonthDatas();
  }, [selectedDate]);

  useEffect(() => { // 年月変更時に呼び出す
    if (isFirstRenderChangedMonth.current) {
      // 初回レンダー時は実行せず、フラグを false にする
      isFirstRenderChangedMonth.current = false;

      return;
    } else{
      getSelectedYearMonthDatas();
    }
  }, [currentMonth]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness Tracker</Text>
      <Calendar
        key={currentMonth + '-01'}
        current={currentMonth + '-01'}
        // 日付が選択された時のコールバック
        onDayPress={(day : DateData) => {
          const selectedDate = day.dateString; // '2025-05-10' みたいな文字列
          setSelectedDate(selectedDate);
          handleDatePress(selectedDate);
        }}
        // 選択された日付のスタイル変更
        markedDates={{
          ...markedDateDatas, // スプレッド演算子でオブジェクトの中身を展開している
          [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
        }}
        onMonthChange={(month: DateObject) => {
          const formattedMonth = `${month.year}-${String(month.month).padStart(2, '0')}`;
          setCurrentMonth(formattedMonth);
        }}
      />
      <FlatList
        ref={flatListRef}
        data={Object.entries(exercisesByDay)} 
        renderItem={({ item }) => {
          const [date, exercises] = item;
          return (
            <View>
              <Text style={styles.daysText}>{String(date)}</Text>

              {exercises.map((exercise: Exercise, index: number) => {
                const isLast = index === exercises.length - 1;

                return (
                  <View key={exercise.id}>
                    <ExerciseItem
                      id={exercise.id}
                      name={exercise.name}
                      duration={exercise.duration}
                      color={isLast ? 'isLast' : ''}
                    />
                  </View>
                );
              })}
            </View>
          );
        }}
      />
      <TouchableOpacity
        style={styles.button}
        accessible={true}
        onPress={() => navigation.navigate('AddExercise', { state: selectedDate })}
        accessibilityRole="button">
        <Text style={styles.buttonText}>Add Exercise</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        accessible={true}
        onPress={() => navigation.navigate('Graph', { state: currentMonth })}
        accessibilityRole="button">
        <Text style={styles.buttonText}>Go To Graph
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;