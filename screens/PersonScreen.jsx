import { View, Text,ScrollView,Image,Dimensions } from 'react-native'
import React,{useState, useEffect} from 'react'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { HeartIcon } from 'react-native-heroicons/solid'
import { useNavigation, useRoute } from '@react-navigation/native'
import MovieList from '../components/MovieList'
import { defaultImg, fetchPersonDetails, fetchPersonMovies, image342 } from '../api/db'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loading from '../components/Loading'

const {width} = Dimensions.get('window')

export default function PersonScreen() {
    const {params:item} = useRoute()
    const navigation = useNavigation()
    const [isLiked,setIsLiked] = useState(false)
    const [personDetails,setPersonDetails] = useState([])
    const [personMovies,setPersonMovies] = useState([])
    const [isLoading,setIsLoading] = useState(true)

    const getPersonDetails = async (id) => {
        try {
            const data = await fetchPersonDetails(id)
            setPersonDetails(data)
        } catch (error) {
            console.log(error)
            return
        }
    }

    const getPersonMovies = async (id) => {
        try {
            const data = await fetchPersonMovies(id)
            setPersonMovies(data)
        } catch (error) {
            console.log(error)
            return
        }
    }

    useEffect(()=>{
        const getUser = async () => {
            AsyncStorage.getItem("profile").then((value)=>{
                let userData = JSON.parse(value)
                if(!userData.email){
                    return navigation.navigate('Auth')
                }
            }).catch((err)=>{
                console.log(err)
            })
        }
        getUser()
    },[])

    useEffect(()=>{
        getPersonDetails(item?.id)
        getPersonMovies(item?.id)
        setIsLoading(false)
    },[])

    if(isLoading){
        return <Loading />
    }

    return (
        <ScrollView 
        showsVerticalScrollIndicator={false}
        className='flex-1 bg-neutral-900' >
            <View className='w-full px-4  flex-row items-center justify-between  mt-4' >
                <View className='p-1 bg-yellow-500 items-center'>
                    <ChevronLeftIcon color='white' onPress={()=>navigation.goBack()} />
                </View>
                <HeartIcon color={`${isLiked ? 'red' : 'white'}`} size={33} onPress={()=>setIsLiked((prev)=>!prev)} />
            </View>
            <View className='my-8'>
                <View className='mx-auto border-[1px] border-red-800 overflow-hidden w-72 h-72 items-center justify-center rounded-full' >
                    <Image source={{uri:personDetails?.profile_path ? image342(personDetails?.profile_path) : defaultImg}} className='w-full h-full'  />
                </View>
                <Text className='text-center mt-4 text-3xl font-semibold text-white' >{personDetails?.name}</Text>
                <Text className='text-neutral-500 text-center' >{personDetails?.place_of_birth}</Text>
                <View style={{width:width * 0.9}} className='mx-auto p-2 bg-neutral-400 rounded-lg mt-2 flex-row' >
                    <View className='border-r-[1px] border-r-neutral-800 pr-1 mx-2' >
                        <Text className='text-white' >Gender</Text>
                        <Text className='text-neutral-700 text-center' >{personDetails?.gender === 1 ? 'Female' : 'Male'}</Text>
                    </View>
                    <View className='border-r-[1px] border-r-neutral-800 pr-1 mx-2' >
                        <Text className='text-white' >Birthday</Text>
                        <Text className='text-neutral-700 text-center' >{personDetails?.birthday}</Text>
                    </View>
                    <View className='border-r-[1px] border-r-neutral-800 pr-1 mx-2' >
                        <Text className='text-white' >Known for</Text>
                        <Text className='text-neutral-700 text-center' >{personDetails?.known_for_department}</Text>
                    </View>
                    <View className=' mx-2' >
                        <Text className='text-white' >Popularty</Text>
                        <Text className='text-neutral-700 text-center' >{personDetails?.popularity?.toFixed(2)} %</Text>
                    </View>
                </View>
            </View>
            <View className='mx-4' >
                <Text className='text-xl font-semibold' >Biography</Text>
                <Text>{personDetails?.biography}</Text>
            </View>
            {personMovies?.cast?.length > 0 && (
                <MovieList title="Person Movies" hideSeeAll={true} data={personMovies.cast} />
            )}
        </ScrollView>
    )
}