import React,{useState, useEffect} from 'react'
import {View,Text,ScrollView,Image,Dimensions} from 'react-native'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import {HeartIcon} from 'react-native-heroicons/solid'
import Cast from '../components/Cast'
import { useNavigation, useRoute } from '@react-navigation/native'
import MovieList from '../components/MovieList'
import { defaultImg, fetchMovieCredits, fetchMovieDetails, fetchSimilarMovies, image500 } from '../api/db'
import Loading from '../components/Loading'
import AsyncStorage from '@react-native-async-storage/async-storage'

const {width,height} = Dimensions.get('window')

const MovieDetails = () => {
  const {params:item} = useRoute()
  const navigation = useNavigation()
  const [movie,setMovie] = useState({})
  const [similairMovies,setSimilairMovies] = useState({})
  const [credits,setCredits] = useState([])
  const [isLiked,setIsLiked] = useState(false)
  const [isLoading,setIsLoading] = useState(true)

  const getMovieDetails = async (id) => {
    try {
      const data = await fetchMovieDetails(id)
      setMovie(data)
    } catch (error) {
      console.log(error)
      return
    }
  }

  const getMovieCredits = async (id) => {
    try {
      console.log("s")
      const data = await fetchMovieCredits(id)
      setCredits(data)
    } catch (error) {
      console.log(error)
      return
    }
  }

  const getSimilairMovies = async (id) => {
    try {
      const data = await fetchSimilarMovies(id)
      setSimilairMovies(data)
    } catch (error) {
      console.log(error)
      return
    }
  }

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

  useEffect(()=>{
    getMovieDetails(item?.id)
    getMovieCredits(item?.id)
    getSimilairMovies(item?.id)
    setIsLoading(false)
  },[])

  if(isLoading){
    return <Loading />
  }

  return (
    <ScrollView className='bg-neutral-800 flex-1' >
      <View className='absolute z-20 w-full px-4  flex-row items-center justify-between  mt-4' >
        <View className='p-1 bg-yellow-500 items-center'>
          <ChevronLeftIcon color='white' onPress={()=>navigation.goBack()} />
        </View>
        <HeartIcon color={`${isLiked ? 'orange' : 'white'}`} size={33} onPress={()=>setIsLiked((prev)=>!prev)} />
      </View>
      <View>
        <Image source={{uri:movie?.poster_path ? image500(movie?.poster_path) : defaultImg}} style={{width:width,height:height * 0.5}} className='mx-auto' />
      </View>
      <View className='mx-4' >
        <Text className='text-3xl font-semibold text-center' >{movie?.original_title}</Text>
        <Text className='text-center' >{movie?.status} . {movie?.release_date?.split('-')[0]} . {movie?.runtime} mins</Text>
        <View className='flex-row my-2 items-center justify-center' >
          {movie?.genres?.map((g,index)=>(
            <Text key={index} >{g?.name} . </Text>
          ))}
        </View>
        <Text>{movie?.overview}</Text>
      </View>
      {credits?.cast?.length > 0 && (
        <Cast data={credits?.cast} />
      )}
      {similairMovies?.results?.length > 0 && (
        <MovieList title='Similair Movies' hideSeeAll={true} data={similairMovies.results} />
      )} 
    </ScrollView>
  )
}

export default MovieDetails