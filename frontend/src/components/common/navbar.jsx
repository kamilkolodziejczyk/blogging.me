import React, { Component } from 'react';
import { Menu, Icon, notification, AutoComplete } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import Api from '../../endpoints';
import debounce from 'lodash.debounce';
import axios from 'axios';

const { Option } = AutoComplete;

class Navbar extends Component {
  state = {
    current: '/home',
    currentBlog: '',
    searchUser: '',
    users: []
  };

  componentDidMount() {
    if (localStorage.getItem('token')) {
      this.props.updateBlogs();
    }
    this.setState({ current: this.props.location.pathname });
  }

  handleClick = e => {
    this.setState({
      current: e.key,
      currentBlog: this.props.blogs.find(blog => blog._id === e.key)
    });
  };
  searchDebounceFunction = debounce(() => {
    if (this.state.searchUser) {
      this.getSearchUser();
    }
  }, 1000);

  getSearchUser = () => {
    axios
      .get(`${Api.USER_SEARCH}/${localStorage.getItem('user_id')}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      .then(res => {
        this.setState({ users: res.data });
      })
      .catch(err => {
        if (err.response.status === 401) {
          this.props.logout();
        }
      });
  };

  deleteBlog = blogId => {
    axios
      .delete(`${Api.BLOG}/${blogId}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      })
      .then(res => {
        notification['success']({
          message: 'The blog was successfully deleted'
        });
        this.props.updateBlogs();
      })
      .catch(err => {
        notification['error']({
          message: err.response.data
        });
        if (err.response.status === 401) {
          this.props.logout();
        }
      });
  };

  selectUser = e => {
    this.props.history.push(`/account/${e.key}`);
  };

  render() {
    const options = this.state.users.map(user => (
      <Option
        onClick={e => {
          this.setState({ searchUser: '' });
          this.selectUser(e);
        }}
        key={user._id}
        value={user._id}
      >
        {`${user.firstName} ${user.lastName}`}
      </Option>
    ));
    const MenuItem = Menu.Item;

    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode='horizontal'
      >
        <MenuItem key='/home'>
          <Link to='/home'>
            <Icon type='home' />
            Home Page
          </Link>
        </MenuItem>
        <MenuItem key='/me'>
          <Link to='/me'>
            <Icon type='setting' />
            Your account {localStorage.getItem('user_firstName')}
          </Link>
        </MenuItem>
        <MenuItem>
          <Link to='/add-new-blog'>
            <Icon type='plus' />
            New blog
          </Link>
        </MenuItem>
        <MenuItem key='logout'>
          <Link
            to='/'
            onClick={() => {
              this.props.logout();
            }}
          >
            <Icon type='logout' />
            Logout
          </Link>
        </MenuItem>
        <AutoComplete
          size='large'
          value={this.state.searchUser}
          dataSource={options}
          filterOption={(inputValue, option) =>
            option.props.children
              .toUpperCase()
              .indexOf(inputValue.toUpperCase()) !== -1
          }
          placeholder='Search users to follow'
          onChange={e => {
            this.setState({ searchUser: e });
            this.searchDebounceFunction();
          }}
          onFocus={this.getSearchUser}
        />
      </Menu>
    );
  }
}

export default withRouter(Navbar);
