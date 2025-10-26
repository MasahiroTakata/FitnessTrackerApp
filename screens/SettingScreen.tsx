import React, { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../stores/themeStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/commonStyles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ThemePickerPanel from './ThemePickerPanel';

const colors = [
  '#007AFF', '#FF3B30', '#34C759', '#FF9500', '#8E8E93', '#5856D6', '#FF2D55', '#00C7BE',
  '#1E90FF', '#FF7F50', '#FFD700', '#8A2BE2', '#00CED1', '#FF1493', '#228B22', '#A52A2A',
  '#2F4F4F', '#CD5C5C', '#20B2AA', '#FF69B4', '#B8860B', '#4B0082', '#006400', '#708090'
];

const SettingScreen: React.FC = () => {
  const { themeColor, setThemeColor } = useThemeStore();
  const isFirstRender = useRef(true);
  const [pickerVisible, setPickerVisible] = useState(false);
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
      <TouchableOpacity
        onPress={() => setPickerVisible(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
        }}
      >
        <Text style={{ fontSize: 20, color: '#666' }}>テーマカラーを選択</Text>
        {/* 右端グループ（marginLeft:'auto'で右端に寄せる） */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
          {/* 選択中の色を1つだけ表示。border を無くす */}
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: themeColor || '#fff',
              marginRight: 12,
              borderWidth: 0,
            }}
          />
          <Text style={{ fontSize: 30, color: '#999' }}>›</Text>
        </View>
      </TouchableOpacity>
      <ThemePickerPanel
        visible={pickerVisible}
        colors={colors}
        selectedColor={themeColor}
        onSelect={(c) => setThemeColor(c)}
        onClose={() => setPickerVisible(false)}
      />
    </View>
  );
};

export default SettingScreen;