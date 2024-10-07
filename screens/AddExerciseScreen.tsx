import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';

const AddExerciseScreen: React.FC = () => {
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState('');
  // タスク一覧を管理するステート
  const [exercises, setExercises] = useState<{ id: number, exerciseName: string, interval: string}[]>([]); // ([])は初期値が空という意味
  const handleAddExercise = () => {
    if (exerciseName.trim()) {
      const updatedExercises = [
        ...exercises,
        {
          id: exercises.length + 1,
          exerciseName: exerciseName,
          interval: duration,
        }
      ];
      // 入力欄をリセット
      setExerciseName('');
      setDuration('');
      setExercises(updatedExercises);
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
            <Text style={styles.taskText}>{item.exerciseName}</Text>
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