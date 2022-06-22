import React, {useEffect, useContext} from 'react';
import {View, Button, Text} from 'react-native';
import {TestingContext} from '../../Context';
const Index = ({navigation, route}) => {
  const context = useContext(TestingContext);
  useEffect(() => {
    console.log('use effect of Screen B called: ', context.time);
    return () => console.log('ScreenB unmounted');
  }, []);
  return (
    <>
      <View>
        <Text>THis is SCreen B</Text>
        <Button
          title="Move Back"
          onPress={() => navigation.navigate('ScreenA')}></Button>
      </View>
    </>
  );
};

export default Index;
