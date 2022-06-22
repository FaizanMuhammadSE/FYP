import React,{useState} from 'react';
import { View, StyleSheet, ScrollView,Image, Text,Pressable,Alert, TouchableHighlight, TouchableOpacity, Button, FlatList } from 'react-native';
import Modal from "react-native-modal";
import {Card} from 'react-native-shadow-cards';
import  Icon  from 'react-native-vector-icons/FontAwesome';
const ModalResult = ({visibleOrNot,closeModal}) => {
    const data=[
                    {name:"Faizan Muhammad",gender:"male",fees:"15000",location:"Lahore"},
                    {name:"Faraz Ali",gender:"male",fees:"18000",location:"Karachi"},
                    {name:"Mehroz Muzaffar",gender:"female",fees:"13000",location:"Quetta"},
                    {name:"Gul Sher Khan",gender:"male",fees:"10000",location:"Okara"},
                    {name:"Ahsan Mehmood",gender:"female",fees:"14000",location:"Multan"},
                    {name:"Kashif Tariq",gender:"male",fees:"17000",location:"Gilgit"},
               ]

    function designItem({item}) {
        //   height parent view is set according to the height of image which is fixed, and other things settle down
        return <View style={{flexDirection:'row', marginBottom:10}}>   
                <Image borderRadius={50} source={require('../../src/res/images/me.png')} style={{height:70,width:70}}/>
                
                {/*Now I want to split this view into further 2 rows of equal space, both will be sum parent height which is according to image height*/}
                <View>
                    <View style={{flex:1,backgroundColor:'yellow'}}> 
                        <Text numberOfLines={1} style={{fontSize:16, textAlign:'center',textAlignVertical:'center',flex:2}}>line 1 alskfjsdlajflskadjflsdkajflsdkaf</Text>
                        <Icon name={item.gender} size={24}></Icon>
                    </View>
                    <View style={{flex:1,backgroundColor:'orange'}}>
                        <Text numberOfLines={1}>line 2 ajfdslfjlajflsadjflsdjfskdlafjlsdajf</Text>
                    </View>
                </View>
            </View>
    }

    return <View>
        <Modal 
        isVisible={visibleOrNot}
        onBackButtonPress={()=>closeModal()}
        >
            <View style={styles.ModalContainer}>
                <Text>I'm working</Text>
                <FlatList
                data={data}
                renderItem={designItem}
                ></FlatList>
            </View>
        </Modal>
    </View>;
}


const styles=StyleSheet.create({
    ModalContainer:{
        flex:1,
        backgroundColor:'snow',
        padding:10,
        borderRadius:20,
        borderWidth:4,
        borderColor:'gray'

    }
})




export default ModalResult;