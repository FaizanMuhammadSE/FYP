import React, { useState } from "react";
import { Alert, StyleSheet, Text, Pressable, View, TouchableOpacity, Button, ScrollView } from "react-native";
import Modal from "react-native-modal";


const WrapperComponent = () => {
    const [value, setValue] = useState(false)
    return (
      <View>
        <Modal isVisible={value} animationInTiming={1000} animationOutTiming={500}>
          <View style={{ flex: 1,backgroundColor:'white',padding:20,margin:0,borderRadius:20 }}>
              <ScrollView>
            <Text style={{fontSize:48}}>I am the modal content!</Text>
            <Text style={{fontSize:48}}>I am the modal content!</Text>
            <Text style={{fontSize:48}}>I am the modal content!</Text>
            <Text style={{fontSize:48}}>I am the modal content!</Text>
            <Text style={{fontSize:48}}>I am the modal content!</Text>
            <Text style={{fontSize:48}}>I am the modal content!</Text>
            <Text style={{fontSize:48}}>I am the modal content!</Text>
            <Text style={{fontSize:48}}>I am the modal content!</Text>
            <Text style={{fontSize:48}}>I am the modal content!</Text>
            <Button title="Close" onPress={()=>setValue(false)}></Button>
            </ScrollView>
          </View>
        </Modal>
        <Button title="Open" onPress={()=>setValue(true)}></Button>
      </View>
    );
}

export default WrapperComponent;