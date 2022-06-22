import React, {useState} from 'react';
import { View, Text, Button,  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../homeScreen/home.js'

function HomeScreen({navigation}) {
  const [Counter, setCounter] = useState(0)
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,backgroundColor:'dodgerblue'}}>
      <Text>Home Screen</Text>
      <Text>{Counter}</Text>
      <Button title='inc' onPress={()=>setCounter(Counter+1)}></Button>
      <Button title='Details Screen' onPress={()=>navigation.navigate('Details')}></Button>
    </View>
  );
}

function DetailsScreen({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button title='Go Back to Home' onPress={()=>navigation.push('Home')}></Button>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function NavigationApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Details" component={DetailsScreen} options={{title:"Detail Menu"}}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{title:"Home Menu",headerTitleAlign:'center',headerTransparent:true}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default NavigationApp;