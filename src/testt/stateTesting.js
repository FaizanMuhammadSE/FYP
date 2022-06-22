import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
const Index = () => {
  const [data, setData] = useState([]); //append new messages in this data
  function doSomething() {
    setData(['FAizan']);
    setData(oldItem => [...oldItem, 'Ali']);
    setData(oldItem => [...oldItem, 'kaka']);
    //setData([...data, 'Shah']);
  }
  useEffect(() => {
    setInterval(() => setData(oldItem => [...oldItem, Date()]), 1000);
    //doSomething();
  }, []);
  useEffect(() => {
    console.log('data has changed: ', data);
  }, [data]);
  return (
    <>
      <View>
        <Text>Hello</Text>
      </View>
    </>
  );
};
export default Index;
