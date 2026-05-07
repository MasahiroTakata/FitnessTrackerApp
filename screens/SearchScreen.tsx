import React, { useState, useCallback, useLayoutEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise } from '@/types/exercise';
import type { RootStackParamList } from '../types/common';
import { useThemeStore } from '../stores/themeStore';
import { useColorScheme } from 'react-native';
import { getCommonStyles } from '../styles/commonStyles';
import ExerciseItem from './ExerciseItem';
import { CategoryRecords } from '../constants/CategoryRecords';
import SearchHeader from '../components/SearchHeader';

type NavigationPropType = StackNavigationProp<RootStackParamList, 'Search'>;

const SearchScreen: React.FC<any> = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { themeColor } = useThemeStore();
  const colorScheme = useColorScheme();
  const styles = getCommonStyles(colorScheme);

  // 非同期で検索を実行
  const performSearch = useCallback(async (query: string) => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const savedExercises = await AsyncStorage.getItem('exercises');
      const allExercises: Exercise[] = savedExercises
        ? JSON.parse(savedExercises)
        : [];

      // 入力テキストで名前とカテゴリーラベルを検索
      const filtered = allExercises.filter((exercise) => {
        const categoryLabel = CategoryRecords.find(
          (cat) => cat.value === exercise.category
        )?.label || '';
        return (
          exercise.name.toLowerCase().includes(query.toLowerCase()) ||
          categoryLabel.toLowerCase().includes(query.toLowerCase())
        );
      });

      // 日付で降順にソート
      filtered.sort((a, b) => (a.exercisedDate < b.exercisedDate ? 1 : -1));

      setSearchResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const groupedResults = useMemo(() => {
    const groups: Record<string, Exercise[]> = {};

    searchResults.forEach((exercise) => {
      const date = exercise.exercisedDate;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(exercise);
    });

    return Object.keys(groups)
      .sort((a, b) => (a < b ? 1 : -1))
      .map((date) => ({ date, items: groups[date] }));
  }, [searchResults]);

  // ヘッダーをカスタマイズ
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
            marginHorizontal: 10,
            width: 350,
          }}
        >
          <SearchHeader
            performSearch={performSearch}
          />
        </View>
      ),
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: themeColor,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: '#fff',
      headerLeft: () => null,
      headerRight: () => null,
    });
  }, [navigation, themeColor]);

  return (
    <View style={styles.container}>
      {!isLoading && searchResults.length === 0 && (
        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 16, color: '#999' }}>
            検索結果がありません
          </Text>
        </View>
      )}

      <FlatList
        data={groupedResults}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View key={item.date} style={{ marginBottom: 12 }}>
            <Text style={[styles.daysText, { backgroundColor: themeColor, marginBottom: 6 }]}> 
              {String(item.date)}
            </Text>
            {item.items.map((exercise, index) => (
              <View key={exercise.id} style={{ marginBottom: index === item.items.length - 1 ? 0 : 4 }}>
                <ExerciseItem
                  id={exercise.id}
                  name={exercise.name}
                  category={exercise.category}
                  duration={exercise.duration}
                  color={index === item.items.length - 1 ? 'isLast' : ''}
                  navigation={navigation}
                />
              </View>
            ))}
          </View>
        )}
        scrollEnabled={groupedResults.length > 0}
      />
    </View>
  );
};

export default SearchScreen;