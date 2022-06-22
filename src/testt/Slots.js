import React, {useState} from 'react';
import {Button, Text, View, StyleSheet} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import TimeSlots from './TimeSlots';
const Slots = props => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#42EADDFF',
          borderRadius: 90,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <Text
          style={{paddingHorizontal: '5%', marginRight: '4%', margin: '3%'}}>
          {((props.stime.getHours() + 11) % 12) + 1}:
          {props.stime.getMinutes() === 0 ? '00' : props.stime.getMinutes()}{' '}
          {props.stime.getHours() >= 0 && props.stime.getHours() <= 11
            ? 'AM'
            : 'PM'}
          {' to '}
          {((props.etime.getHours() + 11) % 12) + 1}:
          {props.etime.getMinutes() === 0 ? '00' : props.etime.getMinutes()}{' '}
          {props.etime.getHours() >= 0 && props.etime.getHours() <= 11
            ? 'AM'
            : 'PM'}
        </Text>
        <FontAwesome
          name={'remove'}
          color="red"
          marginHorizontal={100}
          size={20}
          onPress={() => alert('I am Clicked')}
        />
      </View>
    </View>
  );
};
export default Slots;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    backgroundColor: 'white',
  },
});
