import React, { Component, Fragment } from 'react';
import {  withRouter } from 'react-router-dom';
import Routes from './Routes';
import { Auth } from 'aws-amplify';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { Nav } from 'react-bootstrap';
library.add(faEdit);

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isAuthenticated: false,
			isAuthenticating: true,
			senderacc: '',
			account: '',
			amount:'',
		};
	}

	async componentDidMount() {
		try {
			if (await Auth.currentSession()) {
				this.userHasAuthenticated(true);
			}
		} catch (e) {
			if (e !== 'No current user') {
				alert(e);
			}
		}

		this.setState({ isAuthenticating: false });
	}

	userHasAuthenticated = (authenticated) => {
		this.setState({ isAuthenticated: authenticated });
	};
	changeacc =(value1,value2,value3)=>{
		this.setState({senderacc:value1,account:value2,amount:value3})
	}

	handleLogout = async event => {
		await Auth.signOut();

		this.userHasAuthenticated(false);
		this.props.history.push('/login');
	};
	render() {
		const childProps = {
			isAuthenticated: this.state.isAuthenticated,
			userHasAuthenticated: this.userHasAuthenticated,
			senderacc:this.state.senderacc,
			account:this.state.account,
			amount:this.state.amount,
			changeacc:this.changeacc,
		};
		return (
			<div className="">
				<Nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <a href="/" className="navbar-item">
              Home
            </a>
            <a href="/acc" className="navbar-item">
              My Account
            </a>
            <a href="/admin" className="navbar-item">
              Admin
            </a>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
				{this.state.isAuthenticated ? (
								<a onClick={this.handleLogout} className="button is-primary">
								<strong>Logout</strong>
							  </a>
							) : (
								<Fragment>
									<a href="/signup" className="button is-primary">
                  <strong>Sign up</strong>
                </a>
                <a href="/login" className="button is-light">
                  Log in
				</a> 
								</Fragment>
							)}
              </div>
            </div>
          </div>
        </div>
      </Nav>
				<Routes childProps={childProps} />
			</div>
		);
	}
}

export default withRouter(App);
