import React, {useEffect, useState} from 'react';
import {View, Button, Text} from 'react-native';
import Child from './childComponent';
import {temp, setValue} from '../../../src/res/data';
import {stat} from 'react-native-fs';
const parentComponent = () => {
  let a = 1;
  const fun = () => {
    setValue(a);
    a++;
  };
  const [state, setState] = useState(1000);
  useEffect(() => {
    console.log('Alone parent useEffect');
    return () => {
      console.log('Alone Parent Component Unmounted');
    };
  });
  useEffect(() => {
    console.log('Parent component called' + state);
    setState(2500);
    return () => {
      console.log('Parent component unmounted');
    };
  }, []);
  return (
    <View>
      <Text>I'm parent component {temp}</Text>
      <Button onPress={fun} title="Chane Value"></Button>
      <Child></Child>
    </View>
  );
};

export default parentComponent;
