import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import LoginPage from './components/login-page/loginPage';
import './App.scss';
import 'antd/dist/antd.css';

function App() {
  return (
    <div className="app-wrapper">
      <Switch>
        <Route exact path="/" render={() => <LoginPage />} />
      </Switch>
    </div>
  );
}

export default App;
