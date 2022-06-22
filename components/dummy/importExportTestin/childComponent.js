import React, {useState, useEffect} from 'react';
import {View, Button, Text} from 'react-native';
import {temp} from '../../../src/res/data';
const childComponent = () => {
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    console.log('child component useEffect');
    return () => {
      console.log('child component unmounted');
    };
  });
  return (
    <View>
      <Text>I'm child component, here is data value {temp}</Text>
      <Button onPress={() => setCounter(counter + 1)} title="Inc"></Button>
      <Text>Coounter VAlue: {counter}</Text>
    </View>
  );
};

export default childComponent;
