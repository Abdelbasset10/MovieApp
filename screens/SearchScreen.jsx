import { useNavigation } from '@react-navigation/native';
import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, SafeAreaView, TextInput,ScrollView,TouchableOpacity, Image, Dimensions} from 'react-native';
import {XMarkIcon} from 'react-native-heroicons/outline'
import {debounce} from 'lodash'
import { defaultImg, image342, searchMovies } from '../api/db';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width,height} = Dimensions.get('window')
const SearchScreen = () => {
    const navigation = useNavigation()
    const [results,setResults] = useState([])

    const handleChange = (value) =>{
        if(value && value.length > 2){
            searchMovies({
                query:value,
                include_adult: 'false',
                language: 'en-US',
                page: '1'
            }).then((data)=>{
                if(data?.results?.length > 0){
                    setResults(data.results)
                }else{
                    setResults([])
                }
            }).catch((err)=>{
                console.log(err)
                setResults([])
            })
        }
    }

    const handleSearch = useCallback(debounce(handleChange,400),[])

    useEffect(()=>{
        const getUser = async () => {
            AsyncStorage.getItem("profile").then((value)=>{
                let userData = JSON.parse(value)
                if(!userData.userName){
                    return navigation.navigate('Auth')
                }
            }).catch((err)=>{
                console.log(err)
            })
        }
        getUser()
    },[])

    return (
        <SafeAreaView className='flex-1 bg-neutral-800' >
            <View className='mx-4 mt-4' >
                <View className='border-[1px] border-white flex-row rounded-lg justify-between items-center' >
                    <TextInput placeholder='Search Movie...' className='p-2' onChangeText={handleSearch} />
                    <View className='p-2 items-center bg-neutral-500 w-10 rounded-full'>
                        <XMarkIcon size={25} color='white' onPress={()=>navigation.navigate('Home')} />
                    </View>
                </View>
                {results.length === 0 ? (
                    <Text className='mt-4 text-xl ' >No Results...</Text>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false} >
                        <Text className='text-xl font-semibold my-4' >Results : ({results.length})</Text>
                        <View className='flex-row flex-wrap' >
                            {results?.map((item,index)=>(
                                    <TouchableOpacity key={index} className='mx-2 mb-4' onPress={()=>navigation.navigate('Movie',item)}>
                                        <Image source={{uri:item?.poster_path ? image342(item?.poster_path) : defaultImg}} style={{width:width * 0.4,height:height * 0.4}}  />
                                        <Text>{item?.title?.length > 10 ? `${item?.title?.slice(0,10)}...`:item?.title}</Text>
                                    </TouchableOpacity>
                                ))}
                        </View>            
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
}

export default SearchScreen;
