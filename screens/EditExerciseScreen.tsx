import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonStyles from '../styles/commonStyles';
import RNPickerSelect from 'react-native-picker-select';
import { Exercise } from '@/types/exercise';
import { CategoryRecords } from '@/constants/CategoryRecords'
import { Calendar, DateData } from 'react-native-calendars';
import { StackNavigationProp } from '@react-navigation/stack';
import { useThemeStore } from '../stores/themeStore';
import dayjs from 'dayjs';
import { useLocalSearchParams } from 'expo-router';

const EditExerciseScreen: React.FC<any> = ({ route }) => { // 引数routeの型を<any>として宣言している
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  // 日付入力用
  const [selectedDate, setSelectedDate] = useState(''); // 今日の日付をデフォルトに設定
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  // バリデーション用モーダル
  const [isValidationModalVisible, setValidationModalVisible] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  // 編集成功モーダル
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  // 削除成功モーダル
  const [isDeleteSuccessModalVisible, setDeleteSuccessModalVisible] = useState(false);
  // ナビゲーションの型を定義
  type RootStackParamList = {
    Home: {};
    Graph: undefined;
    AddExercise: { state: string };
  };
  type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
  const navigation = useNavigation<NavigationProp>();
  const params = useLocalSearchParams();
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
  const { themeColor } = useThemeStore();
  // 追加: HomeScreenと同様のナビヘッダを設定（中央に「入力」ラベル）
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
          編集
        </Text>
      ),
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: themeColor,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: '#fff',
      // 左のデフォルト戻るボタン（矢印 + タイトル）を消す
      headerLeft: () => null,
    });
  }, [navigation, themeColor]);
  
  // 編集したエクササイズをホーム画面に渡す
  const handleEditExercise = async() => {
    // 必須バリデーション: カテゴリと時間は必須（エクササイズ名は任意）
    if (!selectedCategory) {
      setValidationMessage('エクササイズカテゴリを選択してください。');
      setValidationModalVisible(true);
      return;
    }

    if (!duration || isNaN(duration) || duration <= 0) {
      setValidationMessage('エクササイズした時間（分）を正しく入力してください。');
      setValidationModalVisible(true);
      return;
    }

    if (true) {
      const savedExercises = await AsyncStorage.getItem('exercises');
      const parsedExercises : Exercise[] = savedExercises ? JSON.parse(savedExercises) : []; // JSON形式の文字列をオブジェクトに変換
      const updatedExercises = parsedExercises.map(item =>
        item.id === route.params?.state
          ? { ...item, 
            name: exerciseName,
            category: selectedCategory,
            duration: duration,
            color: CategoryRecords.find((cat) => cat.value === selectedCategory)?.['graphColor'],
            exercisedDate: selectedDate,
          } // ここで更新するデータをセット
          : item
      );
      // エクササイズ保存
      await AsyncStorage.setItem('exercises', JSON.stringify(updatedExercises));

      if (typeof params.reload !== 'undefined') {
        await AsyncStorage.setItem('params.reload', 'true');
      }
      // 入力欄をセット
      setExerciseName(exerciseName);
      setDuration(duration);
      setSelectedCategory(selectedCategory);
      setSelectedDate(selectedDate);
      // 編集完了のモーダルを表示
      setSuccessModalVisible(true);
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
            const filteredExercises = parsedExercises.filter(item => item.id !== route.params?.state);
            const nowFullDate = new Date()
              .toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" })
              .split("/")
              .join("-"); // 例: 2025-09-20
            await AsyncStorage.setItem('selectedDate', nowFullDate);
            // 削除対象を除いた、エクササイズを改めてAsyncStorageに保存
            await AsyncStorage.setItem('exercises', JSON.stringify(filteredExercises));

            if (typeof params.reload !== 'undefined') {
              await AsyncStorage.setItem('params.reload', 'true');
            }
            // 入力欄をリセット
            setExerciseName('');
            setDuration(0);
            setSelectedCategory(0);
            // 削除完了モーダルを表示（閉じるで Home に移動）
            setDeleteSuccessModalVisible(true);
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
  // Pickerのrefを作成して、全体をタップ可能にする
  const pickerRef = useRef<any>(null);

  return (
    <ScrollView contentContainerStyle={CommonStyles.container} scrollEnabled={true}>
      <Text style={styles.label}>エクササイズカテゴリを選択</Text>
      {/* Picker 全体をタップ可能にするために ref でトグル操作するラッパー */}
      <View style={{ position: 'relative' }}>
        <RNPickerSelect
          ref={pickerRef}
          onValueChange={(value) => {
            setSelectedCategory(value);
          }}
          items={CategoryRecords}
          placeholder={{ label: 'カテゴリーを選択してください', value: "", color: "#000" }}
          style={{
            ...pickerSelectStyles,
            iconContainer: { right: 10, top: 12 },
            inputIOS: { ...pickerSelectStyles.inputIOS, paddingRight: 40 },
            inputAndroid: { ...pickerSelectStyles.inputAndroid, paddingRight: 40 },
          }}
          useNativeAndroidPickerStyle={false}
          value={selectedCategory}
          Icon={() => (<Text style={{ fontSize: 18, color: '#789' }}>▼</Text>)}
        />
        {/* 透明なオーバーレイで領域全体をキャッチする */}
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          activeOpacity={1}
          onPress={() => pickerRef.current?.togglePicker?.()}
        />
      </View>
      <Text style={styles.label}>エクササイズした時間（分）</Text>
      <TextInput
        style={styles.input}
        value={duration.toString()}
        onChangeText={(text) => setDuration(Number(text))}
        keyboardType="numeric"
        placeholder="例: 30"
        placeholderTextColor="gray"
      />
      <Text style={styles.label}>エクササイズ日付</Text>
      {/* 日付表示用のテキスト（右端にカレンダーアイコンを表示） */}
      <TouchableOpacity
        onPress={() => setCalendarVisible(true)}
        activeOpacity={0.8}
        style={styles.dateTouchable}
        accessibilityRole="button"
        accessibilityLabel="日付を変更する"
      >
        <View style={styles.dateRow}>
          <Text style={[styles.dateText, { flex: 1 }]}>
            {formatDate(new Date(selectedDate))}
          </Text>
          {/* シンプルに絵文字でアイコン表示。必要なら vector-icon に置き換えてください */}
          <Text style={styles.calendarIcon}>📅</Text>
        </View>
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
                [selectedDate]: { selected: true, selectedColor: themeColor }, // 選択中の日付を強調表示
              }}
              // 見出しを yyyy年mm月 (例: 2025年09月) 形式で表示
              renderHeader={(date?: Date) => (
                <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 8 }}>
                  {dayjs(date).format('YYYY年MM月')}
                </Text>
              )}
              theme={{
                selectedDayBackgroundColor: themeColor,
                selectedDayTextColor: '#ffffff',
                todayTextColor: themeColor,
                arrowColor: themeColor,
                monthTextColor: '#000000',
              }}
            />
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: themeColor }]}
              onPress={() => setCalendarVisible(false)}
            >
              <Text style={styles.closeButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Text style={styles.label}>エクササイズ名（任意）</Text>
      <TextInput
        style={styles.input}
        value={exerciseName}
        onChangeText={setExerciseName}
        placeholder="エクササイズ名を入力"
        placeholderTextColor="gray"
      />
      {/* 編集ボタン */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: themeColor }]}
        accessible={true}
        onPress={handleEditExercise}
        accessibilityRole="button">
        <Text style={CommonStyles.buttonText}>変更</Text>
      </TouchableOpacity>
      {/* 削除ボタン */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: themeColor }]}
        accessible={true}
        onPress={handleDeleteExercise}
        accessibilityRole="button">
        <Text style={CommonStyles.buttonText}>削除</Text>
      </TouchableOpacity>
      {/* バリデーションエラーモーダル */}
      <Modal visible={isValidationModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={[styles.calendarContainer, { width: '80%', alignItems: 'center' }]}>
            <Text style={{ fontSize: 16, marginBottom: 16, textAlign: 'center' }}>{validationMessage}</Text>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: themeColor, width: '100%' }]}
              onPress={() => setValidationModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* 編集成功モーダル */}
      <Modal visible={isSuccessModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={[styles.calendarContainer, { width: '80%', alignItems: 'center' }]}>
            <Text style={{ fontSize: 16, marginBottom: 16, textAlign: 'center' }}>編集しました。</Text>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: themeColor, width: '100%' }]}
              onPress={() => {
                setSuccessModalVisible(false);
              }}
            >
              <Text style={styles.closeButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* 削除成功モーダル */}
      <Modal visible={isDeleteSuccessModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={[styles.calendarContainer, { width: '80%', alignItems: 'center' }]}>
            <Text style={{ fontSize: 16, marginBottom: 16, textAlign: 'center' }}>削除しました。</Text>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: themeColor, width: '100%' }]}
              onPress={() => {
                setDeleteSuccessModalVisible(false);
                // navigation.reset でナビゲーションスタックをクリアして Home に戻す（確実に再マウントされる）
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home', params: { reload: true } }],
                });
              }}
            >
              <Text style={styles.closeButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  dateTouchable: {
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  calendarIcon: {
    fontSize: 20,
    color: "#555",
    marginLeft: 8,
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