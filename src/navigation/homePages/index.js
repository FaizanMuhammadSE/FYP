import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../../screens/home/index.js';
//import SearchScreen from '../../screens/search/index.js';
import SearchScreen from '../SearchPage/index.js';
import HelpScreen from '../../screens/help/index.js';
import SettingsScreen from '../../screens/settings/index.js';
const BottomTab = createBottomTabNavigator();

const Index = () => {
  //const {userName, picture} = route.params;

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search-circle' : 'search-circle-outline';
          } else if (route.name === 'Help') {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          // You can return any component that you like here!
          if (focused) size = 35;
          else size = 25;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'black',
        headerShown: false,
      })}>
      <BottomTab.Screen name="Home" component={HomeScreen}></BottomTab.Screen>
      <BottomTab.Screen
        name="Search"
        component={SearchScreen}
        // options={{headerShown: true}}
      ></BottomTab.Screen>
      {/* <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}></BottomTab.Screen>
      <BottomTab.Screen name="Help" component={HelpScreen}></BottomTab.Screen> */}
      {/*<BottomTab.Screen name="Help"></BottomTab.Screen> */}
    </BottomTab.Navigator>
  );
};

export default Index;
