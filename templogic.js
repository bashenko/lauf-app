import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import haversine from 'haversine';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: null,
      errorMessage: null,
      latitude: null,
      longitude: null,
      error: null,
    };
  }

  // componentWillMount() {
  componentDidMount() {
    var _this=this;
    Location.watchPositionAsync({
enableHighAccuracy:true, timeInterval:50, activityType: Location.ActivityType.Fitness,
    }, location2 => {
      _this.setState({
        location2, 
        speed: location2.coords.speed, 
        long: location2.coords.longitude, 
        lat: location2.coords.latitude,
        start: {
          latitude: this.state.initLat, 
          longitude: this.state.initLong,
        },
        end: {
          latitude: this.state.lat, 
          longitude: this.state.long,
        },
        distance: haversine({latitude: this.state.initLat, longitude: this.state.initLong}, {latitude: this.state.lat, 
          longitude: this.state.long,}, {unit: 'meter'}),
      });
      // console.log(this.state.start)
    });

    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ 
      location, 
      initLat: location.coords.latitude, 
      initLong: location.coords.longitude,
    });
  };

  // componentDidMount() {
  //   this.watchId = navigator.geolocation.watchPosition(
  //     (position) => {
  //       this.setState({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //         error: null,
  //       });
  //     },
  //     (error) => this.setState({ error: error.message }),
  //     { enableHighAccuracy: true, timeout: 100, maximumAge: 0, distanceFilter: 1},
  //   );
  // }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  

  render() {
    if (this.state.speed >= 0){
    return (
      <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Initial Latitude: {this.state.initLat}</Text>
        <Text>Initial Longitude: {this.state.initLong}</Text>
        <Text>Ongoing Latitude: {this.state.lat}</Text>
        <Text>Ongoing Longitude: {this.state.long}</Text>
       
        {this.state.distance ? <Text>Distance since start: {Math.floor(this.state.distance*100)/100}m</Text> : <Text>Distance since start: 0 m</Text>}
        
        <Text>Speed:  {this.state.speed} meters per second</Text>
        {/* <Text>{Math.floor(100/60) + " h"}, {100%60 + " min" }</Text> */}
        <Text> {Math.round(this.state.speed * Math.pow(60,2))} meters in hour</Text>
        <Text> {Math.round(this.state.speed * Math.pow(60,2)/10)/100} kilometers in hour</Text>

        <Text>Pace {Math.round(1000/this.state.speed/60*100)/100} min/KM</Text>
        <Text>
        {Math.floor(1000/this.state.speed / 60)+ ':' + Math.floor(1000/this.state.speed % 60)} min/km
        </Text>    

        <Text>Onoging Position: {JSON.stringify(this.state.location2)}</Text>
        {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
      </View>
    );
  } else {
    return (
    <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>You better move</Text>
        {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
      </View>
    );
  }
  }
}