import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Easing } from 'react-native-reanimated';

const FirstPage = () => {
    const value = useState(new Animated.ValueXY({ x: -100, y: -100 }))[0];

    function moveBall() {
        Animated.timing(value, {
            toValue: { x: 100, y: 100 },
            duration: 1000,
            useNativeDriver: false,
        }).start();
    }

    useEffect(() => {
        console.log('value', value)
        // moveBall();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={value.getLayout()}>
                <View style={styles.box} />
            </Animated.View>
            <TouchableOpacity onPress={moveBall}>
                <Text>press here</Text>
            </TouchableOpacity>
        </View>
    );
};

export default FirstPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    box: {
        width: 200,
        height: 100,
        borderRadius: 20,
        backgroundColor: 'red',
    },
});
