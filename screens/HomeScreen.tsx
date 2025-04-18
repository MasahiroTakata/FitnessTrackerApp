import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ExerciseItem from './ExerciseItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/commonStyles';
import { Exercise } from '@/types/exercise';
import { Calendar, DateData } from 'react-native-calendars';
import { StackNavigationProp } from '@react-navigation/stack';

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
  const [exercises, setExercises] = useState<Exercise[]>([]); // 初期化
  const [selectedDate, setSelectedDate] = useState(formatted); // 初期は今日の日付
  const [markedDateDatas, setMarkedDateDatas] = useState<
  Record<string, { selected: boolean; marked: boolean; dotColor: string }>
  >({});
  // ナビゲーションの型を定義
  type RootStackParamList = {
    Home: undefined;
    Graph: undefined;
    AddExercise: { state: string };
  };
  type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
  const navigation = useNavigation<NavigationProp>();
  const isFirstRender = useRef(true);

  const loadData = async () => {
    if (isFirstRender.current) {
      // 初回レンダー時は実行せず、フラグを false にする
      isFirstRender.current = false;

      return;
    }

    setSelectedDate(route.params?.state);

    try {
      const savedExercises = await AsyncStorage.getItem('exercises');
      const parsedExercises : Exercise[] = savedExercises ? JSON.parse(savedExercises) : []; // JSON形式の文字列をオブジェクトに変換
      // データが１件も保存されていない場合
      if(parsedExercises == null){
        setExercises([]);
      } else{
          const filteredExercises = parsedExercises.filter(item => item.exercisedDate === route.params?.state);
          setExercises(filteredExercises);
      }
    } catch (error) {
      console.error('Error loading data', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [route.params?.updatedAt]);

  useEffect(() => { // 日付変更時に呼び出す
    const selectDateData = async () => {
      try {
        const savedExercises = await AsyncStorage.getItem('exercises');
        const parsedExercises : Exercise[]= savedExercises ? JSON.parse(savedExercises) : []; // JSON形式の文字列をオブジェクトに変換
        // データが１件も保存されていない場合
        if(parsedExercises == null){
          setExercises([]);
        } else{
          // filterメソッドを使用してexercisedDateが、今日の日付のデータを取得
          const filteredExercises = parsedExercises.filter(item => item.exercisedDate === selectedDate);
          setExercises(filteredExercises);
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
    selectDateData();
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness Tracker</Text>
      <Calendar
        // 日付が選択された時のコールバック
        onDayPress={(day : DateData) => setSelectedDate(day.dateString)}
        // 選択された日付のスタイル変更
        markedDates={{
          ...markedDateDatas, // スプレッド演算子でオブジェクトの中身を展開している
          [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
        }}
      />
      <FlatList
        data={ exercises }
        renderItem={({ item }) => (
          <ExerciseItem id = {item.id} name={item.name} duration={item.duration} color='white' />
        )}
        keyExtractor={(item) => `${item.id}`}
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
        onPress={() => navigation.navigate('Graph')}
        accessibilityRole="button">
        <Text style={styles.buttonText}>Go To Graph
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;