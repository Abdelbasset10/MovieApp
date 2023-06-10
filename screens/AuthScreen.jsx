import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/Loading';

const AuthScreen = () => {
    const navigation = useNavigation()
    const [userInfo,setUserInfo] = useState({
        userName:"",
        password:""
    })
    const [isLoading,setIsLoading] = useState(true)

    useEffect(()=>{
        const getUser = async () => {         
            AsyncStorage.getItem("profile").then((value)=>{
                let userData = JSON.parse(value)
                if(userData?.userName){               
                    navigation.navigate('Home')
                    setIsLoading(false)
                }else{
                    setIsLoading(false)
                }
            }).catch((err)=>{
                console.log(err)
            })
        }
        getUser()
    },[])

    const handleSubmit = async () => {
        if(!userInfo.userName || !userInfo.password){
            Alert.alert('Error','You have to fill all your informations')
            return
        }
        await AsyncStorage.setItem("profile",JSON.stringify(userInfo))
        navigation.navigate('Home')
    }
    
    if(isLoading){
        return <Loading />
    }
    
    return (
        <View className='flex-1 bg-neutral-800 items-center justify-center ' >
            <View>
                <Text className='text-2xl font-semibold' >Welcome To <Text className='text-yellow-500' >M</Text>ovies App</Text>
                <Text className='text-xl underline' >Login</Text>
                <View className='my-4' >
                    <TextInput placeholder='Your Name...'  className='border-[1px] border-yellow-500 rounded-lg p-2 mb-4' onChangeText={(value)=>setUserInfo({...userInfo,userName:value})} />
                    <TextInput secureTextEntry={true} placeholder='Your Password...' className='border-[1px] border-yellow-500 rounded-lg p-2' onChangeText={(value)=>setUserInfo({...userInfo,password:value})} />
                    <TouchableOpacity className='bg-yellow-500 text-white items-center justify-center h-10 my-4 rounded-lg' onPress={handleSubmit} >
                        <Text>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}



export default AuthScreen;
