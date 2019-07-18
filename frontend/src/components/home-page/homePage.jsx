import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Card } from 'antd';
import PostForm from '../post/postForm';
import axios from 'axios';
import Api from '../../endpoints';
const { Meta } = Card;

class HomePage extends Component {
  state = {
    followersPosts: []
  };
  componentDidMount() {
    if (!localStorage.getItem('token')) this.props.history.push('/');
    axios
      .get(`${Api.POST_GET_ALL_FOLLOWERS}/${localStorage.getItem('user_id')}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      })
      .then(res => {
        this.setState({ followersPosts: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    return (
      <div>
        <PostForm logout={this.props.logout} />

        {this.state.followersPosts &&
          this.state.followersPosts.map(post => (
            <Card
              hoverable
              key={post._id}
              style={{ width: 240 }}
              // cover={<img alt='example' src={post.img} />}
            >
              <Meta title={post.title} description={post.content} />
            </Card>
          ))}
      </div>
    );
  }
}

export default withRouter(HomePage);
