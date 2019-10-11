import React from 'react'
import { Platform, Text, View, StyleSheet, Image, Button } from 'react-native';

class LapCard  extends React.Component  {
    render() {
        return (

<View style={{width: 100, marginHorizontal: 5, backgroundColor: '#FFFFFF', borderRadius: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 1,},shadowOpacity: 0.22,shadowRadius: 2.22,elevation: 3, padding: 16, fontSize: 12}}>
    <Text style={{fontWeight: '900'}}>RUNDE {this.props.lapNum}</Text>
    <Text style={{fontWeight: '200'}}>1,45 km</Text>
    <Text style={{fontWeight: '900', color: '#29A9FC', letterSpacing: -0.5,}}>{this.props.lapTime}</Text>
</View>

)
}
}

export default LapCard