import React, { Component } from 'react';
import { PageHeader } from 'react-bootstrap';
import { API } from 'aws-amplify';
import './Home.css';
import Lander from './Lander';

export default class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			testApiCall: []
		};
	}

	async componentDidMount() {
		if (!this.props.isAuthenticated) {
			return;
		}

		try {
			const testApiCall = ''
			this.setState({ testApiCall });
		} catch (e) {
			alert(e);
		}

		this.setState({ isLoading: false });
	}

	testApiCall() {
		return API.get('testApiCall', '/hello');
	}

	renderTestAPI(testApiCall) {
		console.log(testApiCall);
		return testApiCall.message;
	}

	renderLander() {
		return (
			<Lander/>
			// <div className="lander">
			// 	<h1>Test web app</h1>
			// 	<p>A simple react test app</p>
			// </div>
			
		);
	}

	generateotp = async event => {
		event.preventDefault();
		this.setState({ isLoading: true });
		try {
			// const params ={
			// 	"sa":123
			// };
			// const resotp = await axios.post(`${config.api.getotpUrl}/generate/`,params);
			// console.log(resotp)
			// console.log("OTP Pin Generated")
			this.props.history.push('/transact');          
		} catch (e) {
			alert(e.message);
		}
	};
	renderTest() {
		return (
			<div className="test">
				{/* <PageHeader>Test API call authenticate</PageHeader> */}
				{/* <ListGroup>{!this.state.isLoading && this.renderTestAPI(this.state.testApiCall)}</ListGroup> */}
				<PageHeader>This is authenticated user dashboard</PageHeader>
				<div class="lander">
				<p>Landing page for authenticate user.</p>
				<a href="/otp" className="button is-primary" onClick={this.generateotp}>
                  <strong>Transfer</strong>
                </a>
				</div>
			</div>
		);
	}

	render() {
		return <div className="Home">{this.props.isAuthenticated ? this.renderTest() : this.renderLander()}</div>;
	}
}
