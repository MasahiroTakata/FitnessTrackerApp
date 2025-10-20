import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, FlatList, StyleSheet } from 'react-native';

type Props = {
  visible: boolean;
  colors: string[];
  selectedColor: string;
  onSelect: (color: string) => void;
  onClose: () => void;
};

const { width } = Dimensions.get('window');

const ThemePickerPanel: React.FC<Props> = ({ visible, colors, selectedColor, onSelect, onClose }) => {
  const anim = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 0 : width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible, anim]);

  if (!visible) {
    // still render to allow animation out; if you want unmount on hidden, change logic
  }

  return (
    <Animated.View style={[styles.overlay, { transform: [{ translateX: anim }] }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>テーマカラーを選択</Text>
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.close}>閉じる</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={colors}
        keyExtractor={(item) => item}
        numColumns={4}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const selected = item === selectedColor;
          return (
            <TouchableOpacity
              style={[styles.colorItem, { backgroundColor: item, borderWidth: selected ? 3 : 0, borderColor: '#000' }]}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
            />
          );
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: width,
    backgroundColor: '#fff',
    zIndex: 999,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  close: { color: '#007aff', fontSize: 16 },
  list: {
    padding: 16,
    alignItems: 'flex-start',
  },
  colorItem: {
    width: (width - 16 * 2 - 12 * 3) / 4, // padding & gaps
    height: 60,
    borderRadius: 8,
    margin: 6,
  },
});

export default ThemePickerPanel;