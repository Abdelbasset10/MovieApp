import { View, Text,ScrollView,TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { defaultImg, image185 } from '../api/db'

export default function Cast({data}) {
  const navigation = useNavigation()
  return (
    <View className='my-4 ' >
      <Text className='text-white font-semibold text-xl mx-4' >Top Casts</Text>
      <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{paddingLeft:10,paddingRight:10}}
      >
        {data.map((item,index)=>(
          <TouchableOpacity key={index} className='mx-2' onPress={()=>navigation.navigate('Person',item)} >
            <View>
              <Image source={{uri:item?.profile_path ? image185(item?.profile_path) : defaultImg}} className='w-24 h-24 rounded-full' />
            </View>
            <Text>{item?.character?.length > 10 ? item?.character.slice(0,10) : item?.character}</Text>
            <Text className='w-20' >{item?.original_name?.length > 10 ? item?.original_name.slice(0,10) : item?.original_name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}