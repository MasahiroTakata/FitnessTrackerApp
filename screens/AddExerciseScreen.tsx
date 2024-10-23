import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddExerciseScreen: React.FC = () => {
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState('');
  const navigation = useNavigation();

  // 新しいエクササイズをホーム画面に渡す
  const handleAddExercise = async() => {
    if (exerciseName.trim()) {
      const savedExercises = await AsyncStorage.getItem('exercises');
       // JSON形式の文字列をオブジェクトに変換。これによりlengthでデータ数を取得できる
      const parsedExercises = JSON.parse(savedExercises);
      const counter = parsedExercises == null ? 1 : Number(parsedExercises?.length) + 1;
      const newExercise = {
        id: counter,
        name: exerciseName,
        duration: duration,
      };
      // 入力欄をリセット
      setExerciseName('');
      setDuration('');
      // 型を適用した上でnavigation.navigateに引数を渡す
      navigation.navigate('Home', { state: newExercise });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Exercise Name</Text>
      <TextInput
        style={styles.input}
        value={exerciseName}
        onChangeText={setExerciseName}
        placeholder="Enter excercise name"
        placeholderTextColor="gray"
      />
      <Text style={styles.label}>Duration (minutes)</Text>
      <TextInput
        style={styles.input}
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        placeholder="Enter duration name(numeric only)"
        placeholderTextColor="gray"
      />
      <TouchableOpacity
        style={styles.button}
        accessible={true}
        onPress={handleAddExercise}
        accessibilityRole="button">
        <Text style={styles.buttonText}>Add Exercise</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AddExerciseScreen;