import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../homeScreen/home.js'
import SearchScreen from '../dummy/searchScreen.js'
import ResultScreen from '../dummy/Results.js'
function Home() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' , backgroundColor:'red' }}>
      <Text>Settings Screen Under Construction</Text>
    </View>
  );
}
// function HelpScreen() {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' , backgroundColor:'dodgerblue' }}>
//         <Text>Help Screen Under Construction</Text>
//       </View>
//     );
// }
function SearchScreenTesting() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' , backgroundColor:'green'}}>
        <Text>Help Screen Under Construction</Text>
      </View>
    );
}

const Tab = createBottomTabNavigator();

function BottomTabNav() {
  return (
    <NavigationContainer>
      <Tab.Navigator
       screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            }
            else if (route.name === 'Search') {
                iconName = focused ? 'search-circle' : 'search-circle-outline';
            }
            else if (route.name === 'Help') {
                iconName = focused ? 'help-circle' : 'help-circle-outline';
            }
            else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            // You can return any component that you like here!
            if(focused)
                size=35
            else
                size=25    
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'maroon',
          tabBarInactiveTintColor: 'black',
        })}>

        <Tab.Screen name="Home" component={HomeScreen} options={{headerShown:false,}}/>
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Help" component={ResultScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
        
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default BottomTabNav;