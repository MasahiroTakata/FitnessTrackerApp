import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: width,
    backgroundColor: '#fff',
    zIndex: 999,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  close: { color: '#007aff', fontSize: 16 },
  list: {
    padding: 16,
    alignItems: 'flex-start',
  },
  colorItem: {
    width: (width - 16 * 2 - 12 * 3) / 4,
    height: 60,
    borderRadius: 8,
    margin: 6,
  },
});

export default styles;