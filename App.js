import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FirstPage from './src/FirstPage';
import { useFonts } from 'expo-font';
import HomePage from './src/HomePage';


const loadFonts = () => {
  return useFonts({
    GilBlack: require("./Fonts/Gilroy-Black.ttf"),
    GilReg: require("./Fonts/Gilroy-Regular.ttf")
  })
}

const Stack = createNativeStackNavigator();


export default function App() {

  const [Loaded] = loadFonts();
  if (Loaded) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='FirstPage'>
          <Stack.Screen name="FirstPage" component={FirstPage} />
          <Stack.Screen name='HomePage' component={HomePage}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

}
