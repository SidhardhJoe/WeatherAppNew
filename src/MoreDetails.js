import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SharedTransition } from 'react-native-reanimated';

const MoreDetails = () => {
  return (
    <View sharedTransitionTag="sharedTag" >
      <Text>MoreDetails</Text>
    </View>
  )
}

export default MoreDetails

const styles = StyleSheet.create({})