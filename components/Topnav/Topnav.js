import React from 'react'
import { Platform, Text, View, StyleSheet, Image, Button } from 'react-native';

class Topnav extends React.Component  {
    render() {
        return (
        <View  style={styles.container}>
            <Image source={require('../../assets/interface/arrow-up.png')} style={{width: 20, height: 14}}/>
            <Image source={require('../../assets/interface/gear.png')} style={{width: 20, height: 20}}/>
        </View>
        )
    }
  }

  const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%', 
        top: 48, 
        paddingHorizontal: 16
    },
    
    })
  
export default Topnav