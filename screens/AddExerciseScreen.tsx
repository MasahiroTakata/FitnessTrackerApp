import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonStyles from '../styles/commonStyles';
import RNPickerSelect from 'react-native-picker-select';
import { categories } from '@/types/categories';
import { Calendar } from "react-native-calendars";

const AddExerciseScreen: React.FC = () => {
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState('');
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('');
  const today = new Date();
  const formatted = today
  .toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit", // デフォルトは１桁（1月だと1と表示される）、2-digitとすることで２桁としてくれる（１月なら01月）
    day: "2-digit",
  })
  .split("/") // スラッシュ区切りで配列で格納する
  .join("-"); // 配列に格納された値をハイフンで結合して文字列にする
  // 日付入力用
  const [selectedDate, setSelectedDate] = useState(formatted); // 今日の日付をデフォルトに設定
  const [isCalendarVisible, setCalendarVisible] = useState(false);

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
        color: categories.find((cat) => parseInt(cat.value, 10) === parseInt(selectedCategory, 10))['graphColor'],
        exercisedDate: '2025-01-12',
      };
      // 入力欄をリセット
      setExerciseName('');
      setDuration('');
      setSelectedCategory('');
      // 型を適用した上でnavigation.navigateに引数を渡す
      navigation.navigate('Home', { state: newExercise });
    }
  };
  // 日付のフォーマットを調整する関数（例: yyyy-mm-dd）
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月を2桁に
    const day = String(date.getDate()).padStart(2, "0"); // 日を2桁に
    return `${year}-${month}-${day}`;
  };
  // 日付を選択したときの処理
  const onDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCalendarVisible(false); // カレンダーを閉じる
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
      <Text style={styles.label}>Exercised Day</Text>
        {/* 日付表示用のテキスト */}
      <TouchableOpacity onPress={() => setCalendarVisible(true)}>
        <Text style={styles.dateText}>
          {selectedDate}
        </Text>
      </TouchableOpacity>
      {/* モーダルにカレンダーを表示 */}
      <Modal visible={isCalendarVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <Calendar
              // 現在の日付を初期選択状態に設定
              current={selectedDate || undefined}
              onDayPress={(day) => onDateSelect(day.dateString)} // 日付選択時のコールバック
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: "blue" }, // 選択中の日付を強調表示
              }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCalendarVisible(false)}
            >
              <Text style={styles.closeButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  dateText: {
    fontSize: 18,
    color: "black",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  calendarContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
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