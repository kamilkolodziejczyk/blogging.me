import React, { Component } from 'react';
import { Menu, Icon, Button, notification, AutoComplete } from 'antd';
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
      current: e.key
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
      .catch(err => console.log(err));
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
    //TODO go to this user page
  };

  render() {
    const options = this.state.users.map(user => (
      <Option onClick={e => this.selectUser(e)} key={user._id} value={user._id}>
        {`${user.firstName} ${user.lastName}`}
      </Option>
    ));
    const { SubMenu } = Menu;
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
        <SubMenu
          title={
            <span className='submenu-title-wrapper'>
              <Icon type='apartment' />
              Your blogs
            </span>
          }
        >
          <MenuItem>
            <Link to='/add-new-blog'>
              <Button type='primary' icon='plus'>
                New blog
              </Button>
            </Link>
          </MenuItem>
          {this.props.userBlogs &&
            this.props.blogs.map(blog => (
              <MenuItem
                key={blog._id}
                onClick={e => this.setState({ currentBlog: e.key })}
              >
                {blog.name}
                <Button
                  onClick={() => this.deleteBlog(blog._id)}
                  style={{ marginLeft: 5 }}
                  type='danger'
                  shape='circle'
                >
                  <Icon type='minus' style={{ margin: 'auto' }} />
                </Button>
              </MenuItem>
            ))}
        </SubMenu>

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
