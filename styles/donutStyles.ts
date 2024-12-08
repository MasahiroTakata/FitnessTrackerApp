import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // 画面の中心に配置
  },
  chartWrapper: {
    position: "relative", // 重ねられる側
    justifyContent: "center",
    alignItems: "center", // グラフを中心に配置
    width: 200, // コンポーネント全体の横幅
    height: 200, // コンポーネント全体の縦幅
  },
  centerText: {
    position: "absolute", // 重なる側
    width: 100, // 中央の円のサイズ
    height: 100,
    borderRadius: 50, // 完全な円形にする
    backgroundColor: "white", // 背景色と同じ色
    justifyContent: "center",
    alignItems: "center",
  },
  centerTextTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  centerTextValue: {
    fontSize: 14,
    color: "#7F7F7F",
  },
  donutHole: {
    position: "absolute",
    width: 100, // 中央の円のサイズ
    height: 100,
    borderRadius: 50, // 完全な円形にする
    backgroundColor: "white", // 背景色と同じ色
    justifyContent: "center",
    alignItems: "center",
  },
  donutText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default styles;