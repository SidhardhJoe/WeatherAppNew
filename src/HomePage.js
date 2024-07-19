import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loadingcomponenet from './Loadingcomponenet'
import { useWindowDimensions } from 'react-native';

const HomePage = () => {

  const [data, setData] = useState('')
  const WindowwHeight = useWindowDimensions().height
  const [location, setLocation] = useState('')
  const [loading, setLoading]= useState(false)


  const getData = () => {
    setLoading(true)
    axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&include=hours%2Cdays%2Ccurrent%2Calerts&key=F6RQQ5THZ6QFFEP69BKLW8VYX&contentType=json`)
      .then(response => {
        setData(response.data);
        setLoading(false)
        console.log('res', response.data.currentConditions.temp);
      }).catch(err => {
        console.log('err', err);
      });
  };

  // useEffect(() => {
  //   getData();
  // }, [])


  return (
    <ScrollView style={styles.container}>
      <View style={styles.view1}>
        <Text style={styles.citylist}>City List</Text>
        {!data ? <Loadingcomponenet />  : <View style={{ height: WindowwHeight * 0.03 }}>
          <Text style={styles.chancefor}>Chance for {data.currentConditions.conditions}</Text>
        </View> }
      </View>
      <View style={styles.inputboxview}>
        <TextInput style={[styles.inputbox, { height: WindowwHeight * 0.05 }]}
          placeholder='Search for a city or airport'
          placeholderTextColor="#7C7C7C"
          value={location}
          onChangeText={text => setLocation(text)}
        />
        <TouchableOpacity style={[styles.searchbox, { height: WindowwHeight * 0.05 }]} onPress={getData }>
          <Image source={require("../Images/Searchicon.png")} style={styles.icon}/>
        </TouchableOpacity>
      </View>
      {loading ? <ActivityIndicator/>:<Text></Text>}
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
    borderRadius:5,
    justifyContent:"center",
    alignItems:"center"
  },
  inputboxview: {
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  icon:{
    height:22,
    width:22
  }
})