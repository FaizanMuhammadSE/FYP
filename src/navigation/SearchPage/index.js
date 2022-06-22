import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const NativeStack = createNativeStackNavigator();
import SearchScreen from '../../screens/guestSearch/index.js';
import ResultsScreen from '../../screens/result/index.js';
import UserDetailsScreen from '../../screens/userDetails/index.js';
const Index = () => {
  return (
    <NativeStack.Navigator
      initialRouteName="Search"
      screenOptions={{headerShown: false}}>
      <NativeStack.Screen
        name="Search"
        component={SearchScreen}
        initialParams={{guestMode: false}}></NativeStack.Screen>
      <NativeStack.Screen
        name="Result"
        component={ResultsScreen}></NativeStack.Screen>
      <NativeStack.Screen
        name="UserDetails"
        component={UserDetailsScreen}></NativeStack.Screen>
    </NativeStack.Navigator>
  );
};

export default Index;
