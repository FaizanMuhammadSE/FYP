import React from 'react';
import { View,StyleSheet,Dimensions,Text,Image, TouchableOpacity, TouchableHighlight, ScrollView } from 'react-native';
import  Icon  from 'react-native-vector-icons/FontAwesome';
import  AntDesignIcon  from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import  MaterialIcon  from 'react-native-vector-icons/MaterialCommunityIcons';

import UserAvatar from 'react-native-user-avatar';
import {Card} from 'react-native-shadow-cards';


const home = () => {
    const Height=Dimensions.get("screen").height
    const Width=Dimensions.get("screen").width

    return <View style={styles.container}>
        <ScrollView>
        <View style={styles.background}></View> 
        <View style={styles.contentContainer}>

            <View style={styles.notifyButton}>
                <View style={{flex:1,flexDirection:'row'}}>
                    <AntDesignIcon size={30} color="maroon" name="logout" />
                </View>
                <TouchableOpacity style={{flexDirection:'row-reverse',}}>
                    <Text style={{color:'white',fontWeight:'bold',padding:3,marginBottom:4,backgroundColor:"maroon",borderRadius:8,height:'40%',left:20,zIndex:2,}}>9+</Text>
                    <Ionicons style={{marginRight:0,}} size={40} color="maroon" name="notifications-outline" />
                </TouchableOpacity>
            </View>

            
            <View style={{height:'20%'}}>
                <View style={{alignSelf:'center',borderRadius:50,height:100,width:100,backgroundColor:'purple',elevation:16}}>
                    <TouchableOpacity>
                        <Image borderRadius={50} source={require('../../src/res/images/me.png')} style={{height:100,width:100,}}/>
                    </TouchableOpacity>
                </View>
                <Icon style={{alignSelf:'center',bottom:30,left:30,elevation:16,zIndex:2}} size={30} color="maroon" name="camera" onPress={()=>{alert("Camera clicked")}}/>
            </View>

            <TouchableOpacity style={{height:'20%'}}>
                <View>
                    <Card style={{alignSelf:'center',flexDirection:'row',backgroundColor:'pink',justifyContent:'center',padding:10,}} elevation={20} cornerRadius={20} opacity={0.2}>
                        <Text numberOfLines={1} style={{marginHorizontal:15}}>
                            Faizan Muhammad
                        </Text>
                        <Icon style={{left:0}} size={24} color="maroon" name="eraser" />
                    </Card>
                </View>    
            </TouchableOpacity>


            <TouchableOpacity style={{height:'10%',marginTop:10,elevation:16}}>
                
                    <View style={{height:'100%',width:'60%',alignSelf:'center',backgroundColor:"maroon",borderTopRightRadius:20,borderBottomLeftRadius:20,justifyContent:"center",alignItems:"center",elevation:16,marginTop:0}}>
                    <Text style={{color:"white",fontSize:16}}>Teacher</Text>
                    <Text style={{color:"white",fontSize:16}}>Account</Text>
                    </View>
                    
            </TouchableOpacity>




            <TouchableOpacity style={{height:'10%',marginTop:10,elevation:16}} >
                
                    <View style={{height:'100%',width:'60%',alignSelf:'center',backgroundColor:"maroon",borderTopLeftRadius:20,borderBottomRightRadius:20,justifyContent:"center",alignItems:"center",elevation:20,marginTop:0}}>
                        <Text style={{color:"white",fontSize:16,}}>Student</Text>
                        <Text style={{color:"white",fontSize:16,}}>Account</Text>
                    </View>
                 
            </TouchableOpacity>


            {/* <View style={{flexDirection:'row',borderColor:'pink',borderWidth:3,marginTop:10,height:'10%',justifyContent:'space-evenly'}}>
                <View style={{height:'90%',width:'20%',backgroundColor:"red",borderRadius:70,justifyContent:'center',alignItems:'center'}}>
                    
                    <Icon name='search' color={"white"} size={20}></Icon>
                    
                </View>
                <MaterialIcon name='card-search' size={50} color={"maroon"}>

                </MaterialIcon>
                <MaterialIcon name='card-search-outline' size={50} color={"maroon"}>

                </MaterialIcon>
                <MaterialIcon name='menu' size={50} color={"maroon"}>

                </MaterialIcon>
            </View> */}

            {/* <View style={{flexDirection:'row',justifyContent:'space-evenly',height:'10%',backgroundColor:"blue"}}>
                <TouchableOpacity>
                    <View style={{height:'100%',borderRadius:50,backgroundColor:'maroon'}}>
                         <Text>Search</Text>
                    </View>
                </TouchableOpacity>
            </View> */}


                {/* <Card style={{alignSelf:}}>
                    <Text>I'm a card</Text> 
                </Card> */}

            {/* <View style={styles.avatar.avatarBox}>
                <View style={styles.avatar.image}>
                </View>
                <Text>Hello World</Text>
            </View> */}

            
            {/* <View style={styles.notifyButton}>
                <View style={{borderRadius:8,height:25,width:25,backgroundColor:'#EE3E5B'}}>
                    <Text style={{color:'#410A51',fontWeight:'bold',padding:3}}>9+</Text>
                </View>
                <Icon style={{marginRight:3,}} size={24} color="#EE3E5B" name="bell" />
            </View>
            <Card style={{height:100,width:100,borderRadius:50}}  backgroundColor="yellow" elevation={50} >
               <Image borderRadius={50} source={require('../../images/me.png')} style={{height:100,width:100,}}/>
               <Icon style={{marginRight:3,left:70,bottom:30}} size={24} color="#EE3E5B" name="camera" />
               <View style={{height:100,width:100,backgroundColor:"green"}}></View>
            </Card>

            <Image borderRadius={50} source={require('../../images/me2.jpg')} style={{height:100,width:100}}/>
            <UserAvatar size={200} name="Jane Doe" bgColor="#0000" src="https://dummyimage.com/100x100/000/fff"/> */}
            
        </View>     

        </ScrollView>     
    </View>;
}

const styles=StyleSheet.create({

    container:{
        flex:1,
    },

    background:{
            
      borderTopWidth: Dimensions.get("window").height/2,
      borderBottomWidth: Dimensions.get("window").height/2,
      borderRightWidth: Dimensions.get("window").width/2,
      borderLeftWidth: Dimensions.get("window").width/2,
      borderTopColor:"#b391cf",
      borderBottomColor:"#cf919f",
      borderRightColor:"#b391cf",
      borderLeftColor:"#cf919f"

    },
    contentContainer:{
        position:"absolute",
        height:Dimensions.get("window").height,
        width:Dimensions.get("window").width,
        backgroundColor:"white"
    },
    notifyButton:{
        flexDirection:'row',
        // top:15,
        //right:15,
        //height:100,
        marginTop:10,
        marginLeft:10,
        height:'10%',
        // borderColor:'pink',
        // borderWidth:5,
        
        
    },
    avatar:{
        avatarBox:{
            justifyContent:"center",
            alignItems:"center",
            backgroundColor:"white",
            elevation:10,
            overflow:'visible'
            
        },
        image:{
            height:100,
            width:100,
            
            backgroundColor:"purple",
            elevation:10,
            overflow:'visible'
        },
        camera:{

        }

    }
})
// #endregion
export default home;