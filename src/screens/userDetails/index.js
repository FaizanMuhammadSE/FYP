import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Linking,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserAvatar from 'react-native-user-avatar';
import {Card} from 'react-native-shadow-cards';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Modal from 'react-native-modal';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {FirebaseStorageTypes} from '@react-native-firebase/storage';

MapboxGL.setAccessToken(
  'sk.eyJ1IjoiZmFpemFubXVoYW1tYWQiLCJhIjoiY2wxZDNpejAwMGR3dzNpbnJ4eGcyN25zcyJ9.0cGcYbGcksjg51diWhv7sg',
);
const Index = ({navigation, route}) => {
  const data = {
    name: 'Faizan Muahammad',
    gender: 'male',
    fees: '18000',
    experience: 7,
    timeSlots: ['3pm to 4pm', '5pm to 6 pm', '8pm to 10pm'],
    about:
      'No, in stackNavigator, if routed screen in already available in the stack then it will not be re-rendered...',
  };
  const {item, selectedUser} = route.params;
  const [imagesList, setImagesList] = useState([]);
  const [imageApiStatus, setImageApiStatus] = useState('Loading...');
  const [imagePreview, setImagePreview] = useState(false);
  const [selectedImageForPreview, setSelectedImageForPreview] = useState('');
  const [address, setAddress] = useState('Not provided by user...');
  const [coordinates, setCoordiantes] = useState([8.12345, 7.12345]);
  const [mapVisibility, setMapVisibility] = useState(false);
  const fetchImages = async () => {
    let documents = [];
    try {
      const url = await storage()
        .ref(item.userId + '/doc_0')
        .getDownloadURL();
      documents.push(url);
    } catch (error) {
      if (error.code == 'storage/object-not-found')
        console.log('image 00 not found');
    }
    try {
      const url = await storage()
        .ref(item.userId + '/doc_1')
        .getDownloadURL();
      documents.push(url);
    } catch (error) {
      if (error.code == 'storage/object-not-found')
        console.log('image 01 not found');
    }
    try {
      const url = await storage()
        .ref(item.userId + '/doc_2')
        .getDownloadURL();
      documents.push(url);
    } catch (error) {
      if (error.code == 'storage/object-not-found')
        console.log('image 00 not found');
    }
    if (documents.length == 0) setImageApiStatus('No image added yet');
    setImagesList(documents);
  };
  const phoneLinking = phone => {
    console.log('phone working:', phone);
    if (phone && phone.length == 11) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert('Alert', 'No phone number added yet.', [
        {
          text: '',
          //onPress: () => setDeletionEnabled(false),
        },
        {
          text: 'OK',
        },
      ]);
    }
  };
  const emailLinking = email => {
    if (email && email.includes('yourname@gmail.com') == false) {
      Linking.openURL(
        `mailto:${email}?subject=${'TutorHub'}&body=${'Write your message here...'}`,
      );
    } else {
      Alert.alert('Alert', 'No email added yet.', [
        {
          text: '',
          //onPress: () => setDeletionEnabled(false),
        },
        {
          text: 'OK',
        },
      ]);
    }
  };
  const whatsappLinking = whatsApp => {
    if (whatsApp && whatsApp.length == 11) {
      Linking.openURL(
        `whatsapp://send?phone=${whatsApp}&text=${'Write here...'}`,
      );
    } else {
      Alert.alert('Alert', 'No phone number added yet.', [
        {
          text: '',
          //onPress: () => setDeletionEnabled(false),
        },
        {
          text: 'OK',
        },
      ]);
    }
  };
  const getAddress = () => {
    fetch(
      'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
        item.data.longitude +
        ', ' +
        item.data.latitude +
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
  useEffect(() => {
    //console.log('user details useEffect: ', item);
    //fetching images from storage
    if (selectedUser == 'teacher') fetchImages();
    if (item.data.longitude != undefined && item.data.latitude != undefined) {
      getAddress();
      setCoordiantes([item.data.longitude, item.data.latitude]);
    }
  }, []);
  return (
    <ScrollView>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <AntIcon name="back" size={35} color="black"></AntIcon>
      </TouchableOpacity>
      <View
        style={{
          alignSelf: 'center',
          borderRadius: 50,
          height: 100,
          width: 100,
          backgroundColor: 'purple',
          elevation: 16,
          marginBottom: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            setSelectedImageForPreview(
              item.displayPicture.includes('http')
                ? item.displayPicture
                : '../../res/images/no-image.jpg',
            );
            setImagePreview(true);
          }}>
          <Image
            borderRadius={50}
            source={
              item.displayPicture.includes('http') == true
                ? {uri: item.displayPicture}
                : require('../../res/images/no-image.jpg')
            }
            style={{height: 100, width: 100}}
          />
        </TouchableOpacity>
      </View>
      <Card
        style={{
          alignSelf: 'center',
          flexDirection: 'row',
          backgroundColor: '#42EADDFF',
          justifyContent: 'center',
          padding: 10,
          marginBottom: 15,
        }}
        elevation={20}
        cornerRadius={10}
        opacity={0.2}>
        <Text numberOfLines={1} style={{marginHorizontal: 15, color: 'black'}}>
          {item.data.name}
        </Text>
      </Card>
      {/* <Card style={styles.cardStyle} elevation={10} cornerRadius={20}>
            <Icon style={{alignSelf:'center',marginBottom:10}} name='male' size={35} color="maroon"></Icon>
            <View style={{flexDirection:'row',justifyContent:'space-around',flexWrap:'wrap'}}>
                <Text style={styles.cardItem}>Experience: {data.experience} years</Text>
                <Text style={styles.cardItem}>Fees: Rs.{data.fees}</Text>
            </View>
        </Card> */}
      <Card style={styles.cardStyle} elevation={30} cornerRadius={20}>
        <Text
          style={[
            styles.cardItem,
            {backgroundColor: 'red', borderColor: 'red'},
          ]}>
          Fees: {item.data.fees ? 'Rs.' + item.data.fees : 'N/A'}
        </Text>
        <Icon
          style={{alignSelf: 'center', marginBottom: 10}}
          name={item.data.gender}
          size={35}
          color="#F39C12"></Icon>
        <Text
          style={[
            styles.cardItem,
            {backgroundColor: '#5DADE2', borderColor: '#5DADE2'},
          ]}>
          Experience:
          {item.data.experience ? item.data.experience + ' years' : ' N/A'}
        </Text>
      </Card>
      {/* <Card style={styles.cardStyle} elevation={30} cornerRadius={20}>
        <Text
          style={{
            alignSelf: 'center',
            color: '#F39C12',
            fontSize: 22,
            marginBottom: 10,
          }}>
          Time Slots
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
          }}>
          {data.timeSlots.map((item, index) => (
            <Text
              style={[
                styles.cardItem,
                {backgroundColor: '#F7DC6F', borderColor: '#F7DC6F'},
              ]}>
              {item}
            </Text>
          ))}
        </View>
      </Card> */}
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
        {item.data.grades != false && item.data.grades.length > 0
          ? 'Grades & Subjects'
          : 'No Grades Added'}
      </Text>
      {item.data.grades.map((grade, index) => (
        <View key={index}>
          <Text style={styles.selectedGrade}>{grade}</Text>
          <Card style={styles.cardStyle} elevation={10} cornerRadius={20}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
              }}>
              {item.data.subjects[grade].map((subject, subIndex) => (
                <Text key={subIndex} style={styles.selectedSubject}>
                  {subject}
                </Text>
              ))}
            </View>
          </Card>
        </View>
      ))}
      {/* <View>
        <Text style={styles.selectedGrade}>Grade 05</Text>
        <Card style={styles.cardStyle} elevation={10} cornerRadius={20}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
            }}>
            <Text style={styles.selectedSubject}>English</Text>
            <Text style={styles.selectedSubject}>Maths</Text>
            <Text style={styles.selectedSubject}>Urdu</Text>
            <Text style={styles.selectedSubject}>Computer</Text>
          </View>
        </Card>
      </View>

      <View>
        <Text style={styles.selectedGrade}>Grade 11</Text>
        <Card style={styles.cardStyle} elevation={10} cornerRadius={20}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
            }}>
            <Text style={styles.selectedSubject}>English</Text>
            <Text style={styles.selectedSubject}>Maths</Text>
            <Text style={styles.selectedSubject}>Biology</Text>
            <Text style={styles.selectedSubject}>Physics</Text>
            <Text style={styles.selectedSubject}>Computer</Text>
          </View>
        </Card>
      </View> */}

      <Text style={styles.headerStyle}>User Location</Text>
      <Card style={styles.cardStyle} elevation={10} cornerRadius={20}>
        <Text style={{marginTop: 5, flex: 1}} numberOfLines={2}>
          {address}
        </Text>
        {address.includes('...') == false && (
          <TouchableOpacity
            style={{
              backgroundColor: 'skyblue',
              borderRadius: 30,
              marginHorizontal: 25,
              padding: 4,
              alignSelf: 'center',
            }}
            onPress={() => setMapVisibility(true)}>
            <Text
              style={{
                color: 'white',
                margin: 3,
                marginHorizontal: 5,
                fontSize: 16,
              }}>
              See on map
            </Text>
          </TouchableOpacity>
        )}
      </Card>
      {selectedUser == 'teacher' && (
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
          Verification
        </Text>
      )}
      {selectedUser == 'teacher' && (
        <Card style={styles.cardStyle} elevation={10} cornerRadius={20}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
            }}>
            {imagesList.map((image, index) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedImageForPreview(image);
                  setImagePreview(true);
                }}
                key={index}>
                <Image
                  borderRadius={2}
                  source={{uri: image}}
                  style={{
                    height: 100,
                    width: 100,
                    margin: 3,
                    borderWidth: 1,
                    borderColor: 'teal',
                    borderRadius: 5,
                  }}
                />
              </TouchableOpacity>
            ))}
            {imagesList.length == 0 && (
              <Text style={styles.selectedSubject}>{imageApiStatus}</Text>
            )}
          </View>
        </Card>
      )}
      {selectedUser == 'teacher' && item.data.about != false && (
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
          About
        </Text>
      )}
      {selectedUser == 'teacher' && item.data.about != false && (
        <Card style={styles.cardStyle} elevation={10} cornerRadius={20}>
          <Text style={{marginHorizontal: 15, color: 'black'}}>
            {item.data.about}
          </Text>
        </Card>
      )}
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
        Contact Details
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
              // console.log('Link phone', item.data.phone);
              // if (item.data.phone != undefined && item.data.phone != '') {
              //   Linking.openURL(`tel:${'03044665504'}`);
              // } else {
              // Toast.show({
              //   type: 'success',
              //   text1: 'Phone # is not added yet.',
              //   text2: '',
              // });
              phoneLinking(item.data.phone);
              //console.log('its working');
            }}>
            <MaterialIcon name="phone" color="black" size={50}></MaterialIcon>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              whatsappLinking(item.data.whatsapp);
            }}>
            <MaterialIcon
              name="whatsapp"
              color="green"
              size={50}></MaterialIcon>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              emailLinking(item.data.email);
            }}>
            <MaterialIcon name="gmail" color="#BB001B" size={50}></MaterialIcon>
          </TouchableOpacity>
        </View>
      </Card>
      <Text
        style={[
          styles.cardItem,
          {alignSelf: 'center', padding: 10, paddingHorizontal: '40%'},
        ]}>
        The End
      </Text>
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
      <Modal
        animationType={'slide'}
        onBackButtonPress={() => setMapVisibility(false)}
        onBackdropPress={() => setMapVisibility(false)}
        visible={mapVisibility}>
        <View>
          <MapboxGL.MapView style={{height: '100%', width: '100%'}}>
            <MapboxGL.Camera zoomLevel={12} centerCoordinate={coordinates} />
            <MapboxGL.PointAnnotation id="map" coordinate={coordinates} />
          </MapboxGL.MapView>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardStyle: {
    padding: 25,
    alignSelf: 'center',
    marginBottom: 15,
    backgroundColor: 'white',
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
    marginTop: 5,
  },
  selectedSubject: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#F39C12',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 10,
    color: 'white',
    backgroundColor: '#F39C12',
    marginBottom: 5,
  },

  selectedGrade: {
    borderWidth: 3,
    borderColor: '#F39C12',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 10,
    color: 'white',
    backgroundColor: '#F39C12',
    marginBottom: 5,
    marginHorizontal: 5,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },

  selectedSubject: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 10,
    color: 'white',
    backgroundColor: '#F39C12',
    marginBottom: 5,
  },
});

export default Index;
