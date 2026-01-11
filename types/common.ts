export type DateObject = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

export type RootStackParamList = {
  index: {};
  Home: {};
  Graph: {};
  AddExercise: { state: string };
  Setting: {};
};