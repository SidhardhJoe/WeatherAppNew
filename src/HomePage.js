import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loadingcomponenet from './Components/Loadingcomponenet'
import { useWindowDimensions } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomePage = () => {
  const [data, setData] = useState('');
  const WindowwHeight = useWindowDimensions().height;
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageloading, setPageloading] = useState(false);
  const times = [
    "12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM",
    "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"
  ];

  const getAsyncStorage = async () => {
    try {
      const getData = await AsyncStorage.getItem('reverseGeoCodeAddress');
      const getDataParse = JSON.parse(getData);
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

  // const weatherIcon = getWeatherIcon(item.icon);

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
    <ScrollView style={styles.container}>
      <View style={styles.view1}>
        <Text style={styles.citylist}>City List</Text>
        {!data ? (
          <View style={{ height: WindowwHeight * 0.03 }}>
            <Text style={styles.chancefor}>Loading...</Text>
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
          <Animated.View
            style={[styles.viewtest, { height: WindowwHeight * 0.150 }]}
            entering={FadeInUp.duration(700)}
            exiting={FadeOutDown}
          >
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
                <Text style={styles.temprature}>{data.currentConditions.temp}°</Text>
              </View>
            </View>
          </Animated.View>
          <Animated.View
            style={[styles.view2, { height: WindowwHeight * 0.180 }]}
            entering={FadeInUp.duration(1400)}
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
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '5%',
  },
  containerforimgtxtview1: {
    width: '65%',
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
});
