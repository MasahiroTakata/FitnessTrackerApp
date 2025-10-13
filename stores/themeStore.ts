import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeStore = {
  themeColor: string;
  setThemeColor: (color: string) => void;
};

export const useThemeStore = create<ThemeStore>((set) => {
  console.log('useThemeStoreが呼び出されました。'); // デバッグ用ログ
  // 初期値としてデフォルトカラーを設定
  const initialState = {
    themeColor: '#007AFF', // デフォルトカラー
    setThemeColor: (color: string) => {
      set({ themeColor: color });
      // AsyncStorageに保存
      AsyncStorage.setItem('themeColor', color).catch((error) =>
        console.error('テーマカラーの保存に失敗しました:', error)
      );
    },
  };

  // AsyncStorageからテーマカラーを取得して初期値を更新
  (async () => {
    try {
      const savedColor = await AsyncStorage.getItem('themeColor');
      if (savedColor) {
        console.log(`themeStoreから取得した保存されたテーマカラー: ${savedColor}`);
        set({ themeColor: savedColor });
      }
    } catch (error) {
      console.error('テーマカラーの取得に失敗しました:', error);
    }
  })();

  return initialState;
});