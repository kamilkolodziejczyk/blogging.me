import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './components/common/navbar';
import LoginPage from './components/login-page/loginPage';
import RegisterPage from './components/register-page/registerPage';
import HomePage from './components/home-page/homePage';
import BlogForm from './components/blog-crud/blogForm';
import NotFound from './components/common/notFound';
import Api from './endpoints';
import axios from 'axios';
import './App.scss';
import 'antd/dist/antd.css';
import 'emoji-mart/css/emoji-mart.css';

class App extends React.Component {
  state = {
    isNavbarVisible: true,
    user: {}
  };
  componentDidMount() {
    if (localStorage.getItem('token')) this.setState({ isNavbarVisible: true });
    else this.setState({ isNavbarVisible: false });

    this.updateUser();
  }
  changeNavbarVisible = () => {
    this.setState({ isNavbarVisible: !this.state.isNavbarVisible });
  };
  updateUser() {
    if (localStorage.getItem('user_id')) {
      axios
        .get(`${Api.USER_GET_BY_ID}/${localStorage.getItem('user_id')}`)
        .then(res => this.setState({ user: res.data }))
        .catch(err => console.log(err));
    }
  }

  render() {
    return (
      <div className='app-wrapper'>
        {this.state.isNavbarVisible && (
          <Navbar
            changeNavbarVisible={this.changeNavbarVisible}
            userBlogs={this.state.user.blogs}
          />
        )}
        <Switch>
          <Route
            exact
            path='/'
            render={() => (
              <LoginPage changeNavbarVisible={this.changeNavbarVisible} />
            )}
          />
          <Route path='/register' render={() => <RegisterPage />} />
          <Route path='/home' render={() => <HomePage />} />
          <Route path='/add-new-blog' render={() => <BlogForm />} />
          <Route path='/not-found' render={() => <NotFound />} />
          <Redirect to='/not-found' />
        </Switch>
      </div>
    );
  }
}

export default App;
