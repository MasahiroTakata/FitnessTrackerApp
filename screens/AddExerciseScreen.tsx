import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonStyles from '../styles/commonStyles';
import RNPickerSelect from 'react-native-picker-select';

const AddExerciseScreen: React.FC = () => {
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState('');
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('');
  const categories = [
    { label: '首', value: '1', color: "#000", graphColor: "green" },
    { label: '腕', value: '2', color: "#000", graphColor: "red" },
    { label: '背中', value: '3', color: "#000", graphColor: "gold" },
    { label: '胸', value: '4', color: "#000", graphColor: "tomato" },
    { label: '腹', value: '5', color: "#000", graphColor: "orange" },
    { label: '足', value: '6', color: "#000", graphColor: "blue" },
    { label: '有酸素運動系（ランニングなど）', value: '7', color: "#000", graphColor: "yellow"},
  ];
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
        category: parseInt(selectedCategory, 10),
        duration: parseInt(duration, 10),
        color: categories.filter(getGraphColor => getGraphColor['value'] === selectedCategory)[0]['graphColor'],
      };
      // 入力欄をリセット
      setExerciseName('');
      setDuration('');
      setSelectedCategory('');
      // 型を適用した上でnavigation.navigateに引数を渡す
      navigation.navigate('Home', { state: newExercise });
    }
  };

  return (
    <View style={CommonStyles.container}>
      <Text style={styles.label}>Exercise Name</Text>
      <TextInput
        style={styles.input}
        value={exerciseName}
        onChangeText={setExerciseName}
        placeholder="Enter excercise name"
        placeholderTextColor="gray"
      />

      <Text style={styles.label}>Select Exercise Category</Text>
      <RNPickerSelect
        onValueChange={(value) => {
          setSelectedCategory(value);
        }}
        items={categories}
        placeholder={{ label: 'Select an option...', value: "", color: "#000" }}
        style={pickerSelectStyles}
        value={selectedCategory} // 現在選択されている値
        Icon={() => (<Text style={{ position: 'absolute', right: 15, top: 10, fontSize: 18, color: '#789' }}>▼</Text>)}
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
        <Text style={CommonStyles.buttonText}>Add Exercise</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  selectedCategory: {
    fontSize: 16,
    marginTop: 20,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // To ensure the text is not obscured by the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // To ensure the text is not obscured by the icon
  },
};

export default AddExerciseScreen;