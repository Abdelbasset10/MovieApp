import React from 'react'
import {View, Text,Dimensions} from 'react-native'
import Carousel from 'react-native-snap-carousel';
import MovieCard from './MovieCard';

const {width} = Dimensions.get('window')
const TrendMovies = ({data}) => {
  
  return (
    <View className='mt-8' >
        <Text className='mx-4 text-xl font-semibold'>Trending</Text>
        {data && (
          <Carousel
          data={data}
          renderItem={({item})=> <MovieCard item={item} />}
          firstItem={1}
          sliderWidth={width}
          itemWidth={width * 0.6}
          slideStyle={{display:'flex',alignItems:'center', marginTop:10}}
          />
        )}
    </View>
  )
}

export default TrendMovies