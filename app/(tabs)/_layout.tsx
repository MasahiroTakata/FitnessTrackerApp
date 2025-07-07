import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import Foundation from 'react-native-vector-icons/Foundation';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#fff' : '#fff';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: backgroundColor,
        tabBarInactiveBackgroundColor: backgroundColor,
        tabBarStyle: {
          backgroundColor,
          paddingBottom: 0, // 画面下の余白をなくしている
        },
      }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'カレンダー',
            tabBarIcon: ({ color, focused }) => (
              <Foundation name={focused ? 'calendar' : 'calendar'} color={color} size='25' />
            ),
          }}
        />
        <Tabs.Screen
          name="addExercise"
          options={{
            title: '入力',
            tabBarIcon: ({ color, focused }) => (
              <Foundation name={focused ? 'page-edit' : 'page-edit'} color={color} size='25'/>
            ),
          }}
          // listeners={({ navigation }) => ({
          //   tabPress: (e) => {
          //     // デフォルトの動作をキャンセル
          //     e.preventDefault();
          //     // 現在日付を取得
          //     const now = new Date();
          //     const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
          //     console.log(formatted);
          //     // 手動で navigate（state に現在日付を渡す）
          //     navigation.navigate('addExercise', {
          //       state: { selectedDate: formatted },
          //     });
          //   },
          // })}
        />
        <Tabs.Screen
          name="graph"
          options={{
            title: 'グラフ',
            tabBarIcon: ({ color, focused }) => (
              <Foundation name={focused ? 'graph-pie' : 'graph-pie'} color={color} size='25'/>
            ),
          }}
        />
    </Tabs>
  );
}
