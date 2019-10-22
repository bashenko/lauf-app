import React, {Component} from "react";

export const withStopWatch = WrapperComponent =>
	class extends React.Component {
		constructor(props) {
			super(props);
			this.state = this.initialState;
		}

		get initialState() {
			return {
				running: false,
				timeLapStack: [],
				times: [0, 0, 0],
				time: 0
			};
		}

		getNowTime = () => {
			return Date.now();
		};

		reset = () => {
			this.setState(this.initialState);
		};


		start = () => {
			let time = this.state.time;
			if (!time) {
				time = this.getNowTime();
			}
			if (!this.state.running) {
				this.setState(() => ({
					running: true,
					time
				}));
				requestAnimationFrame(this.step.bind(this));
			}
		};

		/**
		 * @desc записать время круга
		 * */
		lap = () => {
			this.setState(state => ({
				timeLapStack: [...state.timeLapStack, this.state.times]
			}));
			return this.state.times;
		};

		stop = () => {
			this.setState(() => ({
				running: false,
				time: null
			}));
		};

		restart = () => {
			let time = this.state.time;
			if (!time) {
				time = this.getNowTime();
			}
			if (!this.state.running) {
				this.setState(() => ({
					running: true,
					time
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
			let diff = timestamp - this.state.time;
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
				time: timestamp,
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
			return `${this.pad0(times[0], 2)}:${this.pad0(times[1], 2)}:${this.pad0(Math.floor(times[2]), 2)}`;
		};

		render() {
			const {
				timeLapStack,
				times: [minutes, seconds, milliseconds]
			} = this.state;

			return (
				<WrapperComponent
					stopWatch={{
						seconds,
						minutes,
						milliseconds,
						timeLapStack,
						lap: this.lap,
						start: this.start,
						stop: this.stop,
						restart: this.restart,
						reset: this.reset,
						format: this.format,
					}}
					{...this.props}
				/>
			);
		}
	};

