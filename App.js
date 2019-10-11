import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Image, Button, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import  Topnav  from './components/Topnav/Topnav.js';
import  Trackers  from './components/Trackers.js';
import LapCard from './components/LapCard.js';
import PaceTracker from './components/PaceTracker.js';

export default class App extends Component {

  
 render() {
    return (
      <View>
        <LinearGradient
          colors={['#009DF0', '#20DCFF']}
          style={styles.gradientContainer}>
          <Topnav />
          <Trackers distance="100" lapTime="1:32" time="3:00" />
          <PaceTracker pace="3:35"/>
          
          <View style={{flex: 1, position: 'absolute', top: 500, height: 125, width: '100%', flexDirection: 'row'}}>
            <ScrollView scrollEventThrottle={16} horizontal={true} showsHorizontalScrollIndicator={false} style={{flex: 4, height: 125}}>
              <LapCard lapNum="1" lapTime="5:45" />
              <LapCard lapNum="2" lapTime="5:45" />
              <LapCard lapNum="3" lapTime="5:45" />
              <LapCard lapNum="4" lapTime="5:45" />
              <LapCard lapNum="5" lapTime="5:45" />
            </ScrollView>
            <TouchableOpacity onPress={() => console.log('lap pressed!')} style={{height: 125}}>
            <View style={{
                width: 100, 
                marginHorizontal: 5, 
                borderWidth: 2, 
                borderColor: 'white', 
                borderRadius: 15, 
                shadowColor: "#000", 
                shadowOffset: { width: 0, height: 1,},
                shadowOpacity: 0.22,
                shadowRadius: 2.22,
                elevation: 3,
                alignContent: "center",
                justifyContent: "center",
                height: 125}}>
                <Text style={{width: '100%', textAlign: 'center', color: 'white', fontSize: 24}}>+</Text>
            </View>
            </TouchableOpacity>
          </View>
          
          <View style={{width: '100%', height: 120, bottom: 10, position: 'absolute', flexDirection: 'column', textAlign: "center", flex: 1}}>
            <Button onPress={() => console.log('Stopwatch START')} title={'start'} color="white" style={{ flex: 1, width: '50%'}}></Button>
            <Button onPress={() => console.log('Stopwatch STOP')} title={'stop'} color="white" style={{ flex: 1, width: '50%'}}></Button>
          </View>
          
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  gradientContainer: {
    width: '100%', 
    height: '100%', 
  },
})