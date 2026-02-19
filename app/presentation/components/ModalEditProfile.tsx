import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Pressable, View, Image} from 'react-native';
import {Text} from './Text';
import {AppColors} from "../theme/AppTheme";

interface Props {
    onPress: () => void;
}
const [modalVisible, setModalVisible] = useState(false);


export const PruebaButton=({onPress}:Props)=>{
    return (
       <View>
           <Modal
               animationType="slide"
               transparent={true}
               visible={modalVisible}
               onRequestClose={() => {
                   Alert.alert('Modal has been closed.');
                   setModalVisible(!modalVisible);
               }}>
               <View >
                   <View >
                       <Text >Hello World!</Text>
                       <Pressable

                           onPress={() => setModalVisible(!modalVisible)}>
                           <Text>Hide Modal</Text>
                       </Pressable>
                   </View>
               </View>
           </Modal>
           <Pressable

               onPress={() => setModalVisible(true)}>
               <Image source={require('../../../assets/search.png')}/>
           </Pressable>

       </View>
    )
}

const styles = StyleSheet.create({
    addButton:{
        height:25,
        width:25,
        tintColor:"red",
    },
    cont:{
        backgroundColor:AppColors.buttonBackground,
        position:"absolute",
        right:35,
        bottom:30,
        borderRadius:40,
        marginRight: 50,
        height:70,
        width:70,
        alignItems:"center",
        justifyContent:"center"
    }
});
