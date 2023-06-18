import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/Loading';
import auth from "@react-native-firebase/auth";

const AuthScreen = () => {
    const navigation = useNavigation()
    const [userInfo,setUserInfo] = useState({
        userName:"",
        email:"",
        password:""
    })
    const [isLoading,setIsLoading] = useState(true)
    const [isSignIn,setIsSignIn] = useState(true)

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
        if(isSignIn){
            if(!userInfo.email || !userInfo.password){
                Alert.alert('Error','You have to fill all your informations')
                return
            }
            auth().signInWithEmailAndPassword(userInfo.email,userInfo.password).then((user)=>{
                const userData = user.user
                AsyncStorage.setItem("profile",JSON.stringify(userData)).then(()=>{
                    setUserInfo({
                        userName:"",email:"",password:""
                    })
                    navigation.navigate('Home')})       
            })       
        }else{
            if(!userInfo.userName || !userInfo.email || !userInfo.password){
                Alert.alert('Error','You have to fill all your informations')
                return
            }
            auth().createUserWithEmailAndPassword(userInfo.email,userInfo.password)
            .then((user) => {
                console.log(
                    "Registration Successful. Please Login to proceed"
                );
                
                if (user) {             
                    auth().currentUser.updateProfile({displayName: userInfo.userName})
                    .then(() => {
                        Alert.alert("Register Successfully ! Login Now")
                        setUserInfo({
                            userName:"",email:"",password:""
                        })
                        setIsSignIn(true)})
                    .catch((error) => {
                        console.error(error);
                    });
                }
            })
        }
    }
    
    if(isLoading){
        return <Loading />
    }
    
    return (
        <View className='flex-1 bg-neutral-800 items-center justify-center ' >
            <View>
                <Text className='text-2xl font-semibold' >Welcome To <Text className='text-yellow-500' >M</Text>ovies App</Text>
                <Text className='text-xl underline' >{isSignIn ? "Login" : "Register"}</Text>
                <View className='my-4' >
                    {!isSignIn && (
                        <TextInput placeholder='Your Name...'  className='border-[1px] border-yellow-500 rounded-lg p-2 mb-4' onChangeText={(value)=>setUserInfo({...userInfo,userName:value})} />
                    )}
                    <TextInput placeholder='Your Email...'  className='border-[1px] border-yellow-500 rounded-lg p-2 mb-4' onChangeText={(value)=>setUserInfo({...userInfo,email:value})} />
                    <TextInput secureTextEntry={true} placeholder='Your Password...' className='border-[1px] border-yellow-500 rounded-lg p-2' onChangeText={(value)=>setUserInfo({...userInfo,password:value})} />
                    <TouchableOpacity className='bg-yellow-500 text-white items-center justify-center h-10 my-4 rounded-lg' onPress={handleSubmit} >
                        <Text>{isSignIn ? "Login" : "Register"}</Text>
                    </TouchableOpacity>
                </View>
                <View className='flex-row items-center space-x-2' >
                    <Text className='text-white' >{isSignIn ? "Don't Have Account ?" : "Alreay have account ?"}</Text>
                    <Text className='text-yellow-500 underline ' onPress={()=>setIsSignIn((prev)=>!prev)} >{isSignIn ? "Register" : "Login"}</Text>
                </View>
            </View>
        </View>
    );
}



export default AuthScreen;
