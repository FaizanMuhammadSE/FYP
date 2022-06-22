import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect, useRef, useContext} from 'react';
import {NotificationsContext} from '../../../Context';
import {Card} from 'react-native-shadow-cards';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntIcon from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
const Index = ({dataList, setData, selectedUser}) => {
  //const notificationsContext = useContext(NotificationsContext);
  //console.log('REsult of notifications:', dataList);
  const navigation = useNavigation();
  function parseDate(input) {
    let parts = input.match(/(\d+)/g);
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1] - 1, parts[2]); // months are 0-based
  }
  function designItem({item}) {
    console.log(item.status);
    console.log('verification status: ', item.data.verified);
    console.log('User details:', item.data);
    return (
      <TouchableOpacity
        style={{flexDirection: 'row', marginBottom: 10}}
        onPress={() => {
          console.log('Item clicked ', item.userId);
          firestore()
            .collection(selectedUser == 'teacher' ? 'teachers' : 'students')
            .doc(auth().currentUser.uid)
            .update({[`messages.${item.userId}.status`]: false})
            .then(() => {
              console.log('status changed successfully');
              setData(
                dataList.map(userData => {
                  if (userData.userId == item.userId)
                    return {...userData, status: false};
                  return userData;
                }),
              );
            })
            .catch(() => console.log('status not changed'));
          navigation
            .getParent()
            .navigate('UserDetails', {item: item, selectedUser});
          //navigation.navigate('UserDetails', {item});
        }}>
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
                : require('../../../res/images/no-image.jpg')
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
                  color: item.status == true ? 'black' : 'gray',
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
                    backgroundColor: item.status == true ? 'red' : 'gray',
                    color: 'white',
                    borderRadius: 15,
                    padding: 4,
                    paddingHorizontal: 8,
                  }}>
                  Fees: {item.data.fees ? 'Rs.' + item.data.fees : 'N/A'}
                </Text>
                <Icon
                  name={item.data.gender}
                  color={item.status == true ? '#F39C12' : 'gray'}
                  size={20}></Icon>
                {item.data.verified == true ? (
                  <Text
                    style={{
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      borderRadius: 15,
                      padding: 6,
                      backgroundColor: item.status == true ? '#58D68D' : 'gray',
                      color: 'white',
                    }}>
                    verified
                  </Text>
                ) : null}
              </View>
              <View
                style={{
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <Text style={{color: item.status == true ? 'black' : 'gray'}}>
                  {item.date
                    ? new Date(item.date).getDay() +
                      '/' +
                      new Date(item.date).getMonth() +
                      '/' +
                      new Date(item.date).getFullYear()
                    : null}
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
  return (
    <View style={styles.Container}>
      {/* {headerValue == true ? (
        <Card style={styles.HeaderCard} elevation={35}>
          <TouchableOpacity
            onPress={() => {
              //navigation.goBack();
            }}>
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
      ) : null} */}
      {/* <Text>{dataForFlatList.length}</Text> */}
      <FlatList data={dataList} renderItem={designItem}></FlatList>
    </View>
  );
  // return (
  //   <>
  //     <View>
  //       <Text>I'm screen</Text>
  //     </View>
  //   </>
  // );
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
