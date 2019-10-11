import React from 'react'
import { Platform, Text, View, StyleSheet, Image, Button } from 'react-native';

class Trackers extends React.Component  {
    render() {
        return (
            <View style={styles.container}>
                <View style={ styles.trackerCol }>
                    <Text style={styles.trackerHead}>{this.props.distance}</Text>
                    <Text style={styles.trackerText}>Meter</Text>
                </View>
                <View style={ styles.trackerCol, {flex: 2} }>
                    <Text style={styles.trackerHead}>{this.props.lapTime}</Text>
                    <Text style={styles.trackerText}>Zeit</Text>
                </View>
                <View style={ styles.trackerCol, {flex: 2} }>
                    <Text style={styles.trackerHead}>{this.props.time}</Text>
                    <Text style={styles.trackerText}>GesamtZeit</Text>
                </View>
                <View style={ styles.trackerCol, {flex: 2} }>
                    <Text style={styles.trackerHead}>—</Text>
                    <Text style={styles.trackerText}>Herzfrequenz</Text>
                </View>
            </View>
            )
        }
      }

const styles = StyleSheet.create({
container: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    paddingHorizontal: 16,
    top: 64,
},
trackerText: {
    textTransform: 'uppercase',
    fontSize: 10,
    textAlign: 'center',
    letterSpacing: -0.5,
    fontWeight: '300'
},
trackerHead: {
    textTransform: 'uppercase',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
},
trackerCol: {
    flex: 1, 
    flexDirection: 'column', 
    height: 40
},

})

export default Trackers