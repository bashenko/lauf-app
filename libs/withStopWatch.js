import React from "react";
import {ms, s, m, h, d} from "time-convert";

export const withStopWatch = WrapperComponent =>
	class extends React.Component {
		constructor(props) {
			super(props);
			this.state = this.initialState;
		}

		get initialState() {
			return {
				running: false,
				sumTimeLapStack: 0, // sum time all lap
				timeLapStack: [],
				times: [0, 0, 0], // minutes, seconds, milliseconds
				currentTime: 0 // timestamp
			};
		}

		getNowTime = () => {
			return Date.now();
		};

		reset = () => {
			this.setState(this.initialState);
		};


		start = () => {
			let currentTime = this.state.currentTime;
			if (!currentTime) {
				currentTime = this.getNowTime();
			}
			if (!this.state.running) {
				this.setState(() => ({
					running: true,
					currentTime
				}));
				requestAnimationFrame(this.step.bind(this));
			}
		};

		toTimeStamp(times) {
			return times[0] * 60 * 1000 + times[1] * 1000 + parseInt(times[2] * 10);
		}

		/**
		 * @desc записать время круга
		 * */
		lap = () => {
			try {
				const timeLapStackLength = this.state.timeLapStack.length;

				// clone current time
				let currentTime = Object.assign([], this.state.times);
				// convert current time to timeStamp
				let currentTimeInTimestamp = this.toTimeStamp(currentTime);
				// time format: minutes, seconds, milliseconds
				let currentTimeInFormat = [0,0,0];

				// diff between current time and all prev lap time
				let timeDiff = 0;

				if (timeLapStackLength > 0) {

					timeDiff = currentTimeInTimestamp - this.state.sumTimeLapStack;

					currentTimeInFormat = ms.to(m, s, ms)(timeDiff);
					currentTimeInFormat[2] = parseInt(currentTimeInFormat[2].toString().substr(0, 2));

				} else {
					currentTimeInFormat = ms.to(m, s, ms)(currentTimeInTimestamp);
					currentTimeInFormat[2] = parseInt(currentTimeInFormat[2].toString().substr(0, 2));
				}

				this.setState((state) => ({
					...state,
					sumTimeLapStack: state.sumTimeLapStack + timeDiff,
					timeLapStack:[...state.timeLapStack, currentTimeInFormat]
				}))

			} catch (e) {
				console.log(e);
				return this.state.times;
			}
		};

		stop = () => {
			this.setState(() => ({
				running: false,
				currentTime: null
			}));
		};

		restart = () => {
			let currentTime = this.state.currentTime;
			if (!currentTime) {
				currentTime = this.getNowTime();
			}
			if (!this.state.running) {
				this.setState(() => ({
					running: true,
					currentTime
				}));
				requestAnimationFrame(this.step.bind(this));
			}
			this.reset();
		};

		step(timestamp) {
			if (!this.state.running) return;
			this.calculate(timestamp);
			requestAnimationFrame(this.step.bind(this));
		}


		formatTimestamp = (timestamp) => {
			let diff = timestamp - this.state.currentTime;
			const {times} = this.state;

			let minutes = times[0];
			let seconds = times[1];
			let milliseconds = times[2];

			// Hundredths of a second are 100 ms
			milliseconds += diff / 10;
			// Seconds are 100 hundredths of a second
			if (milliseconds >= 100) {
				seconds += 1;
				milliseconds -= 100;
			}
			// Minutes are 60 seconds
			if (seconds >= 60) {
				minutes += 1;
				seconds -= 60;
			}
			return [minutes, seconds, milliseconds]
		};

		calculate(timestamp) {

			this.setState(() => ({
				currentTime: timestamp,
				times: this.formatTimestamp(timestamp)
			}));
		}

		pad0 = (value, count) => {
			try {
				let result = value.toString();
				for (; result.length < count; --count) result = "0" + result;
				return result;
			} catch (e) {
				return '00';
			}
		};

		format = times => {
			if (!times) {
				return `00:00:00`;
			}
			return `${this.pad0(times[0], 2)}:${this.pad0(times[1], 2)}:${this.pad0(Math.floor(times[2]), 2)}`;
		};

		render() {
			const {
				timeLapStack,
				currentTime,
				times: [minutes, seconds, milliseconds]
			} = this.state;

			return (
				<WrapperComponent
					stopWatch={{
						seconds,
						minutes,
						milliseconds,
						timeLapStack,
						currentTime,
						lap: this.lap,
						start: this.start,
						stop: this.stop,
						restart: this.restart,
						reset: this.reset,
						format: this.format,
						formatTimestamp: this.formatTimestamp,
					}}
					{...this.props}
				/>
			);
		}
	};

