import { StyleSheet, Text, View, Animated, Image, FlatList, StatusBar, ScrollView } from 'react-native';
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
  const value1 = useState(new Animated.ValueXY({ x: 350, y: 0 }))[0];
  const value2 = useState(new Animated.ValueXY({ x: 100, y: 100 }))[0];

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

  const moveForecast = () => {
    Animated.timing(value1, {
      toValue: { x: 0, y: 0 },
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }

  const moveMoon=() =>{
    Animated.timing(value2, {
      toValue: { x: 50, y: 0 },
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }

  useEffect(() => {
    getAsyncStorageValue();
    moveBall();
    moveForecast();
    moveMoon();
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
        <View >
          <Image source={weatherIcon} style={styles.clouds} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
      <Animated.View style={value.getLayout()}>
        <View style={[styles.headerview, { height: WindowHeight * 0.25 }]}>
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
      <Animated.View style={value1.getLayout()} >
        <View style={[styles.tendayforecast, { height: WindowHeight * 0.29 }]}>
          <View style={styles.headingview}>
            <Image source={require("../Images/calender.png")} style={styles.calender} />
            <Text style={styles.forecasttxt}>10-Day Forecast</Text>
          </View>
          <FlatList
            data={response ? response.days : []}
            renderItem={renderItem}
            keyExtractor={item => item.datetimeEpoch.toString()}
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: "1%" }}
          />
        </View>
      </Animated.View>
      <Animated.View style={styles.weatherfacts}>
        <View style={[styles.smallcontainer1, { height: WindowHeight * 0.135 }]}>
          <View style={styles.smallcontainer10}>
            <Image source={require("../Images/solarrad.png")} style={styles.solarrad} />
            <Text style={styles.forecasttxt}> Solar Radiation</Text>
          </View>
          <View >
            <Text style={styles.solarradtxt}>{response ? response.currentConditions.solarradiation : "Loading..."}nm</Text>
            <Text style={styles.detailstxt}>Take adequate precaution</Text>
          </View>
        </View>
        <View style={[styles.smallcontainer1, { height: WindowHeight * 0.135 }]}>
          <View style={styles.smallcontainer10}>
            <Image source={require("../Images/air.png")} style={styles.solarrad} />
            <Text style={styles.forecasttxt}> pressure</Text>
          </View>
          <View>
            <Text style={styles.solarradtxt}>{response ? response.currentConditions.pressure : "Loading..."}</Text>
            <Text style={styles.detailstxt}>The pressure is excellent</Text>
          </View>
        </View>
      </Animated.View>
      <Animated.View>
        <View style={[styles.largecontainer1, { height: WindowHeight * 0.170 }]}>
          <View style={styles.smallcontainer10}>
            <Image source={require("../Images/moonphase.png")} style={styles.solarrad} />
            <Text style={styles.forecasttxt}> Moon Phase</Text>
          </View>
          <Animated.View style={value2.getLayout()}>
            {
              response ? (
                response.currentConditions.moonphase === 0 ? (
                  <Image source={require("../Images/newmoon.png")} style={styles.moon} />
                ) : response.currentConditions.moonphase > 0.00 && response.currentConditions.moonphase <= 0.24 ? (
                  <Image source={require("../Images/waxingcrescent.png")} style={styles.moon} />
                ) : response.currentConditions.moonphase >= 0.24 && response.currentConditions.moonphase <= 0.26 ? (
                  <Image source={require("../Images/firstquarter.png")} style={styles.moon} />
                ) : response.currentConditions.moonphase > 0.26 && response.currentConditions.moonphase <= 0.49 ? (
                  <Image source={require("../Images/waxinggibbous.png")} style={styles.moon} />
                ) : response.currentConditions.moonphase >= 0.49 && response.currentConditions.moonphase <= 0.51 ? (
                  <Image source={require("../Images/fullmoon.png")} style={styles.moon} />
                ) : response.currentConditions.moonphase > 0.51 && response.currentConditions.moonphase <= 0.74 ? (
                  <Image source={require("../Images/waninggibbous.png")} style={styles.moon} />
                ) : response.currentConditions.moonphase >= 0.74 && response.currentConditions.moonphase <= 0.99 ? (
                  <Image source={require("../Images/lastquarter.png")} style={styles.moon} />
                ) : (
                  <Image source={require("../Images/waningcrescent.png")} style={styles.moon} />
                )
              ) : (
                <Text>Loading...</Text>
              )
            }
          </Animated.View>
        </View>
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
  },
  smallcontainer1: {
    width: "42.5%",
    backgroundColor: "#1B1B1B",
    marginLeft: "5%",
    borderRadius: 10,
  },
  weatherfacts: {
    flexDirection: "row"
  },
  largecontainer1: {
    width: "90%",
    backgroundColor: "#1B1B1B",
    marginLeft: "5%",
    borderRadius: 10,
    marginVertical: "5%"
  },
  solarrad: {
    height: 20,
    width: 20,

  },
  smallcontainer10: {
    flexDirection: "row",
    margin: 5
  },
  solarradtxt: {
    color: "white",
    fontFamily: "GilSemiBold",
    fontSize: 17,
    marginLeft: "7%"
  },
  detailstxt: {
    fontFamily: "GilMed",
    color: "white",
    fontSize: 14,
    marginLeft: "7%"
  },
  moon: {
    height: 75,
    width: 75,

  }
});
