import React, { useState } from 'react';
import { Form, Input, Button, Radio, notification } from 'antd';
import { Picker, Emoji } from 'emoji-mart';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import endpoints from '../endpoints';
import { userActions } from '../redux/actions';

const BlogForm = props => {
  const [likeEmoji, setLikeEmoji] = useState({ id: '+1' });
  const [dislikeEmoji, setDislikeEmoji] = useState({ id: '-1' });
  const [choosingEmoji, setChoosingEmoji] = useState('like');
  const [name, setName] = useState('');

  const selectEmoji = emoji => {
    if (choosingEmoji === 'like') setLikeEmoji({ id: emoji.id });
    else if (choosingEmoji === 'dislike') setDislikeEmoji({ id: emoji.id });
  };

  const createBlog = () => {
    axios
      .post(
        `${endpoints.BLOG}/${localStorage.getItem('user_id')}`,
        {
          customization: {
            likeButton: likeEmoji.id,
            dislikeButton: dislikeEmoji.id
          },
          blog: {
            name: name
          }
        },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        }
      )
      .then(res => {
        setLikeEmoji({ id: '+1' });
        setDislikeEmoji({ id: '-1' });
        setChoosingEmoji('like');
        setName('');
        notification['success']({
          message: 'The blog is successfully create.'
        });
        if (res.data.token) localStorage.setItem('token', res.data.token);
        props.history.push('/home');
      })
      .catch(err => {
        notification['error']({
          message: err.response.data
        });
        if (err.response.status === 401) {
          props.logout();
          props.history.push('/');
        }
      });
  };

  return (
    <div className='form-wrapper'>
      <Form className='form'>
        <h1>New Blog</h1>
        <Form.Item>
          <Input
            placeholder='Name'
            size='large'
            onChange={e => setName(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <h2>Choose your reaction emoji</h2>
          <Radio.Group
            onChange={e => setChoosingEmoji(e.target.value)}
            defaultValue='like'
            size='large'
          >
            <Radio value='like'>Like emoji</Radio>
            <Radio value='dislike'>Dislike emoji</Radio>
          </Radio.Group>
          <Picker onSelect={emoji => selectEmoji(emoji)} />
        </Form.Item>
        <Form.Item>
          <h3>Like emoji:</h3>
          <Emoji emoji={likeEmoji} size={30} />
          <h3>Dislike emoji:</h3>
          <Emoji emoji={dislikeEmoji} size={30} />
        </Form.Item>
        <Button className='form-button' type='primary' onClick={createBlog}>
          Create blog
        </Button>
      </Form>
    </div>
  );
};

function mapState(state) {}

const actionCreators = {
  logout: userActions.logout
};

export default connect(
  mapState,
  actionCreators
)(withRouter(BlogForm));
