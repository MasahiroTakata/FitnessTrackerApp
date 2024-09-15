import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness Tracker</Text>
      <Button
        title="Add Exercise"
        onPress={() => navigation.navigate('AddExercise')}
      />
      {/* エクササイズリスト表示（仮） */}
      <FlatList
        data={[]}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.name}</Text>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
