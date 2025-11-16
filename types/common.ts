export type DateObject = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

export type RootStackParamList = {
  index: undefined;
  Home: {};
  Graph: undefined;
  AddExercise: { state: string };
};