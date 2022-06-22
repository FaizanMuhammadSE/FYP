import React, {useState, useEffect, useContext, useRef} from 'react';
import Toast from 'react-native-toast-message';
import Dialog from 'react-native-dialog';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Switch,
  Alert,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  FlatList,
  Button,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import GradesAndSubjects from '../search/components/GradesAndSubjects/index.js';
//import SwitchSelector from 'react-native-switch-selector';
import SwitchSelector from './components/SwitchSelector.js';
import OutlineInput from 'react-native-outline-input';
import {Card} from 'react-native-shadow-cards';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import ImagePicker from 'react-native-image-crop-picker';
import Fontisto from 'react-native-vector-icons/Fontisto';
//import Geolocation from '@react-native-community/geolocation';
//import MapView from 'react-native-maps';
//import DatePicker from 'react-native-date-picker';

//import {TimePicker} from 'react-native-simple-time-picker';
//import ModalDropdown from 'react-native-modal-dropdown';
//import DropDownPicker from 'react-native-dropdown-picker';
// import NumberPlease from 'react-native-number-please';
// import {Picker} from '@react-native-picker/picker';

import grades, {
  subjects,
  setGradesInsideModule,
  getGradesFromModule,
  setSubjectsInsideModule,
  getSubjectsFromModule,
} from '../../res/data.js';
import {GradesAndSubjectsContext} from '../../Context/index.js';
import {setAppInfo} from 'react-native/Libraries/LogBox/Data/LogBoxData';
import {
  NavigationContainer,
  NavigationContainerRefContext,
} from '@react-navigation/native';
//let reserveIds = [];
const Teacher = ({navigation, route}) => {
  const [gender, setGender] = useState('male');
  const [fees, setFees] = useState(null);
  const [years, setYears] = useState(null);
  const [radius, setRadius] = useState(null);
  const [contact, setContact] = useState(0);
  const [about, setAbout] = useState('');
  const [experience, setExperience] = useState(null);
  const [age, setAge] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [email, setEmail] = useState('yourname@gmail.com');
  const [modal, setModal] = useState(false);
  const [contactType, setContactType] = useState('');
  const [Grades, setGrades] = useState([]);
  const [Subjects, setSubjects] = useState([]);
  const [documentsList, setDocumentsList] = useState([]);
  const [deletionEnabled, setDeletionEnabled] = useState(false);
  const [imagePreview, setImagePreview] = useState(false);
  const [selectedImageForPreview, setSelectedImageForPreview] = useState('');
  const context = useContext(GradesAndSubjectsContext);
  const reserveIds = useRef([]); //creating instance variable(which will not auto reset) to hold free Ids for incoming images
  let teacherMessagesObj = useRef({});
  function gradeManagement(index) {
    if (Grades[index] == false) {
      if (Grades.filter(x => x == true).length == 10) {
        console.log('10 items already selected');
        Toast.show({
          type: 'success',
          text1: 'Alert',
          text2: 'Maximum 10 subjects are allowed!',
        });
        return; //no need to run below piece of code
      }
    }
    let tempGrade = [...Grades];
    tempGrade[index] = !tempGrade[index];
    setGrades(tempGrade);
  }

  function subjectManagement(gradeIndex, subjectIndex) {
    let tempSubjects = [...Subjects];
    tempSubjects[gradeIndex][subjectIndex] =
      !tempSubjects[gradeIndex][subjectIndex];
    if (subjectIndex == context.subjects[gradeIndex].length - 1)
      //if user clicked on all button, then make other buttons also like it either checked or uncheked
      for (let i = 0; i < tempSubjects[gradeIndex].length; i++)
        tempSubjects[gradeIndex][i] = tempSubjects[gradeIndex][subjectIndex];
    setSubjects(tempSubjects);
  }

  function isGradeSelected(index) {
    return Grades[index];
  }
  function isSubjectSelected(gradeIndex, subjectIndex) {
    //console.log('isSubjectSelected: ', Subjects);
    if (Subjects == undefined || Subjects.length == 0) return false;
    return Subjects[gradeIndex][subjectIndex];
  }

  const getUserId = () => {
    //in-progress
    return auth().currentUser.uid;
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
      //documentsList.push(response.assets[0].uri);
      console.log('following reserve ids are available', reserveIds.current);
      setDocumentsList([
        ...documentsList,
        {url: response.assets[0].uri, name: reserveIds.current.pop()},
      ]);
    }).catch(error => console.log('Image library promise rejected'));
  };

  const addDocument = () => {
    if (documentsList.length == 3) {
      Toast.show({
        type: 'error',
        text1: 'Max 3 images are allowed!',
        text2: 'Delete any image to add new one.',
      });
      return;
    }
    chooseFile('photo');
  };

  const deleteDocument = itemIndex => {
    Alert.alert('Alert', 'Are you sure to delete it?', [
      {
        text: 'No',
        onPress: () => setDeletionEnabled(false),
      },
      {
        text: 'Yes',
        onPress: async () => {
          //console.log('OK Pressed');
          //console.log('inside block',);
          if (documentsList[itemIndex].url.includes('http') == true) {
            console.log('inside true block');
            try {
              await storage()
                .ref(getUserId() + '/' + documentsList[itemIndex].name)
                .delete();
              reserveIds.current.push(documentsList[itemIndex].name);
              console.log('Following are reserve Ids', reserveIds.current);
            } catch (error) {
              console.log('inside catch block', error.code);
            }
          } else reserveIds.current.push(documentsList[itemIndex].name);

          setDocumentsList(
            documentsList.filter((item, index) => index != itemIndex),
          );
          setDeletionEnabled(false);
        },
      },
    ]);
  };
  const getUrl = async item => {
    return await item.getDownloadURL();
  };
  const initializeStates = async () => {
    // if (
    //   context.ages.length == 0 ||
    //   context.experiences.length == 0 ||
    //   context.grades.length == 0 ||
    //   context.subjects.length == 0
    // )
    //   return;
    // const result = await firestore()
    //   .collection('teachers')
    //   .doc(getUserId())
    //   .get();
    // const values = result.data();
    // //console.log('Grades Before: ', getGradesFromModule());
    // if (values.grades != undefined) setGradesInsideModule(values.grades); //setting grades after fetching data from database
    // //console.log('Grades After: ', getGradesFromModule());
    // if (values.subjects != undefined) {
    //   getGradesFromModule().forEach(item => {
    //     let val = values.subjects[item];
    //     setSubjectsInsideModule(val);
    //   });
    // }
    // console.log('values: ', values);
    // console.log('Grades: ', getGradesFromModule());
    // console.log('Subjects: ', getSubjectsFromModule());

    const result = await firestore()
      .collection('teachers')
      .doc(getUserId())
      .get();
    const values = result.data();
    if (values.messages != undefined) teacherMessagesObj = values.messages;
    //console.log('values: ', values);
    console.log('Values while getting from database:', values.gender);
    if (values.gender != undefined) setGender(values.gender);
    if (values.fees != undefined) setFees(values.fees);
    if (values.radius != undefined) setRadius(values.radius);
    if (values.age != undefined) setAge(values.age);
    if (values.experience != undefined) setExperience(values.experience);
    if (values.about != undefined) setAbout(values.about);
    if (values.phone != undefined) setPhoneNumber(values.phone);
    if (values.whatsapp != undefined) setWhatsAppNumber(values.whatsapp);
    if (values.email != undefined) setEmail(values.email);
    //values exist in database lets fill states accoriding to them
    if (values.grades != undefined && values.subjects != undefined) {
      let tempGrade = [];
      let tempAllSubjects = [];
      for (let i = 0; i < context.grades.length; i++) {
        let tempSubjects = [];
        // console.log(
        //   'lets check type: ',
        //   typeof [1, 2, 3, 4],
        //   context.grades[i],
        //   values.grades.indexOf(context.grades[i]),
        // );
        let len = context.subjects[i].length;
        if (values.grades.indexOf(context.grades[i]) != -1) {
          tempGrade.push(true);
          let subjectsList = context.subjects[i];
          for (let j = 0; j < len; j++) {
            tempSubjects.push(
              values.subjects[context.grades[i]].indexOf(subjectsList[j]) != -1
                ? true
                : false,
            );
            // if (subjectsList[j] == 'All') {
            //   console.log(
            //     'All Subject status',
            //     values.subjects[context.grades[i]],
            //     subjectsList[j],
            //     values.subjects[context.grades[i]][2] == subjectsList[j],
            //     values.subjects[context.grades[i]].indexOf(subjectsList[j]),
            //   );
            // }
          }
        } else {
          // console.log('inside else block');
          tempGrade.push(false);
          tempSubjects = Array.from({length: len}, () => false);
        }
        // console.log('Details of subjects: ', tempSubjects);
        tempAllSubjects.push(tempSubjects);
      }
      setGrades(tempGrade);
      setSubjects(tempAllSubjects);
    } else {
      //if values are not set in database then initialize states as empty
      setGrades(Array.from({length: context.grades.length}, () => false));
      let allSubjects = [];
      for (let i = 0; i < context.subjects.length; i++) {
        allSubjects.push(
          Array.from({length: context.subjects[i].length}, () => false),
        );
      }
      setSubjects(allSubjects);
      //this piece of code is creating issue
      // setSubjects(
      //   Array.from({length: context.subjects.length}, () =>
      //     Array.from({length: 9}, () => false),
      //   ),
      // );
    }

    //fetching images from storage
    let documents = [];
    try {
      const url = await storage()
        .ref(getUserId() + '/doc_0')
        .getDownloadURL();
      documents.push({url: url, name: 'doc_0'});
    } catch (error) {
      if (error.code == 'storage/object-not-found')
        reserveIds.current.push('doc_0');
    }
    try {
      const url = await storage()
        .ref(getUserId() + '/doc_1')
        .getDownloadURL();
      documents.push({url: url, name: 'doc_1'});
    } catch (error) {
      if (error.code == 'storage/object-not-found')
        reserveIds.current.push('doc_1');
    }
    try {
      const url = await storage()
        .ref(getUserId() + '/doc_2')
        .getDownloadURL();
      documents.push({url: url, name: 'doc_2'});
    } catch (error) {
      if (error.code == 'storage/object-not-found')
        reserveIds.current.push('doc_2');
    }
    setDocumentsList(documents);
    console.log(
      'reserve Ids in intializing state it will never run again: ',
      reserveIds.current,
    );
    // let allImages = await ref.listAll();
    // console.log('lengths are: ', allImages.items.length);
    // if (allImages.items.length >= 1) {
    //   const url = await allImages.items..getDownloadURL();
    //   console.log('url is 0: ', url);
    //   documents.push(url);
    // }
    // if (allImages.items.length >= 2) {
    //   const url = await allImages.items.at(1).getDownloadURL();
    //   console.log('url is 1: ', url);
    //   documents.push(url);
    // }
    // if (allImages.items.length >= 3) {
    //   const url = await allImages.items.at(2).getDownloadURL();
    //   console.log('url is 2: ', url);
    //   documents.push(url);
    // }
    // console.log('all urls are: ', documents);
    // setDocumentsList(documents);
    // for (const image of allImages.items) {
    //   if (image.name != 'dp') {
    //     const url = await image.getDownloadURL();
    //     setDocumentsList([...documentsList, url]);
    //   }
    // }
    // allImages.items.forEach(item => {
    //   if (item.name != 'dp') {
    //     item.getDownloadURL().then(url => {
    //       console.log(url);
    //       let list = [...documentsList, url];
    //       setDocumentsList(list);
    //       //console.log('PRE STATE: ', documentsList);
    //       //setDocumentsList([...documentsList, url]);
    //     });
    //     //documents.push(getUrl(item));
    //     //console.log('document url is fetched: ', documents);
    //   }
    // });

    //console.log('doucments sotdred: ', documents);
    //setDocumentsList(documents);
    // if (values.subjects != undefined) {
    // }

    //setting states
    // console.log(
    //   'lengths',
    //   context.grades.length,
    //   context.subjects.length,
    //   context.ages,
    // );
    //
  };
  function haversine(lat1, lon1, lat2, lon2) {
    // distance between latitudes
    // and longitudes
    let dLat = ((lat2 - lat1) * Math.PI) / 180.0;
    let dLon = ((lon2 - lon1) * Math.PI) / 180.0;

    // convert to radiansa
    lat1 = (lat1 * Math.PI) / 180.0;
    lat2 = (lat2 * Math.PI) / 180.0;

    // apply formulae
    let a =
      Math.pow(Math.sin(dLat / 2), 2) +
      Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
    let rad = 6371;
    let c = 2 * Math.asin(Math.sqrt(a));
    return rad * c;
  }
  const saveChanges = async () => {
    let tempGrades = [];
    let tempAllSubjects = {};
    for (let i = 0; i < Grades.length; i++) {
      let tempSubjectsList = [];
      if (Grades[i] == true) {
        //iterate on all the subjects of specific(ith grade which is true/enabled/selected by user) grade
        for (let j = 0; j < Subjects[i].length; j++) {
          if (Subjects[i][j] == true) {
            tempSubjectsList.push(context.subjects[i][j]);
          }
        }
        if (tempSubjectsList.length > 0) {
          tempGrades.push(context.grades[i]); //pushing actual name of grade
          tempAllSubjects[context.grades[i]] = tempSubjectsList;
        }
      }
    }

    //now all below queires are for notification
    //we just need to match grades&subjects after this check radius
    //then we have to place matching record in two places
    //first add message in the matched student record
    //add message in the teacher record itself

    let arrayOfUsers = [];
    //if user selected any grade & suject then process messages
    if (tempGrades.length > 0) {
      let query = firestore()
        .collection('students')
        .where('grades', 'array-contains-any', tempGrades);
      arrayOfUsers = await query.get();
      arrayOfUsers = arrayOfUsers.docs;
      console.log('Array of users who matched just subjects: ', arrayOfUsers);
    }
    //this record is matched with user, let start notifying process
    // let teacherMessagesObj = route.params.messages;
    // if (teacherMessagesObj == undefined) {
    //   // means if messages variable is not initialized in database
    //   teacherMessagesObj = {};
    // }
    for (let i = 0; i < arrayOfUsers.length; i++) {
      //if user is in range then fetch his profile image and store his data alongwith image in resultant dataList which will later fed to flatlist
      const calculatedDistance = haversine(
        route.params.coordinates[1],
        route.params.coordinates[0],
        arrayOfUsers[i]._data.latitude,
        arrayOfUsers[i]._data.longitude,
      );
      console.log(
        'calculated distance: ',
        calculatedDistance,
        route.params.coordinates[1],
        route.params.coordinates[0],
        arrayOfUsers[i]._data.latitude,
        arrayOfUsers[i]._data.longitude,
      );
      if (route.params.address.includes('...'))
        console.log('User has not given his address', route.params.address);
      else console.log('User has given his address', route.params.address);

      //if calculated distance between teacher and student is within range of teacher then notify teacher
      //if teacher has set his radius then check radius otherwise notify without checking radius
      if (radius && route.params.address.includes('...') == false) {
        console.log('USER HAS GIVEN ADDRESS & RADIUS');
        if (calculatedDistance <= radius) {
          //message added in teacher account
          teacherMessagesObj[arrayOfUsers[i].id] = {
            status: true,
            date: Date(),
            type: 'normal',
          };
        }
      } else {
        //message added in teacher account
        teacherMessagesObj[arrayOfUsers[i].id] = {
          status: true,
          date: Date(),
          type: 'normal',
        };
      }

      //if student has set his radius then check radius otherwise notify without checking radius
      if (arrayOfUsers[i]._data.radius && arrayOfUsers[i]._data.longitude) {
        if (calculatedDistance <= arrayOfUsers[i]._data.radius) {
          let studentMessagesObj = arrayOfUsers[i]._data.messages;
          if (studentMessagesObj == undefined) studentMessagesObj = {};
          studentMessagesObj[auth().currentUser.uid] = {
            status: true,
            date: Date(),
            type: 'normal',
          };
          firestore()
            .collection('students')
            .doc(arrayOfUsers[i].id)
            .update({messages: studentMessagesObj});
        }
      } else {
        let studentMessagesObj = arrayOfUsers[i]._data.messages;
        if (studentMessagesObj == undefined) studentMessagesObj = {};
        studentMessagesObj[auth().currentUser.uid] = {
          status: true,
          date: Date(),
          type: 'normal',
        };
        firestore()
          .collection('students')
          .doc(arrayOfUsers[i].id)
          .update({messages: studentMessagesObj});
      }
    }

    //console.log('values while saving in database:', gender);
    await firestore()
      .collection('teachers')
      .doc(getUserId())
      .update({
        gender,
        fees,
        radius,
        age,
        experience,
        about,
        email,
        phone: phoneNumber,
        whatsapp: whatsAppNumber,
        grades: tempGrades,
        subjects: tempAllSubjects,
        verified: documentsList.length > 0 ? true : false,
        messages: teacherMessagesObj, //now set here messages of teacher which you collected above
      });

    console.log('images:', documentsList.length);
    for (let i = 0; i < documentsList.length; i++) {
      if (documentsList[i].url.includes('http') == false) {
        const fileName = getUserId() + '/' + documentsList[i].name;
        const reference = storage().ref(fileName);
        console.log('Going to upload :', documentsList[i].url);
        const task = reference.putFile(documentsList[i].url);
        // task.on('state_changed', taskSnapshot => {
        //   console.log(
        //     `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        //   );
        // });
        task
          .then(() => {
            console.log('Image uploaded to the bucket!');
          })
          .catch(error => console.log('image not uploaded to storage', error));
      }
    }

    // for (let i = 0; i < 3 - documentsList.length; i--) {
    //   const fileName = getUserId() + '/' + 'doc_' + (2 - i);
    //   const reference = storage().ref(fileName);
    //   //console.log('Checking filePath in useEffect:', filePath);
    //   const task = reference.delete();
    //   // task.on('state_changed', taskSnapshot => {
    //   //   console.log(
    //   //     `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
    //   //   );
    //   // });
    //   task
    //     .then(() => {
    //       console.log('Image uploaded to the bucket!');
    //     })
    //     .catch(error => console.log('image not uploaded to storage', error));
    // }
  };
  useEffect(() => {
    //console.log('UseEffect of teacher account');
    //console.log('Context changed:', context);
    console.log('Context is: ', context);
    initializeStates();
    //console.log('after iniatalizing states: ', Grades, Subjects);
    return () => {
      console.log('teacher component unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('documentListUpdated: ', documentsList);
  }, [documentsList]);
  // useEffect(() => {
  //   console.log('Alone useEffect form teacher account');
  //   return () => {
  //     console.log('Alone useEffect saying teacher component unmounted');
  //   };
  // });
  // useEffect(() => {
  //   console.log('Use Effect of Grades: ', Grades);
  // }, [Grades]);
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.genderCon}>
          <Text style={styles.headerStyle}>Gender</Text>
          <SwitchSelector
            gender={gender}
            setGender={setGender}></SwitchSelector>
          {/* <SwitchSelector
            selectedColor="white"
            buttonColor="#42EADDFF"
            borderColor="teal"
            hasPadding
            initial={gender}
            borderWidth={2}
            borderRadius={20}
            onPress={value => {
              setGender(value);
              console.log('Gender value changed: ', value);
            }}
            options={[
              {
                label: 'Male',
                value: 'male',
                imageIcon: require('../../res/images/male.png'),
              },
              {
                label: 'FeMale',
                value: 'female',
                imageIcon: require('../../res/images/female.png'),
              },
            ]}
          /> */}
        </View>
        {/* <View style={[styles.genderCon]}>
          <Text>Location:</Text>
        </View> */}
        <Text style={styles.inputLabel}>Enter fees</Text>
        <View style={styles.textInput}>
          <OutlineInput
            value={fees}
            label=""
            onChangeText={e => {
              if (e.length == 0) setFees('');
              else if (e[e.length - 1] >= '0' && e[e.length - 1] <= '9')
                setFees(e);
            }}
            activeValueColor="black"
            activeBorderColor="#42EADDFF"
            activeLabelColor="teal"
            passiveBorderColor="#B2BABB"
            passiveLabelColor="#B2BABB"
            passiveValueColor="#B2BABB"
            //keyboardType="numeric"
          />
        </View>
        <Text style={styles.inputLabel}>Enter radius</Text>
        <View
          style={[
            styles.textInput,
            {
              marginTop: 20,
            },
          ]}>
          <OutlineInput
            value={radius}
            onChangeText={e => {
              if (e.length == 0) setRadius('');
              else if (e[e.length - 1] >= '0' && e[e.length - 1] <= '9')
                setRadius(e);
            }}
            label=""
            activeValueColor="black"
            activeBorderColor="#42EADDFF"
            activeLabelColor="teal"
            passiveBorderColor="#B2BABB"
            passiveLabelColor="#B2BABB"
            passiveValueColor="#B2BABB"
            width="90%"
          />
        </View>
        <View
          style={[
            styles.textInput,
            {
              marginTop: 20,
            },
          ]}>
          {/* <OutlineInput
            value={radius}
            onChangeText={e => setRadius(e)}
            label="Radius"
            activeValueColor="black"
            activeBorderColor="#42EADDFF"
            activeLabelColor="teal"
            passiveBorderColor="#B2BABB"
            passiveLabelColor="#B2BABB"
            passiveValueColor="#B2BABB"
            //width="90%"
            keyboardType="numeric"
          /> */}
        </View>
        {/* <View style={{marginTop: 10}}>
          <Text>Contact</Text>
        </View> */}
        {/*<View
          style={[
            styles.textInput,
            {
              flexDirection: 'row',

              //marginTop: 20,
            },
          ]}>
           <TouchableOpacity onPress={() => Alert.alert('I am a Whats app')}>
            <View style={styles.btnContact}>
              <Text style={styles.btnTextContact}>Whats app</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert('I am a Gmail')}>
            <View style={styles.btnContact}>
              <Text style={styles.btnTextContact}>Gmail</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert('I am Phone Button')}>
            <View style={styles.btnContact}>
              <Text style={styles.btnTextContact}>Phone</Text>
            </View>
          </TouchableOpacity>
        </View> */}
        {context.ages.length > 0 && (
          <Text style={styles.headerStyle}>Age ( Years )</Text>
        )}
        {context.ages.length > 0 && (
          <Card style={styles.cardStyle} elevation={10} cornerRadius={20}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
              }}>
              {context.ages.map((ag, expIndex) => (
                <TouchableOpacity
                  key={expIndex}
                  onPress={() => setAge(parseInt(ag.slice(0, ag.length - 1)))}>
                  <Text
                    style={
                      age == parseInt(ag.slice(0, ag.length - 1))
                        ? styles.selectedBox
                        : styles.normalBox
                    }>
                    {ag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}

        {context.experiences.length > 0 && (
          <Text style={styles.headerStyle}>Experience ( Years )</Text>
        )}
        {context.experiences.length > 0 && (
          <Card style={styles.cardStyle} elevation={10} cornerRadius={20}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
              }}>
              {context.experiences.map((exp, expIndex) => (
                <TouchableOpacity
                  key={expIndex}
                  onPress={() => setExperience(exp)}>
                  <Text
                    style={
                      experience == exp ? styles.selectedBox : styles.normalBox
                    }>
                    {exp}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}
        {context.grades.length > 0 && (
          <Text style={styles.headerStyle}>Subjects & Grades</Text>
        )}
        <GradesAndSubjects
          GradeManagement={gradeManagement}
          SubjectManagement={subjectManagement}
          IsGradeSelected={isGradeSelected}
          IsSubjectSelected={isSubjectSelected}></GradesAndSubjects>
        {/* {Grades.lenght >= 0 ? (
          <GradesAndSubjects
            GradeManagement={gradeManagement}
            SubjectManagement={subjectManagement}
            IsGradeSelected={isGradeSelected}
            IsSubjectSelected={isSubjectSelected}></GradesAndSubjects>
        ) : (
          <Text>No subject is selected {Grades.length}</Text>
        )} */}
        <View
          style={[
            styles.textInput,
            {
              marginTop: 20,
            },
          ]}>
          <Text style={[styles.inputLabel, {marginBottom: 10}]}>About</Text>
          <OutlineInput
            value={about}
            onChangeText={e => {
              if (e.length <= 250) setAbout(e);
              console.log(about);
            }}
            label=""
            activeValueColor="black"
            activeBorderColor="#42EADDFF"
            activeLabelColor="teal"
            passiveBorderColor="#B2BABB"
            passiveLabelColor="#B2BABB"
            passiveValueColor="#B2BABB"
            width="80%"
          />
          <View style={{flexDirection: 'row-reverse'}}>
            <Text style={{color: about.length < 201 ? 'green' : 'red'}}>
              {250 - about.length} characters left
            </Text>
          </View>
        </View>
        <Text style={styles.headerStyle}>Verification (Documents)</Text>
        <Card style={styles.cardStyle} elevation={10} cornerRadius={20}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
            }}>
            {documentsList.length > 0 ? (
              documentsList.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  onLongPress={() => {
                    setDeletionEnabled(true);
                  }}
                  onPress={() => {
                    setSelectedImageForPreview(documentsList[itemIndex].url);
                    setImagePreview(true);
                  }}>
                  <TouchableOpacity
                    style={{zIndex: 1, flexDirection: 'row-reverse'}}
                    onPress={() => {
                      deleteDocument(itemIndex);
                    }}>
                    {deletionEnabled && (
                      <MaterialIcon
                        style={{
                          top: 13,
                          right: 15,
                        }}
                        name="delete-circle-outline"
                        color="red"
                        size={30}></MaterialIcon>
                    )}
                  </TouchableOpacity>
                  <Image
                    borderRadius={10}
                    source={{uri: item.url}}
                    style={{height: 100, width: 100, marginTop: 5}}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{alignSelf: 'center'}}>Click to add...</Text>
            )}
            {/* <View>
              <TouchableOpacity
                style={{zIndex: 1, flexDirection: 'row-reverse'}}>
                <EntypoIcon
                  style={{
                    // backgroundColor: 'gray',
                    // width: '20%',
                    // borderRadius: 50,
                    // justifyContent: 'center',
                    // paddingLeft: 2,
                    top: 10,
                  }}
                  name="circle-with-cross"
                  color="red"
                  size={30}></EntypoIcon>
              </TouchableOpacity>
              <Image
                borderRadius={2}
                source={require('../../res/images/me2.jpg')}
                style={{height: 100, width: 100, marginTop: 5}}
              />
            </View>
            <Image
              borderRadius={2}
              source={require('../../res/images/me2.jpg')}
              style={{height: 100, width: 100, marginTop: 5}}
            /> */}
          </View>
          <TouchableOpacity
            style={{
              flexDirection: 'row-reverse',
              marginTop: 3,
              //alignSelf: 'center',
            }}
            onPress={addDocument}>
            <MaterialIcon
              style={{
                backgroundColor: 'gray',
                width: '20%',
                borderRadius: 50,
                justifyContent: 'center',
                paddingLeft: 2,
              }}
              name="plus"
              color="white"
              size={50}></MaterialIcon>
          </TouchableOpacity>
        </Card>
        <Text style={styles.headerStyle}>Contact</Text>
        <Card style={styles.cardStyle} elevation={10} cornerRadius={20}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
            }}>
            <TouchableOpacity
              onPress={() => {
                setTempValue(phoneNumber);
                setContactType('phone');
                setModal(true);
              }}>
              <MaterialIcon name="phone" color="black" size={50}></MaterialIcon>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setTempValue(whatsAppNumber);
                setContactType('whatsapp');
                setModal(true);
              }}>
              <MaterialIcon
                name="whatsapp"
                color="green"
                size={50}></MaterialIcon>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setTempValue(email);
                setContactType('email');
                setModal(true);
              }}>
              <MaterialIcon
                name="gmail"
                color="#BB001B"
                size={50}></MaterialIcon>
            </TouchableOpacity>
          </View>
        </Card>
        <TouchableOpacity
          onPress={() => {
            //alert('Your request has been recorded...');
            Alert.alert('Alert', 'Do you want to save changes?', [
              {
                text: 'No',
                onPress: () => console.log('Cancel Pressed'),
                style: 'default',
              },
              {
                text: 'Yes',
                onPress: () => {
                  console.log('OK Pressed');
                  saveChanges();
                  navigation.goBack(); //lets move back to main screen
                },
              },
            ]);
          }}>
          <Text
            style={[
              styles.cardItem,
              {alignSelf: 'center', padding: 10, paddingHorizontal: '40%'},
            ]}>
            SAVE
          </Text>
        </TouchableOpacity>
      </View>
      <Dialog.Container visible={modal}>
        <Dialog.Description>
          {contactType == 'phone'
            ? 'Phone Number'
            : contactType == 'email'
            ? 'Email'
            : 'WhatsApp Number'}
        </Dialog.Description>
        <Dialog.Input
          value={tempValue}
          onChangeText={val => {
            if (contactType == 'phone' || contactType == 'whatsapp') {
              if (
                val[val.length - 1] >= '0' &&
                val[val.length - 1] <= '9' &&
                val.length <= 11
              )
                setTempValue(val);
              else {
                Toast.show({
                  type: 'error',
                  text1: 'Alert',
                  text2:
                    'Just digits are allowed & number length should be 11 digits',
                });
              }
            } else {
              setTempValue(val);
            }
          }}></Dialog.Input>
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            //will it also work on backPress button of mobile?
            setTempValue('');
            setModal(false);
          }}
        />
        <Dialog.Button
          label="Set"
          onPress={() => {
            if (
              (contactType == 'phone' || contactType == 'whatsapp') &&
              tempValue.length < 11
            ) {
              Toast.show({
                type: 'error',
                text1: 'Alert',
                text2: 'Number length should be 11 digits',
              });
              return;
            } else if (
              contactType == 'email' &&
              (tempValue.includes('@') == false ||
                tempValue.includes('.') == false)
            ) {
              Toast.show({
                type: 'error',
                text1: 'Alert',
                text2: 'Invalid email format',
              });
              return;
            }
            //following code will in-case if everything is fine
            if (contactType == 'phone') setPhoneNumber(tempValue);
            else if (contactType == 'whatsapp') setWhatsAppNumber(tempValue);
            else if (contactType == 'email') setEmail(tempValue);
            setTempValue('');
            setModal(false);
          }}
        />
        <Toast position="bottom" visibilityTime={2000}></Toast>
      </Dialog.Container>
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
              selectedImageForPreview.includes('http') ||
              selectedImageForPreview.includes('file:')
                ? {uri: selectedImageForPreview}
                : require('../../res/images/no-image.jpg')
            }
            style={{flex: 1}}></Image>
        </View>
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    padding: 10,
  },
  genderCon: {
    //flexGrow: 3,
    width: '90%',
    alignSelf: 'center',
    //flexDirection: 'row',
    // backgroundColor: 'blue',
  },
  selectedBox: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'aqua',
    backgroundColor: 'aqua',
    color: 'teal',
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  normalBox: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'aqua',
    color: 'teal',
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 5,
  },
  btn: {
    backgroundColor: 'white',
    borderRadius: hp('30%'),
    borderWidth: 3, //Width of the border
    borderColor: '#800000',
    padding: 4,
    elevation: 30,
    //height: 100,
    //width: 100,
  },
  cardItem: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#58D68D',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 10,
    color: 'white',
    backgroundColor: '#58D68D',
    marginBottom: 5,
    marginTop: 10,
  },
  headerStyle: {
    alignSelf: 'center',
    fontSize: 18,
    marginBottom: 5,
    color: 'white',
    backgroundColor: 'teal',
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  btnText: {
    color: '#800000',
    fontSize: 16,
    fontWeight: 'bold',
    //justifyContent:"center",
    //alignItems:"center",
    //OR
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    // padding: 20,
  },
  textInput: {
    fontSize: 16,
    paddingHorizontal: 16,
    marginTop: 15,
  },
  btnContact: {
    backgroundColor: 'white',
    borderRadius: hp('3%'),
    borderWidth: 3, //Width of the border
    borderColor: '#800000',
    padding: 15,
    elevation: 30,
  },
  btnTextContact: {
    color: '#800000',
    fontSize: 16,
    fontWeight: 'bold',
    //justifyContent:"center",
    //alignItems:"center",
    //OR
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  cardStyle: {
    padding: 25,
    alignSelf: 'center',
    marginBottom: 15,
    backgroundColor: 'white',
  },
  inputLabel: {
    width: '40%',
    fontSize: 18,
    marginBottom: 3,
    color: 'white',
    backgroundColor: 'teal',
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
});
export default Teacher;
