import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
const Index = ({navigation, route}) => {
  const Height = Dimensions.get('screen').height;
  const Width = Dimensions.get('screen').width;
  useEffect(() => {
    setTimeout(() => navigation.navigate('Authentication'), 1000);
  }, []);
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          borderTopWidth: Height / 2,
          borderBottomWidth: Height / 2,
          borderRightWidth: Width / 2,
          borderLeftWidth: Width / 2,
          borderTopColor: 'white',
          borderBottomColor: 'white',
          borderRightColor: '#384553',
          borderLeftColor: '#384553',
        }}></View>
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}>
        <Image
          source={require('../../res/images/logo.png')}
          style={{borderRadius: 10}}></Image>
      </View>
    </View>
  );
};

export default Index;
