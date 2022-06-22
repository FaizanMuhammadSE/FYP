import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const Index = ({
  gender = 'male',
  setGender = () => console.log('No gender setter is passed as argument'),
}) => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 150,
          height: 52,
        }}>
        <TouchableOpacity
          style={[
            styles.switchSelector,
            gender == 'male' ? styles.activeArea : styles.inActiveArea,
          ]}
          onPress={() => setGender('male')}>
          <FontAwesome name="male" color="black" size={20} />
          <Text style={{fontSize: 18, paddingLeft: 5}}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.switchSelector,
            gender == 'female' ? styles.activeArea : styles.inActiveArea,
          ]}
          onPress={() => setGender('female')}>
          <FontAwesome name="female" color="black" size={20} />
          <Text style={{fontSize: 18, paddingLeft: 5}}>Female</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  activeArea: {
    backgroundColor: 'aqua',
  },
  inActiveArea: {
    backgroundColor: 'white',
  },
  switchSelector: {
    height: 50,
    borderRadius: 150,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
export default Index;
