import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ExerciseItem from './ExerciseItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/commonStyles';

interface Exercise {
  id: number;
  name: string;
  category: number;
  duration: number;
  color: string;
}

const HomeScreen: React.FC<any> = ({ route }) => { // screenコンポーネントの引数（props）として、自動的に提供される
  const [exercises, setExercises] = useState<Exercise[]>([]); // 初期化
  const navigation = useNavigation();

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
          };
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

  useEffect(() => { // 初回読み込みで呼び出す
    // 初期化時にローカルストレージからデータを読み込む
    const loadData = async () => {
      try {
        const savedExercises = await AsyncStorage.getItem('exercises');
        const parsedExercises = JSON.parse(savedExercises); // JSON形式の文字列をオブジェクトに変換
        setExercises(parsedExercises);
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
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness Tracker</Text>
      <FlatList
        data={ exercises }
        renderItem={({ item }) => (
          <ExerciseItem name={item.name} duration={item.duration} />
        )}
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