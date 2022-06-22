import React, {useEffect, useContext} from 'react';
import {View, Button, Text} from 'react-native';
import {TestingContext} from '../../Context';
const Index = ({navigation, route}) => {
  const context = useContext(TestingContext);
  useEffect(() => {
    console.log('use effect of screen A called');
    // setInterval(
    //   () => console.log("I'm still running from screenA", Date()),
    //   1000,
    // );
    return () => console.log('ScreenA unmounted');
  });
  return (
    <>
      <View>
        <Text>THis is SCreen A: {context.time}</Text>
        <Button
          title="Move to B"
          onPress={() => navigation.navigate('ScreenB')}></Button>
      </View>
    </>
  );
};

export default Index;
