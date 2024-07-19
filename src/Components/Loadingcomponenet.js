import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';

const Loadingcomponenet = () => {
    return (
        <LottieView style={styles.container} source={require('../../Images/Loadingani.json')} autoPlay loop />
    )
}

export default Loadingcomponenet

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: 75,
    }
})