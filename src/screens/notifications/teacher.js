import React, {useEffect, useContext, useState} from 'react';
import {Text, View, ActivityIndicator} from 'react-native';
import ResultComponent from '../notifications/components/index.js';
import {NotificationsContext} from '../../Context/index.js';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
const Index = () => {
  const notificationsContext = useContext(NotificationsContext);
  //data format of single entry
  //{userId,date,type,status,displayPicture,data};
  const [data, setData] = useState([]); //append new messages in this data
  const [keys, setKeys] = useState([]); //users ids will be stored in this state
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  //this use effect will run when new messages will come

  const findIndexOf = tempKey => {
    for (let i = 0; i < keys.length; i++) if (keys[i][0] == tempKey) return 1;
    return -1;
  };
  const fetchNewData = async tempKeys => {
    //let allData = [];
    for (let i = 0; i < tempKeys.length; i++) {
      //means this message is new so fetch it
      if (findIndexOf(tempKeys[i][0]) == -1) {
        let displayPicture;
        try {
          displayPicture = await storage()
            .ref(tempKeys[i][0] + '/dp')
            .getDownloadURL();
        } catch (error) {
          displayPicture = './../../res/images/no-image.jpg';
        }
        //console.log('this is a picture: ', displayPicture);
        let userData = await firestore()
          .collection('students')
          .doc(tempKeys[i][0])
          .get();
        userData = userData.data();
        //console.log('this is user data:', userData);
        let newUser = {
          userId: tempKeys[i][0],
          date: tempKeys[i][1],
          type: tempKeys[i][2],
          status: tempKeys[i][3],
          displayPicture: displayPicture,
          data: userData,
        };
        //allData.push(newUser);
        //let temp = data.push(newUser);
        setData(oldData => [...oldData, newUser]);
        // let allData = data;
        // allData.push(newUser);
        //let temp = [...data];
        //temp.push(newUser);
        // for (let itm in data) temp.push(itm);
        // temp.push(newUser);

        //tempAllUsers.push(newUser);
        //console.log('after pushing data: ', tempAllUsers);
      }
      setIsDataLoaded(true);
      //console.log('all data: ', allData);
      //setData(oldData => [...oldData, allData]);
      //console.log('before pushing data: ', tempAllUsers);
    }
  };
  useEffect(() => {
    let tempKeys = notificationsContext.teacher.map(item => [
      item.id,
      item.date,
      item.type,
      item.status,
    ]);
    fetchNewData(tempKeys);
    setKeys(tempKeys);
  }, [
    notificationsContext.teacher,
    //notificationsContext.teacherOhter,
    //notificationsContext.student,
    //notificationsContext.studentOhter,
    //notificationsContext.teacherUnread,
  ]);
  return (
    <>
      {isDataLoaded && data.length != 0 && (
        <ResultComponent
          dataList={data}
          setData={setData}
          selectedUser="teacher"></ResultComponent>
      )}
      {isDataLoaded && data.length == 0 && (
        <View style={{alignSelf: 'center', flex: 1}}>
          No notifications for you
        </View>
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
    </>
  );
  //return <Text>I'm screen</Text>;
};

export default Index;
