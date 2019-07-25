import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Row,
  Col,
  Avatar,
  Card,
  Button,
  notification,
  Spin,
  Popconfirm
} from 'antd';
import axios from 'axios';
import Api from '../../endpoints';

class SearchAccountPage extends Component {
  state = {
    user: {},
    blogs: [],
    following: [],
    canFollow: true,
    loading: false
  };
  componentWillReceiveProps() {}
  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get(`${Api.USER_GET_ALL_SEARCHING_DATA}/${this.props.match.params.id}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      .then(res => {
        this.setState({
          user: res.data.user,
          blogs: res.data.blogs,
          following: res.data.following
        });
      })
      .catch(err => {
        this.setState({ loading: false });
        if (err.response.status === 401) {
          this.props.logout();
        }
      });

    axios
      .get(`${Api.USER_GET_BY_ID}/${localStorage.getItem('user_id')}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      .then(res => {
        if (res.data.following.length > 0) {
          const isFollow = res.data.following.find(
            follower => follower === this.props.match.params.id
          );

          if (isFollow) this.setState({ canFollow: false, loading: false });
          else this.setState({ canFollow: true, loading: false });
        } else this.setState({ canFollow: true, loading: false });
      })
      .catch(err => {
        this.setState({ loading: false });
        if (err.response.status === 401) {
          this.props.logout();
        }
      });
  }
  follow = () => {
    axios
      .post(
        `${Api.USER_FOLLOW}/${localStorage.getItem('user_id')}`,
        { email: this.state.user.email },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      )
      .then(res => {
        notification['success']({
          message: 'This user was successfully follow'
        });
        this.setState({ canFollow: !this.state.canFollow });
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

  unfollow = () => {
    axios
      .put(
        `${Api.USER_UNFOLLOW}/${localStorage.getItem('user_id')}`,
        { follower: this.props.match.params.id },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      )
      .then(res => {
        notification['success']({
          message: 'This user was successfully unfollow'
        });
        this.setState({ canFollow: !this.state.canFollow });
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
  pushToFollowingPage = id => {
    if (id === localStorage.getItem('user_id')) {
      this.props.history.push('/me');
    } else {
      this.props.history.push(`/account/${id}`);
    }
  };
  render() {
    return (
      <div className='account-wrapper'>
        <Col className='account-form'>
          <Spin spinning={this.state.loading} size='large'>
            <Row>
              <Col span={12}>
                <h2>
                  <Avatar
                    size={64}
                    src={this.state.user.avatar}
                    icon='user'
                    style={{ marginRight: 10 }}
                  />
                  {`${this.state.user.firstName} ${this.state.user.lastName}`}
                </h2>
              </Col>
              <Col span={12}>
                {this.state.canFollow && (
                  <Button type='primary' onClick={this.follow}>
                    Follow
                  </Button>
                )}
                {!this.state.canFollow && (
                  <Popconfirm
                    title='Are you sure unfollow this user?'
                    onConfirm={this.unfollow}
                    okText='Yes'
                    cancelText='No'
                  >
                    <Button type='primary'>Unfollow</Button>
                  </Popconfirm>
                )}
              </Col>
            </Row>
            <Row gutter={24} align='middle' type='flex' justify='space-between'>
              <Col span={12}>
                <Card title='Blogs'>
                  {this.state.blogs &&
                    this.state.blogs.map(blog => (
                      <p key={blog._id}>{blog.name}</p>
                    ))}
                </Card>
              </Col>
              <Col span={12}>
                <Card title='Following'>
                  {this.state.following &&
                    this.state.following.map(follower => (
                      <p
                        className='clickable'
                        onClick={() => this.pushToFollowingPage(follower._id)}
                        key={follower._id}
                      >
                        {`${follower.firstName} ${follower.lastName}`}
                      </p>
                    ))}
                </Card>
              </Col>
            </Row>
          </Spin>
        </Col>
      </div>
    );
  }
}

export default withRouter(SearchAccountPage);
