import { StyleSheet, Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  homeItem: {
    padding: 18,
    borderBottomWidth: 0.3,
    borderBottomColor: 'gray',
    width: screenWidth * 0.92,
  },
  lastItem: {
    padding: 18,
    width: screenWidth * 0.92,
  },
  graphItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: screenWidth * 0.85,
  },
  exerciseList: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
  },
  duration: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'right',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 50,
  },
});

export default styles;