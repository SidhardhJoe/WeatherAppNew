import { StyleSheet, Text, View, ScrollView, StatusBar, Animated } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const MoreDetails = ({ route }) => {
  const WindowHeight = useWindowDimensions().height;
  const [asyncvalue, setAsyncvalue] = useState('');
  const [response, setResponse] = useState(null);
  const { location, savedataparse } = route.params;
  const value = useState(new Animated.ValueXY({ x: -0, y: -300 }))[0];

  const getAsyncStorageValue = async () => {
    try {
      const storeAsyncValue = await AsyncStorage.getItem("reverseGeoCodeAddress");
      setAsyncvalue(storeAsyncValue);
      const loc = location ? location : storeAsyncValue;

      const weatherResponse = await axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?unitGroup=metric&include=hours%2Cdays%2Ccurrent%2Calerts&key=F6RQQ5THZ6QFFEP69BKLW8VYX&contentType=json`);
      setResponse(weatherResponse.data);
      console.log('response', weatherResponse.data.address);
    } catch (err) {
      console.log('err', err);
    }
  }

  const moveBall = () => {
    Animated.timing(value, {
      toValue: { x: 0, y: 0 },
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }

  useEffect(() => {
    getAsyncStorageValue();
    moveBall();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <StatusBar hidden={true} />
      <Animated.View style={value.getLayout()}>
        <View style={[styles.headerview, { height: WindowHeight * 0.38 }]}>
          <View style={styles.headerview1}>
            <Text>{response ? response.resolvedAddress : 'Loading...'}</Text>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

export default MoreDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  headerview: {
    width: "100%",
    backgroundColor: "#9F2B68",
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70
  }
});
