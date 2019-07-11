import React, { Component } from 'react';
import { Menu, Icon, Button, notification } from 'antd';
import { Link } from 'react-router-dom';
import Api from '../../endpoints';
import axios from 'axios';

class Navbar extends Component {
  state = {
    current: 'home',
    currentBlog: ''
  };
  componentDidMount() {
    if (localStorage.getItem('token')) {
      this.props.updateBlogs();
    }
  }

  handleClick = e => {
    this.setState({
      current: e.key
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
      </Menu>
    );
  }
}

export default Navbar;
