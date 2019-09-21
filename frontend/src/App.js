import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './components/login';
import './App.scss';
import 'antd/dist/antd.css';

function App() {
  return (
    <div className='app-wrapper'>
      <Switch>
        <Route exact path='/' render={() => <Login />} />
      </Switch>
    </div>
  );
}

export default App;
