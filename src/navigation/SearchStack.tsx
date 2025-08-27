import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { SearchStackParamList } from '../types/navigation';
import SearchScreen from '../screens/search/SearchScreen';

const Stack = createStackNavigator<SearchStackParamList>();

function SearchResultsScreen({ route, navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Arama Sonuçları</Text>
      <Text style={styles.subtitle}>Arama: {route.params.query}</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Geri Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

function FilterScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filtreler</Text>
      <Text style={styles.subtitle}>Filtre seçenekleri burada olacak</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Geri Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SearchScreen" 
        component={SearchScreen} 
        options={{ title: 'Arama' }}
      />
      <Stack.Screen 
        name="SearchResults" 
        component={SearchResultsScreen} 
        options={{ title: 'Arama Sonuçları' }}
      />
      <Stack.Screen 
        name="FilterScreen" 
        component={FilterScreen} 
        options={{ title: 'Filtreler' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
