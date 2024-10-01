import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ExerciseItem from './ExerciseItem';

interface Exercise {
  id: string;
  name: string;
  duration: number;
}

const HomeScreen: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness Tracker</Text>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExerciseItem name={item.name} duration={item.duration} />
        )}
      />
      <Button
        title="Add New Exercise"
        onPress={() => navigation.navigate('AddExercise')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default HomeScreen;