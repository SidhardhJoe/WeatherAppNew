import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddLocationPage = () => {
    const navigation = useNavigation();

    const [location, setLocation] = useState('');

    const setData = async () => {
        try {
            await AsyncStorage.setItem("location", JSON.stringify(location))
        } catch (err) {
            console.log('err', err)
        }
    }

    useEffect(()=>{
        setData();
    })
    return (
        <View>
            <TouchableOpacity onPress={() => navigation.navigate('HomePage')}>
                <Text style={{ padding: 20 }}>Press here for nav</Text>
                <TextInput
                    value={location}
                    onChangeText={text => setLocation(text)}
                    style={styles.txtinpit}
                />
                {console.log('location', location)}
            </TouchableOpacity>
        </View>
    )
}

export default AddLocationPage

const styles = StyleSheet.create({
    txtinpit:{
        height:"50%",
        width:"80%",
        marginLeft:"10%",
        backgroundColor:"grey"
    }
})