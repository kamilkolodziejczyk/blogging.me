/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import CreatePostForm from './common/postForm';
import Post from './post';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { postActions, userActions } from '../redux/actions';
import { Spin } from 'antd';

const HomePage = props => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) props.history.push('/');
    setLoading(props.loading);
    if (!props.posts)
      props.getAllFollowersPosts(localStorage.getItem('user_id'));
    if (props.error) {
      props.clearState();
      props.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      props.history.push('/');
    }
  }, [props.history, props.loading]);

  return (
    <div className='home-wrapper'>
      <Spin spinning={loading} size='large'>
        <CreatePostForm />
        {props.posts &&
          props.posts.map(({ post, author, customization }) => (
            <Post
              key={post._id}
              post={post}
              author={author}
              customization={customization}
            />
          ))}
      </Spin>
    </div>
  );
};

function mapState(state) {
  const { posts, loading, error } = state.post;
  return { posts, loading, error };
}

const actionCreators = {
  getAllFollowersPosts: postActions.getAllFollowersPosts,
  clearState: postActions.clearState,
  logout: userActions.logout
};

export default connect(
  mapState,
  actionCreators
)(withRouter(HomePage));
