import React, { useLayoutEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DonutChart from './DonutChart';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/commonStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationProp } from '@react-navigation/native';
import { useThemeStore } from '../stores/themeStore';
import dayjs from 'dayjs';

type RootStackParamList = {
  index: undefined;
};
type NavigationPropType = StackNavigationProp<RootStackParamList, 'index'>;

const GraphScreen: React.FC<any> = (state) => {
  const navigation = useNavigation<NavigationPropType>();
  const { themeColor } = useThemeStore();

  // 今日の年月を初期値にする（'YYYY-MM' 形式）
  const today = new Date();
  const initialMonth = dayjs(today).format('YYYY-MM');
  const [currentMonth, setCurrentMonth] = useState<string>(initialMonth);

  useLayoutEffect(() => {
    const title = dayjs(currentMonth + '-01').format('YYYY年 M月');
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>{title}</Text>,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: themeColor,
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
          <Text style={{ color: '#fff', fontSize: 20 }}>{'‹'}</Text>
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
          <Text style={{ color: '#fff', fontSize: 20 }}>{'›'}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, themeColor, currentMonth]);

  return (
    <View style={styles.container}>
      <DonutChart selectedMonthProp={currentMonth} navigation={navigation} />
    </View>
  );
};

export default GraphScreen;