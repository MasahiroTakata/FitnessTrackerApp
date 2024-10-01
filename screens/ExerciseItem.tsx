import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ExerciseItemProps {
  name: string;
  duration: number;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ name, duration }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.duration}>{duration} mins</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: {
    fontSize: 18,
  },
  duration: {
    fontSize: 16,
    color: 'gray',
  },
});

export default ExerciseItem;