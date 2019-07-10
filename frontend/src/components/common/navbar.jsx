import React, { Component } from 'react';
import { Menu, Icon, Button } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Api from '../../endpoints';

class Navbar extends Component {
  state = {
    current: 'home',
    blogs: []
  };
  componentDidMount() {
    axios
      .get(`${Api.BLOG}/${localStorage.getItem('user_id')}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      })
      .then(res => {
        this.setState({ blogs: res.data.blogs });
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleClick = e => {
    this.setState({
      current: e.key
    });
  };
  render() {
    const { SubMenu } = Menu;
    const MenuItem = Menu.Item;

    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode='horizontal'
      >
        <MenuItem key='home'>
          <Link to='/home'>
            <Icon type='home' />
            Home Page
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
            this.state.blogs.map(blog => (
              <MenuItem key={blog}>{blog.name}</MenuItem>
            ))}
        </SubMenu>
        <MenuItem key='logout'>
          <Link
            to='/'
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user_id');
              this.props.changeNavbarVisible();
            }}
          >
            <Icon type='logout' />
            Logout
          </Link>
        </MenuItem>
      </Menu>
    );
  }
}

export default Navbar;
