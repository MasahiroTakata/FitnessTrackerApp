import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonStyles from '../styles/commonStyles';
import RNPickerSelect from 'react-native-picker-select';
import { Exercise } from '@/types/exercise';
import { CategoryRecords } from '@/constants/CategoryRecords'
import { Calendar, DateData } from 'react-native-calendars';
import { StackNavigationProp } from '@react-navigation/stack';

const EditExerciseScreen: React.FC<any> = ({ route }) => { // 引数routeの型を<any>として宣言している
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  // 日付入力用
  const [selectedDate, setSelectedDate] = useState(''); // 今日の日付をデフォルトに設定
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  // ナビゲーションの型を定義
  type RootStackParamList = {
    Home: { state: string, updatedAt: string };
    Graph: undefined;
    AddExercise: { state: string };
  };
  type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
  const navigation = useNavigation<NavigationProp>();
  // 初回読み込みで呼び出す（第二引数を空にすることで、初期表示時にこのuseEffectが呼び出される）
  useEffect(() => {
    getEditExercise();
  }, []);
  // ホームで選択したエクササイズ情報を取得して、その内容をテキスト等にセットする
  const getEditExercise = async() => {
    const savedExercises = await AsyncStorage.getItem('exercises');
    // JSON形式の文字列をオブジェクトに変換。これによりlengthでデータ数を取得できる
    const parsedExercises : Exercise[] = savedExercises ? JSON.parse(savedExercises) : [];
    // routeから受け取ったidを基に、保存されたエクササイズ内から該当のエクササイズを検索する
    const filteredExercises = parsedExercises.filter(item => item.id === route.params?.state)[0];
    // 入力欄をセット
    setExerciseName(filteredExercises['name']);
    setDuration(filteredExercises['duration']);
    setSelectedCategory(filteredExercises['category']);
    setSelectedDate(filteredExercises['exercisedDate']);
  };
  // 編集したエクササイズをホーム画面に渡す
  const handleEditExercise = async() => {
    if (exerciseName.trim()) {
      const savedExercises = await AsyncStorage.getItem('exercises');
      const parsedExercises : Exercise[] = savedExercises ? JSON.parse(savedExercises) : []; // JSON形式の文字列をオブジェクトに変換
      const updatedExercises = parsedExercises.map(item =>
        item.id === route.params?.state
          ? { ...item, 
            name: exerciseName,
            category: parseInt(selectedCategory, 10),
            duration: duration,
            color: CategoryRecords.find((cat) => parseInt(cat.value, 10) == parseInt(selectedCategory, 10))?.['graphColor'],
            exercisedDate: selectedDate,
          } // ここで更新するデータをセット
          : item
      );
      // エクササイズ保存
      await AsyncStorage.setItem('exercises', JSON.stringify(updatedExercises));
      // 入力欄をリセット
      setExerciseName('');
      setDuration(0);
      setSelectedCategory('');
      // 型を適用した上でnavigation.navigateに引数を渡す
      navigation.navigate('Home', { 
        state: selectedDate,
        updatedAt: new Date().toISOString()
      });
    }
  };
  // 削除機能
  const handleDeleteExercise = async() => {
    Alert.alert(
      "削除しても良いですか？", 
      "",
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const savedExercises = await AsyncStorage.getItem('exercises');
            const parsedExercises : Exercise[] = savedExercises ? JSON.parse(savedExercises) : []; // JSON形式の文字列をオブジェクトに変換
            const deletedExercises = parsedExercises.filter(item => item.id === route.params?.state)[0];
            const filteredExercises = parsedExercises.filter(item => item.id !== route.params?.state);
            // 削除対象を除いた、エクササイズを改めてAsyncStorageに保存
            await AsyncStorage.setItem("exercises", JSON.stringify(filteredExercises));
            // 入力欄をリセット
            setExerciseName('');
            setDuration(0);
            setSelectedCategory('');
            // エクサイズIDを引数として渡す
            navigation.navigate('Home', { state: deletedExercises['exercisedDate'], updatedAt: new Date().toISOString() });
          },
        },
      ]
    );
  };
  // 日付のフォーマットを調整する関数（例: yyyy-mm-dd）
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月を2桁に
    const day = String(date.getDate()).padStart(2, "0"); // 日を2桁に
    return `${year}/${month}/${day}`;
  };
  // 日付を選択したときの処理
  const onDateSelect = (date: string) => {
    setSelectedDate(date);
    setCalendarVisible(false); // カレンダーを閉じる
  };

  return (
    <ScrollView contentContainerStyle={CommonStyles.container} scrollEnabled={true}>
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
        items={CategoryRecords}
        placeholder={{ label: 'Select an option...', value: "", color: "#000" }}
        style={pickerSelectStyles}
        value={selectedCategory} // 現在選択されている値
        Icon={() => (<Text style={{ position: 'absolute', right: 15, top: 10, fontSize: 18, color: '#789' }}>▼</Text>)}
      />

      <Text style={styles.label}>Duration (minutes)</Text>
      <TextInput
        style={styles.input}
        value={duration.toString()}
        onChangeText={(text) => setDuration(Number(text))}
        keyboardType="numeric"
        placeholder="Enter duration name(numeric only)"
        placeholderTextColor="gray"
      />
      <Text style={styles.label}>Exercised Day(変更可能)
      </Text>
        {/* 日付表示用のテキスト */}
      <TouchableOpacity onPress={() => setCalendarVisible(true)}>
        <Text style={styles.dateText}>
          { formatDate(new Date(selectedDate)) }
        </Text>
      </TouchableOpacity>
      {/* モーダルにカレンダーを表示 */}
      <Modal visible={isCalendarVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <Calendar
              // 現在の日付を初期選択状態に設定
              current={selectedDate || undefined}
              onDayPress={(day : DateData) => onDateSelect(day.dateString)} // 日付選択時のコールバック
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
      {/* 編集ボタン */}
      <TouchableOpacity
        style={styles.button}
        accessible={true}
        onPress={handleEditExercise}
        accessibilityRole="button">
        <Text style={CommonStyles.buttonText}>Edit Exercise</Text>
      </TouchableOpacity>
      {/* 削除ボタン */}
      <TouchableOpacity
        style={styles.button}
        accessible={true}
        onPress={handleDeleteExercise}
        accessibilityRole="button">
        <Text style={CommonStyles.buttonText}>Delete Exercise</Text>
      </TouchableOpacity>
    </ScrollView>
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
    marginBottom: 10,
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

export default EditExerciseScreen;