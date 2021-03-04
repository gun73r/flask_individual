import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import AgreementList from './components/agreement-list/AgreementList';
import Header from './components/header/Header';
import Agreement from './components/Agreement';
import Login from './components/login/Login';
import PrivateRoute from './components/private-route/PrivateRoute';
import Company from './components/company/Company';
import InviteList from './components/invite-list/InviteList';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
    return (
        <div className="App">
            <Router history={history}>
                <Switch>
                    <Route path="/login" component={Login} />
                    <div>
                        <Header/>
                        <PrivateRoute path="/company" component={Company} />
                        <PrivateRoute path="/agreements" component={AgreementList} />
                        <PrivateRoute path="/invites" component={InviteList} />
                        <PrivateRoute path="/agreement/:agreementId" component={Agreement}  socket={socket} />
                    </div>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
