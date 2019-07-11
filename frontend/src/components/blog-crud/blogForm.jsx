import React, { Component } from 'react';
import { Form, Input, Button, Radio, notification } from 'antd';
import { Picker, Emoji } from 'emoji-mart';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Api from '../../endpoints';

class BlogForm extends Component {
  state = {
    likeEmoji: {
      id: '+1'
    },
    dislikeEmoji: {
      id: '-1'
    },
    choosingEmoji: 'like',
    name: ''
  };
  selectEmoji = emoji => {
    if (this.state.choosingEmoji === 'like') {
      this.setState({ likeEmoji: { id: emoji.id } });
    } else if (this.state.choosingEmoji === 'dislike') {
      this.setState({ dislikeEmoji: { id: emoji.id } });
    }
  };
  createBlog = () => {
    axios
      .post(
        `${Api.BLOG}/${localStorage.getItem('user_id')}`,
        {
          customization: {
            likeButton: this.state.likeEmoji.id,
            dislikeButton: this.state.dislikeEmoji.id
          },
          blog: {
            name: this.state.name
          }
        },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        }
      )
      .then(res => {
        this.setState({
          likeEmoji: { id: '+1' },
          dislikeEmoji: { id: '-1' },
          choosingEmoji: 'like',
          name: ''
        });
        this.props.history.push('/home');
        this.props.updateBlogs();
        notification['success']({
          message: 'The blog was successfully created'
        });
        if (res.data.token) localStorage.setItem('token', res.data.token);
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
    return (
      <div className='form-wrapper'>
        <Form className='form'>
          <h1>New Blog</h1>
          <Form.Item>
            <Input
              placeholder='Name'
              size='large'
              onChange={e => this.setState({ name: e.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <h2>Choose your reaction emoji</h2>
            <Radio.Group
              onChange={e => this.setState({ choosingEmoji: e.target.value })}
              defaultValue='like'
              size='large'
            >
              <Radio value='like'>Like emoji</Radio>
              <Radio value='dislike'>Dislike emoji</Radio>
            </Radio.Group>
            <Picker onSelect={emoji => this.selectEmoji(emoji)} />
          </Form.Item>
          <Form.Item>
            <h3>Like emoji:</h3>{' '}
            <Emoji emoji={this.state.likeEmoji} size={30} />
            <h3>Dislike emoji:</h3>{' '}
            <Emoji emoji={this.state.dislikeEmoji} size={30} />
          </Form.Item>
          <Button
            className='form-button'
            type='primary'
            onClick={this.createBlog}
          >
            Create blog
          </Button>
        </Form>
      </div>
    );
  }
}

export default withRouter(BlogForm);
