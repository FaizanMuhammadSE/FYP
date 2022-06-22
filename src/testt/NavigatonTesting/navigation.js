import React, {useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ScreenA from './screenA.js';
import ScreenB from './screenB.js';
import {TestingContext} from '../../Context/index';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
const NativeStack = createNativeStackNavigator();

const Index = () => {
  const [time, setTime] = useState(Date());
  useEffect(() => {
    setInterval(() => {
      setTime(Date());
    }, 1000);
  }, []);
  useEffect(() => {
    console.log('useEffect of naviagtion screen: ', time);
  }, [time]);
  return (
    <TestingContext.Provider value={{time}}>
      <NavigationContainer>
        <NativeStack.Navigator
          initialRouteName="ScreenA"
          screenOptions={{headerShown: false}}>
          {/* <NativeStack.Screen name="Splash"></NativeStack.Screen>
            <NativeStack.Screen name="Authentication"></NativeStack.Screen>*/}

          {/* Screen named "Main" is itself a "BottomTabNavigator" which will further route to pages */}
          <NativeStack.Screen
            name="ScreenA"
            component={ScreenA}></NativeStack.Screen>
          <NativeStack.Screen
            name="ScreenB"
            component={ScreenB}></NativeStack.Screen>
        </NativeStack.Navigator>
      </NavigationContainer>
      <Toast></Toast>
    </TestingContext.Provider>
  );
};

export default Index;
