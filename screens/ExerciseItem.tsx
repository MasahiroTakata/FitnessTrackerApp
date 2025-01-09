import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface ExerciseItemProps {
  name: string;
  duration: number;
  color: string;
}
// デバイスの幅を取得（デバイスを横にした時の幅は取ってくれないっぽい、DimensionsというAPIは。）
const screenWidth = Dimensions.get('window').width;

const ExerciseItem: React.FC<ExerciseItemProps> = ({ name = '', duration = '', color = 'white' }) => {
  return (
    <View style={color !== 'white' ? [styles.item, { flexDirection: 'row', alignItems: 'center' }] : [styles.item]}>
      <View style={color !== 'white' ? [styles.circle, { backgroundColor: color }] : [styles.circle]}></View>
      <View style={styles.exerciseList}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.duration}>{duration} mins</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: screenWidth * 0.85,
  },
  exerciseList: {
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
  },
  duration: {
    fontSize: 16,
    color: 'gray',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 50,
    // backgroundColor: 'skyblue' // styleプロパティに直接記述することで、動的に色を指定できる
  }
});

export default ExerciseItem;