import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

export default function AddExerciseScreen({ navigation }) {
  const [exercise, setExercise] = useState('');

  const addExercise = () => {
    // エクササイズ追加のロジック
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter exercise name"
        value={exercise}
        onChangeText={setExercise}
      />
      <Button title="Save Exercise" onPress={addExercise} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
