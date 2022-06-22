import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect, useRef} from 'react';
//import haversine from 'haversine-distance';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  Pressable,
  Alert,
  TouchableHighlight,
  TouchableOpacity,
  Button,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import {Card} from 'react-native-shadow-cards';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntIcon from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
const Index = ({navigation, route}) => {
  if (navigation === undefined) navigation = useNavigation();
  const headerValue = route?.params.header;
  const {
    selectedUser,
    selectedGender,
    selectedAge,
    enteredRadius,
    enteredCoordinates,
    selectedGrades,
  } = route.params;
  const [dataForFlatList, setDataForFlatList] = useState([]);
  const resultantDataList = useRef([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
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

  const fetchData = async () => {
    let query;
    if (selectedUser == true) {
      query = firestore().collection('teachers');
      if (selectedAge != 'Nothing')
        query = query.where('age', '>=', selectedAge);
    } else query = firestore().collection('students');
    if (selectedGender != 'Nothing')
      query = query.where('gender', '==', selectedGender);
    query = query.where('grades', 'array-contains-any', selectedGrades);
    let result = await query.get();
    let arrayOfUsers = result.docs;
    for (let i = 0; i < arrayOfUsers.length; i++) {
      //if user is in range then fetch his images and store his data alongwith images in resultant dataList which will later fed to flatlist
      if (
        haversine(
          enteredCoordinates[1],
          enteredCoordinates[0],
          arrayOfUsers[i]._data.latitude,
          arrayOfUsers[i]._data.longitude,
        ) <= enteredRadius
      ) {
        console.log('before getting images');
        let displayPicture;
        try {
          displayPicture = await storage()
            .ref(arrayOfUsers[i].id + '/dp')
            .getDownloadURL();
        } catch (error) {
          displayPicture = './../../res/images/no-image.jpg';
        }
        resultantDataList.current.push({
          userId: arrayOfUsers[i].id,
          displayPicture: displayPicture,
          data: arrayOfUsers[i]._data,
        });
        console.log('data of ith item is ready: ', i);
      }
    }
    console.log('AFter preparing data here it is:', resultantDataList.current);
    setDataForFlatList(resultantDataList.current);
    setIsDataLoaded(true);
    // result.forEach(item => {
    //   if (
    //     haversine(
    //       enteredCoordinates[1],
    //       enteredCoordinates[0],
    //       item._data.latitude,
    //       item._data.longitude,
    //     ) <= enteredRadius
    //   ) {
    //     storage()
    //       .ref(getUserId() + '/dp')
    //       .getDownloadURL()
    //       .then(url => {})
    //       .catch(() => {});
    //     console.log('user qualified');
    //   }
    //   //else console.log('user disqualified');
    //   // console.log('result: ', item._data);
    //   // console.log('user Id', item.id);
    //   // console.log(
    //   //   'Distance for this: ',
    //   //   haversine(
    //   //     enteredCoordinates[1],
    //   //     enteredCoordinates[0],
    //   //     item._data.latitude,
    //   //     item._data.longitude,
    //   //   ),
    //   // );
    // });
    //   result.forEach(
    //     item => {
    //       // console.log(
    //       //   'query doc: ',
    //       //   haversine(
    //       //     {latitude: enteredCoordinates[1], longitude: enteredCoordinates[0]},
    //       //     {
    //       //       latitude: item.latitude,
    //       //       longitude: item.longitude,
    //       //     },
    //       //     item,
    //       //   ),
    //       // ),
    //      ,
    //   }
    // );
    /////
    // let query = firestore()
    //   .collection('teachers')
    //   .where('age', '>=', selectedAge)
    //   .where('gender', '==', selectedGender)
    //   .where('grades', 'array-contains-any', selectedGrades);
    // let result = await query.get();
    // result.forEach(item => console.log('query doc: ', item));
  };
  useEffect(() => {
    console.log(
      'values for searching:',
      selectedUser,
      selectedGender,
      selectedAge,
      enteredRadius,
      enteredCoordinates,
      selectedGrades,
    );

    fetchData();
    // firestore()
    //   .collection('students')
    //   .where('grades', 'array-contains-any', selectedGrades)
    //   .get()
    //   .then(querySnapshot =>
    //     querySnapshot.forEach(item =>
    //       console.log('query result:', item.data()),
    //     ),
    //   );
    //querySnapshot.forEach(item=>console.log("query result: ",item))
  }, []);
  const data = [
    {
      name: 'Faizan Muhammad',
      gender: 'male',
      fees: '15000',
      location: 'Lahore',
      verified: true,
    },
    {
      name: 'Faraz Ali',
      gender: 'male',
      fees: '18000',
      location: 'Karachi',
      verified: true,
    },
    {
      name: 'Mehroz Muzaffar',
      gender: 'female',
      fees: '13000',
      location: 'Quetta',
      verified: true,
    },
    {
      name: 'Gul Sher Khan',
      gender: 'male',
      fees: '10000',
      location: 'Okara',
      verified: true,
    },
    {
      name: 'Ahsan Mehmood',
      gender: 'female',
      fees: '14000',
      location: 'Multan',
      verified: true,
    },
    {
      name: 'Kashif Tariq',
      gender: 'male',
      fees: '17000',
      location: 'Gilgit',
      verified: true,
    },
    {
      name: 'Kashif Tariq',
      gender: 'male',
      fees: '17000',
      location: 'Gilgit',
      verified: true,
    },
    {
      name: 'Kashif Tariq',
      gender: 'male',
      fees: '17000',
      location: 'Gilgit',
      verified: true,
    },
    {name: 'Kashif Tariq', gender: 'male', fees: '17000', location: 'Gilgit'},
    {name: 'Kashif Tariq', gender: 'male', fees: '17000', location: 'Gilgit'},
    {name: 'Kashif Tariq', gender: 'male', fees: '17000', location: 'Gilgit'},
    {name: 'Kashif Tariq', gender: 'male', fees: '17000', location: 'Gilgit'},
    {name: 'Kashif Tariq', gender: 'male', fees: '17000', location: 'Gilgit'},
  ];

  function designItem({item}) {
    //   height parent view is set according to the height of image which is fixed, and other things settle down
    // return
    return (
      <TouchableOpacity
        style={{flexDirection: 'row', marginBottom: 10}}
        onPress={() =>
          navigation.navigate('UserDetails', {
            item,
            selectedUser: selectedUser ? 'teacher' : 'student',
          })
        }>
        <Card
          style={{
            margin: 2,
            padding: 2,
            alignSelf: 'center',
            flexDirection: 'row',
          }}
          elevation={10}>
          <Image
            borderRadius={50}
            source={
              item.displayPicture.includes('http')
                ? {uri: item.displayPicture}
                : require('../../res/images/no-image.jpg')
            }
            style={{height: 70, width: 70}}
          />
          {/*Now I want to split this view into further 2 rows of equal space, both will be sum parent height which is according to image height*/}
          <View style={{flex: 1}}>
            <View style={{flex: 1}}>
              <Text
                numberOfLines={1}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  color: 'black',
                  fontSize: 16,
                }}>
                {item.data.name}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <View
                style={{
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    backgroundColor: 'red',
                    color: 'white',
                    borderRadius: 15,
                    padding: 4,
                    paddingHorizontal: 8,
                  }}>
                  Fees: {item.data.fees ? 'Rs.' + item.data.fees : ' N/A'}
                </Text>
                <Icon name={item.data.gender} color="#F39C12" size={20}></Icon>
                {item.data.verified == true ? (
                  <Text
                    style={{
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      borderRadius: 15,
                      padding: 6,
                      backgroundColor: '#58D68D',
                      color: 'white',
                    }}>
                    verified
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.Container}>
      {headerValue == true ? (
        <Card style={styles.HeaderCard} elevation={35}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntIcon name="back" size={30} color="black"></AntIcon>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              textAlignVertical: 'center',
              color: 'black',
              flex: 1,
            }}>
            Search Results
          </Text>
        </Card>
      ) : null}
      {/* <Text>{dataForFlatList.length}</Text> */}
      {isDataLoaded && (
        <FlatList data={dataForFlatList} renderItem={designItem}></FlatList>
      )}
      {isDataLoaded && dataForFlatList.length == 0 && (
        <Text style={{alignSelf: 'center', fontSize: 20}}>
          No Results Found
        </Text>
      )}
      {!isDataLoaded && (
        <ActivityIndicator
          color="pink"
          size={100}
          style={{
            alignSelf: 'center',
            marginBottom: 30,
            height: '20%',
            width: '20%',
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 18,
    paddingTop: '0%',
  },
  HeaderCard: {
    margin: 10,
    padding: 3,
    alignSelf: 'center',
    flexDirection: 'row',
  },
});

export default Index;
