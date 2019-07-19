import React, { Component } from 'react';
import { Avatar } from 'antd';
import { Emoji } from 'emoji-mart';
import axios from 'axios';
import Api from '../../endpoints';

class Post extends Component {
  state = {
    likes: 0,
    dislikes: 0
  };
  componentDidMount() {
    const { reactions } = this.props.post;

    if (reactions) {
      axios
        .get(`${Api.REACTION}/${reactions}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        })
        .then(res => {
          this.setState({
            likes: res.data.likes.length,
            dislikes: res.data.dislikes.length
          });
        });
    }
  }
  onLikeClick = () => {
    this.setState({ likes: 1 });
  };
  onDislikeClick = () => {
    this.setState({ dislikes: 1 });
  };
  render() {
    const { post, author, customization } = this.props;
    return (
      <div className='post-wrapper'>
        <header className='post-header'>
          <Avatar src={author.avatar} />
          <span className='post-author'>{`${author.firstName} ${
            author.lastName
          }`}</span>
        </header>
        <main className='post-main'>
          <h3>{post.title}</h3>
          <div className='content'>{post.content}</div>
          {post.image && (
            <img
              className='img'
              width='200'
              height='200'
              src={post.image}
              alt={post._id}
            />
          )}
        </main>
        <footer className='post-footer'>
          <div className='clickable' onClick={this.onLikeClick}>
            <Emoji emoji={{ id: customization.likeButton }} size={16} />
            <span>{this.state.likes}</span>
          </div>
          <div className='clickable' onClick={this.onDislikeClick}>
            <Emoji emoji={{ id: customization.dislikeButton }} size={16} />
            <span>{this.state.dislikes}</span>
          </div>
        </footer>
      </div>
    );
  }
}

export default Post;
