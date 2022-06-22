import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Text} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

MapboxGL.setAccessToken(
  'sk.eyJ1IjoiZmFpemFubXVoYW1tYWQiLCJhIjoiY2wxZDNpejAwMGR3dzNpbnJ4eGcyN25zcyJ9.0cGcYbGcksjg51diWhv7sg',
);

const Index = ({
  selectedAreaCoordinates = [8.34234234, 7.2342352],
  setSelectedAreaCoordinates,
  getAddressUsingMapboxApi,
  setAddress,
  navigation,
  route,
}) => {
  const [nearbyAreas, setNearbyAreas] = useState([]);
  return (
    <>
      <View style={{height: 300, width: '100%', padding: 15}}>
        <TextInput
          placeholder="Search on map..."
          style={{borderWidth: 1, borderRadius: 5}}
          onChangeText={async e => {
            try {
              const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${e}.json?access_token=sk.eyJ1IjoiZmFpemFubXVoYW1tYWQiLCJhIjoiY2wxZDNpejAwMGR3dzNpbnJ4eGcyN25zcyJ9.0cGcYbGcksjg51diWhv7sg&autocomplete=true&country=PK`;
              const response = await fetch(endpoint);
              const results = await response.json();
              console.log(results.features);
              setNearbyAreas(results?.features);
            } catch (error) {
              console.log('Error fetching data, ', error);
            }
          }}></TextInput>
        {/* <View style={{backgroundColor: 'pink'}}> */}
        {/* <View
            style={{
              position: 'absolute',
              height: 150,
              width: '100%',
              backgroundColor: 'purple',
            }}></View> */}
        <View
          style={{
            flex: 1,
            // backgroundColor: 'gray',
            // marginTop: '2%',
            //position: 'absolute',
          }}>
          <MapboxGL.MapView
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              borderWidth: 1,
              borderColor: 'teal',
              borderRadius: 5,
            }}
            onPress={val => {
              console.log('ONPress called:', val);
              setSelectedAreaCoordinates(val.geometry.coordinates); //longitude and latitude
              getAddressUsingMapboxApi(
                val.geometry.coordinates[0],
                val.geometry.coordinates[1],
              ); //(longitude,latitude)
            }}>
            {/* {
              // PointAnnotation will display marker on map, and don't display it until user gives us location
              selectedAreaCoordinates.length > 0 && ( */}
            <MapboxGL.Camera
              zoomLevel={12}
              centerCoordinate={selectedAreaCoordinates}
            />
            {/* ) && ( */}
            <MapboxGL.PointAnnotation
              id="map"
              coordinate={selectedAreaCoordinates}
            />
            {/* ) &&
                console.log('its working')
            } */}
          </MapboxGL.MapView>

          {nearbyAreas.length > 0 ? (
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'white',
              }}>
              {nearbyAreas.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{padding: 3, borderRadius: 15}}
                  onPress={() => {
                    setSelectedAreaCoordinates(item.center);
                    setNearbyAreas([]);
                    setAddress(item.place_name);
                  }}>
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
      {/* </View> */}
      {/* <View style={{flex: 1, backgroundColor: 'yellow'}}>
        <View style={{position: 'relative'}}></View>
      </View> */}
    </>
  );
};

export default Index;
