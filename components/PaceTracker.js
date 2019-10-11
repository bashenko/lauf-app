import React from 'react'
import { Platform, Text, View, StyleSheet, Image, Button } from 'react-native';

class PaceTracker  extends React.Component  {
    render() {
        return (

    <View style={{width: '100%', height: 120, top: 300, position: 'absolute'}}>
        <Text style={{fontSize: 100, textAlign: "center", fontWeight: "900", height: 100}}>{this.props.pace}</Text>
        <Text style={{fontSize: 14, textAlign: "center", textTransform: 'uppercase', fontWeight: '200'}}> Min / KM </Text>
    </View>

)
}
}

export default PaceTracker