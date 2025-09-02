import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ExerciseItem from './ExerciseItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/commonStyles';
import { Exercise } from '@/types/exercise';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import dayjs from 'dayjs';
import { useLocalSearchParams } from 'expo-router';
import { useThemeStore } from '../stores/themeStore';
import { useLayoutEffect } from 'react';

type DateObject = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

LocaleConfig.locales['ja'] = {
  monthNames: [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ],
  monthNamesShort: [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ],
  dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
  today: '今日'
};

LocaleConfig.defaultLocale = 'ja';

const HomeScreen: React.FC<any> = ({ route }) => { // screenコンポーネントの引数（props）として、自動的に提供される
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
  const today = new Date();
  const formatted = today
    .toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit", // デフォルトは１桁（1月だと1と表示される）、2-digitとすることで２桁としてくれる（１月なら01月）
      day: "2-digit",
    })
    .split("/") // スラッシュ区切りで配列で格納する
    .join("-"); // 配列に格納された値をハイフンで結合して文字列にする
  const [selectedDate, setSelectedDate] = useState(formatted); // 初期は今日の日付
  const [markedDateDatas, setMarkedDateDatas] = useState<
  Record<string, { selected: boolean; marked: boolean; dotColor: string }>
  >({});
  const navigation = useNavigation();
  const isFirstRender = useRef(true);
  const isFirstRenderChangedMonth = useRef(true);
  const nowYearMonth = today
  .toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit", // デフォルトは１桁（1月だと1と表示される）、2-digitとすることで２桁としてくれる（１月なら01月）
  })
  .split("/") // スラッシュ区切りで配列で格納する
  .join("-"); // 配列に格納された値をハイフンで結合して文字列にする
  const [currentMonth, setCurrentMonth] = useState(nowYearMonth);
  // 日付ごとにグルーピングする用の型を用意
  type typeOfGroupedDay = {
    [date: string]: Exercise[]
  };
  const groupedByDay: typeOfGroupedDay = {};
  const [exercisesByDay, setExercisesByDay] = useState<typeOfGroupedDay> ({});
  // FlatListにアクセスするためのref（参照）を作成
  const flatListRef = useRef<FlatList>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const params = useLocalSearchParams();
  const { themeColor, setThemeColor } = useThemeStore();

  // カレンダーボタンを押下した時の処理（同じタブを連続押下した場合も対応できる）
  useEffect(() => {
    if (params.reload) {
      const nowYearMonth = today
        .toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit", // デフォルトは１桁（1月だと1と表示される）、2-digitとすることで２桁としてくれる（１月なら01月）
      })
      .split("/") // スラッシュ区切りで配列で格納する
      .join("-"); // 配列に格納された値をハイフンで結合して文字列にする

      if(currentMonth === nowYearMonth){
        console.log('現在の月と選択された月が一致しました。データを取得します。');
        getSelectedYearMonthDatas();
      } else{
        console.log('現在の月と選択された月が一致しません。currentMonthを更新します。');
        setCurrentMonth(nowYearMonth);
      }
    }
  }, [params.reload]);
  // HomeScreenの画面を、違う画面から表示する際に呼び出す処理
  useFocusEffect(
    useCallback(() => {
      const fetchUpdatedAt = async () => {
        try {
          const value = await AsyncStorage.getItem('updatedAt');
          if (value !== null) {
            console.log('AsyncStorageから取得したupdatedAt:', value);
            setUpdatedAt(value);
          } else{
            console.log('AsyncStorageにupdatedAtが存在しません。');
            const savedColor = await AsyncStorage.getItem('themeColor');
            if (savedColor) {
              console.log(`themeStoreから取得した保存されたテーマカラー: ${savedColor}`);
              setThemeColor(savedColor);
            } else {
              console.log('themeStoreに保存されたテーマカラーが存在しません。');
            }
          }
        } catch (e) {
          console.error('AsyncStorage 読み込みエラー:', e);
        }
      };

      fetchUpdatedAt();
    }, [])
  );
  // ナビヘッダをカレンダーの年月で上書きする（元々用意していたヘッダーは表示しない）
  useLayoutEffect(() => {
    const title = dayjs(currentMonth + '-01').format('YYYY年 M月');
    navigation.setOptions({
      headerShown: true, // 親で非表示にしている場合は true にする
      headerTitle: () => (
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
          {title}
        </Text>
      ),
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: themeColor, // ヘッダー背景にテーマカラーを反映（任意）
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: '#fff',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            const prev = dayjs(currentMonth + '-01').subtract(1, 'month').format('YYYY-MM');
            setCurrentMonth(prev);
          }}
          style={{ paddingHorizontal: 50 }}
        >
          <Text style={{ color: '#fff', fontSize: 25 }}>{'‹'}</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            const next = dayjs(currentMonth + '-01').add(1, 'month').format('YYYY-MM');
            setCurrentMonth(next);
          }}
          style={{ paddingHorizontal: 50 }}
        >
          <Text style={{ color: '#fff', fontSize: 25 }}>{'›'}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, currentMonth, themeColor]);
  // 日付が選択された時に呼ばれる関数コンポーネント
  // exercisesByDay: { date: '2025-05-10', exercises: Exercise[] }[]
  const handleDatePress = (selectedDate: string) => {
    const entries = Object.entries(exercisesByDay); // オブジェクトから配列に変換する
    const index = entries.findIndex(([date]) => date === selectedDate);
    // 該当のデータが見つかった且つ、refが正しくセットされているか？
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      // 初回レンダー時は実行せず、フラグを false にする
      isFirstRender.current = false;

      return;
    }

    const loadData = async () => {
      try {
        const savedExercises = await AsyncStorage.getItem('exercises');
        const selectedDate = await AsyncStorage.getItem('selectedDate');
        const yearMonth = dayjs(selectedDate).format('YYYY-MM');

        await AsyncStorage.removeItem('updatedAt');
        await AsyncStorage.removeItem('selectedDate');

        if(yearMonth == currentMonth){
          const parsedExercises : Exercise[]= savedExercises ? JSON.parse(savedExercises) : []; // JSON形式の文字列をオブジェクトに変換
          // データが１件も保存されていない場合
          if(parsedExercises == null){
            setExercisesByDay({});
          } else{
            // filterメソッドを使用してexercisedDateが、今月のデータを取得
            const nowMonthExercises = parsedExercises.filter(exercise => exercise.exercisedDate.startsWith(yearMonth));

            nowMonthExercises.forEach((exercise) => {
              const day = exercise.exercisedDate;
              // 要素がその日付である配列の存在チェック（なければ、その日付の配列を用意する）
              if (!groupedByDay[day]) {
                groupedByDay[day] = [];
              }
              // その日付の配列にデータを格納する
              groupedByDay[day].push(exercise);
            });
            // 日付のキーだけ取り出して、降順（新しい順）に並べ替え
            const sortedDates = Object.keys(groupedByDay).sort((a, b) => (a < b ? 1 : -1));
            // ソートされた順番で新しいオブジェクトを作る
            const sortedGroupedByDay: { [date: string]: Exercise[] } = {};

            sortedDates.forEach((date) => {
              sortedGroupedByDay[date] = groupedByDay[date];
            });

            setExercisesByDay(sortedGroupedByDay);
            /* カレンダーに印をつける実装 */
            // エクササイズが記録されている日付のリストを取得する
            const dateList = parsedExercises.map(item => item.exercisedDate);
            // Setクラスを使って、dateListの重複を排除している
            const uniqueDates = new Set(dateList);
            // uniqueDatesをArray.fromで配列に変換する
            // reduce関数で、{ 日付: オブジェクト }の形に変換&集積した
            const markedDates = Array.from(uniqueDates).reduce<Record<string, { selected: boolean; marked: boolean; dotColor: string }>>(
              (acc, date) => {
                acc[date as string] = { selected: false, marked: true, dotColor: themeColor };
                return acc;
              },
              {}
            );

            setMarkedDateDatas(markedDates);
          }
        }else{
          setCurrentMonth(yearMonth);
        }
      } catch (error) {
        console.error('Error loading data', error);
      }
    };

    loadData();
  }, [updatedAt]);

  // その年月のエクササイズ情報を取得する
  const getSelectedYearMonthDatas = async () => {
    console.log('getSelectedYearMonthDatasが呼び出されました。現在の年月:', currentMonth);
    try {
      const savedExercises = await AsyncStorage.getItem('exercises');
      const parsedExercises : Exercise[]= savedExercises ? JSON.parse(savedExercises) : []; // JSON形式の文字列をオブジェクトに変換
      // データが１件も保存されていない場合
      if(parsedExercises == null){
        setExercisesByDay({});
      } else{
        // filterメソッドを使用してexercisedDateが、今月のデータを取得
        const nowMonthExercises = parsedExercises.filter(exercise => exercise.exercisedDate.startsWith(currentMonth));
        const groupedByDay: typeOfGroupedDay = {};

        nowMonthExercises.forEach((exercise) => {
          const day = exercise.exercisedDate;
          // 要素がその日付である配列の存在チェック（なければ、その日付の配列を用意する）
          if (!groupedByDay[day]) {
            groupedByDay[day] = [];
          }
          // その日付の配列にデータを格納する
          groupedByDay[day].push(exercise);
        });
        // 日付のキーだけ取り出して、降順（新しい順）に並べ替え
        const sortedDates = Object.keys(groupedByDay).sort((a, b) => (a < b ? 1 : -1));
        // ソートされた順番で新しいオブジェクトを作る
        const sortedGroupedByDay: { [date: string]: Exercise[] } = {};

        sortedDates.forEach((date) => {
          sortedGroupedByDay[date] = groupedByDay[date];
        });

        setExercisesByDay(sortedGroupedByDay);
        /* カレンダーに印をつける実装 */
        // エクササイズが記録されている日付のリストを取得する
        const dateList = parsedExercises.map(item => item.exercisedDate);
        // Setクラスを使って、dateListの重複を排除している
        const uniqueDates = new Set(dateList);
        // uniqueDatesをArray.fromで配列に変換する
        // reduce関数で、{ 日付: オブジェクト }の形に変換&集積した
        const markedDates = Array.from(uniqueDates).reduce<Record<string, { selected: boolean; marked: boolean; dotColor: string }>>(
          (acc, date) => {
            acc[date as string] = { selected: false, marked: true, dotColor: themeColor };
            return acc;
          },
          {}
        );

        setMarkedDateDatas(markedDates);
      }
    } catch (error) {
      console.error('Error loading data', error);
    }

    // try {
    //   // 特定のキーに保存されたデータを削除する
    //   await AsyncStorage.removeItem('exercises');
    //   await AsyncStorage.removeItem('updatedAt');
    //   console.log('データが削除されました');
    // } catch (error) {
    //   console.log('データ削除エラー:', error);
    // }
  };

  useEffect(() => { // 日付変更と初期表示時に呼び出す
    getSelectedYearMonthDatas();
  }, [selectedDate]);

  useEffect(() => { // 年月変更時に呼び出す
    if (isFirstRenderChangedMonth.current) {
      // 初回レンダー時は実行せず、フラグを false にする
      isFirstRenderChangedMonth.current = false;

      return;
    } else{
      getSelectedYearMonthDatas();
    }
  }, [currentMonth]);

  // テーマカラーが変更された時に、カレンダーを再描画するための処理
  useEffect(() => {
    if (isFirstRender.current) {
      // 初回レンダー時は実行せず、フラグを false にする
      isFirstRender.current = false;

      return;
    } else{
      getSelectedYearMonthDatas();
    }
  }, [themeColor]);

  return (
    <View style={styles.container}>
      {/* カスタム曜日ラベル */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8 }}>
        {weekDays.map((day, index) => (
          <Text
            key={index}
            style={{
              fontWeight: 'bold',
              color: index === 0 ? 'red' : index === 6 ? 'blue' : '#2d4150',
            }}
          >
            {day}
          </Text>
        ))}
      </View>
      <Calendar
        key={`${currentMonth}-01-${themeColor}`} // themeColor or 画面リロードで再描画（keyの内容が変わると、Calendarを再描画する仕組み）
        hideDayNames={true} // デフォルトの曜日ラベルを非表示
        // Calendar内部のヘッダーを使わない（ナビヘッダで表示するため）
        renderHeader={() => <View style={{ height: 0 }} />}
        // カレンダー内の左右矢印も非表示にする（ナビヘッダ側で矢印を表示しているため）
        hideArrows={true}
        theme={{
          calendarBackground: '#ffffff', // カレンダーの背景色
          selectedDayBackgroundColor: themeColor, // 選択された日付の背景色
          selectedDayTextColor: '#ffffff', // 選択された日付のテキスト色
          todayTextColor: themeColor, // 今日の日付のテキスト色
          dayTextColor: '#2d4150', // 通常の日付のテキスト色
          textDisabledColor: '#d9e1e8', // 無効な日付のテキスト色
          selectedDotColor: '#ffffff', // 選択されたドットの色
          indicatorColor: themeColor, // インジケーターの色
          monthTextColor: '#fff',     // ヘッダーのテキスト（白文字）
          arrowColor: '#fff',         // 矢印の色（白）
          textSectionTitleColor: '#333', // 曜日部分は黒 or 調整
        }}
        current={currentMonth + '-01'}
        // 日付が選択された時のコールバック
        onDayPress={(day : DateData) => {
          const selectedDate = day.dateString; // '2025-05-10' みたいな文字列
          setSelectedDate(selectedDate);
          handleDatePress(selectedDate);
        }}
        // 選択された日付のスタイル変更
        markedDates={{
          ...markedDateDatas, // スプレッド演算子でオブジェクトの中身を展開している
          [selectedDate]: { selected: true, marked: true },
        }}
        onMonthChange={(month: DateObject) => {
          const formattedMonth = `${month.year}-${String(month.month).padStart(2, '0')}`;
          setCurrentMonth(formattedMonth);
        }}
      />
      <FlatList
        ref={flatListRef}
        data={Object.entries(exercisesByDay)} 
        renderItem={({ item }) => {
          const [date, exercises] = item;
          return (
            <View>
              <Text style={[styles.daysText, { backgroundColor: themeColor }]}>{String(date)}</Text>

              {exercises.map((exercise: Exercise, index: number) => {
                const isLast = index === exercises.length - 1;

                return (
                  <View key={exercise.id}>
                    <ExerciseItem
                      id={exercise.id}
                      name={exercise.name}
                      category={exercise.category}
                      duration={exercise.duration}
                      color={isLast ? 'isLast' : ''}
                      navigation={navigation}
                    />
                  </View>
                );
              })}
            </View>
          );
        }}
      />
    </View>
  );
};

export default HomeScreen;