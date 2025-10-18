import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/useColorScheme';
import Foundation from 'react-native-vector-icons/Foundation';
import { useThemeStore } from '../../stores/themeStore'; // zustandのストアをインポート

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#fff' : '#fff';
  const { themeColor, setThemeColor } = useThemeStore(); // zustandからテーマカラーを取得（即時反映するために必要）
  // AsyncStorageからテーマカラーを取得してzustandに設定
  useEffect(() => {
    const loadThemeColor = async () => {
      try {
        const savedColor = await AsyncStorage.getItem('themeColor');
        if (savedColor) {
          setThemeColor(savedColor); // zustandに保存されたテーマカラーを設定
        }
      } catch (error) {
        console.error('テーマカラーの取得に失敗しました:', error);
      }
    };

    loadThemeColor();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: themeColor,
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
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              // ここでイベント発火
              navigation.navigate('index', { reload: Date.now() });
            },
          })}
        />
        <Tabs.Screen
          name="addExercise"
          options={{
            title: '入力',
            tabBarIcon: ({ color, focused }) => (
              <Foundation name={focused ? 'page-edit' : 'page-edit'} color={color} size='25'/>
            ),
          }}
        />
        <Tabs.Screen
          name="graph"
          options={{
            title: 'グラフ',
            tabBarIcon: ({ color, focused }) => (
              <Foundation name={focused ? 'graph-pie' : 'graph-pie'} color={color} size='25'/>
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              // ここでイベント発火
              navigation.navigate('graph', { reload: Date.now() });
            },
          })}
        />
        <Tabs.Screen
          name="setting"
          options={{
            title: '設定',
            tabBarIcon: ({ color, focused }) => (
              <Foundation name={focused ? 'widget' : 'widget'} color={color} size='25'/>
            ),
          }}
        />
    </Tabs>
  );
}
