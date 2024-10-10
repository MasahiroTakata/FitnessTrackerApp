import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Exercise {
  id: number;
  name: string;
  duration: string;
}

const AddExerciseScreen: React.FC = () => {
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState('');
  // タスク一覧を管理するステート
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const navigation = useNavigation();
  useEffect(() => { // 初回レンダリングで呼び出す
    const loadData = async () => {
      try {
        const savedExercises = await AsyncStorage.getItem('exercises');
        if (savedExercises !== null) {
          setExercises(JSON.parse(savedExercises));
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

    loadData();
  }, []);
  // const [AddBtnFlg, setAddBtnFlg] = useState<boolean>(true);
  // const handleAddExercise = () => {
  //   if (exerciseName.trim()) {
  //     const updatedExercises = [
  //       ...exercises,
  //       {
  //         id: exercises.length + 1,
  //         exerciseName: exerciseName,
  //         interval: duration,
  //       }
  //     ];
  //     // 入力欄をリセット
  //     setExerciseName('');
  //     setDuration('');
  //     setExercises(updatedExercises);
  //   }
  // };
  // 新しいエクササイズを追加してローカルストレージに保存
  const handleAddExercise = async() => {
    if (exerciseName.trim()) {
      const newExercise = {
        id:exercises.length + 1,
        name: exerciseName,
        duration: duration,
      };
      // すでに登録されたデータがexercisesに格納されている
      const updatedExercises = [...exercises, newExercise];
      // exercisesを更新
      setExercises(updatedExercises);
      // ローカルストレージに保存
      try {
        await AsyncStorage.setItem('exercises', JSON.stringify(updatedExercises));
      } catch (error) {
        console.error('Error saving data', error);
      }
      // 入力欄をリセット
      setExerciseName('');
      setDuration('');
    }
  };

  // useEffect(() => {
  //   if(AddBtnFlg){
  //     setAddBtnFlg(false);
  //     return;
  //   }
  //   // 型を適用した上でnavigation.navigateに引数を渡す
  //   navigation.navigate('Home', { state: exercises });
  // }, [exercises]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Exercise Name</Text>
      <TextInput
        style={styles.input}
        value={exerciseName}
        onChangeText={setExerciseName}
        placeholder="Enter excercise name"
      />
      <Text style={styles.label}>Duration (minutes)</Text>
      <TextInput
        style={styles.input}
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        placeholder="Enter duration name(numeric only)"
      />
      {/* タスクの一覧を表示 */}
      <FlatList
        data={ exercises }
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.name} - {item.duration} 分</Text>
          </View>
        )}
      />
      <Button title="Add Exercise" onPress={handleAddExercise} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  taskItem: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    marginTop: 10,
    borderRadius: 5,
  },
  taskText: {
    fontSize: 16,
  },
});

export default AddExerciseScreen;