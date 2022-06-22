import React from 'react';
import { View, StyleSheet, ScrollView, Text,Pressable,Alert, Modal, TouchableHighlight, TouchableOpacity, Button, FlatList } from 'react-native';

const App = () => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello World!</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.textStyle}>Show Modal</Text>
        </Pressable>
      </View>
    );
  };

const Results = () => {

    function itemClicked(name) {
        alert(name)
    }

    const data=[{name:"Faizan"},{name:"Ali"},{name:"Umar"},{name:"Faizan"},{name:"Ali"},{name:"Umar"},{name:"Faizan"},{name:"Ali"},{name:"Umar"},{name:"Faizan"},{name:"Ali"},{name:"Umar"}]
    return <View style={styles.container}>
        <FlatList
        data={data}
        renderItem={({item}) => <Button title={String(item.name)} onPress={()=>itemClicked(item.name)}></Button>}
        >
        </FlatList>
    </View>;
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'pink',
    },
    text:{
        backgroundColor:"dodgerblue",
        padding:20,
        margin:4,
        color:'red',
        fontSize:20
    },






    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
})

export default Results;