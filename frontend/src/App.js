import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import SearchAccountPage from './components/account-page/searchAccountPage';
import RegisterPage from './components/register-page/registerPage';
import AccountPage from './components/account-page/accountPage';
import LoginPage from './components/login-page/loginPage';
import BlogForm from './components/blog-crud/blogForm';
import HomePage from './components/home-page/homePage';
import NotFound from './components/common/notFound';
import Navbar from './components/common/navbar';
import Api from './endpoints';
import axios from 'axios';
import 'emoji-mart/css/emoji-mart.css';
import 'cropperjs/dist/cropper.css';
import 'antd/dist/antd.css';
import './App.scss';

class App extends React.Component {
  state = {
    isNavbarVisible: true,
    user: {},
    blogs: []
  };
  componentDidMount() {
    if (localStorage.getItem('token')) this.setState({ isNavbarVisible: true });
    else this.setState({ isNavbarVisible: false });

    this.updateUser();
  }
  changeNavbarVisible = () => {
    this.setState({ isNavbarVisible: !this.state.isNavbarVisible });
    if (this.state.isNavbarVisible === false) this.updateBlogs();
  };
  updateUser = () => {
    if (localStorage.getItem('user_id')) {
      axios
        .get(`${Api.USER_GET_BY_ID}/${localStorage.getItem('user_id')}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        })
        .then(res => {
          if (res.data.token) localStorage.setItem('token', res.data.token);
          this.setState({ user: res.data });
        })
        .catch(err => {
          if (err.response.status === 401) {
            this.logout();
          }
        });
    }
  };

  updateBlogs = () => {
    axios
      .get(`${Api.BLOG}/${localStorage.getItem('user_id')}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      })
      .then(res => {
        this.setState({ blogs: res.data.blogs });
        if (res.data.token) localStorage.setItem('token', res.data.token);
      })
      .catch(err => {
        if (err.response.status === 401) {
          this.logout();
        }
      });
  };
  logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_firstName');
    this.changeNavbarVisible();
  };

  render() {
    return (
      <div className='app-wrapper'>
        {this.state.isNavbarVisible && (
          <Navbar
            logout={this.logout}
            userBlogs={this.state.user.blogs}
            blogs={this.state.blogs}
            updateBlogs={this.updateBlogs}
          />
        )}
        <Switch>
          <Route
            exact
            path='/'
            render={() => (
              <LoginPage
                changeNavbarVisible={this.changeNavbarVisible}
                updateBlogs={this.updateBlogs}
              />
            )}
          />
          <Route
            path='/register'
            render={() => (
              <RegisterPage
                changeNavbarVisible={this.changeNavbarVisible}
                updateBlogs={this.updateBlogs}
              />
            )}
          />
          <Route path='/home' render={() => <HomePage />} />
          <Route
            path='/me'
            render={() => (
              <AccountPage
                blogs={this.state.blogs}
                updateBlogs={this.updateBlogs}
                logout={this.logout}
              />
            )}
          />
          <Route
            path='/add-new-blog'
            render={() => (
              <BlogForm updateBlogs={this.updateBlogs} logout={this.logout} />
            )}
          />
          <Route
            path='/account/:id'
            render={() => <SearchAccountPage logout={this.logout} />}
          />
          <Route path='/not-found' render={() => <NotFound />} />
          <Redirect to='/not-found' />
        </Switch>
      </div>
    );
  }
}

export default App;
