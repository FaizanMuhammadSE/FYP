import React from 'react';
import {useState, useEffect} from 'react';
import {
  StatusBar,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  View,
  StyleSheet,
  ScrollView,
  Button,
  Modal,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
//import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import OutlineInput from 'react-native-outline-input';
import AwesomeAlert from 'react-native-awesome-alerts';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import * as RNFS from 'react-native-fs';
//const fileHandler = require('fs');
GoogleSignin.configure({
  webClientId:
    '1060621772973-7t2feq1j454br2ve5r0qs92k7dl2i7mb.apps.googleusercontent.com',
  androidClientId:
    '1060621772973 - t5rkri716lh4r73a5t1cu2etribekpl6.apps.googleusercontent.com',
});
const Signup = ({navigation}) => {
  //all states are defined here
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signUpBtnColor, setSignupBtnColor] = useState('#D5DBDB');
  //----------these states are related to alertDialog----------//
  const [alertText, setAlertText] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [moveToLoginPage, setMoveToLoginPage] = useState(false);
  //----------------------------------------------------------//
  //const [value, setValue] = useState(null);
  //all hooks are defined here
  useEffect(() => {}, []);
  //all helper functions are defined here

  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices(); //checking either user has google play services installed if not then user will be prompted with a modal by default
      // Get the users ID token
      const googleAccountDetails = await GoogleSignin.signIn();
      //console.log('Google Account Credentials:', googleAccountDetails);
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(
        googleAccountDetails.idToken,
      );
      //console.log('Google Credentials:', googleCredential);
      const noOfMethods = await auth().fetchSignInMethodsForEmail(
        googleAccountDetails.user.email,
      ); //checking either someone already registered with this email
      //lenght==0 means there is no signin mehtod for provided email which elaborates that user is new
      if (noOfMethods.length == 0) {
        //means previously no one is registered with this account
        // Sign-in the user with the credential
        try {
          const user = await auth().signInWithCredential(googleCredential);
          //promise resolved succesfully
          console.log(
            'Signed in with Google!',
            user.additionalUserInfo.profile.given_name,
          );
          //before navigation to Main Page store this user in txtfile as new user
          //addUserToLocalStorage(auth().currentUser.uid);
          navigation.navigate('Main', {
            screen: 'Home',
            params: {
              userName: user.additionalUserInfo.profile.given_name,
              picture: './../../res/images/no-image.jpg',
            },
          });
        } catch (error) {
          //promise rejected
          setAlertText(error.message);
          setShowAlert(true);
        }
      } else {
        //console.log(googleAccountDetails.user.email);
        setAlertText(
          `Someone is already registered with this email ${googleAccountDetails.user.email}, you should try to register with another email.`,
        );
        setShowAlert(true);
        GoogleSignin.signOut(); //it will allow user to select another google account, otherwise previous account will be selected by default
      }
    } catch (error) {
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        //user is already prompted with modal to install by default
      }
    }
  }
  const createUser = async () => {
    //
    if (
      email == null ||
      password == null ||
      email.length == 0 ||
      password.length == 0
    ) {
      setAlertText('Empty fields are not allowed!');
      setShowAlert(true);
      return;
    }
    try {
      const res = await auth().createUserWithEmailAndPassword(email, password);
      //console.log('User account created & signed in!', res);
      //console.log('USER DETAILS THROUGH AUTH: ', auth().currentUser);
      auth()
        .currentUser.sendEmailVerification()
        .then(
          () => {
            // console.log(
            //   'We have sent you email on provided email address, go and check it out',
            // );
            setAlertText(
              'Verification link is sent to your provided email address, open it and complete your verification step. Then go to SignIn Page and Login with your credentials',
            );
            //enabling Move to login Page button on alert dialog
            setMoveToLoginPage(true); //verification mail is sent, so navigate user to the login page
          },
          error => setAlertText(error.message),
        );
      setShowAlert(true);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      } else console.error(error);
      console.log('Code', error.code);
      console.log('msg: ', error.message);
      setAlertText(error.message);
      setShowAlert(true);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.triangleContainer}></View>
        <ScrollView>
          {/* <Button
            title="SignOut"
            onPress={() => {
              const signout = async () => {
                //this code is working perfectly
                //console.log('current user: ', auth().currentUser);
                await auth().signOut(); //it will remove current user present in auth, either that user was logged in through Google or Email/Password
                //console.log('Current User Status: ', auth().currentUser);
                await GoogleSignin.signOut(); //If we will not signOut from there then next time, it will automatically select already selected user and will not give pop-up
                //console.log('Signout from google also now agian login');
              };
              signout();
              // GoogleSignin.signOut().then(
              //   console.log('user signed out: ', auth().currentUser),
              // );
            }}></Button> */}
          <View style={styles.formContainer}>
            {/* <Text>{value}</Text> */}
            <View style={styles.textInput}>
              <OutlineInput
                value={email}
                onChangeText={e => setEmail(e)}
                label="Email"
                activeValueColor="black"
                activeBorderColor="#42EADDFF"
                activeLabelColor="teal"
                passiveBorderColor="#B2BABB"
                passiveLabelColor="#B2BABB"
                passiveValueColor="#B2BABB"
              />
            </View>
            <View style={[styles.textInput, {marginTop: 10}]}>
              <OutlineInput
                secureTextEntry={isSecureTextEntry ? true : false}
                value={password}
                onChangeText={e => setPassword(e)}
                label="Password"
                activeValueColor="black"
                activeBorderColor="#42EADDFF"
                activeLabelColor="teal"
                passiveBorderColor="#B2BABB"
                passiveLabelColor="#B2BABB"
                passiveValueColor="#B2BABB"
              />
              <TouchableOpacity
                style={{bottom: 40, left: 270}}
                onPress={() => setIsSecureTextEntry(!isSecureTextEntry)}>
                <FontAwesome
                  name={isSecureTextEntry ? 'eye-slash' : 'eye'}
                  color="gray"
                  size={25}
                  paddingHorizontal="12%"
                />
              </TouchableOpacity>
            </View>
            {password?.length > 0 && password?.length < 6 ? (
              <Text style={[styles.textInput, {color: 'red'}]}>
                Password should have atleast 6 characters
              </Text>
            ) : null}
            <View>
              <TouchableOpacity
                style={[
                  styles.btn,
                  {
                    backgroundColor:
                      password.length > 5 &&
                      email.length > 0 &&
                      email.includes('@') &&
                      email.includes('.')
                        ? '#42EADDFF'
                        : 'lightgray',
                  },
                ]} //Or if don't want "backgroundColor:" and just need change the text color use => "color:""
                onPress={() => {
                  //setState({btnColor: '#42EADDFF'});
                  // setTimeout(() => {
                  //   navigation.navigate('Main');
                  //   setState({
                  //     btnColor: '#D5DBDB',
                  //     //googleBtnColor: '#D5DBDB',
                  //   });
                  // }, 100);

                  //console.log('function triggered');

                  createUser();

                  //token => console.log('user id token: ', token),
                  //err =>
                }}>
                <View>
                  <Text style={styles.btnText}>Sign up</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text
              style={{color: '#42EADDFF', marginHorizontal: 50, marginTop: 10}}>
              ------------------------------OR------------------------------
            </Text>

            <View style={[styles.btn, {marginVertical: 20}]}>
              <FontAwesome.Button
                name="google"
                backgroundColor="#58D68D"
                paddingHorizontal="20%"
                onPress={() => onGoogleButtonPress()}>
                <Text style={[styles.btnText, {padding: 2}]}>
                  Signup with Google
                </Text>
              </FontAwesome.Button>
            </View>

            <View style={styles.signinCont}>
              <Text style={styles.signinText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.btnSignin}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <AwesomeAlert
        show={showAlert}
        //showProgress={false}
        title="Alert"
        message={alertText}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={moveToLoginPage} //this button will be enabled when user detials are correct and verification email has sent
        showConfirmButton={true} //this button will always enabled
        cancelText="Login Page"
        confirmText="OK"
        confirmButtonColor="#DD6B55"
        cancelButtonColor="teal"
        onCancelPressed={() => {
          setMoveToLoginPage(false); //disabling it so that when user come back to screen by pressing back button then it should be false
          setShowAlert(false);
          navigation.navigate('Login');
          //navigation.navigate("login");
          // auth().currentUser.sendEmailVerification().then(
          //   ()=>{
          //     setAlertText("Verification Email Sent!");
          //     setShowAlert(true);
          //   })
        }}
        onConfirmPressed={() => {
          setMoveToLoginPage(false);
          setShowAlert(false);
          // console.log('after closing alert');
          // if (moveToLoginPage) {
          //   setMoveToLoginPage(false);
          //   console.log("inside function")
          // }
          // console.log("outside function");
        }}></AwesomeAlert>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F6',
    //alignContent: 'center',
    //justifyContent: 'center',
    //marginLeft: 50,
  },
  triangleContainer: {
    flex: 1,

    height: 0,
    width: 0,

    borderTopWidth: 180,
    borderTopColor: '#008080',
    borderStyle: 'solid',

    borderRightWidth: 300,
    //borderStyle: 'solid',
    borderLeftColor: 'transparent',

    borderRightWidth: 120,
    //borderStyle: 'solid',
    borderRightColor: 'transparent',
  },
  formContainer: {
    flex: 19,
    //justifyContent: 'center',
    //alignItems: 'center',
    //textAlign: 'center',
  },
  textBox: {
    //width: 320,
    backgroundColor: '#B2BABB',
    marginVertical: 10,
    marginHorizontal: 20,

    borderRadius: 25,
    //borderWidth: 2,
    //fontSize: 20,
    //borderColor: 'pink',
  },
  textInput: {
    fontSize: 16,
    paddingHorizontal: 25,
  },
  btn: {
    //width: 320,
    //borderWidth: 2,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 25,
    //backgroundColor: '#800000',
  },
  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    textTransform: 'uppercase',
    padding: 12,
  },
  signinCont: {
    //marginHorizontal: 70,
    marginVertical: hp('5%'),
    flexGrow: 1,
    flexDirection: 'row',
    //alignItems: 'flex-end',
    justifyContent: 'center',
  },
  signinText: {
    color: '#42EADDFF',
    fontSize: 16,
  },
  btnSignin: {
    color: 'teal',
    fontSize: 18,
    fontWeight: 'normal',
    //textTransform: 'uppercase',
  },
});
export default Signup;
