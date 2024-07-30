import "./gesture-handler.native"
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import FirstPage from './src/FirstPage';
import { useFonts } from 'expo-font';
import HomePage from './src/HomePage';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import MoreDetails from "./src/MoreDetails";


const loadFonts = () => {
  return useFonts({
    GilBlack: require("./Fonts/Gilroy-Black.ttf"),
    GilReg: require("./Fonts/Gilroy-Regular.ttf"),
    GilMed: require("./Fonts/Gilroy-Medium.ttf"),
    GilSemiBold: require("./Fonts/Gilroy-SemiBold.ttf")
  })
}

const Stack = createStackNavigator();


export default function App() {

  const config = {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 10,
    },
  };

  const [Loaded] = loadFonts();
  if (Loaded) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='FirstPage'>
          <Stack.Screen name="FirstPage" component={FirstPage} />
          <Stack.Screen
            name='HomePage'
            component={HomePage}
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          />
          <Stack.Screen name="MoreDetails" component={MoreDetails}/>
          
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

}
