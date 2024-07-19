import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loadingcomponenet from './Loadingcomponenet'
import {useWindowDimensions} from 'react-native';

const HomePage = () => {

  const [data, setData] = useState('')
  const WindowwHeight = useWindowDimensions().height


  const getData = () => {
    axios.get('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/koratty?unitGroup=metric&include=hours%2Cdays%2Ccurrent%2Calerts&key=F6RQQ5THZ6QFFEP69BKLW8VYX&contentType=json')
      .then(response => {
        setData(response.data);
        console.log('res', response.data.currentConditions.temp);
      }).catch(err => {
        console.log('err', err);
      });
  };

  useEffect(() => {
    getData();
  }, [])


  return (
    <ScrollView style={styles.container}>
      <View style={styles.view1}>
        <Text style={styles.citylist}>City List</Text>
        {data ? <View>
          <Text style={styles.chancefor}>Chance for {data.currentConditions.conditions}</Text>
        </View> : <Loadingcomponenet />}
      </View>
      <View>
        <TextInput style={[styles.inputbox, {height:WindowwHeight*0.04}]}/>
      </View>
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
  chancefor:{
    fontFamily:"GilReg",
    color:"grey",
    marginTop:"1%"
  },
  inputbox:{
    width:"90%",
    marginHorizontal:"5%",
    backgroundColor:"white",
    color:"black"
  }
})