import React, {useState, useEffect, useContext, useRef} from 'react';
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
import SwitchSelector from '../teacherAccount/components/SwitchSelector.js';
import OutlineInput from 'react-native-outline-input';
import Toast from 'react-native-toast-message';
import Dialog from 'react-native-dialog';
import {Card} from 'react-native-shadow-cards';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
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
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import grades, {subjects} from '../../res/data.js';
import {GradesAndSubjectsContext} from '../../Context/index.js';
const Student = ({navigation, route}) => {
  const [gender, setGender] = useState('male');
  const [fees, setFees] = useState('');
  const [radius, setRadius] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [email, setEmail] = useState('yourname@gmail.com');
  const [modal, setModal] = useState(false);
  const [contactType, setContactType] = useState('');
  const [Grades, setGrades] = useState([]);
  const [Subjects, setSubjects] = useState([]);
  const context = useContext(GradesAndSubjectsContext);
  let studentMessagesObj = useRef({});
  function gradeManagement(index) {
    if (Grades[index] == false) {
      if (Grades.filter(x => x == true).length == 10) {
        console.log('10 items already selected');
        Toast.show({
          type: 'info',
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

    console.log('Inside subject Management: ', Subjects, tempSubjects);
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
  const initializeStates = async () => {
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
    console.log('going to initialize states');
    const result = await firestore()
      .collection('students')
      .doc(getUserId())
      .get();
    console.log('values: coming from database', result);
    console.log('User exists: ', result._exists);
    const values = result.data();
    console.log('what is inside messages object:', values.messages);
    if (values.messages != undefined) studentMessagesObj = values.messages;
    console.log('Values while getting from database:', values.gender);
    if (values.gender != undefined) setGender(values.gender);
    if (values.fees != undefined) setFees(values.fees);
    if (values.radius != undefined) setRadius(values.radius);
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
        let len = context.subjects[i].length; //total subjects in ith grade
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
      console.log('User have already selected something');
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
      //this piece of code was creating issues
      // setSubjects(
      //   Array.from({length: context.subjects.length}, () =>
      //     Array.from({length: 9}, () => false),
      //   ),
      // );
      console.log('User have nooooooooot already selected something');
    }
    // if (values.subjects != undefined) {
    // }

    //setting states
    console.log(
      'lengths',
      context.grades.length,
      context.subjects.length,
      context.ages,
    );
    //
  };
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
        //if user has selected any subject inside grade then consider that grade otherwise ignore it
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
    if (tempGrades.length > 0) {
      let query = firestore()
        .collection('teachers')
        .where('grades', 'array-contains-any', tempGrades);
      let result = await query.get();
      arrayOfUsers = result.docs;
      console.log(
        'all the users which matched with your profile are following: ',
        arrayOfUsers,
      );
    }

    //this record is matched with user, let start notifying process
    // let teacherMessagesObj = route.params.messages;
    // if (teacherMessagesObj == undefined) {
    //   // means if messages variable is not initialized in database
    //   teacherMessagesObj = {};
    // }
    for (let i = 0; i < arrayOfUsers.length; i++) {
      //if user is in range then fetch his profile image and store his data alongwith image in resultant dataList which will later fed to flatlist
      console.log(
        'calculated distance will be: ',
        route.params.coordinates[1],
        route.params.coordinates[0],
        arrayOfUsers[i]._data.latitude,
        arrayOfUsers[i]._data.longitude,
        haversine(
          route.params.coordinates[1],
          route.params.coordinates[0],
          arrayOfUsers[i]._data.latitude,
          arrayOfUsers[i]._data.longitude,
        ),
      );

      const calculatedDistance = haversine(
        route.params.coordinates[1],
        route.params.coordinates[0],
        arrayOfUsers[i]._data.latitude,
        arrayOfUsers[i]._data.longitude,
      );
      //if user has entered his radius and location then he should be treated according to rules
      if (radius && route.params.address.includes('...') == false) {
        if (calculatedDistance <= radius) {
          console.log('values matched');
          //message added in teacher account
          console.log('iDS: ', arrayOfUsers[i].id);
          studentMessagesObj[arrayOfUsers[i].id] = {
            status: true,
            date: Date(),
            type: 'normal',
          };
        }
      } else {
        studentMessagesObj[arrayOfUsers[i].id] = {
          status: true,
          date: Date(),
          type: 'normal',
        };
      }

      //if user has entered his radius and location then he should be treated according to rules
      if (arrayOfUsers[i]._data.radius && arrayOfUsers[i]._data.longitude) {
        if (calculatedDistance <= arrayOfUsers[i]._data.radius) {
          let teacherMessagesObj = arrayOfUsers[i]._data.messages;
          if (teacherMessagesObj == undefined) teacherMessagesObj = {};
          teacherMessagesObj[auth().currentUser.uid] = {
            status: true,
            date: Date(),
            type: 'normal',
          };
          firestore()
            .collection('teachers')
            .doc(arrayOfUsers[i].id)
            .update({messages: teacherMessagesObj});
        }
      } else {
        let teacherMessagesObj = arrayOfUsers[i]._data.messages;
        if (teacherMessagesObj == undefined) teacherMessagesObj = {};
        teacherMessagesObj[auth().currentUser.uid] = {
          status: true,
          date: Date(),
          type: 'normal',
        };
        firestore()
          .collection('teachers')
          .doc(arrayOfUsers[i].id)
          .update({messages: teacherMessagesObj});
      }
    }
    //console.log('values while saving in database:', gender);
    try {
      await firestore().collection('students').doc(getUserId()).update({
        gender,
        fees,
        radius,
        email,
        phone: phoneNumber,
        whatsapp: whatsAppNumber,
        grades: tempGrades,
        subjects: tempAllSubjects,
        messages: studentMessagesObj,
      });
      console.log(
        'Following are values: ',
        gender,
        fees,
        radius,
        email,
        phoneNumber,
        whatsAppNumber,
        tempGrades,
        tempAllSubjects,
        studentMessagesObj,
      );
    } catch (error) {
      console.log(
        'Error while saving data in firestore: ',
        error.code,
        error.message,
      );
      console.log(
        'Following are values: ',
        gender,
        fees,
        radius,
        email,
        phoneNumber,
        whatsAppNumber,
        tempGrades,
        tempAllSubjects,
        studentMessagesObj,
      );
    }
  };

  useEffect(() => {
    //console.log('UseEffect of teacher account');
    initializeStates();
    //console.log('after iniatalizing states: ', Grades, Subjects);
    return () => {
      console.log('student component unmounted');
    };
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.genderCon}>
          <Text
            style={{
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
            }}>
            Gender
          </Text>
          <SwitchSelector
            gender={gender}
            setGender={setGender}></SwitchSelector>
        </View>

        {/* <View style={[styles.genderCon]}>
        <Text>Location:</Text>
      </View> */}

        <View style={styles.textInput}>
          <OutlineInput
            value={fees}
            onChangeText={e => {
              if (e.length == 0) setFees('');
              else if (e[e.length - 1] >= '0' && e[e.length - 1] <= '9')
                setFees(e);
            }}
            label="Enter fees (in numbers)"
            activeValueColor="black"
            activeBorderColor="#42EADDFF"
            activeLabelColor="teal"
            passiveBorderColor="#B2BABB"
            passiveLabelColor="#B2BABB"
            passiveValueColor="#B2BABB"
            //keyboardType="numeric"
          />
        </View>
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
            label="Enter radius (in numbers)"
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
        <Text
          style={{
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
          }}>
          Subjects & Grades
        </Text>
        <GradesAndSubjects
          GradeManagement={gradeManagement}
          SubjectManagement={subjectManagement}
          IsGradeSelected={isGradeSelected}
          IsSubjectSelected={isSubjectSelected}></GradesAndSubjects>

        <View
          style={[
            styles.textInput,
            {
              marginTop: 20,
            },
          ]}>
          {/* <OutlineInput
            value={about}
            onChangeText={e => setAbout(e)}
            label="About"
            activeValueColor="black"
            activeBorderColor="#42EADDFF"
            activeLabelColor="teal"
            passiveBorderColor="#B2BABB"
            passiveLabelColor="#B2BABB"
            passiveValueColor="#B2BABB"
            width="80%"
          /> */}
        </View>
        <Text
          style={{
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
          }}>
          Contact
        </Text>
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
});
export default Student;
