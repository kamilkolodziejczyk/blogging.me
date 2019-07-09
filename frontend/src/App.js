import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import LoginPage from './components/login-page/loginPage';
import RegisterPage from './components/register-page/registerPage';
import HomePage from './components/home-page/homePage';
import './App.scss';
import 'antd/dist/antd.css';

function App() {
  return (
    <div className='app-wrapper'>
      <Switch>
        <Route exact path='/' render={() => <LoginPage />} />
        <Route path='/register' render={() => <RegisterPage />} />
        <Route path='/home' render={() => <HomePage />} />
      </Switch>
    </div>
  );
}

export default App;
