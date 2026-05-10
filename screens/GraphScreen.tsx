import React, { useLayoutEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DonutChart from './DonutChart';
import { useNavigation } from '@react-navigation/native';
import { getCommonStyles } from '../styles/commonStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationProp } from '@react-navigation/native';
import { useThemeStore } from '../stores/themeStore';
import dayjs from 'dayjs';
import type { RootStackParamList } from '../types/common';
import { useColorScheme } from 'react-native';

type NavigationPropType = StackNavigationProp<RootStackParamList, 'Graph'>;

const GraphScreen: React.FC<any> = (state) => {
  const navigation = useNavigation<NavigationPropType>();
  const { themeColor } = useThemeStore();

  // 今日の年月を初期値にする（'YYYY-MM' 形式）
  const today = new Date();
  const initialMonth = dayjs(today).format('YYYY-MM');
  const [currentMonth, setCurrentMonth] = useState<string>(initialMonth);
  const colorScheme = useColorScheme();
  const styles = getCommonStyles(colorScheme);

  useLayoutEffect(() => {
    const title = dayjs(currentMonth + '-01').format('YYYY年 M月');
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              const prev = dayjs(currentMonth + '-01').subtract(1, 'month').format('YYYY-MM');
              setCurrentMonth(prev);
            }}
            style={{ marginRight: 17 }}
          >
            <Text style={{ color: '#fff', fontSize: 25 }}>{'‹'}</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
            {title}
          </Text>
          <TouchableOpacity
            onPress={() => {
              const next = dayjs(currentMonth + '-01').add(1, 'month').format('YYYY-MM');
              setCurrentMonth(next);
            }}
            style={{ marginLeft: 17 }}
          >
            <Text style={{ color: '#fff', fontSize: 25 }}>{'›'}</Text>
          </TouchableOpacity>
        </View>
      ),
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: themeColor,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: '#fff',
      headerLeft: () => null,
      headerRight: () => null,
    });
  }, [navigation, themeColor, currentMonth]);

  return (
    <View style={styles.container}>
      <DonutChart selectedMonthProp={currentMonth} navigation={navigation} />
    </View>
  );
};

export default GraphScreen;