import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';

const Loadingcomponenet = () => {
    return (
        <LottieView style={styles.icon} source={require('../Images/Loadingani.json')} autoPlay loop />
    )
}

export default Loadingcomponenet

const styles = StyleSheet.create({
    icon:{
        height:"10%",
        width:"50%"
    }
})