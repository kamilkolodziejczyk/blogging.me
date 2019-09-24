import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import Login from './components/login';
import HomePage from './components/home';
import Navbar from './components/navbar';
import BlogForm from './components/blog';
import Register from './components/register';
import CurrentUserAccountPage from './components/account-page/current-user/user';
import './App.scss';
import 'antd/dist/antd.css';
import 'cropperjs/dist/cropper.css';
import 'emoji-mart/css/emoji-mart.css';

const App = props => {
  const [navbarVisible, setNavbarVisible] = useState(true);

  useEffect(() => {
    if (props.loggedIn || props.registeredIn || localStorage.getItem('token')) {
      setNavbarVisible(true);
    } else setNavbarVisible(false);
  }, [props.loggedIn, props.registeredIn]);

  return (
    <div className='app-wrapper'>
      {navbarVisible && <Navbar changeVisible={setNavbarVisible} />}
      <Switch>
        <Route exact path='/' render={() => <Login />} />
        <Route exact path='/register' render={() => <Register />} />
        <Route
          exact
          path='/home'
          render={() => <HomePage changeVisible={setNavbarVisible} />}
        />
        <Route exact path='/add-new-blog' render={() => <BlogForm />} />
        <Route exact path='/me' render={() => <CurrentUserAccountPage />} />
      </Switch>
    </div>
  );
};

function mapState(state) {
  const { loggedIn, registeredIn } = state.user;
  return { loggedIn, registeredIn };
}

const actionCreators = {};

export default connect(
  mapState,
  actionCreators
)(App);
