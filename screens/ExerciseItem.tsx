import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { CategoryRecords } from '@/constants/CategoryRecords'

interface ExerciseItemProps {
  id: string;
  name: string;
  category: number;
  duration: number;
  color: string;
  navigation: NavigationProp<any>;
}

// デバイスの幅を取得（デバイスを横にした時の幅は取ってくれないっぽい、DimensionsというAPIは。）
const screenWidth = Dimensions.get('window').width;
const getCategoryLabel = (category: number): string => {
  // catは、CategoryRecordsの１データのこと。findでcategoryを1行ずつ検索している
  const foundCategory = CategoryRecords.find((cat) => parseInt(cat.value, 10) === category);
  return foundCategory ? foundCategory.label : "不明"; // 該当するカテゴリーがなければ「不明」
};

const ExerciseItem: React.FC<ExerciseItemProps> = ({ id = '', name = '', category = 0, duration = 0, color = '', navigation }) => {
  if(color === ''){
    return (
      <TouchableOpacity
        style={[styles.homeItem]}
        onPress={() => navigation.navigate('EditExercise', { state: id })}
      >
        <View style={styles.exerciseList}>
          <Text style={styles.name}>
            {getCategoryLabel(category)}
            {name ? `（${name}）` : null}
          </Text>
          <Text style={styles.duration}>{duration} mins</Text>
        </View>
      </TouchableOpacity>
    );
  } else if(color === 'isLast'){
    return (
      <TouchableOpacity
        style={[styles.lastItem]}
        onPress={() => navigation.navigate('EditExercise', { state: id })}
      >
        <View style={styles.exerciseList}>
          <Text style={styles.name}>
            {getCategoryLabel(category)}
            {name ? `（${name}）` : null}
          </Text>
          <Text style={styles.duration}>{duration} mins</Text>
        </View>
      </TouchableOpacity>
    );
  } else{ // ホーム画面（編集画面を表示する）
    return ( // 円グラフ画面
      <View style= {[styles.graphItem, {flexDirection: 'row', alignItems: 'center'}]}>
        <View style={[styles.circle, { backgroundColor: color }]}></View>
        <View style={styles.exerciseList}>
          <Text style={styles.name}>{category}</Text>
          <Text style={styles.duration}>{duration} mins</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  homeItem: {
    padding: 18,
    borderBottomWidth: 0.3,
    borderBottomColor: 'gray',
    width: screenWidth * 0.92,
  },
  lastItem: {
    padding: 18,
    width: screenWidth * 0.92,
  },
  graphItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: screenWidth * 0.85,
  },
  exerciseList: {
    flex: 1, // circle の横に置かれる場合は残りを埋める
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
  },
  duration: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'right',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 50,
  }
});

export default ExerciseItem;