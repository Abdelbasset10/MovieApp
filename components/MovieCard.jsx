import React from 'react'
import {Text,TouchableWithoutFeedback,Image,Dimensions} from 'react-native'
import { defaultImg, image500 } from '../api/db'
import { useNavigation } from '@react-navigation/native'

const {width,height} = Dimensions.get('window')
const MovieCard = ({item}) => {
  const navigation = useNavigation()
  return (
    <TouchableWithoutFeedback className='rounded-lg' onPress={()=>navigation.navigate('Movie',item)} >
        <Image source={{uri:item?.poster_path ? image500(item.poster_path) : defaultImg}} style={{width:width*0.6,height:height*0.33}} className='rounded-lg' />     
    </TouchableWithoutFeedback>
  )
}

export default MovieCard