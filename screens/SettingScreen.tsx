import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../stores/themeStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/commonStyles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const colors = ['#007AFF', '#FF3B30', '#34C759', '#FF9500'];

const SettingScreen: React.FC = () => {
  const { themeColor, setThemeColor } = useThemeStore();
  const isFirstRender = useRef(true);
  type RootStackParamList = { index: undefined; };
  type NavigationProp = StackNavigationProp<RootStackParamList, 'index'>;
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    if (isFirstRender.current) {
      // 初回レンダー時は実行せず、フラグを false にする
      isFirstRender.current = false;

      return;
    }
    // テーマカラーを保存する処理を追記する
    const updateThemeColor = async () => {
      try {
        await AsyncStorage.setItem('themeColor', themeColor);
        console.log(`テーマカラーが保存されました: ${themeColor}`);
      } catch (e) {
        console.error('AsyncStorage 読み込みエラー:', e);
      }
    };
    updateThemeColor();
  }, [themeColor]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
          設定
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

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>テーマカラーを選択</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            onPress={() => setThemeColor(color)}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: color,
              borderWidth: color === themeColor ? 1.7 : 0,
              borderColor: 'black',
              marginRight: 10,
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default SettingScreen;