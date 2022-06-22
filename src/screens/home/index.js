import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  Vibration,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import Dialog from 'react-native-dialog';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserAvatar from 'react-native-user-avatar';
import {Card} from 'react-native-shadow-cards';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import MapboxGL from '@react-native-mapbox-gl/maps';
import RNLocation from 'react-native-location';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {NotificationsContext} from '../../Context';
import RNBeep from 'react-native-a-beep';

import * as RNFS from 'react-native-fs';
const fileHandler = require('fs');

// Import Image Picker
// import ImagePicker from 'react-native-image-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {receiveMessageOnPort} from 'worker_threads';

MapboxGL.setAccessToken(
  'sk.eyJ1IjoiZmFpemFubXVoYW1tYWQiLCJhIjoiY2wxZDNpejAwMGR3dzNpbnJ4eGcyN25zcyJ9.0cGcYbGcksjg51diWhv7sg',
);
RNLocation.configure({
  distanceFilter: null,
});

const Index = ({navigation, route}) => {
  const Height = Dimensions.get('screen').height;
  const Width = Dimensions.get('screen').width;
  const [filePath, setFilePath] = useState('./../../res/images/no-image.jpg');
  const [showModal, setShowModal] = useState(false);
  const [logout, setLogout] = useState(false);
  const [nameModal, showNameModal] = useState(false);
  const [name, setName] = useState('');
  const [tempName, setTempName] = useState('');
  const [imageModal, setImageModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(false);
  //states for map
  const [coordinates, setCoordiantes] = useState([
    74.30802498247266, 31.57333670552373,
  ]); //[longitude,latitude] //by-default value given for initializing maps
  const [address, setAddress] = useState('Here is your location...');
  const {userName, picture} = route.params; //these parameters are navigated to this screen
  // const messages = useRef({});
  const notificationsContext = useContext(NotificationsContext);

  const manageLocation = location => {
    firestore()
      .collection('teachers')
      .doc(getUserId())
      .update({
        longitude: location.longitude,
        latitude: location.latitude,
      })
      .then(console.log('Location set in teacher account'));

    firestore()
      .collection('students')
      .doc(getUserId())
      .update({
        longitude: location.longitude,
        latitude: location.latitude,
      })
      .then(console.log('Location set in student account'));
    getAddressUsingMapboxApi(location.longitude, location.latitude); //address state will be set in this func
    setCoordiantes([location.longitude, location.latitude]);
  };
  const permissionHandle = async () => {
    //console.log('At Start of function');

    //checking permission, Is permission already given
    let permission = await RNLocation.checkPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'coarse', // or 'fine'
      },
    });

    //console.log('Permission Status before extracting location: ' + permission);

    let location;

    //if permission not given, then try to take permission
    if (!permission) {
      // console.log('Inside Permission taking block');
      permission = await RNLocation.requestPermission({
        ios: 'whenInUse',
        android: {
          detail: 'coarse',
          rationale: {
            title: 'We need to access your location',
            message: 'We use your location to find best match for you',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        },
      });

      //console.log('Status after asking for permission: ' + permission);
    }

    //if permission given then, then ask for turning on location, and get coordinates, if location enabled

    if (permission) {
      let data;
      try {
        data = await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        });

        //console.log('Location Enabled: ', data);
      } catch (error) {}

      if (data == 'already-enabled' || data == 'enabled') {
        //console.log('before getting location', location);
        location = await RNLocation.getLatestLocation({timeout: 60000});
        //console.log('In between: ', location);
        //location = await RNLocation.getLatestLocation({timeout: 1000});
        //console.log('after 2nd Call: ', location);
        console.log(
          'hERE is location object: ',
          location,
          // location.longitude,
          // location.latitude,
          // location.timestamp,
        );

        if (location) {
          manageLocation(location);
        }
      }
    }
  };
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      // videoQuality: 'low',
      //durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        //console.log('Response = ', response);

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        setFilePath(response.assets[0].uri);
      });
    }
  };

  const chooseFile = type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, response => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      //console.log('File path is this: ', response);
      setFilePath(response.assets[0].uri);
    }).catch(error => console.log('Image library promise rejected'));
  };

  const getUserId = () => {
    //in-progress
    return auth().currentUser.uid;
  };

  const getAddressUsingMapboxApi = (longitude, latitude) => {
    fetch(
      'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
        longitude +
        ', ' +
        latitude +
        '.json?access_token=' +
        'sk.eyJ1IjoiZmFpemFubXVoYW1tYWQiLCJhIjoiY2wxZDNpejAwMGR3dzNpbnJ4eGcyN25zcyJ9.0cGcYbGcksjg51diWhv7sg',
    )
      .then(response => response.json())
      .then(result => {
        //console.log(result.features[0].place_name);
        //setting state
        setAddress(result.features[0].place_name);
      })
      .catch(err =>
        console.log('Error ecnounterd while making Api call:', err),
      );
  };

  const initializeLongitudeAndLatitudeValues = async () => {
    //if (address != 'Here is your location...') return; //values are already initialized
    const result = await firestore()
      .collection('teachers')
      .doc(getUserId())
      .get();
    let values = result.data();
    //set states after fetching data from database...
    if (values.longitude != undefined) {
      getAddressUsingMapboxApi(values.longitude, values.latitude);
      setCoordiantes([values.longitude, values.latitude]);
      //console.log('Initialization of long and lat is done');
    }
  };
  const checkingFirstVisitAndSettingAccount = async () => {
    try {
      const userData = await firestore()
        .collection('teachers')
        .doc(getUserId())
        .get();
      if (userData.exists) {
        //console.log('user already exists, msg by useEffect');
        //user exists so get name and image from database
        //messages = userData.data().messages; //these messages will be required in teacherAccount during handling notifications
        try {
          const avatarUrl = await storage()
            .ref(getUserId() + '/dp')
            .getDownloadURL();
          //console.log('image is downloaded:', avatarUrl);
          setFilePath(avatarUrl); //filePath set
          //console.log('Url of your image: ', avatarUrl);
        } catch (error) {
          console.log('some error came: ', error.code);
          //if(avatarUrl not exists then put static file in setFilePath not avatarUrl)
          if (error.code == 'storage/object-not-found') {
            setFilePath('./../../res/images/no-image.jpg');
          }
        }
        //console.log('user name is : ', userData.data().name);
        setName(userData.data().name); //name set
        //console.log('user data:', userData.name);
      } else {
        //user not exist so set name and image to database
        //console.log('user not exist in database, lets save it');
        await firestore()
          .collection('teachers')
          .doc(getUserId())
          .set({name: userName});
        //name will also updated in student account, because data is updated
        await firestore()
          .collection('students')
          .doc(getUserId())
          .set({name: userName});

        //image will be uploaded by filePath useEffect on setting image state
        setName(userName);
        setFilePath(picture);
      }
    } catch (error) {
      err => console.log('Document Reference Error:', err);
    }
  };
  const deleteImage = async () => {
    const fileName = getUserId() + '/' + 'dp';
    const reference = storage().ref(fileName);
    //console.log('Checking filePath in useEffect:', filePath);
    try {
      await reference.delete();
      setFilePath('./../../res/images/no-image.jpg');
    } catch (error) {
      console.log('Errorm: ', error.code, error.message);
    }
  };
  function resetNotificationStates() {
    notificationsContext.setTeacher([]);
    notificationsContext.setStudent([]);
    notificationsContext.setTeacherOther([]);
    notificationsContext.setStudentOther([]);
    notificationsContext.setTeacherUnread(0);
    notificationsContext.setStudentUnread(0);
    notificationsContext.setTeacherOtherUnread(0);
    notificationsContext.setStudentOtherUnread(0);
  }
  function teacherCallback(DocumentSnapshot) {
    console.log('Got Teacher collection result.', DocumentSnapshot);

    if (DocumentSnapshot._exists == false) return;
    // console.log(
    //   'Status returned by document snapshot: ',
    //   DocumentSnapshot.data().messages,
    //   DocumentSnapshot._exists,
    // );
    let receivedMessages =
      DocumentSnapshot._data.messages != undefined
        ? DocumentSnapshot._data.messages
        : undefined;
    console.log(
      'These messages are received by teacher listener:',
      receivedMessages,
    );
    if (
      receivedMessages == undefined ||
      receivedMessages == null ||
      receivedMessages == false
    )
      return;
    //just run script/code if new record is added in messages field
    let keys = Object.keys(receivedMessages);
    //length-1 means I'm extracting that redundant entry(with key "current") in object
    let keysLength = keys.length;
    if (keys.includes('current') != -1) keysLength--;
    console.log(
      'lengths comparison: ',
      keysLength,
      notificationsContext.teacher.length +
        notificationsContext.teacherOther.length,
    );

    let tempTeacher = [];
    let tempTeacherOther = [];
    let tempTeacherUnread = 0;
    let tempTeacherOtherUnread = 0;
    keys.forEach(key => {
      console.log('this is key', key, receivedMessages[key]['type']);
      if (key == 'current') return;
      if (receivedMessages[key]['type'] == 'normal') {
        tempTeacher.push({...receivedMessages[key], id: key});
        if (receivedMessages[key]['status'] == true) tempTeacherUnread++;
      } else {
        tempTeacherOther.push({...receivedMessages[key], id: key});
        if (receivedMessages[key]['status'] == true) tempTeacherOtherUnread++;
      }
    });
    //messages
    // if (
    //   keysLength !=
    //   notificationsContext.teacher.length +
    //     notificationsContext.teacherOther.length
    // ) {
    notificationsContext.setTeacher(tempTeacher);
    notificationsContext.setTeacherOther(tempTeacherOther);
    ///} else {
    //  console.log('just status changed so no need to update data');
    //}
    //count of unread messages
    notificationsContext.setTeacherUnread(tempTeacherUnread);
    notificationsContext.setTeacherOtherUnread(tempTeacherOtherUnread);
    if (tempTeacherUnread) {
      RNBeep.beep();
      Vibration.vibrate(1000);
    }
    // } else {
    //   console.log('else is running no state is updated');
    // }
  }
  function studentCallback(DocumentSnapshot) {
    console.log('Got Student collection result.');
    if (DocumentSnapshot._exists == false) return;
    let receivedMessages =
      DocumentSnapshot._data.messages != undefined
        ? DocumentSnapshot._data.messages
        : undefined;
    console.log(
      'These messages are received by student listener:',
      receivedMessages,
    );
    //just run script/code if new record is added in messages field
    if (
      receivedMessages == undefined ||
      receivedMessages == null ||
      receivedMessages == false
    )
      return;
    let keys = Object.keys(receivedMessages);
    //length-1 means I'm extracting that redundant entry(with key "current") in object
    let keysLength = keys.length;
    if (keys.includes('current') != -1) keysLength--;
    console.log(
      'lengths comparison: ',
      keysLength,
      notificationsContext.student.length +
        notificationsContext.studentOther.length,
    );

    let tempStudent = [];
    let tempStudentOther = [];
    let tempStudentUnread = 0;
    let tempStudentOtherUnread = 0;
    keys.forEach(key => {
      if (key == 'current') return;
      if (receivedMessages[key]['type'] == 'normal') {
        tempStudent.push({...receivedMessages[key], id: key});
        if (receivedMessages[key]['status'] == true) tempStudentUnread++;
      } else {
        tempStudentOther.push({...receivedMessages[key], id: key});
        if (receivedMessages[key]['status'] == true) tempStudentOtherUnread++;
      }
    });
    // if (
    //   keysLength !=
    //   notificationsContext.student.length +
    //     notificationsContext.studentOther.length
    // ) {
    notificationsContext.setStudent(tempStudent);
    notificationsContext.setStudentOther(tempStudentOther);
    //}
    notificationsContext.setStudentUnread(tempStudentUnread);
    notificationsContext.setStudentOtherUnread(tempStudentOtherUnread);
    if (tempStudentUnread) {
      RNBeep.beep();
      Vibration.vibrate(1000);
    }
  }
  useEffect(() => {
    const teacherSubscriber = firestore()
      .collection('teachers')
      .doc(auth().currentUser.uid)
      .onSnapshot(teacherCallback, () => {
        console.log('Error with teacher listener');
      });
    const studentSubscriber = firestore()
      .collection('students')
      .doc(auth().currentUser.uid)
      .onSnapshot(studentCallback, () => {
        console.log('Error with student listener');
      });
    return () => {
      teacherSubscriber();
      studentSubscriber();
    };
  }, []);

  useEffect(() => {
    //console.log('useEffect one', filePath);
    //console.log('Routing Values to the HOme screen:', userName, picture);
    checkingFirstVisitAndSettingAccount();
    //extracting image from database
    // storage()
    //   .ref(getUserId() + '/dp')
    //   .getDownloadURL()
    //   .then(url => {
    //     console.log('URL is:', url);
    //     setFilePath(url); //setting this state will run useEffect associated with filePath and will upload image uselessly but thats fine
    //   })
    //   .catch(err => console.log('Err WHILE getting url:', err.code));
    //
    // RNFS.exists('../../res/local_storage.txt').then(status =>
    //   console.log(status),
    //);
  }, []);

  //it will run on componentDidMount and whenever image is changed by user, we will update it in database
  useEffect(() => {
    //console.log('useEffect two filePath listener:', filePath);
    //if filePath is empty then no need to upload on firebase, return from this useEffect right now
    //also don't upload static file to firebase
    if (
      filePath != '' &&
      filePath.includes('http') == false &&
      filePath.includes('./../../res/images/no-image.jpg') == false
    ) {
      //console.log('Runnig filePath useEffect', filePath);
      const fileName = getUserId() + '/' + 'dp';
      const reference = storage().ref(fileName);
      //console.log('Checking filePath in useEffect:', filePath);
      const task = reference.putFile(filePath);
      task.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        );
      });
      task
        .then(() => {
          console.log('Image uploaded to the bucket!');
        })
        .catch(error => console.log('image not uploaded to storage', error));
    } else {
      // console.log(
      //   'useEffect cancel uploading image because image is already belongs to remote',
      // );
    }
  }, [filePath]);
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.background}></View>
        <View style={styles.contentContainer}>
          <View style={styles.notifyButton}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() =>
                  //navigation.getParent().navigate('Authentication')
                  setLogout(true)
                }>
                <AntDesignIcon size={30} color="teal" name="logout" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{flexDirection: 'row-reverse'}}
              onPress={() => navigation.getParent().navigate('Notification')}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  padding: 3,
                  marginBottom: 4,
                  backgroundColor: 'red',
                  borderRadius: 8,
                  height: '40%',
                  left: 20,
                  zIndex: 2,
                }}>
                {notificationsContext.teacherUnread +
                  notificationsContext.teacherOtherUnread +
                  notificationsContext.studentUnread +
                  notificationsContext.studentOtherUnread <=
                9
                  ? notificationsContext.teacherUnread +
                    notificationsContext.teacherOtherUnread +
                    notificationsContext.studentUnread +
                    notificationsContext.studentOtherUnread
                  : '9+'}
              </Text>
              <Ionicons
                style={{marginRight: 0}}
                size={40}
                color="#42EADDFF"
                name="notifications-outline"
              />
            </TouchableOpacity>
          </View>

          <View style={{height: '20%'}}>
            <View
              style={{
                alignSelf: 'center',
                borderRadius: 50,
                height: 100,
                width: 100,
                backgroundColor: 'white',
                elevation: 16,
              }}>
              <TouchableOpacity onPress={() => setImagePreview(true)}>
                <Image
                  borderRadius={50}
                  source={
                    filePath.includes('http') || filePath.includes('file:')
                      ? {uri: filePath}
                      : require('./../../res/images/no-image.jpg')
                    // filePath.length == 0
                    //   ? require('../../res/images/no-image.jpg')
                    //   : {uri: filePath}
                  }
                  style={{height: 100, width: 100}}
                />
              </TouchableOpacity>
            </View>
            <Icon
              style={{
                alignSelf: 'center',
                bottom: 30,
                left: 30,
                elevation: 16,
                zIndex: 2,
              }}
              size={30}
              color="#42EADDFF"
              name="camera"
              onPress={() => {
                //chooseFile('photo');
                setImageModal(true);
              }}
            />
          </View>

          <TouchableOpacity
            style={{height: '20%'}}
            onPress={() => {
              setTempName(name);
              showNameModal(true);
            }}>
            <Card
              style={{
                alignSelf: 'center',
                flexDirection: 'row',
                backgroundColor: '#42EADDFF',
                justifyContent: 'center',
                padding: 10,
              }}
              elevation={10}
              cornerRadius={20}
              opacity={0.2}>
              <Text
                numberOfLines={1}
                style={{
                  marginHorizontal: 15,
                  fontFamily: 'Fascinate-Regular',
                }}>
                {name}
              </Text>

              <Icon style={{left: 0}} size={24} color="teal" name="eraser" />
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              height: '10%',
              marginTop: 10,
              elevation: 16,
              width: '60%',
              alignSelf: 'center',
              backgroundColor: '#F39C12',
              borderTopRightRadius: 20,
              borderBottomLeftRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 5,
            }}
            onPress={() =>
              navigation.navigate('TeacherAccount', {coordinates, address})
            }>
            {/* <View
              style={{
                height: '100%',
                width: '60%',
                alignSelf: 'center',
                backgroundColor: '#F39C12',
                borderTopRightRadius: 20,
                borderBottomLeftRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 16,
                marginTop: 0,
              }}> */}
            <Text style={{color: 'white', fontSize: 16}}>Teacher</Text>
            <Text style={{color: 'white', fontSize: 16}}>Account</Text>
            {/* </View> */}
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              height: '10%',
              marginTop: 10,
              elevation: 16,
              width: '60%',
              alignSelf: 'center',
              backgroundColor: '#3498DB',
              borderTopRightRadius: 20,
              borderBottomLeftRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 5,
            }}
            onPress={() =>
              navigation.navigate('StudentAccount', {coordinates, address})
            }>
            {/* <View
              style={{
                height: '100%',
                width: '60%',
                alignSelf: 'center',
                backgroundColor: '#3498DB',
                borderTopLeftRadius: 20,
                borderBottomRightRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 20,
                marginTop: 0,
              }}> */}
            <Text style={{color: 'white', fontSize: 16}}>Student</Text>
            <Text style={{color: 'white', fontSize: 16}}>Account</Text>
            {/* </View> */}
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              marginTop: '4%',
              backgroundColor: '#5DADE2',
              marginHorizontal: '20%',
              width: '60%',
            }}
            onPress={() => {
              initializeLongitudeAndLatitudeValues();
              setShowModal(true);
            }}>
            <Text style={{margin: '8%', textAlign: 'center'}}>
              Set Location
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Modal
            animationType={'slide'}
            transparent={false}
            visible={showModal}
            onRequestClose={() => {
              //when click on back in android
              setShowModal(!showModal);
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text style={{marginTop: 5, flex: 1}} numberOfLines={2}>
                {address}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#3498DB',
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={permissionHandle}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 'normal',
                    margin: 3,
                    marginHorizontal: 5,
                    fontSize: 16,
                  }}>
                  Add Location
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 280,
                backgroundColor: 'gray',
                marginTop: '2%',
              }}>
              <MapboxGL.MapView
                style={{height: '100%', width: '100%'}}
                onPress={val => {
                  console.log('ONPress called:', val);
                  manageLocation({
                    longitude: val.geometry.coordinates[0],
                    latitude: val.geometry.coordinates[1],
                  }); //(longitude,latitude)
                }}>
                <MapboxGL.Camera
                  zoomLevel={12}
                  centerCoordinate={coordinates}
                />
                <MapboxGL.PointAnnotation id="map" coordinate={coordinates} />
              </MapboxGL.MapView>
            </View>
          </Modal>
        </View>
        <View>
          <Dialog.Container visible={logout}>
            <Dialog.Description>Do you want to logout?</Dialog.Description>
            <Dialog.Button label="Cancel" onPress={() => setLogout(false)} />
            <Dialog.Button
              label="Logout"
              onPress={() => {
                setLogout(false);
                const signout = async () => {
                  //this code is working perfectly
                  //console.log('current user: ', auth().currentUser);
                  await auth().signOut(); //it will remove current user present in auth, either that user was logged in through Google or Email/Password
                  //console.log('Current User Status: ', auth().currentUser);
                  await GoogleSignin.signOut(); //If we will not signOut from there then next time, it will automatically select already selected user and will not give pop-up
                  //console.log('Signout from google also now agian login');
                };
                resetNotificationStates(); //re-set is necessary otherwise new user notification count will be disturbed, as notifications states are global to the root
                signout();
                navigation.getParent().navigate('Authentication'); //after clicking logout our cached user or auth().currentuser will be null and we will be navigated to first screen
              }}
            />
          </Dialog.Container>
        </View>
        <View>
          <Dialog.Container visible={nameModal}>
            <Dialog.Description>Enter your name</Dialog.Description>
            <Dialog.Input
              value={tempName}
              onChangeText={val => setTempName(val)}></Dialog.Input>
            <Dialog.Button
              label="Cancel"
              onPress={() => {
                //will it also work on backPress button of mobile?
                setTempName('');
                showNameModal(false);
              }}
            />
            <Dialog.Button
              label="Set"
              onPress={() => {
                setName(tempName);
                showNameModal(false);
                firestore()
                  .collection('teachers')
                  .doc(getUserId())
                  .update({name: tempName});
                //name will also be upadted in student account due to duplication of same data
                firestore()
                  .collection('students')
                  .doc(getUserId())
                  .update({name: tempName})
                  .then(() => setTempName(''));
              }}
            />
          </Dialog.Container>
        </View>
        <View>
          <Dialog.Container visible={imageModal}>
            <Dialog.Title>Select a Photo</Dialog.Title>
            <Dialog.Description>
              <Dialog.Button
                label="Take Photo..."
                onPress={() => {
                  captureImage('photo');
                  setImageModal(!imageModal);
                }}></Dialog.Button>
            </Dialog.Description>
            <Dialog.Description>
              <Dialog.Button
                label="Choose from Gallery..."
                onPress={() => {
                  chooseFile('photo');
                  setImageModal(!imageModal);
                }}></Dialog.Button>
            </Dialog.Description>
            <Dialog.Description>
              <Dialog.Button
                label="Remove photo..."
                color={'red'}
                bold="false"
                onPress={() => {
                  deleteImage();
                  setImageModal(!imageModal);
                }}></Dialog.Button>
            </Dialog.Description>
            <Dialog.Button
              label="Cancel"
              onPress={() => setImageModal(false)}
            />
          </Dialog.Container>
          {/*This is demo page*/}
        </View>
        <Modal
          isVisible={imagePreview}
          onBackButtonPress={() => setImagePreview(false)}
          onBackdropPress={() => setImagePreview(false)}
          animationIn="slideInUp"
          animationOut="zoomOut"
          animationInTiming={700}
          animationOutTiming={700}
          backdropColor="gray">
          <View style={{flex: 1}}>
            <Image
              source={
                filePath.includes('http') || filePath.includes('file:')
                  ? {uri: filePath}
                  : require('../../res/images/no-image.jpg')
              }
              style={{flex: 1}}></Image>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    borderTopWidth: Dimensions.get('window').height / 2,
    borderBottomWidth: Dimensions.get('window').height / 2,
    borderRightWidth: Dimensions.get('window').width / 2,
    borderLeftWidth: Dimensions.get('window').width / 2,
    borderTopColor: 'blue',
    borderBottomColor: 'blue',
    borderRightColor: 'blue',
    borderLeftColor: 'blue',
  },
  contentContainer: {
    position: 'absolute',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
  },
  notifyButton: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
    height: '10%',
  },
  avatar: {
    avatarBox: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      elevation: 10,
      overflow: 'visible',
    },
    image: {
      height: 100,
      width: 100,

      backgroundColor: 'purple',
      elevation: 10,
      overflow: 'visible',
    },
    camera: {},
  },
});
// #endregion
export default Index;
