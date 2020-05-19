import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AppliedRoute from './components/AppliedRoute';

import Home from './containers/Home';
import NotFound from './containers/NotFound';
import Login from './containers/Login';
import Signup from './containers/Signup';
import Transaction from './containers/Transaction'
import MyAccount from './containers/MyAccount';
import Admin from './containers/Admin';

import Otp from './containers/otp/Otp'

export default ({ childProps }) => (
	<Switch>
		<AppliedRoute path="/" exact component={Home} props={childProps} />
		<AppliedRoute path="/login" exact component={Login} props={childProps} />
		<AppliedRoute path="/signup" exact component={Signup} props={childProps} />
		<AppliedRoute path="/transact" exact component={Transaction}props={childProps}/>
		<AppliedRoute path="/admin" exact component={Admin}props={childProps}/>
		<AppliedRoute path="/acc" exact component={MyAccount}props={childProps}/>
		<AppliedRoute path="/otp" exact component={Otp}props={childProps}/>
		{/* Finally, catch all unmatched routes */}
		<Route component={NotFound} />
	</Switch>
);
