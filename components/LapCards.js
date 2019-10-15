import React from 'react';
import { ScrollView, FlatList, StyleSheet, Text, View } from 'react-native';

let padToTwo = (number) => (number <= 9 ? `0${number}`: number); 

class LapCards extends React.Component  {

    render() {
        return (
                            
                <FlatList
                    data={this.props.lap} horizontal={true}
                    renderItem={({item, index}) =>  <View key={index+1} style={{width: 100, marginHorizontal: 5, backgroundColor: '#FFFFFF', borderRadius: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 1,},shadowOpacity: 0.22,shadowRadius: 2.22,elevation: 3, padding: 16, fontSize: 12}}>
                                                        <Text style={{fontWeight: '900'}}>RUNDE {index+1}</Text>
                                                        <Text style={{fontWeight: '200'}}>{item.distance}</Text>
                                                        <Text style={{fontWeight: '900', color: '#29A9FC', letterSpacing: -0.5,}}>{padToTwo(item.min)}:{padToTwo(item.sec)}:{padToTwo(item.msec)}</Text>
                                                    </View>      
                    }
                    keyExtractor={(item, index) => index.toString()}
                />
            
        );
    }
}
 
export default LapCards