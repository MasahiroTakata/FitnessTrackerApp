import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ExerciseItem from './ExerciseItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Exercise {
  id: string;
  name: string;
  duration: string;
}

const HomeScreen: React.FC<any> = ({ route }) => { // screenコンポーネントの引数（props）として、自動的に提供される
  const [exercises, setExercises] = useState<Exercise[]>([]); // 初期化
  const navigation = useNavigation();
  React.useEffect(() => {
    if (route.params?.state) {
      // setExercises(prevData => [...prevData, route.params.exerciseData]);
      // console.log(route.params?.state['exerciseName']);
      const newExercise = {
        id: exercises.length + 1,
        name: route.params?.state['exerciseName'],
        duration: route.params?.state['interval'],
      };

      const loadData = async () => {
        try {
          await AsyncStorage.setItem('exercises', JSON.stringify(newExercise));
          // const savedExercises = await AsyncStorage.getItem('exercises');
          // if (savedExercises !== null) {
          //   setExercises(JSON.parse(savedExercises));
          // }  
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
        console.log(savedExercises);
        if (savedExercises !== null) {
          setExercises(JSON.parse(savedExercises));
        }
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness Tracker</Text>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // <ExerciseItem name={item.name} duration={item.duration} />
          <Text>{item.name} - {item.duration} 分</Text>

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