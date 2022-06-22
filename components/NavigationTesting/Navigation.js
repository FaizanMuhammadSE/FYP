import React, {useState} from 'react';
import { View, Text, Button, Modal } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import Modal  from 'react-native-modal';
import Home from '../homeScreen/home.js'





const RootStack = createNativeStackNavigator();
const NestedStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();




function ButtonComponent(){
    const navigation = useNavigation();
    return (<Button title="I'm button component nested inside" onPress={()=>navigation.getParent().navigate("CScreen")}>
    </Button>);
}

function NestedScreen1({navigation}) {
    return <View>
    <Text style={{ fontSize: 30 }}>This is the navigation screen#1!</Text>
    <Button
    onPress={()=>navigation.navigate("NScreen2")}
    title="NestedScreen 1"
    />
    {/* <ButtonComponent></ButtonComponent> */}
    </View>
}

function NestedScreen2({navigation}) {
    const [modal, setModal] = useState(false)
    return <View>
    <Text style={{ fontSize: 30 }}>I'm nested screen 2.....</Text>
    <View>
      <Modal animationType='fade' onRequestClose={()=>setModal(false)} visible={modal}>
        <Text style={{fontSize:40,color:'pink'}}>I'm modal</Text>
        <ButtonComponent></ButtonComponent>
          <Text>{String(modal)}</Text>
      </Modal>
        {/* <Modal 
        isVisible={modal}
        onBackButtonPress={()=>setModal(false)}
        style={{backgroundColor:"green",flex:1}}
        swipeDirection="right"
        >
          <ButtonComponent></ButtonComponent>
          <Text>{String(modal)}</Text>
        </Modal> */}
        <Button title='Open Modal' onPress={()=>setModal(true)}></Button>
        <Text>{String(modal)}</Text>
    </View>
    </View>
}
function NestedScreen3({navigation}) {
    return <View>
    <Text style={{ fontSize: 30 }}>I'm nested screen 3!</Text>
    <Button
    onPress={()=>navigation.navigate("Home")}
    title="Click Me"
    />
    <ButtonComponent></ButtonComponent>
    </View>
}
function AnotherHome({navigation}) {
    return <View>
    <Text style={{ fontSize: 30 }}>I'm another home screen 3!</Text>
    <Button
    onPress={()=>navigation.navigate("Home")}
    title="Click Me"
    />
    <ButtonComponent></ButtonComponent>
    </View>
}




function HomeScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30 }}>This is the main home screen!</Text>
        <Button
          onPress={()=>navigation.navigate("BottomTab",{screen:'Help'})}
          title="Click Me"
        />
      </View>
    );
  }

  function CScreen(params) {
    return <Text style={{fontSize:30}}>I'm C screen inside main navigator</Text>
  }


  function Feed(params) {
    return <Text style={{fontSize:30}}>I'm Feed Page</Text>
  }

  function Help(params) {
      const [counter, setCounter] = useState(0)
    return <><Text style={{fontSize:30}}>I'm Help Page {counter}</Text><Button title='Inc Count' onPress={()=>setCounter(counter+1)}></Button></>
  }


  function CustomButton(params) {
      const navigation=useNavigation();
    return <Button title='Feed' onPress={()=>navigation.getParent().navigate("CScreen")}></Button>
  }
  function Settings({navigation}) {
    return <><Text style={{fontSize:30}}>I'm Settings Page</Text><CustomButton></CustomButton></>;
  }

  function MyTabs({navigator}) {
    return (
      <Tab.Navigator initialRouteName='Feed' backBehavior='history'>
        <Tab.Screen name="Feed" component={Feed} options={{title:"Feeding",backgroundColor:'pink'}}/>
        <Tab.Screen name="Help" component={Help} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    );
  }

  function DetailsScreen({navigation}) {
    return (
        <NestedStack.Navigator>
            <NestedStack.Screen name='NScreen1' component={NestedScreen1}></NestedStack.Screen>
            <NestedStack.Screen name='NScreen2' component={NestedScreen2}></NestedStack.Screen>
            <NestedStack.Screen name='NScreen3' component={NestedScreen3}></NestedStack.Screen>
            <NestedStack.Screen name='AnotherHome' component={AnotherHome}></NestedStack.Screen>
        </NestedStack.Navigator>
    );
  }
  



  function MainScreen({navigation}){

    const [modalVisibility, setModalVisibility] = useState(false)

    return <View>
          <Text style={{ fontSize: 25 }}>I'm Main Screen...</Text>
          <Text>{String(modalVisibility)}</Text>
          <Button title='Show Modal' onPress={()=>setModalVisibility(true)} ></Button>


          <Modal visible={modalVisibility} onRequestClose={()=>setModalVisibility(false)}>
            <Text>I'm modal with visiblility {String(modalVisibility)}</Text>
            <Button title='Go to Feed' onPress={()=>navigation.navigate('FeedScreen')}></Button>
          </Modal>
        
    </View>
    
  }

  function FeedScreen({navigation}) {
    return <View>
      <Button title='Go to Main' onPress={()=>navigation.navigate("MainScreen")}></Button>
    </View>
  }

  function RootStackScreen() {
    return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName='Home'>

  
          <RootStack.Screen name="Home" component={HomeScreen} />
          <RootStack.Screen name="Details" component={DetailsScreen} />
          <RootStack.Screen name="BottomTab" component={MyTabs} />
          <RootStack.Screen name="CScreen" component={CScreen} />

          <RootStack.Screen name="MainScreen" component={MainScreen}/>
          <RootStack.Screen name="FeedScreen" component={FeedScreen}/>

 
      </RootStack.Navigator>
    </NavigationContainer>
    );
}




export default RootStackScreen;