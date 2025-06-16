import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NavigationContainer } from '@react-navigation/native';
import Foundation from 'react-native-vector-icons/Foundation';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    // <NavigationContainer>
      <Tabs
        screenOptions={{
          headerShown: false,
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
    // </NavigationContainer>
  );
}
