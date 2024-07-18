import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, StatusBar, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Easing } from 'react-native-reanimated';

const FirstPage = () => {
    const value = useState(new Animated.ValueXY({ x: -400, y: -400 }))[0];

    function moveBall() {
        Animated.timing(value, {
            toValue: { x: -60, y: -40 },
            duration: 1100,
            useNativeDriver: false,
        }).start();
    }

    useEffect(() => {
        console.log('value', value)
        moveBall();
    }, []);

    const size = 350
    const borderradius = size/2

    return (
        <View style={styles.container}>
            <StatusBar>

            </StatusBar>
            <Animated.View style={value.getLayout()}>
                <View style={[styles.box, {width:size, height:size, borderRadius:borderradius}]}>
                    <Image source={require("../Images/bg1.png")} style={styles.bg1}/>
                </View>
            </Animated.View>
        </View>
    );
};

export default FirstPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"black"
    },
    box: {
        backgroundColor: '#232323',
        justifyContent:"center",
        alignItems:"center"
    },
    bg1:{
        height:200,
        width:200
    }
});
