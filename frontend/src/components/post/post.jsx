import React, { Component } from 'react';
import { Avatar, notification, Comment, List, Button } from 'antd';
import { Emoji } from 'emoji-mart';
import axios from 'axios';
import moment from 'moment';
import Api from '../../endpoints';
import Editor from '../common/editor';

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
    itemLayout='horizontal'
    renderItem={props => <Comment {...props} />}
  />
);

class Post extends Component {
  state = {
    comments: [],
    value: '',
    likes: 0,
    dislikes: 0,
    isUserCanLike: true,
    isUserCanDislike: true,
    isCommentsVisible: false,
    userAvatar: '',
    name: '',
    likeClass: 'clickable',
    dislikeClass: 'clickable',
    commentsButton: 'Show comments...'
  };
  handleSubmit = () => {
    if (!this.state.value) {
      return;
    }

    axios
      .post(
        `${Api.COMMENTS}/${this.props.post._id}`,
        {
          comment: {
            user_id: localStorage.getItem('user_id'),
            content: this.state.value,
            date: Date.now()
          }
        },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        }
      )
      .then(res =>
        this.setState({
          value: '',
          comments: [
            ...this.state.comments,
            {
              author: this.state.name,
              avatar: this.state.userAvatar,
              content: <p>{this.state.value}</p>,
              datetime: moment().from(res.data.date)
            }
          ]
        })
      )
      .catch(err => console.log(err));
  };

  componentDidMount() {
    const { reactions } = this.props.post;

    axios
      .get(`${Api.USER_GET_BY_ID}/${localStorage.getItem('user_id')}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      .then(res =>
        this.setState({
          userAvatar: res.data.avatar,
          name: `${res.data.firstName} ${res.data.lastName}`
        })
      )
      .catch(err => {
        if (err.response.status === 401) {
          this.props.logout();
        }
      });

    axios
      .get(`${Api.COMMENTS}/${this.props.post._id}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      })
      .then(res => {
        if (res.data.length > 0) {
          res.data.forEach(data => {
            this.setState({
              comments: [
                {
                  author: `${data.author.firstName} ${data.author.lastName}`,
                  avatar: data.author.avatar,
                  content: data.comment.content,
                  datetime: moment().from(data.comment.date)
                },
                ...this.state.comments
              ]
            });
          });
        }
      })
      .catch(err => {
        if (err.response.status === 401) {
          this.props.logout();
        }
      });

    if (reactions) {
      axios
        .get(`${Api.REACTION}/${reactions}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        })
        .then(res => {
          if (
            res.data.likes.find(
              like => like === localStorage.getItem('user_id')
            )
          ) {
            this.setState({
              isUserCanLike: !this.state.isUserCanLike,
              likeClass: 'non-clickable',
              dislikeClass: 'clickable'
            });
            if (this.props.author._id === localStorage.getItem('user_id')) {
              this.setState({
                likeClass: 'non-clickable',
                dislikeClass: 'non-clickable'
              });
            }
          } else if (
            res.data.dislikes.find(
              dislike => dislike === localStorage.getItem('user_id')
            )
          ) {
            this.setState({
              isUserCanDislike: !this.state.isUserCanDislike,
              dislikeClass: 'non-clickable',
              likeClass: 'clickable'
            });
            if (this.props.author._id === localStorage.getItem('user_id')) {
              this.setState({
                likeClass: 'non-clickable',
                dislikeClass: 'non-clickable'
              });
            }
          }
          this.setState({
            likes: res.data.likes.length,
            dislikes: res.data.dislikes.length
          });
          if (
            res.data.likes.length === 0 &&
            res.data.dislikes.length === 0 &&
            this.props.author._id === localStorage.getItem('user_id')
          ) {
            this.setState({
              likeClass: 'non-clickable',
              dislikeClass: 'non-clickable'
            });
          }
        })
        .catch(err => {
          if (err.response.status === 401) {
            this.props.logout();
          }
        });
    }
  }
  handleOnClick = reactionType => {
    if (this.props.author._id !== localStorage.getItem('user_id')) {
      axios
        .put(
          `${Api.REACTION}/${this.props.post._id}`,
          {
            user_id: localStorage.getItem('user_id'),
            reactionType
          },
          { headers: { 'x-auth-token': localStorage.getItem('token') } }
        )
        .then(res => {
          if (
            res.data.likes.find(
              like => like === localStorage.getItem('user_id')
            )
          ) {
            this.setState({
              isUserCanLike: !this.state.isUserCanLike,
              likeClass: 'non-clickable',
              dislikeClass: 'clickable'
            });
          } else if (
            res.data.dislikes.find(
              dislike => dislike === localStorage.getItem('user_id')
            )
          ) {
            this.setState({
              isUserCanDislike: !this.state.isUserCanDislike,
              dislikeClass: 'non-clickable',
              likeClass: 'clickable'
            });
          }
          this.setState({
            likes: res.data.likes.length,
            dislikes: res.data.dislikes.length
          });
        })
        .catch(err => {
          notification['error']({
            message: err.response.data
          });
          if (err.response.status === 401) {
            this.props.logout();
          }
        });
    } else {
      //open modal with users who like and dislike this post
    }
  };
  handleUnclick = () => {};
  render() {
    const { comments, value } = this.state;
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
          <div
            className={this.state.likeClass}
            onClick={e => this.handleOnClick('like', e)}
          >
            <Emoji emoji={{ id: customization.likeButton }} size={16} />
            <span>{this.state.likes}</span>
          </div>
          <div
            className={this.state.dislikeClass}
            onClick={e => this.handleOnClick('dislike', e)}
          >
            <Emoji emoji={{ id: customization.dislikeButton }} size={16} />
            <span>{this.state.dislikes}</span>
          </div>
        </footer>
        <div className='comments'>
          {comments.length > 0 && this.state.isCommentsVisible && (
            <CommentList comments={comments} />
          )}
          {comments.length > 0 && (
            <p
              className='clickable'
              onClick={() => {
                this.setState({
                  commentsButton: this.state.isCommentsVisible
                    ? 'Show comments...'
                    : 'Hide comments...',
                  isCommentsVisible: !this.state.isCommentsVisible
                });
              }}
              type='primary'
            >
              {this.state.commentsButton}
            </p>
          )}

          <Comment
            avatar={<Avatar src={this.state.userAvatar} />}
            content={
              <Editor
                onChange={e => this.setState({ value: e.target.value })}
                onClick={this.handleSubmit}
                value={value}
              />
            }
          />
        </div>
      </div>
    );
  }
}

export default Post;
