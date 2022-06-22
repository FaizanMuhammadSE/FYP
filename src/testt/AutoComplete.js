import React, {useState} from 'react';
import {TextInput, View, Text, TouchableOpacity} from 'react-native';
const AutoComplete = () => {
  const [state, setState] = useState([]);
  return (
    <>
      <View style={{flex: 1, padding: 15}}>
        <TextInput
          onChangeText={async e => {
            try {
              const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${e}.json?access_token=sk.eyJ1IjoiZmFpemFubXVoYW1tYWQiLCJhIjoiY2wxZDNpejAwMGR3dzNpbnJ4eGcyN25zcyJ9.0cGcYbGcksjg51diWhv7sg&autocomplete=true&country=PK`;
              const response = await fetch(endpoint);
              const results = await response.json();
              setState(results?.features);
              console.log(results.features);
            } catch (error) {
              console.log('Error fetching data, ', error);
            }
          }}></TextInput>
        <View style={{flex: 1}}>
          <View
            style={{
              position: 'absolute',
              height: 150,
              width: '100%',
              backgroundColor: 'purple',
            }}></View>
          {state.length > 0 ? (
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'white',
              }}>
              {state.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{padding: 3, borderRadius: 15}}>
                  <Text
                    style={{
                      borderColor: 'teal',
                      borderWidth: 1,
                      borderRadius: 10,
                      padding: 3,
                    }}>
                    {item.place_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>
      </View>
      <View style={{flex: 1, backgroundColor: 'yellow'}}>
        <View style={{position: 'relative'}}></View>
      </View>
    </>
  );
};

export default AutoComplete;
