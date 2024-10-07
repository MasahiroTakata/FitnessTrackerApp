import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ExerciseItem from './ExerciseItem';

interface Exercise {
  id: string;
  name: string;
  duration: number;
}

const HomeScreen: React.FC<any> = ({ route }) => { // screenコンポーネントの引数（props）として、自動的に提供される
  const [exercises, setExercises] = useState<Exercise[]>([]); // 初期化
  const navigation = useNavigation();
  React.useEffect(() => {
    if (route.params?.exerciseData) {
      setExercises(prevData => [...prevData, route.params.exerciseData]);
    }
  }, [route.params?.exerciseData]);

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