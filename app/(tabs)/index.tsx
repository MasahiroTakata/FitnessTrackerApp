import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../screens/HomeScreen';
import AddExerciseScreen from '../../screens/AddExerciseScreen';
import GraphScreen from '../../screens/GraphScreen';
import EditExerciseScreen from '../../screens/EditExerciseScreen';
import SettingScreen from '../../screens/SettingScreen';
import { StatusBar } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  const backgroundColor = '#fff'; 

  return (
    <>
      {/* iOSの画面左上と右上に表示される時計やバッテリーなどを表示しているヘッダー部分の装飾 */}
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor, // ヘッダーの背景色
          },
          headerTitleAlign: 'center', // タイトル中央
          headerTintColor: '#000', // タイトルや戻るボタンの色
          contentStyle: {
            backgroundColor, // 画面全体の背景色（iOS対策）
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddExercise" component={AddExerciseScreen} />
        <Stack.Screen name="Graph" component={GraphScreen} />
        <Stack.Screen name="EditExercise" component={EditExerciseScreen} />
        <Stack.Screen name="Setting" component={SettingScreen} />
      </Stack.Navigator>
    </>
  );
}
