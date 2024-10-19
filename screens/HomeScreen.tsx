import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ExerciseItem from './ExerciseItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Exercise {
  id: number;
  name: string;
  duration: string;
}

const HomeScreen: React.FC<any> = ({ route }) => { // screenコンポーネントの引数（props）として、自動的に提供される
  const [exercises, setExercises] = useState<Exercise[]>([]); // 初期化
  const navigation = useNavigation();
  const [count, setCounter] = useState<number>(0); // 入力したタスクにIDを振るためのcount

  // console.log(route.params?.state['name']);
  // console.log(route.params?.state['duration']);
  // console.log(Array.isArray(exercises));
  useEffect(() => { // データ保存時
    if (route.params?.state) {
      // setExercises(prevData => [...prevData, route.params.exerciseData]);
      // console.log(route.params?.state['exerciseName']);
      const loadData = async () => {
        try {
          const savedExercises = await AsyncStorage.getItem('exercises');
          const newExercise = {
            id: route.params?.state['id'],
            name: route.params?.state['name'],
            duration: route.params?.state['duration'],
          };
          // console.log(savedExercises);
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
      console.log("データ保存");
    }
  }, [route.params?.state]);

  useEffect(() => { // 初回読み込みで呼び出す
    // 初期化時にローカルストレージからデータを読み込む
    const loadData = async () => {
      try {
        const savedExercises = await AsyncStorage.getItem('exercises');
        const parsedExercises = JSON.parse(savedExercises); // JSON形式の文字列をオブジェクトに変換
        // if (savedExercises !== null) {
        //   // setExercises(JSON.parse(savedExercises));
        //   const newExercise = [
        //     ...savedExercises,
        //     {
        //       id: parsedExercises.id,
        //       name: parsedExercises.name,
        //       duration: parsedExercises.duration,
        //     }
        //   ];
          setExercises(parsedExercises);
        // }
      } catch (error) {
        console.error('Error loading data', error);
      }
      console.log('初回読み込み');
      // try {
      //   // 特定のキーに保存されたデータを削除する
      //   await AsyncStorage.removeItem('exercises');
      //   console.log('データが削除されました');
      // } catch (error) {
      //   console.log('データ削除エラー:', error);
      // }
    };
    loadData();
  }, []);

  console.log(exercises);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness Tracker</Text>
      <FlatList
        data={ exercises }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // <ExerciseItem name={item.name} duration={item.duration} />
          <View>
            <Text>{item.name} - {item.duration} 分</Text>
          </View>
        )}
      />
      <Button
        title="Add New Exercise"
        onPress={() => navigation.navigate('AddExercise')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default HomeScreen;