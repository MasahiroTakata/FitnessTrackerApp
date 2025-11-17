import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  topContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedCategory: {
    fontSize: 16,
    marginTop: 20,
  },
  dateText: {
    fontSize: 18,
    color: 'black',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  dateTouchable: {
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  calendarIcon: {
    fontSize: 20,
    color: '#555',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default styles;