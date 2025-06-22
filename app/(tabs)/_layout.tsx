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
        tabBarInactiveBackgroundColor: backgroundColor
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
