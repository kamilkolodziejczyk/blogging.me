import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PostForm from '../post/postForm';
import Post from '../post/post';
import axios from 'axios';
import Api from '../../endpoints';

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

  image = img => {
    if (img) return <img alt={img} src={img} />;
    else return '';
  };
  render() {
    return (
      <div>
        <PostForm logout={this.props.logout} />
        <div className='posts'>
          {this.state.followersPosts &&
            this.state.followersPosts.map(({ post, author, customization }) => (
              <Post
                key={post._id}
                post={post}
                author={author}
                customization={customization}
                logout={this.props.logout}
              />
            ))}
        </div>
      </div>
    );
  }
}

export default withRouter(HomePage);
