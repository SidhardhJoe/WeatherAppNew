import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, StatusBar, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FirstPage = () => {
    const navigation = useNavigation();
    const value = useState(new Animated.ValueXY({ x: -300, y: -300 }))[0];
    const value1 = useState(new Animated.ValueXY({ x: -300, y: 0 }))[0];
    const value2 = useState(new Animated.ValueXY({ x: 0, y: 100 }))[0];
    const [data, setData] = useState('')

    function moveBall() {
        Animated.timing(value, {
            toValue: { x: -60, y: -40 },
            duration: 1200,
            useNativeDriver: false,
        }).start();
    }
    function moveText() {
        Animated.timing(value1, {
            toValue: { x: 20, y: 0 },
            duration: 1200,
            useNativeDriver: false,
        }).start();
    }
    function moveBox() {
        Animated.timing(value2, {
            toValue: { x: 0, y: 0 },
            duration: 1200,
            useNativeDriver: false,
        }).start()
    }

    const getData = async () => {
        try {
            const savedata = await AsyncStorage.getItem("location")
            const pardata = JSON.parse(savedata)
            setData(pardata)
        } catch (err) {
            console.log('err', err)
        }
    }

    useEffect(() => {
        moveBall();
        moveText();
        moveBox();
        getData();
    }, []);

    const size = 350
    const borderradius = size / 2

    return (
        <View style={styles.container}>
            <StatusBar>
            </StatusBar>
            <Animated.View style={value.getLayout()}>
                <View style={[styles.box, { width: size, height: size, borderRadius: borderradius }]}>
                    <Image source={require("../Images/suncloudwind.png")} style={styles.bg1} />
                </View>
            </Animated.View>
            <Animated.View style={value1.getLayout()}>
                <View>
                    <Text style={styles.text1}>TRUSTED</Text>
                    <Text style={styles.text1}>WEATHER</Text>
                    <Text style={styles.text1}>FORECAST</Text>
                    <View style={styles.viewsubtext}>
                        <Text style={styles.text2}>Get to know your weather maps and radar precipitation forecast</Text>
                    </View>
                </View>
            </Animated.View>
            <View style={styles.lastview}>
                <Animated.View style={value2.getLayout()}>
                    {data ? <TouchableOpacity style={styles.bottombox} onPress={() => navigation.navigate('HomePage')}>
                        <View>
                            <Text style={styles.lasttxt}>Get Started</Text>
                        </View>
                    </TouchableOpacity> :
                        <TouchableOpacity style={styles.bottombox} onPress={() => navigation.navigate('AddLocation')}>
                            <View>
                                <Text style={styles.lasttxt}>Get Started</Text>
                            </View>
                        </TouchableOpacity>}
                </Animated.View>
                {console.log('data', data)}
            </View>
        </View>
    );
};

export default FirstPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    box: {
        backgroundColor: '#232323',
        justifyContent: "center",
        alignItems: "center",
    },
    bg1: {
        height: 200,
        width: 200
    },
    text1: {
        fontFamily: "GilBlack",
        color: "white",
        fontSize: 38
    },
    text2: {
        fontFamily: "GilReg",
        color: "#878787",
    },
    viewsubtext: {
        width: "60%"
    },
    bottombox: {
        height: "45%",
        width: "90%",
        backgroundColor: "white",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "5%"
    },
    lastview: {
        marginTop: "25%"
    },
    lasttxt: {
        fontFamily: "GilBlack",
        fontSize: 20
    }
});
