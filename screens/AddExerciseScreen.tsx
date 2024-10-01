import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddExerciseScreen: React.FC = () => {
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState('');
  const navigation = useNavigation();

  const handleAddExercise = () => {
    // フィットネストラッキング用のロジックをここに書く
    // 例: 新しいエクササイズをリストに追加する
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Exercise Name</Text>
      <TextInput
        style={styles.input}
        value={exerciseName}
        onChangeText={setExerciseName}
      />
      <Text style={styles.label}>Duration (minutes)</Text>
      <TextInput
        style={styles.input}
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
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
});

export default AddExerciseScreen;