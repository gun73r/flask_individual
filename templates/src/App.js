import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import AgreementList from './components/agreement-list/AgreementList';
import Header from './components/header/Header';
import Editor from './components/editor/Editor';
import Login from './components/login/Login';
import PrivateRoute from './components/private-route/PrivateRoute';
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
                        <PrivateRoute path="/company" component={AgreementList} />
                        <PrivateRoute path="/agreements" component={AgreementList} />
                        <PrivateRoute path="/archive" component={AgreementList} />
                        <PrivateRoute path="/agreement/:agreementId" component={Editor}  socket={socket} />
                    </div>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
