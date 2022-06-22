import React, {useState} from 'react';
import {Text, Switch, StyleSheet, View} from 'react-native';

const Index = () => {
  const [VisibilityOne, setVisibilityOne] = useState(false);
  const [VisibilityTwo, setVisibilityTwo] = useState(false);
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.TextStyle}>Teacher Notifications</Text>
        <Switch
          trackColor={{false: 'gray', true: '#42EADDFF'}}
          onValueChange={() =>
            setVisibilityOne(previousState => !previousState)
          }
          value={VisibilityOne}
        />
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.TextStyle}>Student Notifications</Text>
        <Switch
          trackColor={{false: 'gray', true: '#42EADDFF'}}
          onValueChange={() =>
            setVisibilityTwo(previousState => !previousState)
          }
          value={VisibilityTwo}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    paddingTop: 20,
    justifyContent: 'space-around',
  },
  TextStyle: {
    fontSize: 20,
    color: 'black',
  },
});
export default Index;
