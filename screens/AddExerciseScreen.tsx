import React, { useState, useLayoutEffect, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Keyboard } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCommonStyles } from '../styles/commonStyles';
import styles from '../styles/AddExerciseStyles';
import RNPickerSelect from 'react-native-picker-select';
import { CategoryRecords } from '@/constants/CategoryRecords'
import { Calendar, DateData } from "react-native-calendars";
import dayjs from 'dayjs';
import { StackNavigationProp } from '@react-navigation/stack';
import { useThemeStore } from '../stores/themeStore';
import type { RootStackParamList } from '../types/common';
import { useColorScheme } from 'react-native';

const AddExerciseScreen: React.FC<any> = ({ route }) => {
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  // バリデーション用モーダル
  const [isValidationModalVisible, setValidationModalVisible] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  // 保存成功モーダル
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const formatted = dayjs().format('YYYY-MM-DD');
  // 日付入力用
  const [selectedDate, setSelectedDate] = useState(formatted); // 今日の日付をデフォルトに設定
  const [isCalendarVisible, setCalendarVisible] = useState(false);

  // 画面がフォーカスされるたびに HomeScreenで選択された日付があれば反映
  useFocusEffect(
    useCallback(() => {
      const loadSelectedDate = async () => {
        try {
          const savedDate = await AsyncStorage.getItem('selectedDateForExercise');
          if (savedDate) {
            setSelectedDate(savedDate);
          }
        } catch (e) {
          console.error('selectedDateForExercise 取得エラー:', e);
        }
      };
      loadSelectedDate();
    }, [])
  );

  type NavigationProp = StackNavigationProp<RootStackParamList, 'AddExercise'>;
  const navigation = useNavigation<NavigationProp>();
  const { themeColor } = useThemeStore();
  const colorScheme = useColorScheme();
  const CommonStyles = getCommonStyles(colorScheme);

  // 追加: HomeScreenと同様のナビヘッダを設定（中央に「入力」ラベル）
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
          入力
        </Text>
      ),
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: themeColor,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: '#fff',
    });
  }, [navigation, themeColor]);

  const handleAddExercise = async() => {
    // 必須バリデーション: カテゴリと時間は必須（エクササイズ名は任意）
    if (!selectedCategory) {
      setValidationMessage('エクササイズカテゴリを選択してください。');
      setValidationModalVisible(true);
      return;
    }
    const parsedDuration = parseInt(duration, 10);
    if (!duration || isNaN(parsedDuration) || parsedDuration <= 0) {
      setValidationMessage('エクササイズした時間（分）を正しく入力してください。');
      setValidationModalVisible(true);
      return;
    }

    // exerciseNameは任意なので空でも保存可能
    if (true) {
      Keyboard.dismiss(); // キーボードを閉じる
      const savedExercises = await AsyncStorage.getItem('exercises');
      let parsedExercises: any[] = [];

      try {
        parsedExercises = savedExercises ? JSON.parse(savedExercises) : [];
        // parsedExercises = savedExercises ? [savedExercises] : [];
        // if (!Array.isArray(parsedExercises)) parsedExercises = [];
      } catch (e) {
        parsedExercises = [];
      }

      const counter = Number(parsedExercises?.length) + 1;
      const category = CategoryRecords.find(
        (cat) => cat.value === parseInt(selectedCategory, 10)
      );
      const newExercise = {
        id: counter,
        name: exerciseName,
        category: parseInt(selectedCategory, 10),
        duration: parsedDuration,
        color: category?.['graphColor'] ?? '#cccccc',
        exercisedDate: selectedDate,
      };
      // 元々登録されているデータに、今回の新規データを追加した配列を用意する
      const newExercise2 = [
        ...parsedExercises,
          newExercise
      ];
      await AsyncStorage.setItem('exercises', JSON.stringify(newExercise2));
      await AsyncStorage.setItem('updatedAt', new Date().toISOString());
      await AsyncStorage.setItem('selectedDate', selectedDate);
      // 入力欄をリセット
      setExerciseName('');
      setDuration('');
      setSelectedCategory('');
      // 保存完了モーダルを表示（閉じるで Home に戻る）
      setSuccessModalVisible(true);
    }
  };
  // 日付を選択したときの処理
  const onDateSelect = (date: string) => {
    setSelectedDate(date);
    setCalendarVisible(false); // カレンダーを閉じる
  };
  // Pickerのrefを作成して、全体をタップ可能にする
  const pickerRef = useRef<any>(null);

  return (
    <ScrollView
      contentContainerStyle={[CommonStyles.container, styles.topContainer]}
      scrollEnabled={true}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>エクササイズカテゴリを選択</Text>
      {/* Picker 全体をタップ可能にするために ref でトグル操作するラッパー */}
      <View style={{ position: 'relative', marginBottom: 12 }}>
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
        value={duration}
        onChangeText={setDuration}
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
            {dayjs(selectedDate ?? new Date()).format('YYYY/MM/DD')}
          </Text>
          {/* シンプルに絵文字でアイコン表示。必要なら vector-icon に置き換えてください */}
          <Text style={styles.calendarIcon}>📅</Text>
        </View>
      </TouchableOpacity>
      {/* モーダルにカレンダーを表示 */}
      <Modal visible={isCalendarVisible} transparent={true} animationType="slide" presentationStyle="overFullScreen">
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <Calendar
              // 現在の日付を初期選択状態に設定
              current={selectedDate || dayjs().format('YYYY-MM-DD')}
              onDayPress={(day : DateData) => onDateSelect(day.dateString)} // 日付選択時のコールバック
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: themeColor }, // 選択中の日付をテーマカラーで強調
              }}
              // 見出しを yyyy年mm月 (例: 2025年09月) 形式で表示
              renderHeader={(date) => {
                const safeDate = dayjs(date ?? undefined);
                return (
                  <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 8 }}>
                    {safeDate.isValid()
                      ? safeDate.format('YYYY年MM月')
                      : dayjs().format('YYYY年MM月')}
                  </Text>
                );
              }}
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
      <TouchableOpacity
        style={[styles.button, { backgroundColor: themeColor }]}
        accessible={true}
        onPress={handleAddExercise}
        accessibilityRole="button">
        <Text style={CommonStyles.buttonText}>保存</Text>
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

      {/* 保存成功モーダル */}
      <Modal visible={isSuccessModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={[styles.calendarContainer, { width: '80%', alignItems: 'center' }]}>
            <Text style={{ fontSize: 16, marginBottom: 16, textAlign: 'center' }}>保存しました。</Text>
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
    </ScrollView>
  );
};

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