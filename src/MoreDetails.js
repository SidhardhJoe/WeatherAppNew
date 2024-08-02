import { StyleSheet, Text, View, Animated, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const MoreDetails = ({ route }) => {
  const WindowHeight = useWindowDimensions().height;
  const [asyncvalue, setAsyncvalue] = useState('');
  const [response, setResponse] = useState(null);
  const { location } = route.params;
  const value = useState(new Animated.ValueXY({ x: 0, y: -300 }))[0];
  // const value1 = useState(new Animated.ValueXY({ x: 350, y: 0 }))[0];

  const getAsyncStorageValue = async () => {
    try {
      const storeAsyncValue = await AsyncStorage.getItem("reverseGeoCodeAddress");
      setAsyncvalue(storeAsyncValue);
      const loc = location ? location : JSON.parse(storeAsyncValue);
      const weatherResponse = await axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?unitGroup=metric&include=hours%2Cdays%2Ccurrent%2Calerts&key=F6RQQ5THZ6QFFEP69BKLW8VYX&contentType=json`);
      setResponse(weatherResponse.data);
      console.log('response', weatherResponse.data.address);
    } catch (err) {
      console.log('err', err);
    }
  }

  const getWeatherIcon = (iconName) => {
    switch (iconName) {
      case 'snow':
        return require('../Images/snow.png');
      case 'snow-showers-day':
        return require('../Images/snow-showers-day.png');
      case 'snow-showers-night':
        return require('../Images/snow-showers-night.png');
      case 'thunder-rain':
        return require('../Images/thunder-rain.png');
      case 'thunder-showers-day':
        return require('../Images/thunder-showers-day.png');
      case 'thunder-showers-night':
        return require('../Images/thunder-showers-night.png');
      case 'rain':
        return require('../Images/rain.png');
      case 'showers-day':
        return require('../Images/showers-day.png');
      case 'showers-night':
        return require('../Images/showers-night.png');
      case 'fog':
        return require('../Images/fog.png');
      case 'wind':
        return require('../Images/wind.png');
      case 'cloudy':
        return require('../Images/cloudy.png');
      case 'partly-cloudy-day':
        return require('../Images/partly-cloudy-day.png');
      case 'partly-cloudy-night':
        return require('../Images/partly-cloudy-night.png');
      case 'clear-day':
        return require('../Images/clear-day.png');
      case 'clear-night':
        return require('../Images/clear-night.png');
      default:
        return require('../Images/suncloudwind.png');
    }
  };

  const moveBall = () => {
    Animated.timing(value, {
      toValue: { x: 0, y: 0 },
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }

  // const moveForecast = () => {
  //   Animated.timing(value1, {
  //     toValue: { x: 0, y: 0 },
  //     duration: 1500,
  //     useNativeDriver: false,
  //   }).start();
  // }

  useEffect(() => {
    getAsyncStorageValue();
    moveBall();
    // moveForecast();
  }, []);

  const renderItem = ({ item }) => {
    const weatherIcon = getWeatherIcon(item.icon);
    return (
      <View style={[styles.flatlistcontainer, { height: WindowHeight * 0.04 }]}>
        <View style={styles.view1}>
          <Text style={styles.view1txt}>{item.datetime}</Text>
        </View>
        <View style={styles.view2}>
          <Text style={styles.view1txt} >{item.tempmin}°</Text>
        </View>
        <LinearGradient style={styles.bar} colors={['#1034A6', '#412F88', '#722B6A', '#A2264B', '#D3212D', '#F62D2D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}></LinearGradient>
        <View style={styles.view3}>
          <Text style={styles.view1txt}>{item.tempmax}°</Text>
        </View>
        <View style={styles.view4}>
          <Image source={weatherIcon} style={styles.clouds} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={value.getLayout()}>
        <View style={[styles.headerview, { height: WindowHeight * 0.22 }]}>
          <View style={styles.headerview1}>
            <Text style={styles.addresstxt}>{response ? response.address : 'Loading...'}</Text>
          </View>
          <View style={styles.headerview2}>
            <Text style={styles.currentcondi}>{response ? response.currentConditions.conditions : 'Loading...'}</Text>
          </View>
          <View style={styles.headerview2}>
            <Text style={styles.currenttemp}>{response ? response.currentConditions.temp : 'Loading...'}°</Text>
          </View>
          <View style={styles.headerview3}>
            <Text style={styles.temps}>H: {response ? response.days[0].tempmax : 'Loading...'}° . </Text>
            <Text style={styles.temps}> L: {response ? response.days[0].tempmin : 'Loading...'}°</Text>
          </View>
        </View>
      </Animated.View>
      <Animated.View >
        <View style={[styles.tendayforecast, { height: WindowHeight * 0.5 }]}>
          <View style={styles.headingview}>
            <Image source={require("../Images/calender.png")} style={styles.calender} />
            <Text style={styles.forecasttxt}>10-Day Forecast</Text>
          </View>
          <FlatList
            data={response ? response.days : []}
            renderItem={renderItem}
            keyExtractor={item => item.datetimeEpoch.toString()}
            showsVerticalScrollIndicator={false}
            style={{marginBottom:"1%"}}
          />
        </View>
      </Animated.View>
      <Animated.View style={styles.weatherfacts}>

      </Animated.View>
    </View>
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
    backgroundColor: "#e4faff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  headerview1: {
    alignItems: "center",
    marginTop: "3%"
  },
  addresstxt: {
    fontFamily: "GilSemiBold",
    fontSize: 28
  },
  currentcondi: {
    fontFamily: "GilSemiBold",
    fontSize: 16
  },
  headerview2: {
    alignItems: "center",
    marginTop: "1%"
  },
  currenttemp: {
    fontFamily: "GilBlack",
    fontSize: 38
  },
  headerview3: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "2%"
  },
  temps: {
    fontFamily: "GilSemiBold"
  },
  tendayforecast: {
    width: "90%",
    backgroundColor: '#1B1B1B',
    borderRadius: 10,
    marginVertical: "5%",
    marginHorizontal: "5%"
  },
  calender: {
    height: 25,
    width: 25,
  },
  forecasttxt: {
    color: "#595959",
    fontFamily: "GilMed",
    marginTop: "1%"
  },
  headingview: {
    flexDirection: "row",
    margin: "1%"
  },
  bar: {
    height: 5,
    width: "30%",
    backgroundColor: "blue",
    borderRadius: 10
  },
  clouds: {
    height: 25,
    width: 25
  },
  flatlistcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: "3%",
    alignItems: "center"
  },
  view1txt: {
    fontFamily: "GilMed",
    color: "white"
  },
  view1: {
    width: "27%"
  },
  view2: {
    width: "12%"
  },
  view3: {
    width: "12%"
  }
});
