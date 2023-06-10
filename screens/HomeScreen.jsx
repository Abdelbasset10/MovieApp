import React, {useState, useEffect} from 'react'
import {View,Text, ScrollView,Platform,TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline'
import TrendMovies from '../components/TrendMovies'
import MovieList from '../components/MovieList'
import { useNavigation } from '@react-navigation/native'
import { fetchTopRatedMovies, fetchTrendMovies, fetchUpComingMovies } from '../api/db'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading'

const ios = Platform.OS === "ios"

const HomeScreen = () => {
    const navigation = useNavigation()
    const [trendMovies,setTredMovies] = useState([])
    const [upComingMovies,setUpComingMovies] = useState([])
    const [topRatedMovies,setTopRatedMovies] = useState([])
    const [isLoading,setIsLoading] = useState(true)

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

    const getTrendMovies = async () => {
        try {
            const data = await fetchTrendMovies()                              
                setTredMovies(data) 
        } catch (error) {
            console.log(error)
            return
        }
    }

    const getUpComingMovies = async () => {
        try {
            const data = await fetchUpComingMovies()                              
            setUpComingMovies(data) 
        } catch (error) {
            console.log(error)
            return
        }
    }

    const getUpTopRatedMovies = async () => {
        try {
            const data = await fetchTopRatedMovies()                              
            setTopRatedMovies(data) 
        } catch (error) {
            console.log(error)
            return
        }
    }

    const handleLogOut = async () => {
        await AsyncStorage.removeItem("profile")
        navigation.navigate('Auth')
    }

    useEffect(()=>{
        getTrendMovies()
        getUpComingMovies()
        getUpTopRatedMovies()
        setIsLoading(false)
    },[])
    
    if(isLoading){
        return <Loading />
    }

    return (
    <View className='flex-1 bg-neutral-800'>
        <SafeAreaView className={`${ios ? '-mb-2' : 'mb-3'}`} >
            <View className='mx-4 mt-2 flex-row items-center justify-between' >
                <Text className='text-3xl font-semibold' >
                    <Text className='text-yellow-300' >M</Text>ovies
                </Text>
                <MagnifyingGlassIcon size={30} strokeWidth={2} color='white' onPress={()=>navigation.navigate('Search')} />   
                <TouchableOpacity className='bg-yellow-500 text-white px-2 py-1 rounded-lg' onPress={handleLogOut} >
                    <Text className='text-xl' >Log Out</Text>    
                </TouchableOpacity>   
            </View>
        </SafeAreaView>      
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom:10}}
            >
                {trendMovies?.results?.length > 0 && (
                    <TrendMovies data={trendMovies?.results} />
                )}
                {upComingMovies?.results?.length >0 && (
                    <MovieList title="Upcoming Movies" data={upComingMovies?.results} />
                )}
                {topRatedMovies?.results?.length >0 && (
                    <MovieList title="Top trendMovies" data={topRatedMovies?.results} /> 
                )}
            </ScrollView>
    </View>
    )
}

export default HomeScreen