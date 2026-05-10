import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../types/common';

type NavigationPropType = StackNavigationProp<RootStackParamList, 'EditExercise'>;

type SearchHeaderProps = {
  performSearch: (text: string) => void;
};

const SearchHeader: React.FC<SearchHeaderProps> = ({
  performSearch
}) => {  const navigation = useNavigation<NavigationPropType>();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginHorizontal: 10 }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>閉じる</Text>
      </TouchableOpacity>
      <TextInput
        style={{
          flex: 1, marginLeft: 15, paddingHorizontal: 12, paddingVertical: 8,
          backgroundColor: '#fff', borderRadius: 8, fontSize: 14,
        }}
        placeholder="運動名またはカテゴリー名で検索..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          performSearch(text);
        }}
        autoCorrect={true}
        autoCapitalize="none"
      />
    </View>
  );
};

export default SearchHeader;