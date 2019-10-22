import React from "react";
import {FlatList, Text, View} from "react-native";

class LapCards extends React.Component {
	render() {
		const {
			lapStack,
			timeFormat,
			distanceStack
		} = this.props;
		return (
			<FlatList
				data={lapStack}
				horizontal={true}
				renderItem={({item, index}) => {

					return (
						<View
							key={index + 1}
							style={{
								width: 100,
								marginHorizontal: 5,
								backgroundColor: "#FFFFFF",
								borderRadius: 15,
								shadowColor: "#000",
								shadowOffset: {width: 0, height: 1},
								shadowOpacity: 0.22,
								shadowRadius: 2.22,
								elevation: 3,
								padding: 16,
								fontSize: 12
							}}
						>
							<Text style={{fontWeight: "900"}}>RUNDE {index + 1}</Text>
							<Text style={{fontWeight: "200"}}>
                {
                  distanceStack[index]
                }
							</Text>
							<Text
								style={{
									fontWeight: "900",
									color: "#29A9FC",
									letterSpacing: -0.5
								}}
							>
                {
                  timeFormat(item)
                }
							</Text>
						</View>
					)
				}}
				keyExtractor={(item, index) => index.toString()}
			/>
		);
	}
}

export default LapCards;
