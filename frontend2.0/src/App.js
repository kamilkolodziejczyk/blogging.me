import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import LoginPage from './components/login-page/login';

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" render={() => <LoginPage />} />
      </Switch>
    </div>
  );
}

export default withRouter(App);
