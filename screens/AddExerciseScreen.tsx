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
  const [count, setCounter] = useState<number>(1); // 入力したタスクにIDを振るためのcount

  // const [AddBtnFlg, setAddBtnFlg] = useState<boolean>(true);

  // useEffect(() => { // 初回読み込みで呼び出す
  //   // 初期化時にローカルストレージからデータを読み込む
  //   const loadData = async () => {
  //     try {
  //       const savedExercises = await AsyncStorage.getItem('exercises');
  //       console.log(savedExercises);
  //       if (savedExercises !== null) {
  //         setExercises(JSON.parse(savedExercises));
  //       }
  //     } catch (error) {
  //       console.error('Error loading data', error);
  //     }
  //     console.log('初回読み込み');
  //     // try {
  //     //   // 特定のキーに保存されたデータを削除する
  //     //   await AsyncStorage.removeItem('exercises');
  //     //   console.log('データが削除されました');
  //     // } catch (error) {
  //     //   console.log('データ削除エラー:', error);
  //     // }
  //   };
  //   loadData();
  // }, []);

  // useEffect(() => { // 初回レンダリングで呼び出す
  //   const loadData = async () => {
  //     try {
  //       // 特定のキーに保存されたデータを削除する
  //       await AsyncStorage.removeItem('exercises');
  //       console.log('データが削除されました');
  //     } catch (error) {
  //       console.log('データ削除エラー:', error);
  //     }
  //   };
  //   loadData();
  // }, []);
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
  // 新しいエクササイズをホーム画面に渡す
  const handleAddExercise = async() => {
    if (exerciseName.trim()) {
      const savedExercises = await AsyncStorage.getItem('exercises');
      // const savedCounter = await AsyncStorage.getItem('counter');

      const parsedExercises = JSON.parse(savedExercises); // JSON形式の文字列をオブジェクトに変換
      console.log(parsedExercises);
      // if(savedCounter !== ''){
      //   setCounter(Number(parsedExercises?.length) + 1);
      // }
      const aaaa = parsedExercises == null ? 1 : Number(parsedExercises?.length) + 1;
      const newExercise = {
        id: aaaa,
        name: exerciseName,
        duration: duration,
      };
      // 入力欄をリセット
      setExerciseName('');
      setDuration('');
      // await AsyncStorage.setItem('counter', JSON.stringify(count));

      // 型を適用した上でnavigation.navigateに引数を渡す
      navigation.navigate('Home', { state: newExercise });
// 
      // try {
      //   const savedExercises = await AsyncStorage.getItem('exercises');
      //   if (savedExercises !== null) {
      //     setExercises(JSON.parse(savedExercises));
      //   }
        
      // } catch (error) {
      //   console.error('Error loading data', error);
      // }
      // すでに登録されたデータがexercisesに格納されている
      // const updatedExercises = [...exercises, newExercise];
      // exercisesを更新
      // setExercises(updatedExercises);
      // ローカルストレージに保存
      // try {
      //   await AsyncStorage.setItem('exercises', JSON.stringify(updatedExercises));
      // } catch (error) {
      //   console.error('Error saving data', error);
      // }
    }
  };

  // useEffect(() => {
  //   if(AddBtnFlg){ // 初回レンダリングはどうしても呼ばれてしまうので制御する
  //     setAddBtnFlg(false);
  //     return;
  //   }
  //   // 入力欄をリセット
  //   setExerciseName('');
  //   setDuration('');
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
        // keyExtractor={(item) => item.id.toString()}
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