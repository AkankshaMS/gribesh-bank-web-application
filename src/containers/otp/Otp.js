import React, { Component } from 'react';
import axios from "axios";
import  {Auth } from 'aws-amplify';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoaderButton from '../../components/LoaderButton'
const config = require('../../config.json');


export default class Otp extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			otppin: '',
		};
	}

	handleChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		});
	};

	handleSubmit = async event => {
		event.preventDefault();
		this.setState({ isLoading: true });
		if(this.props.senderacc===""||this.props.account===""||this.props.amount==="")
		{
			alert("Account Information Empty. Please enter account details.")
			console.log("Account Information is empty.")
			this.setState({ isLoading: false });
			return
		}
		else{
		try {
			const resotp = await axios.get(`${config.api.getotpUrl}/${this.props.senderacc}`);
			if(String(resotp.data)===this.state.otppin)
			{
				console.log(resotp.data);
				console.log(this.state.otppin);
				const paramse = {
					"sa":this.props.senderacc,
					"ra":this.props.account,
					"amt":this.props.amount,
				  };
				  const idrespo=await Auth.currentSession()
				  console.log(idrespo)
				  var idresp=idrespo.idToken.jwtToken
				  console.log(idresp);
				await axios.post(`${config.api.transactionUrl}/deposit/`, paramse,{ headers: { Authorization: idresp } });
				alert("Transaction Initiated. Soon reflected in account.");
				console.log("This is otp pin "+ this.state.otppin)
				this.props.history.push('/');
			}
			else{
				alert("Incorrect Pin")
				console.log("Incorrect OTPPIN")
				this.setState({ isLoading: false });
			}
            
		} catch (e) {
			alert(e.message);
		}
	}
};

	render() {
		return (
			<div>
				<div className="container" align="center">
				<ControlLabel>Sender Acc: {this.props.senderacc}</ControlLabel><br/>
				<ControlLabel>Receiver Acc: {this.props.account}</ControlLabel><br/>
				<ControlLabel>Amount : {this.props.amount}</ControlLabel><br/>
				</div>
			
			<div className="Login">
				<form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="otppin"  bsSize="large">
						<ControlLabel>Enter OTP</ControlLabel>
						<FormControl autoFocus type="number" value={this.state.otppin} onChange={this.handleChange} />
					</FormGroup>
					<LoaderButton
						block
						bsSize="large"
						type="submit"
						isLoading={this.state.isLoading}
						text="Verify"
						loadingText="Verifying…"
					/>
				</form>
			</div>
			</div>
		);
	}
}
