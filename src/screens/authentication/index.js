import React, {useState, useEffect} from 'react';
import {
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  View,
  StyleSheet,
  Button,
  Alert,
  SafeAreaView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';

const Main = ({navigation, route}) => {
  //all states are defined here
  // const [state, setState] = useState({
  //   loginBtnColor: '',
  //   signupBtnColor: '',
  //   guestBtnColor: '',
  // });
  const [loginBtnColor, setLoginBtnColor] = useState('white');
  const [signupBtnColor, setSignupBtnColor] = useState('white');
  const [guestBtnColor, setGuestBtnColor] = useState('white');
  //all hooks are defined here
  useEffect(() => {
    if (auth().currentUser) {
      auth().currentUser.reload(); //in case user verified his email but he closed the app, so we will reload app to check his verification status
      //this is verified user, its obvious that current cached user had given correct email and password
      //but there is still a loop whole, first time verified user did'nt loged in, and close app, in this case we will still allow him to navigate to Main page
      if (auth().currentUser.emailVerified) {
        console.log('user is moving to main screen catch him');
        navigation.navigate('Main', {
          screen: 'Home',
          params: {
            userName: 'Anonymous',
            picture: './../../res/images/no-image.jpg',
          },
        }); //auth().currentUser will be availabe on all pages of this app
      }
    }
    console.log(
      'User Data from UseEffect of authentication screen: ',
      auth().currentUser,
    );
  }, []);
  //all functions are defined here
  return (
    <View style={styles.container}>
      <View style={styles.btnsContainer}>
        {/* <Text>{loginBtnColor}</Text> */}
        <TouchableOpacity
          style={[styles.btn, {backgroundColor: loginBtnColor}]} //Or if don't want "backgroundColor:" and just need change the text color use => "color:""
          onPress={() => {
            setLoginBtnColor('#42EADDFF');
            setTimeout(() => {
              navigation.navigate('Login');
              setLoginBtnColor('white');
            }, 100);
          }}>
          <View>
            <Text style={[styles.btnText, {fontFamily: 'Fascinate-Regular'}]}>
              Login
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, {backgroundColor: signupBtnColor}]} //Or if don't want "backgroundColor:" and just need change the text color use => "color:""
          onPress={() => {
            setSignupBtnColor('#42EADDFF');
            setTimeout(() => {
              navigation.navigate('Signup');
              setSignupBtnColor('white');
            }, 100);
          }}>
          <View>
            <Text style={styles.btnText}>Sign Up</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, {backgroundColor: guestBtnColor}]} //Or if don't want "backgroundColor:" and just need change the text color use => "color:""
          onPress={() => {
            setGuestBtnColor('#42EADDFF');
            setTimeout(() => {
              navigation.navigate('GuestSearch');
              setGuestBtnColor('white');
            }, 100);
          }}>
          <View>
            <Text style={styles.btnText}>Guest</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008080',
  },
  btnsContainer: {
    flexDirection: 'column', //By default
    justifyContent: 'space-evenly', //Align the items direction-wise
    height: hp('100%'),
    backgroundColor: '#F4F6F6',
    padding: hp('9%'),
    marginLeft: hp('10%'),
    //borderBottomRightRadius: hp('100%'),
    borderBottomLeftRadius: hp('80%'),
    borderTopLeftRadius: hp('100%'),
    //borderTopRightRadius: hp('100%'),
    //overflow: 'hidden',
  },

  btnText: {
    color: '#008080',
    fontSize: 16,
    fontWeight: 'normal',
    //justifyContent:"center",
    //alignItems:"center",
    //OR
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  btn: {
    height: 60,
    width: 160,
    borderWidth: 2,
    //backgroundColor: '',
    borderRadius: 30,
    borderColor: '#42EADDFF',
    justifyContent: 'center',
    alignItems: 'center',
    textTransform: 'uppercase',
    //elevation: 30,
  },
});
export default Main;
