import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../screens/HomeScreen';
import AddExerciseScreen from '../../screens/AddExerciseScreen';
import GraphScreen from '../../screens/GraphScreen';
import EditExerciseScreen from '../../screens/EditExerciseScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddExercise" component={AddExerciseScreen} />
        <Stack.Screen name="Graph" component={GraphScreen} />
        <Stack.Screen name="EditExercise" component={EditExerciseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
