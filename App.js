import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FirstPage from './src/FirstPage';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName='FirstPage'>
        <Stack.Screen name="FirstPage" component={FirstPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
