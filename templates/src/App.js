import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import AgreementList from './components/agreement-list/AgreementList';
import Header from './components/header/Header';
import Editor from './components/Editor/Editor';

function App() {
    return (
        <div className="App">
            <Router>
                <Header/>
                <Switch>
                    <Route path="/company">
                        <AgreementList />
                    </Route>
                    <Route path="/agreements">
                        <AgreementList />
                    </Route>
                    <Route path="/archive">
                        <AgreementList />
                    </Route>
                    <Route path="/agreement/:agreementId">
                        <Editor />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
