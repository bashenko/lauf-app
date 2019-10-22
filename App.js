import React, { Component } from "react";
import {
	Platform,
	Text,
	View,
	StyleSheet,
	Image,
	Button,
	ScrollView,
	TouchableOpacity
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Topnav from "./components/Topnav/Topnav.js";
import Trackers from "./components/Trackers.js";
import LapCard from "./components/LapCard.js";
import LapCards from "./components/LapCards.js";
import PaceTracker from "./components/PaceTracker.js";

import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import haversine from "haversine";
import * as Constants from "expo-constants";

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			location: null,
			errorMessage: null,
			latitude: null,
			longitude: null,
			error: null,
			min: 0,
			sec: 0,
			msec: 0
		};

		this.lapArr = [];

		this.interval = null;
	}

	handleToggle = () => {
		console.log(this.state.start);
		this.setState(
			{
				start: !this.state.start
			},
			() => this.handleStart()
		);
	};

	handleLap = (min, sec, msec) => {
		this.lapArr = [...this.lapArr, { min, sec, msec }];
	};

	handleStart = () => {
		if (this.state.start) {
			this.interval = setInterval(() => {
				if (this.state.msec !== 99) {
					this.setState({
						msec: this.state.msec + 1
					});
				} else if (this.state.sec !== 59) {
					this.setState({
						msec: 0,
						sec: ++this.state.sec
					});
				} else {
					this.setState({
						msec: 0,
						sec: 0,
						min: ++this.state.min
					});
				}
			}, 1);
		} else {
			clearInterval(this.interval);
		}
	};

	handleReset = () => {
		this.setState({
			min: 0,
			sec: 0,
			msec: 0,
			distance: 0,
			start: false
		});

		clearInterval(this.interval);

		this.lapArr = [];
	};

	componentDidMount() {
		var _this = this;
		Location.watchPositionAsync(
			{
				enableHighAccuracy: true,
				timeInterval: 50,
				activityType: Location.ActivityType.Fitness
			},
			location2 => {
				_this.setState({
					location2,

					speed: location2.coords.speed,
					long: location2.coords.longitude,
					lat: location2.coords.latitude,
					distStart: {
						latitude: this.state.initLat,
						longitude: this.state.initLong
					},
					distEnd: {
						latitude: this.state.lat,
						longitude: this.state.long
					},
					distance: haversine(
						{ latitude: this.state.initLat, longitude: this.state.initLong },
						{
							latitude: this.state.lat,
							longitude: this.state.long
						},
						{ unit: "meter" }
					)
				});
			}
		);

		if (Platform.OS === "android" && !Constants.isDevice) {
			this.setState({
				errorMessage:
					"Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
			});
		} else {
			this._getLocationAsync();
		}
	}

	_getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== "granted") {
			this.setState({
				errorMessage: "Permission to access location was denied"
			});
		}

		let location = await Location.getCurrentPositionAsync({});
		this.setState({
			location,
			initLat: location.coords.latitude,
			initLong: location.coords.longitude
		});
	};

	componentWillUnmount() {
		navigator.geolocation.clearWatch(this.watchId);
	}

	render() {
		let speed = this.state.speed;
		let distance;
		let paceM;
		let paceS;
		let padToTwo = number => (number <= 9 ? `0${number}` : number);

		if (speed > 0) {
			distance = Math.floor(this.state.distance * 100) / 100;
			paceM = Math.floor(1000 / this.state.speed / 60);
			paceS = Math.floor((1000 / this.state.speed) % 60);
		} else {
			distance = "paused";
			paceM = "0";
			paceS = "0";
		}

		return (
			<View>
				<LinearGradient
					colors={["#009DF0", "#20DCFF"]}
					style={styles.gradientContainer}
				>
					<Topnav />
					<Trackers
						distance={distance}
						lapTime={
							padToTwo(this.lapArr.min) +
							":" +
							padToTwo(this.lapArr.sec) +
							":" +
							padToTwo(this.lapArr.msec)
						}
						time={
							padToTwo(this.state.min) +
							":" +
							padToTwo(this.state.sec) +
							":" +
							padToTwo(this.state.msec)
						}
					/>
					<PaceTracker pace={padToTwo(paceM) + ":" + padToTwo(paceS)} />

					<View
						style={{
							flex: 1,
							position: "absolute",
							top: 500,
							height: 125,
							width: "100%",
							flexDirection: "row"
						}}
					>
						<ScrollView
							scrollEventThrottle={16}
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							style={{ flex: 4, height: 125 }}
						>
							<LapCards lap={this.lapArr} />
						</ScrollView>

						<TouchableOpacity
							onPress={() =>
								this.handleLap(this.state.min, this.state.sec, this.state.msec)
							}
							disabled={!this.state.start}
							style={{ height: 125 }}
						>
							<View
								style={{
									width: 100,
									marginHorizontal: 5,
									borderWidth: 2,
									borderColor: "white",
									borderRadius: 15,
									shadowColor: "#000",
									shadowOffset: { width: 0, height: 1 },
									shadowOpacity: 0.22,
									shadowRadius: 2.22,
									elevation: 3,
									alignContent: "center",
									justifyContent: "center",
									height: 125
								}}
							>
								<Text
									style={{
										width: "100%",
										textAlign: "center",
										color: "white",
										fontSize: 24
									}}
								>
									+
								</Text>
							</View>
						</TouchableOpacity>
					</View>

					{/*
            On START
            — get initial location
            — record new lap location
            — record initial lap time
            — Timer starts
            — Distance start counting

            On RECORD LAP
            — get Lap final Location
            — calculate Lap distance
            — display lap time

            — render lap card

            — record new lap location
            — record initial lap time
            */}

					<View
						style={{
							width: "100%",
							bottom: 20,
							position: "absolute",
							flexDirection: "column",
							textAlign: "center",
							flex: 1
						}}
					>
						<Button
							onPress={this.handleToggle}
							title={!this.state.start ? "Start" : "Stop"}
							color="white"
							style={{ flex: 1, width: "50%" }}
						/>
						<Button
							onPress={() =>
								this.handleLap(this.state.min, this.state.sec, this.state.msec)
							}
							disabled={!this.state.start}
							title="Lap"
							color="white"
							style={{ flex: 1, width: "50%" }}
						/>
						<Button
							onPress={this.handleReset}
							title="Reset"
							color="white"
							style={{ flex: 1, width: "50%" }}
						/>
					</View>
				</LinearGradient>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	gradientContainer: {
		width: "100%",
		height: "100%"
	}
});
