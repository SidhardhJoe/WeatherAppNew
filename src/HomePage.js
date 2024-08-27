import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loadingcomponenet from './Components/Loadingcomponenet'
import { useWindowDimensions } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const HomePage = () => {
  const navigation = useNavigation();
  const [data, setData] = useState('');
  const WindowwHeight = useWindowDimensions().height;
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageloading, setPageloading] = useState(false);
  const [savedataparse, setSavedataparse] = useState(null)
  const times = [
    "12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM",
    "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"
  ];
  const [refreshing, setRefreshing] = useState(false);

  const getAsyncStorage = async () => {
    try {
      const getData = await AsyncStorage.getItem('reverseGeoCodeAddress');
      const getDataParse = JSON.parse(getData);
      setSavedataparse(getDataParse);
      setLoading(true);
      axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location ? location : getDataParse}?unitGroup=metric&include=hours%2Cdays%2Ccurrent%2Calerts&key=F6RQQ5THZ6QFFEP69BKLW8VYX&contentType=json`)
        .then(response => {
          setData(response.data);
          setLoading(false);
          setPageloading(true);
          console.log('res', data.resolvedAddress);
        }).catch(err => {
          console.log('err', err);
        });
    } catch (err) {
      console.log('err', err);
    }
  };

  useEffect(() => {
    getAsyncStorage();
  }, []);

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

  const renderItem = ({ item, index }) => {
    const timeLabel = times[index] || '';
    const weatherIcon = getWeatherIcon(item.icon);
    return (
      <View style={styles.flatcontainer}>
        <Text style={styles.timelabel}>{timeLabel}</Text>
        <Image source={weatherIcon} style={styles.weathericon} />
        <Text style={styles.templabel}>{item.temp}°C</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={getAsyncStorage} />
    }>
      <View style={styles.view1}>
        <Text style={styles.citylist}>Your City</Text>
        {!data ? (
          <View style={{ height: WindowwHeight * 0.03 }}>
            <Text style={styles.chancefor}>Loading....</Text>
          </View>
        ) : (
          <View style={{ height: WindowwHeight * 0.03 }}>
            <Text style={styles.chancefor}>Chance for {data.currentConditions.conditions}</Text>
          </View>
        )}
      </View>
      <View style={styles.inputboxview}>
        <TextInput
          style={[styles.inputbox, { height: WindowwHeight * 0.05 }]}
          placeholder='Search for a city or airport'
          placeholderTextColor="#7C7C7C"
          value={location}
          onChangeText={text => setLocation(text)}
          onSubmitEditing={getAsyncStorage}
        />
        <TouchableOpacity
          style={[styles.searchbox, { height: WindowwHeight * 0.05 }]}
          onPress={getAsyncStorage}
        >
          <Image source={require('../Images/Searchicon.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      {!data ? (
        <Loadingcomponenet />
      ) : (
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate("MoreDetails", { location, savedataparse })} style={[styles.viewtest, { height: WindowwHeight * 0.150 }]}>
            <Animated.View
              entering={FadeInUp.duration(900)}
              exiting={FadeOutDown}>
              <View style={[styles.viewsub1, { height: WindowwHeight * 0.150 }]}>
                <View style={styles.containerforimgtxtview1}>
                  <View style={styles.imgtxtview1}>
                    <Image source={require('../Images/suncloudwind.png')} style={styles.displayimg} />
                    <Text style={styles.address}>{data.resolvedAddress}</Text>
                  </View>
                  <View style={styles.imgtxtview2}>
                    <Text style={styles.forecast}>{data.currentConditions.conditions} forecasted</Text>
                  </View>
                </View>
                <View style={styles.tempview}>
                  <Text style={styles.temprature}>{data.currentConditions.temp}°C</Text>
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>
          <Animated.View
            style={[styles.view2, { height: WindowwHeight * 0.180 }]}
            entering={FadeInUp.duration(900)}
            exiting={FadeOutDown}
          >
            <Text style={styles.txthf}>HOURLY FORECAST</Text>
            {data && (
              <Animated.FlatList
                data={data.days[0].hours}
                renderItem={renderItem}
                horizontal={true}
                keyExtractor={item => item.datetimeEpoch.toString()}
                style={styles.flatlistview}
                showsHorizontalScrollIndicator={false}
              />
            )}
          </Animated.View>
          <Animated.View style={styles.anview2} entering={FadeInUp.duration(900)} exiting={FadeOutDown}>
            
            <Animated.View style={[styles.aniviewsub1, { height: WindowwHeight * 0.150 }]}>
              <View style={styles.sub1}>
                <Image source={require("../Images/clear-day.png")} style={styles.uvicon} />
                <Text style={styles.aniviewsub1txt}>UV Index</Text>
              </View>
              <View style={styles.uvdetails}>
                <Text style={styles.uvnum}>{data.currentConditions.uvindex}</Text>
                <Text style={styles.uvreading}>{data.currentConditions.uvindex >= 0 && data.currentConditions.uvindex <= 2 ? "Low" : data.currentConditions.uvindex >= 3 && data.currentConditions.uvindex <= 5 ? "Moderate" : data.currentConditions.uvindex >= 6 && data.currentConditions.uvindex <= 7 ? "High" : data.currentConditions.uvindex >= 8 && data.currentConditions.uvindex <= 10 ? "Very High" : "Extreme"}</Text>
              </View>
              <Text style={styles.uvsentence}>{data.currentConditions.uvindex >= 0 && data.currentConditions.uvindex <= 2 ? "You can safely enjoy being outside!" : data.currentConditions.uvindex >= 3 && data.currentConditions.uvindex <= 7 ? "Seek shade during midday! Slip on a shirt, slop on sunscreen and slap on hat!" : "Avoid being outside during midday! Make sure you seek shade! Shirt, sunscreen and hat are a must!"}</Text>
            </Animated.View>

            <Animated.View style={[styles.aniviewsub1, { height: WindowwHeight * 0.150 }]}>
              <View style={styles.sub2}>
                <Image source={require("../Images/humidity.png")} style={styles.humicon} />
                <Text style={styles.aniviewsub1txt}>Humidity</Text>
              </View>
              <View style={styles.uvdetails}>
                <Text style={styles.uvnum}>{data.currentConditions.humidity}%</Text>
              </View>
              <Text style={styles.uvsentence}>The Dew point is {data.currentConditions.dew} right now</Text>
            </Animated.View>
          </Animated.View>
          <Animated.View style={styles.anview2} entering={FadeInUp.duration(900)} exiting={FadeOutDown}>
            <View style={[styles.aniviewsub1, { height: WindowwHeight * 0.160 }]}>
              <View style={styles.sub3}>
                <Image source={require("../Images/thermo.png")} style={styles.thermoicon} />
                <Text style={styles.aniviewsub1txt}>Feels Like</Text>
              </View>
              <Text style={styles.uvnum}>{data.currentConditions.feelslike}°</Text>
              <Text style={styles.feelikedet}>Feels like is calculated using the ambient temperature, humidity level and wind speed</Text>
            </View>
            <View style={[styles.aniviewsub1, { height: WindowwHeight * 0.160 }]}>
              <View style={styles.sub3}>
                <Image source={require("../Images/visi.png")} style={styles.humicon} />
                <Text style={styles.aniviewsub1txt}>Visiblity</Text>
              </View>
              <Text style={styles.uvnum}>{data.currentConditions.visibility} mi</Text>
              <Text style={styles.feelikedet}>{data.currentConditions.visibility >= 0.0 && data.currentConditions.visibility <= 0.5 ? "Thick fog, heavy snow, or severe weather conditions; hazardous for all outdoor activities and travel." : data.currentConditions.visibility > 0.5 && data.currentConditions.visibility <= 1 ? "Dense fog, heavy rain, or snow; dangerous for driving and other outdoor activities." : data.currentConditions.visibility > 1 && data.currentConditions.visibility <= 2 ? "Significant haze, fog, or light rain; can impact driving, especially at higher speeds." : data.currentConditions.visibility > 2 && data.currentConditions.visibility <= 5 ? "Some haze or light fog; might slightly impact driving or outdoor activities." : data.currentConditions.visibility > 5 && data.currentConditions.visibility <= 10 ? "Clear with minimal obstructions; suitable for most activities." : "Perfectly clear skies with no obstructions; ideal for all activities."}</Text>
            </View>
          </Animated.View>
          <Animated.View style={styles.anview2} entering={FadeInUp.duration(900)} exiting={FadeOutDown}>
            <View style={[styles.aniviewsub1, { height: WindowwHeight * 0.160 }]}>
              <View style={styles.sub3}>
                <Image source={require("../Images/aqi.png")} style={styles.aqiicon} />
                <Text style={styles.aniviewsub1txt}>Wind Speed</Text>
              </View>
              <Text style={styles.uvnum}>{data.currentConditions.windspeed}</Text>
              <Text style={styles.feelikedet}>{data.currentConditions.windspeed >= 0 && data.currentConditions.windspeed <= 5 ? "Smoke drift indicates wind direction; leaves do not move." : data.currentConditions.windspeed >= 6 && data.currentConditions.windspeed <= 11 ? "Leaves rustle; wind felt on face." : data.currentConditions.windspeed >= 12 && data.currentConditions.windspeed <= 19 ? "Leaves and small twigs in constant motion; light flags extended." : data.currentConditions.windspeed >= 20 && data.currentConditions.windspeed <= 28 ? "Small branches move; raises dust and loose paper." : data.currentConditions.windspeed >= 29 && data.currentConditions.windspeed <= 38 ? "Small trees in leaf begin to sway; crested wavelets form on inland waters." : data.currentConditions.windspeed >= 39 && data.currentConditions.windspeed <= 49 ? "Large branches in motion; umbrellas difficult to use; whistling heard in wires." : "Get to safety"}</Text>
            </View>
            <View style={[styles.aniviewsub1, { height: WindowwHeight * 0.160 }]}>
              <View style={styles.sub3}>
                <Image source={require("../Images/Water.png")} style={styles.humicon} />
                <Text style={styles.aniviewsub1txt}>Dew</Text>
              </View>
              <Text style={styles.uvnum}>{data.currentConditions.dew}</Text>
              <Text style={styles.feelikedet}>Dew is a measurement which indicates the temperature at which air becomes saturated with moisture and dew forms</Text>
            </View>
          </Animated.View>
          <Animated.View style={[styles.viewtest1, { height: WindowwHeight * 0.145 }]}>
            <View style={styles.alignitemss}>
              <Image source={require("../Images/sunrise.png")} style={styles.sunrise} />
              <Text style={styles.sunrisetxt}>sunrise</Text>
              <Text style={styles.sunrisetxt}>{data.currentConditions.sunrise}</Text>
            </View>
            <View style={styles.center}>
              <Image source={require("../Images/sun.png")} style={styles.clouds} />
              <Text style={styles.sunrisetxt}>cloud cover</Text>
              <Text style={styles.sunrisetxt}>{data.currentConditions.cloudcover}</Text>
            </View>
            <View style={styles.alignitemss}>
              <Image source={require("../Images/sunset.png")} style={styles.sunrise} />
              <Text style={styles.sunrisetxt}>sunset</Text>
              <Text style={styles.sunrisetxt}>{data.currentConditions.sunset}</Text>
            </View>
          </Animated.View>
          <Text style={styles.lasttxt}>Weather for {data.resolvedAddress}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  view1: {
    padding: 15,
    marginLeft: '2%',
  },
  citylist: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'GilSemiBold',
  },
  chancefor: {
    fontFamily: 'GilReg',
    color: '#7C7C7C',
    marginTop: '1%',
  },
  inputbox: {
    width: '75%',
    backgroundColor: '#1B1B1B',
    fontFamily: 'GilMed',
    textAlign: 'left',
    paddingLeft: 10,
    borderRadius: 5,
    color: 'white',
  },
  searchbox: {
    width: '12%',
    backgroundColor: '#1B1B1B',
    marginRight: '3%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '3%',
  },
  inputboxview: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginLeft: '2%',
  },
  icon: {
    height: 22,
    width: 22,
  },
  viewtest: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: '5%',
  },
  yctxt: {
    color: 'white',
    fontFamily: 'GilMed',
    fontSize: 16,
    padding: 10,
    marginLeft: '2%',
  },
  displayimg: {
    height: 50,
    width: 50,
  },
  imgtxtview1: {
    flexDirection: 'row',
    width: '75%',
    alignItems: 'center',
  },
  viewsub1: {
    flexDirection: 'row',
  },
  imgtxtview2: {
    width: '100',
  },
  tempview: {
    width: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '5%',
  },
  containerforimgtxtview1: {
    width: '60%',
    justifyContent: 'center',
    marginLeft: '7%',
  },
  address: {
    fontFamily: 'GilSemiBold',
    fontSize: 18,
    padding: 10,
  },
  temprature: {
    fontFamily: 'GilBlack',
    fontSize: 30,
  },
  forecast: {
    fontFamily: 'GilSemiBold',
    fontSize: 12,
  },
  view2: {
    width: '90%',
    backgroundColor: '#1B1B1B',
    marginTop: '5%',
    borderRadius: 10,
  },
  txthf: {
    fontFamily: 'GilMed',
    color: '#595959',
    padding: 10,
  },
  flatcontainer: {
    width: 50,
    alignItems: 'center',
    gap: 5,
  },
  weathericon: {
    height: 25,
    width: 25,
  },
  timelabel: {
    color: 'white',
    fontFamily: 'GilMed',
  },
  flatlistview: {
    marginLeft: 2,
  },
  templabel: {
    color: 'white',
    fontFamily: 'GilMed',
  },
  anview2: {
    flexDirection: "row"
  },
  aniviewsub1: {
    width: "42.5%",
    backgroundColor: "#1B1B1B",
    marginHorizontal: "2.5%",
    marginTop: "5%",
    borderRadius: 10
  },
  aniviewsub1txt: {
    color: "#595959",
    fontFamily: "GilMed",
    marginTop: "2%"
  },
  uvicon: {
    height: 25,
    width: 25
  },
  sub1: {
    flexDirection: "row",
    padding: 5
  },
  uvdetails: {
    flexDirection: "row",
  },
  uvnum: {
    color: "white",
    fontFamily: "GilMed",
    fontSize: 19,
    marginLeft: "7%"
  },
  uvreading: {
    fontFamily: "GilSemiBold",
    color: "white",
    fontSize: 18,
    marginLeft: "5%"
  },
  uvsentence: {
    fontFamily: "GilSemiBold",
    color: "white",
    fontSize: 10,
    paddingHorizontal: 10
  },
  humicon: {
    height: 20,
    width: 20
  },
  sub2: {
    flexDirection: "row",
    padding: 6,
    gap: 5
  },
  thermoicon: {
    height: 18,
    width: 7,
    marginTop: "2%"
  },
  sub3: {
    flexDirection: "row",
    padding: 10,
    gap: 5
  },
  feelikedet: {
    fontFamily: "GilSemiBold",
    color: "white",
    fontSize: 10,
    paddingHorizontal: "5%",
    textAlign: "left"
  },
  aqiicon: {
    height: 19,
    width: 25
  },
  viewtest1: {
    width: '90%',
    backgroundColor: '#1B1B1B',
    borderRadius: 10,
    marginVertical: '5%',
    paddingHorizontal: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lasttxt: {
    color: "#8B8B8B",
    fontFamily: "GilBlack",
    paddingBottom: 20
  },
  sunrise: {
    height: 40,
    width: 40,
  },
  sunrisetxt: {
    color: "white",
    fontFamily: "GilSemiBold"
  },
  clouds: {
    height: 40,
    width: 40,
    marginTop: "2%"
  },
  alignitemss: {
    justifyContent: "center",
    alignItems: "center"
  },
  center: {
    alignItems: "center"
  }
});