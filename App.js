import React, {Component} from "react";
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
import {LinearGradient} from "expo-linear-gradient";
import PropTypes from 'prop-types'; // ES6

import Topnav from "./components/Topnav/Topnav.js";
import Trackers from "./components/Trackers.js";
import LapCard from "./components/LapCard.js";
import LapCards from "./components/LapCards.js";
import PaceTracker from "./components/PaceTracker.js";

import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import haversine from "haversine";
import * as Constants from "expo-constants";
import {withStopWatch} from "./libs/withStopWatch";

class App extends Component {

	static propTypes = {
		stopWatch: {
			milliseconds: PropTypes.number,
			seconds: PropTypes.number,
			minutes: PropTypes.number,
			start: PropTypes.func,
			stop: PropTypes.func,
			reset: PropTypes.func,
			lap: PropTypes.func,
			restart: PropTypes.func,
		}
	};

	watchId;

	constructor(props) {
		super(props);

		this.state = this.initialState;

		this.lapArr = [];

	}


	get initialState() {
		return {
			timerIsActive: 'idol', // idol, play, pause
			currentPosition: {lat: 0, long: 0},
			initPosition: {lat: 0, long: 0},

			// old state
			location: null,
			errorMessage: null,
			latitude: null,
			longitude: null,
			error: null,
		}
	}

	handleToggleTimer = () => {
		const {stopWatch: {start, stop}} = this.props;

		if (this.state.timerIsActive === 'idol') {
			start();
			this.setState({
				...this.state,
				timerIsActive: 'play',
			})
		} else if (this.state.timerIsActive === 'pause') {
			start();
			this.setState({
				...this.state,
				timerIsActive: 'play',
			})
		} else if (this.state.timerIsActive === 'play') {
			stop();
			this.setState({
				...this.state,
				timerIsActive: 'pause',
			})
		}
	};

	timeToTimestamp = () => {
		const {stopWatch: {seconds, minutes, hours,}} = this.props;
	};

	handleTimeLockLap = () => {
		const {lap} = this.props.stopWatch;
		lap();
	};

	handleReset = () => {
		const {reset, stop} = this.props.stopWatch;
		stop();
		reset();
		this.setState({
			distance: 0,
			timerIsActive: 'idol'
		});
	};


	watchDevicePosition = () =>{
		Location.watchPositionAsync(
			{
				enableHighAccuracy: true,
				timeInterval: 50,
				activityType: Location.ActivityType.Fitness
			},
			location2 => {
				this.setState({
					location2,
					speed: location2.coords.speed,
					currentPosition:{
						long: location2.coords.longitude,
						lat: location2.coords.latitude,
					},
					distStart: {
						latitude: this.state.initPosition.lat,
						longitude: this.state.initPosition.long,
					},
					distEnd: {
						latitude: this.state.currentPosition.lat,
						longitude: this.state.currentPosition.long,
					},
					distance: haversine(
						{
							latitude: this.state.initPosition.lat,
							longitude: this.state.initPosition.long,
						},
						{
							latitude: this.state.currentPosition.lat,
							longitude: this.state.currentPosition.long,
						},
						{
							unit: "meter",
						}
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

	componentDidMount() {
		this.watchDevicePosition();
	}

	_getLocationAsync = async () => {
		let {status} = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== "granted") {
			this.setState({
				errorMessage: "Permission to access location was denied"
			});
		}

		let location = await Location.getCurrentPositionAsync({});
		this.setState({
			location,
			initPosition: {
				lat: location.coords.latitude,
				long: location.coords.longitude
			},
		});
	};

	componentWillUnmount() {
		navigator.geolocation.clearWatch(this.watchId);
	}


	getTitlePlayButton = () => {
		return this.state.timerIsActive === "idol" || this.state.timerIsActive === "pause"
			? "Start"
			: "Stop";
	};

	render() {

		const {
			minutes,
			seconds,
			milliseconds,
			format,
			timeLapStack,
			getTimeLapByIndex,
		} = this.props.stopWatch;

		const {timerIsActive} = this.state;

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

		console.log('timeLapStack: ', timeLapStack);
		let lapTime = getTimeLapByIndex(timeLapStack.length - 1);
		console.log('lapTime: ', lapTime);
		return (
			<View>
				<LinearGradient
					colors={["#009DF0", "#20DCFF"]}
					style={styles.gradientContainer}
				>
					<Topnav/>
					<Trackers
						distance={distance}
						lapTime={
							format(lapTime)
						}
						time={
							format([minutes, seconds, milliseconds])
						}
					/>
					<PaceTracker pace={padToTwo(paceM) + ":" + padToTwo(paceS)}/>

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
							style={{flex: 4, height: 125}}
						>
							<LapCards lap={this.lapArr}/>
						</ScrollView>

						<TouchableOpacity
							onPress={this.handleTimeLockLap}
							disabled={timerIsActive === "idol" }
							style={{height: 125}}
						>
							<View
								style={{
									width: 100,
									marginHorizontal: 5,
									borderWidth: 2,
									borderColor: "white",
									borderRadius: 15,
									shadowColor: "#000",
									shadowOffset: {width: 0, height: 1},
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
							onPress={this.handleToggleTimer}
							title={this.getTitlePlayButton()}

							style={{
								flex: 1,
								width: "50%",
								color: '#222222',
								backgroundColor: '#ffffff'
							}}
						/>
						<Button
							onPress={() =>
								this.handleTimeLockLap(this.state.min, this.state.sec, this.state.msec)
							}
							disabled={
								timerIsActive === "idol" || timerIsActive === "pause"
							}
							title="Lap"
							style={{flex: 1, width: "50%"}}
						/>
						<Button
							onPress={this.handleReset}
							title="Reset"
							disabled={timerIsActive === "idol"}
							style={{flex: 1, width: "50%"}}
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


export default withStopWatch(App);
