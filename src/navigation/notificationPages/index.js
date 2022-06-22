import React, {useContext} from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../../screens/home/index.js';
import SearchScreen from '../../screens/search/index.js';
import TeacherNotificationScreen from '../../screens/notifications/teacher.js';
import StudentNotificationScreen from '../../screens/notifications/student.js';
import OtherNotificationScreen from '../../screens/notifications/other.js';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {NotificationsContext} from '../../Context/index.js';
import Toast from 'react-native-toast-message';
const TopTab = createMaterialTopTabNavigator();

function Index({navigation}) {
  const notificationsContext = useContext(NotificationsContext);
  return (
    <>
      <TopTab.Navigator
        screenOptions={({route}) => ({
          // tabBarIcon: ({ focused, color, size }) => {
          //   let iconName;

          //   if (route.name === 'Teacher') {
          //     iconName = focused ? 'home' : 'home-outline';
          //   }
          //   else if (route.name === 'Student') {
          //       iconName = focused ? 'search-circle' : 'search-circle-outline';
          //   }
          //   else if (route.name === 'Other') {
          //       iconName = focused ? 'help-circle' : 'help-circle-outline';
          //   }
          //   // You can return any component that you like here!
          //   if(focused)
          //       size=25
          //   else
          //       size=15
          //   return <Ionicons name={iconName} size={size} color={color} />;
          // },
          tabBarBadge: () => {
            return (
              <Text
                style={{
                  color: 'white',
                  borderRadius: 20,
                  backgroundColor: 'red',
                  padding: 4,
                }}>
                {route.name == 'Teacher'
                  ? notificationsContext.teacherUnread
                  : route.name == 'Student'
                  ? notificationsContext.studentUnread
                  : notificationsContext.teacherOtherUnread +
                    notificationsContext.studentOtherUnread}
              </Text>
            );
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'black',
          headerShown: false,
          tabBarLabelStyle: {elevation: 10, fontSize: 18},
        })}
        initialRouteName="Teacher">
        <TopTab.Screen name="Teacher" component={TeacherNotificationScreen} />
        <TopTab.Screen name="Student" component={StudentNotificationScreen} />
        {/* <TopTab.Screen name="Other" component={OtherNotificationScreen} /> */}
      </TopTab.Navigator>
    </>
  );
}

export default Index;
