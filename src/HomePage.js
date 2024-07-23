import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loadingcomponenet from './Components/Loadingcomponenet'
import { useWindowDimensions } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage'

const HomePage = () => {

  const [data, setData] = useState('')
  const WindowwHeight = useWindowDimensions().height
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pageloading, setPageloading] = useState(false)
  const time = [{ time: "12AM" }, { time: "1AM" }, { time: "2AM" }, { time: "3AM" }, { time: "4AM" }, { time: "5AM" }, { time: "6AM" }, { time: "7AM" }, { time: "8AM" }, { time: "11AM" }, { time: "12PM" }, { time: "1PM" }, { time: "2PM" }, { time: "3PM" }, { time: "4PM" }, { time: "5PM" }, { time: "6PM" }, { time: "7PM" }, { time: "8PM" }, { time: "9PM" }, { time: "10PM" }, { time: "11PM" }];

  const getAsyncStorage = async () => {
    try {
      const getData = await AsyncStorage.getItem('reverseGeoCodeAddress')
      const getDataParse = JSON.parse(getData)
      setLoading(true)
      axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location ? location : getDataParse}?unitGroup=metric&include=hours%2Cdays%2Ccurrent%2Calerts&key=F6RQQ5THZ6QFFEP69BKLW8VYX&contentType=json`)
        .then(response => {
          setData(response.data);
          setLoading(false)
          setPageloading(true)
          console.log('res', data.resolvedAddress);
        }).catch(err => {
          console.log('err', err);
        });
    } catch (err) {
      console.log('err', err)
    }
  }


  useEffect(() => {
    getAsyncStorage();
  }, [])

  const renderItem = ({ item }) => {
    return (
      <View style={styles.flatcontainer}>

        <View>
          {time.map((time) => (
            <Text style={{ color: "white" }}>{time.time}</Text>
          ))}
          <Image source={require("../Images/suncloudwind.png")} style={styles.weathericon} />
          <Text style={{ color: "white" }}>{item?.hours[0]?.temp}</Text>
        </View>

      </View>
    )
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.view1}>
        <Text style={styles.citylist}>City List</Text>
        {!data ? <View style={{ height: WindowwHeight * 0.03 }}><Text style={styles.chancefor}>Loading...</Text></View> : <View style={{ height: WindowwHeight * 0.03 }}>
          <Text style={styles.chancefor}>Chance for {data.currentConditions.conditions}</Text>
        </View>}
      </View>
      <View style={styles.inputboxview}>
        <TextInput style={[styles.inputbox, { height: WindowwHeight * 0.05 }]}
          placeholder='Search for a city or airport'
          placeholderTextColor="#7C7C7C"
          value={location}
          onChangeText={text => setLocation(text)}
          onSubmitEditing={getAsyncStorage}
        />
        <TouchableOpacity style={[styles.searchbox, { height: WindowwHeight * 0.05 }]} onPress={getAsyncStorage}>
          <Image source={require("../Images/Searchicon.png")} style={styles.icon} />
        </TouchableOpacity>
      </View>
      {!data ? <Loadingcomponenet /> :
        <View style={{ alignItems: "center" }} >
          <Animated.View style={[styles.viewtest, { height: WindowwHeight * 0.150 }]} entering={FadeInUp.duration(700)} exiting={FadeOutDown}  >
            <View style={[styles.viewsub1, { height: WindowwHeight * 0.150 }]}>
              <View style={styles.containerforimgtxtview1}>
                <View style={styles.imgtxtview1}>
                  <Image source={require("../Images/suncloudwind.png")} style={styles.displayimg} />
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
          <Animated.View style={[styles.view2, { height: WindowwHeight * 0.180 }]} entering={FadeInUp.duration(1400)} exiting={FadeOutDown}>
            <Text style={styles.txthf}>HOURLY FORECAST</Text>
            {data && <Animated.FlatList
              data={data.days}
              renderItem={renderItem}
              horizontal={true}
              keyExtractor={item => item.datetimeEpoch.toString()}
            />}
          </Animated.View>
        </View>
      }
    </ScrollView>
  )
}

export default HomePage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  view1: {
    padding: 15,
    marginLeft: "2%"
  },
  citylist: {
    color: "white",
    fontSize: 24,
    fontFamily: "GilSemiBold"
  },
  chancefor: {
    fontFamily: "GilReg",
    color: "#7C7C7C",
    marginTop: "1%"
  },
  inputbox: {
    width: "75%",
    backgroundColor: "#1B1B1B",
    fontFamily: "GilMed",
    textAlign: "left",
    paddingLeft: 10,
    borderRadius: 5,
    color: "white"
  },
  searchbox: {
    width: "12%",
    backgroundColor: "#1B1B1B",
    marginRight: "3%",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "3%"
  },
  inputboxview: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginLeft: "2%"
  },
  icon: {
    height: 22,
    width: 22
  },
  viewtest: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: "5%"

  },
  yctxt: {
    color: "white",
    fontFamily: "GilMed",
    fontSize: 16,
    padding: 10,
    marginLeft: "2%"
  },
  displayimg: {
    height: 50,
    width: 50,
  },
  imgtxtview1: {
    flexDirection: "row",
    width: "75%",
    alignItems: "center"

  },
  viewsub1: {
    flexDirection: "row"
  },
  imgtxtview2: {
    width: "100",
  },
  tempview: {
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "5%"
  },
  containerforimgtxtview1: {
    width: "65%",
    justifyContent: "center",
    marginLeft: "7%"
  },
  address: {
    fontFamily: "GilSemiBold",
    fontSize: 18,
    padding: 10
  },
  temprature: {
    fontFamily: "GilBlack",
    fontSize: 30
  },
  forecast: {
    fontFamily: "GilSemiBold",
    fontSize: 12
  },
  view2: {
    width: "90%",
    backgroundColor: "#1B1B1B",
    marginTop: "5%",
    borderRadius: 10
  },
  txthf: {
    fontFamily: "GilMed",
    color: "#595959",
    padding: 10
  },
  flatcontainer: {
    width: 40,
  },
  weathericon: {
    height: 25,
    width: 25
  }
})