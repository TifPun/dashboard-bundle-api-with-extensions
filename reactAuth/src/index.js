import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/Main';
import { browserHistory } from 'react-router';
import Root from './Root';

// https://scotch.io/tutorials/build-a-react-flux-app-with-user-authentication
// Render the main component into the dom
ReactDOM.render(<Root history={browserHistory} />, document.getElementById('app'));
