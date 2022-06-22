import React, {useState, useContext, useRef, useEffect} from 'react';
import Toast from 'react-native-toast-message';
import OutlineInput from 'react-native-outline-input';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Button,
  Alert,
} from 'react-native';
import {Card} from 'react-native-shadow-cards';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapboxGL from '@react-native-mapbox-gl/maps';
import RNLocation from 'react-native-location';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import GradesAndSubjects from '../search/components/GradesAndSubjects/index.js';
import grades, {subjects} from '../../res/data.js';
import SearchOnMap from './components/searchOnMap';
import {GradesAndSubjectsContext} from '../../Context/index.js';
// function ShowData() {
//   let items = [];
//   for (var key in Data) {
//     items.push(Data.key);
//   }
//   return items;
// }

const Index = ({navigation, route}) => {
  const context = useContext(GradesAndSubjectsContext);
  const [Teacher, setTeacher] = useState(true);
  const [Gender, setGender] = useState('Nothing');
  const [Age, setAge] = useState('Nothing');
  const [radius, setRadius] = useState('');
  const [Grades, setGrades] = useState(
    Array.from({length: context.grades.length}, () => false),
  );
  const [Subjects, setSubjects] = useState(
    Array.from({length: context.subjects.length}, () =>
      Array.from({length: 9}, () => false),
    ),
  );
  const [coordinates, setCoordiantes] = useState([8.2323123, 7.3432467]); //longitude,latitude
  const [address, setAddress] = useState('Here is your location...');
  const {guestMode} = route.params;
  //let header;
  //if (route.params == undefined) header = undefined;
  //else header = route.params.header;

  // const [selectedArea, setSelectedArea] = useState([8.2323123, 7.3432467]);
  // function userSelected(user) {
  //   if (user == 'Teacher') setTeacher(true);
  //   else setTeacher(false);
  // }

  // function genderSelected(gender) {
  //   if (gender == 'Male') setGender('Male');
  //   else if (gender == 'Female') setGender('Female');
  //   else if (gender == 'Nothing') setGender('Nothing');
  // }

  // function ageSelected(age) {
  //   if (age == '20+') setAge('20+');
  //   else if (age == '30+') setAge('30+');
  //   else if (age == '40+') setAge('40+');
  //   else if (age == '50+') setAge('50+');
  //   else if (age == 'Nothing') setAge('Nothing');
  // }

  function gradeManagement(index) {
    //console.log('grade management', Grades);
    if (Grades[index] == false) {
      if (Grades.filter(x => x == true).length == 10) {
        //console.log('10 items already selected');
        Toast.show({
          type: 'error',
          text1: 'Maximum 10 subjects are allowed!',
          //text2: 'Maximum 10 subjects are allowed!',
        });
        return; //no need to run below piece of code
      }
    }
    let tempGrade = [...Grades];
    //console.log('before', tempGrade);
    tempGrade[index] = !tempGrade[index];
    //console.log('after', tempGrade);
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
        console.log('before getting location', location);
        location = await RNLocation.getLatestLocation({timeout: 60000});
        // console.log('In between: ', location);
        // location = await RNLocation.getLatestLocation({timeout: 1000});
        // console.log('after 2nd Call: ', location);
        // console.log(
        //   'hERE is location object: ',
        //   location,
        //   // location.longitude,
        //   // location.latitude,
        //   // location.timestamp,
        // );

        if (location) {
          // firestore()
          //   .collection('teachers')
          //   .doc(getUserId())
          //   .update({
          //     longitude: location.longitude,
          //     latitude: location.latitude,
          //   })
          //   .then(console.log('Location set in teacher account'));

          // firestore()
          //   .collection('students')
          //   .doc(getUserId())
          //   .update({
          //     longitude: location.longitude,
          //     latitude: location.latitude,
          //   })
          //   .then(console.log('Location set in student account'));
          getAddressUsingMapboxApi(location.longitude, location.latitude); //address state will be set in this func
          setCoordiantes([location.longitude, location.latitude]);
        }
      }
    }
  };
  const navigateToResultPage = () => {
    let selectedGrades = [];
    for (let i = 0; i < Grades.length; i++) {
      //means if grade is selected and their is atleast one subject is selected(true) against that grade
      if (Grades[i] == true && Subjects[i].indexOf(true) != -1)
        selectedGrades.push(context.grades[i]); //push name of that grade
    }
    //checking grades & subjects and displaying toast if necessary
    if (selectedGrades.length == 0) {
      Toast.show({
        type: 'error',
        text1: 'Please select subjects & grades first!',
      });
      return;
    }
    //checking coordinates and displaying toast if necessary
    //we can't use this condition "coordinates.length==0" because we have to initialize coordinates with some random values to display marker on map
    if (address.includes('...') == true) {
      Toast.show({
        type: 'error',
        text1: 'Please give your location first!',
        text2: 'Your location is necessary to search nearby users...',
      });
      return;
    }
    //checking radius and displaying toast if necessary
    console.log('value of radius: ', radius);
    let enteredRadius = radius.length == 0 ? 20 : parseInt(radius);
    let selectedUser = Teacher;
    let selectedGender = Gender;
    let selectedAge =
      Age != 'Nothing' ? parseInt(Age.slice(0, Age.length - 1)) : Age;
    let enteredCoordinates = coordinates;

    navigation.navigate('Result', {
      header: true,
      selectedUser,
      selectedGender,
      selectedAge,
      enteredRadius,
      enteredCoordinates,
      selectedGrades,
    });
  };
  // function toggleValue(row, col) {
  //   let temp = [...Subjects];
  //   temp[row][col] = !temp[row][col];
  //   setSubjects(temp);
  // }
  useEffect(() => {
    //console.log('header vlaues: ', header);
    //console.log('Guesjdfj adfjsd: ', route.params.guestMode);
    console.log('User selects this area: ', coordinates);
  }, [coordinates]);
  return (
    <View>
      <ScrollView>
        <View style={styles.section}>
          <Text
            style={{
              //backgroundColor: '#3498DB',
              backgroundColor: '#F39C12',
              color: 'white',
              textAlign: 'center',
              marginBottom: '3%',
              padding: '2%',
            }}>
            {guestMode ? 'Guest Mode' : 'Search Filters'}
          </Text>

          <Text style={styles.headerStyle}>Looking for</Text>
          <Card style={styles.cardStyle} elevation={10} cornerRadius={20}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <TouchableOpacity onPress={() => setTeacher(true)}>
                <Text
                  style={
                    Teacher == true ? styles.selectedUser : styles.normalUser
                  }>
                  Teacher
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTeacher(false)}>
                <Text
                  style={
                    Teacher == false ? styles.selectedUser : styles.normalUser
                  }>
                  Student
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.headerStyle}>Gender</Text>
          <Card style={styles.cardStyle} elevation={5} cornerRadius={20}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
              }}>
              <TouchableOpacity onPress={() => setGender('male')}>
                <Text
                  style={
                    Gender == 'male' ? styles.selectedUser : styles.normalUser
                  }>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setGender('female')}>
                <Text
                  style={
                    Gender == 'female' ? styles.selectedUser : styles.normalUser
                  }>
                  Female
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setGender('Nothing')}>
                <Text
                  style={
                    Gender == 'Nothing'
                      ? styles.selectedUser
                      : styles.normalUser
                  }>
                  Doesn't Matter
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {Teacher && (
          <View style={styles.section}>
            <Text style={styles.headerStyle}>Age</Text>
            <Card style={styles.cardStyle} elevation={4} cornerRadius={20}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  flexWrap: 'wrap',
                }}>
                {context.ages.map((item, index) => (
                  <TouchableOpacity key={index} onPress={() => setAge(item)}>
                    <Text
                      style={
                        Age == item ? styles.selectedUser : styles.normalUser
                      }>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => setAge('Nothing')}>
                  <Text
                    style={
                      Age == 'Nothing' ? styles.selectedUser : styles.normalUser
                    }>
                    Doesn't Matter
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        )}
        <Text style={styles.headerStyle}>Distance</Text>
        <View style={styles.textInput}>
          <OutlineInput
            value={radius}
            onChangeText={e => {
              if (e.length == 0) setRadius('');
              else if (e[e.length - 1] >= '0' && e[e.length - 1] <= '9')
                setRadius(e);
              else {
                Toast.show({
                  type: 'error',
                  text1: 'just digits are allowed!',
                });
                //if (e.length == 1) setRadius(null);
              }
            }}
            label="Enter Max Distance(KM)"
            activeValueColor="black"
            activeBorderColor="#42EADDFF"
            activeLabelColor="teal"
            passiveBorderColor="#B2BABB"
            passiveLabelColor="#B2BABB"
            passiveValueColor="#B2BABB"
            width="90%"
          />
        </View>
        <Text style={styles.headerStyle}>Your Location</Text>
        {/* <OutlineInput
          value={radius}
          label=""
          onChangeText={e => {
            if (e.length == 0) setRadius('');
            else if (e[e.length - 1] >= '0' && e[e.length - 1] <= '9')
              setRadius(e);
          }}
          activeValueColor="black"
          activeBorderColor="#42EADDFF"
          activeLabelColor="teal"
          passiveBorderColor="#B2BABB"
          passiveLabelColor="#B2BABB"
          passiveValueColor="#B2BABB"
          //keyboardType="numeric"
        /> */}
        <Card style={styles.cardStyle} elevation={10} cornerRadius={20}>
          <Text style={{marginTop: 5, flex: 1}} numberOfLines={2}>
            {address}
          </Text>
        </Card>
        <TouchableOpacity
          style={{
            backgroundColor: '#58D68D',
            borderRadius: 30,
            // justifyContent: 'center',
            // alignItems: 'center',
            marginHorizontal: 25,
            padding: 4,
            alignSelf: 'center',
          }}
          onPress={permissionHandle}>
          <Text
            style={{
              color: 'white',
              margin: 3,
              marginHorizontal: 5,
              fontSize: 16,
            }}>
            Add Current Location
          </Text>
        </TouchableOpacity>
        <SearchOnMap
          selectedAreaCoordinates={coordinates}
          setSelectedAreaCoordinates={setCoordiantes}
          setAddress={setAddress}
          getAddressUsingMapboxApi={getAddressUsingMapboxApi}></SearchOnMap>

        <Text style={styles.headerStyle}>Grades & Subjects</Text>
        {/* <Text style={{alignSelf:'center',fontSize:18,marginBottom:5,borderWidth:5,borderColor:'white',color:'white',backgroundColor:'darkkhaki',textAlign:'center',textAlignVertical:'center',padding:10,marginTop:20,borderRadius:5,borderTopRightRadius:20,borderTopLeftRadius:20}}>Grades & Subjects</Text> */}

        {/*Search Page should know*/}

        <GradesAndSubjects
          GradeManagement={gradeManagement}
          SubjectManagement={subjectManagement}
          IsGradeSelected={isGradeSelected}
          IsSubjectSelected={isSubjectSelected}></GradesAndSubjects>

        <TouchableOpacity onPress={navigateToResultPage}>
          <Text
            style={[
              styles.selectedUser,
              {
                alignSelf: 'center',
                padding: 10,
                paddingHorizontal: '40%',
                borderColor: '#58D68D',
                backgroundColor: '#58D68D',
              },
            ]}>
            Search
          </Text>
        </TouchableOpacity>

        {/* <ModalResult visibleOrNot={isModalVisible} closeModal={closeModal}></ModalResult> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ScrollView: {
    backgroundColor: 'gray',
  },
  normalUser: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#42EADDFF',
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 10,
    color: 'teal',
    marginBottom: 5,
  },
  selectedUser: {
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#42EADDFF',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 10,
    color: 'white',
    backgroundColor: '#42EADDFF',
    marginBottom: 5,
  },
  cardStyle: {
    padding: 25,
    alignSelf: 'center',
    marginBottom: 15,
    backgroundColor: 'white',
    //backgroundColor: '#3498DB',
  },
  section: {
    marginBottom: 10,
  },
  headerStyle: {
    alignSelf: 'center',
    fontSize: 18,
    marginBottom: 5,
    borderWidth: 5,
    borderColor: 'white',
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
  textInput: {
    fontSize: 16,
    paddingHorizontal: 16,
    marginTop: 15,
  },
});

export default Index;
