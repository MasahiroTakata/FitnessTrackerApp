import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddExerciseScreen from './screens/AddExerciseScreen';
import ExerciseDetailScreen from './screens/ExerciseDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddExercise" component={AddExerciseScreen} />
        <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
