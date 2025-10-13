import { StyleSheet, Dimensions } from 'react-native';
import { useColorScheme } from 'react-native';

// デバイスの幅を取得（デバイスを横にした時の幅は取ってくれないっぽい、DimensionsというAPIは。）
const screenWidth = Dimensions.get('window').width;
const colorScheme = useColorScheme();
const backgroundColor = colorScheme === 'dark' ? '#f5f5f5' : '#f5f5f5';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: backgroundColor
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  daysText: {
    textAlign: 'left',
    // backgroundColor: 'gray',
    color: 'white',
    padding: 2,
  },
  homeItem: {
    padding: 16,
    borderBottomWidth: 0.3,
    borderBottomColor: 'gray',
    width: screenWidth * 0.85,
  },
});

export default styles;