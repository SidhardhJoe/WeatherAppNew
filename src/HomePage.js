import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const HomePage = () => {

  const [data, setData]=useState('')


  const getData = () =>{
    axios.get('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/koratty?unitGroup=metric&include=hours%2Cdays%2Ccurrent%2Calerts&key=F6RQQ5THZ6QFFEP69BKLW8VYX&contentType=json')
    .then(response =>{
      setData(response)
      console.log('res', data.data.currentConditions.temp)
    }).catch(err =>{
      console.log('err', err)
    })
  }

  useEffect(() => {
    getData();
  },[])


  return (
    <View style={styles.container}>
      {data ?<View>
        <Text style={{ color: "white", padding: 20, fontSize: 18, fontFamily: "GilBlack" }}>City List {data.data.currentConditions.temp}   </Text>
      </View>:<ActivityIndicator />
      }
    </View>
  )
}

export default HomePage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  }
})