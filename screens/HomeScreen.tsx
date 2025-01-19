import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ExerciseItem from './ExerciseItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/commonStyles';
import { Exercise } from '@/types/exercise';
import { Calendar } from 'react-native-calendars';

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
  const navigation = useNavigation();

  const loadData = async () => {
    try {
      const savedExercises = await AsyncStorage.getItem('exercises');
      const parsedExercises = JSON.parse(savedExercises); // JSON形式の文字列をオブジェクトに変換

      if(parsedExercises == null){
        setExercises(parsedExercises);
      } else{
        // filterメソッドを使用してexercisedDateが、今日の日付のデータを取得
        const filteredExercises = parsedExercises.filter(item => item.exercisedDate === selectedDate);
        setExercises(filteredExercises);
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

  useEffect(() => { // データ保存時
    if (route.params?.state) {
      const loadData = async () => {
        try {
          const savedExercises = await AsyncStorage.getItem('exercises');
          const newExercise = {
            id: route.params?.state['id'],
            name: route.params?.state['name'],
            category: route.params?.state['category'],
            duration: route.params?.state['duration'],
            color: route.params?.state['color'],
            exercisedDate: route.params?.state['exercisedDate'],
          };
          // 他のエクササイズデータが保存されてた時
          if (savedExercises !== null) {
            const parsedExercises = JSON.parse(savedExercises); // JSON形式の文字列をオブジェクトに変換
            const newExercise2 = [
              ...parsedExercises,
                newExercise
            ];
            await AsyncStorage.setItem('exercises', JSON.stringify(newExercise2));
            setExercises(newExercise2);
          } else{
            const newExercise2 = [
              newExercise
            ];
            await AsyncStorage.setItem('exercises', JSON.stringify(newExercise2));
            setExercises(newExercise2);
          }
        } catch (error) {
          console.error('Error saving data', error);
        }
      };
      loadData();
    }
  }, [route.params?.state]);

  useEffect(() => { // 初回読み込みで呼び出す（第二引数を空にすることで、初期表示時にこのuseEffectが呼び出される）
    loadData();
  }, []);

  useEffect(() => { // 日付変更時に呼び出す
    loadData();
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness Tracker</Text>
      <Calendar
        // 日付が選択された時のコールバック
        onDayPress={(day) => setSelectedDate(day.dateString)}
        // 選択された日付のスタイル変更
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
        }}
      />
      <FlatList
        data={ exercises }
        renderItem={({ item }) => (
          <ExerciseItem name={item.name} duration={item.duration} color='white' />
        )}
        keyExtractor={(item) => `${item.name} - ${item.duration}`}
      />
      <TouchableOpacity
        style={styles.button}
        accessible={true}
        onPress={() => navigation.navigate('AddExercise')}
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