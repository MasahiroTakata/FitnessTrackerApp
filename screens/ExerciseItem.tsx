import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

interface ExerciseItemProps {
  id: string;
  name: string;
  duration: number;
  color: string;
  navigation: NavigationProp<any>;
}

// デバイスの幅を取得（デバイスを横にした時の幅は取ってくれないっぽい、DimensionsというAPIは。）
const screenWidth = Dimensions.get('window').width;

const ExerciseItem: React.FC<ExerciseItemProps> = ({ id = '', name = '', duration = '', color = '', navigation }) => {
  if(color === ''){
    return (
      <TouchableOpacity
        style={[styles.homeItem]}
        onPress={() => navigation.navigate('EditExercise', { state: id })}
      >
        <View style={styles.exerciseList}>
          <Text style={styles.name}>{name}</Text>
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
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.duration}>{duration} mins</Text>
        </View>
      </TouchableOpacity>
    );
  } else{ // ホーム画面（編集画面を表示する）
    return ( // 円グラフ画面
      <View style= {[styles.graphItem, {flexDirection: 'row', alignItems: 'center'}]}>
        <View style={[styles.circle, { backgroundColor: color }]}></View>
        <View style={styles.exerciseList}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.duration}>{duration} mins</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  homeItem: {
    padding: 16,
    borderBottomWidth: 0.3,
    borderBottomColor: 'gray',
    width: screenWidth * 0.85,
  },
  lastItem: {
    padding: 16,
    width: screenWidth * 0.85,
  },
  graphItem: {
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