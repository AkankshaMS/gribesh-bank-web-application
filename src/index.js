import React from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.min.css';
import './index.css';
import Amplify from 'aws-amplify';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import config from './config';
import registerServiceWorker from './registerServiceWorker';

Amplify.configure({
	Auth: {
		mandatorySignIn: true,
		region: config.cognito.REGION,
		userPoolId: config.cognito.USER_POOL_ID,
		identityPoolId: config.cognito.IDENTITY_POOL_ID,
		userPoolWebClientId: config.cognito.APP_CLIENT_ID
	},
	API: {
		endpoints: [
			{
				name: 'testApiCall',
				endpoint: config.apiGateway.URL,
				region: config.apiGateway.REGION,
				custom_header: async () => {
					return { Authorization: 'eyJraWQiOiJjY3dKNTlpVzFvTFpZOWozcEFIbE5ncXlFMWMwU2tqdGp4UFR4OER3T3g0PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3NWM4YTU0MC0yMGU0LTRhZDUtYTVjNy0xOTc4Yjk0ZDNlY2QiLCJhdWQiOiIyajJnbnVuZzcxdHQ2c3NmaTd1aWpsaWs2ZCIsImV2ZW50X2lkIjoiMmVlY2E0MjgtMTBlNS00OTNkLTlkOTAtYWE4ZmVlOWEyNzkwIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1ODczNjg3MDcsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX21QbnVjV1dLeiIsImNvZ25pdG86dXNlcm5hbWUiOiJncmliZXNoZGhha2FsQGdtYWlsLmNvbSIsImV4cCI6MTU4NzM3MjMwNywiaWF0IjoxNTg3MzY4NzA3fQ.Fl2DtiZ5PTnIwOU7DO3Jl8gj-dxf7TVB-OIU0xi8WHtYSJ7Dzwe4Yx0H5XiSUTLdVTS_RqkyzMv_qVEsYsJjlk6nyK5C_yg4uxT2XoK0wqkWe_JRd4NoaLWR-Ppyq7B59j7bDxEbrKywfZ094J_MWZK0sTwfYFvIUtmwd3PeEBJBvEUWdG2XH3eWiiviBJODgU2wk-8lcucumMY2JMnAJ0SB6Zy69QzsUJ85EVHu-c1YjFZKJ3DHrqvrgWs-JBaubHPafBXL9y15wiYLGf4waXiAoI9hm_9bbmL09Iu-Zxr1l1Olef62D-kEFYl4EV7g1hgYUzWPt6qsIxUObmCi9w' }
				}
			}
		]
	}
});

ReactDOM.render(
	<Router>
		<App />
	</Router>,
	document.getElementById('root')
);
registerServiceWorker();
