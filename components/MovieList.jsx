import { useNavigation } from '@react-navigation/native'
import React from 'react'
import {View,Text,ScrollView,TouchableWithoutFeedback,Image,Dimensions} from 'react-native'
import { defaultImg, image342, image500 } from '../api/db'

const {width,height} = Dimensions.get('window')

const MovieList = ({title,data,hideSeeAll}) => {
    const navigation = useNavigation()
    return (
        <View className='my-8' >
            <View className='flex-row justify-between items-center mx-4 mb-4' >
                <Text className='text-xl font-semibold ' >{title}</Text>
                {!hideSeeAll && (
                    <Text className='text-yellow-500 text-xl' >See All</Text>
                )}
            </View>
            <ScrollView
            horizontal
            contentContainerStyle={{paddingHorizontal:15}}
            >
                {data?.map((item,index)=>{
                    return (
                        <TouchableWithoutFeedback key={index} onPress={()=>navigation.push('Movie',item)} >
                            <View className='mr-2 rounded-lg' >
                                <View>
                                    <Image
                                        source={{uri:item?.poster_path ? image342(item.poster_path) : defaultImg}}
                                        style={{width:width*0.33,height:height*0.22}}
                                        className='rounded-lg' />
                                </View>  
                                <Text className='w-24' >{item?.title?.length> 10 ? `${item.title.slice(0,10)}...` : item.title}</Text>
                            </View>         
                        </TouchableWithoutFeedback>
                    )
                })}
            </ScrollView>
        </View>
    )
}

export default MovieList