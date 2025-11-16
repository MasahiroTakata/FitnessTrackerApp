import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { CategoryRecords } from '@/constants/CategoryRecords'
import styles from '../styles/ExerciseItemStyles';

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
  const foundCategory = CategoryRecords.find((cat) => cat.value === category);

  return foundCategory ? foundCategory.label : "不明"; // 該当するカテゴリーがなければ「不明」
};

const ExerciseItem: React.FC<ExerciseItemProps> = ({ id = '', name = '', category = 0, duration = 0, color = '', navigation }) => {
  if(color === ''){ // ホーム画面（編集画面を表示する）
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
          <Text style={styles.duration}>{duration} 分</Text>
        </View>
      </TouchableOpacity>
    );
  } else if(color === 'isLast'){ // ホーム画面（編集画面を表示する）
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
          <Text style={styles.duration}>{duration} 分</Text>
        </View>
      </TouchableOpacity>
    );
  } else{ // 円グラフ画面
    return (
      <View style= {[styles.graphItem, {flexDirection: 'row', alignItems: 'center'}]}>
        <View style={[styles.circle, { backgroundColor: color }]}></View>
        <View style={styles.exerciseList}>
          <Text style={styles.name}>{getCategoryLabel(category)}</Text>
          <Text style={styles.duration}>{duration} 分</Text>
        </View>
      </View>
    );
  }
};

export default ExerciseItem;