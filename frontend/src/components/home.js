/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import CreatePostForm from './common/postForm';
import Post from './post';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {postActions, userActions} from '../redux/actions';
import {Spin} from 'antd';

const HomePage = props => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    props.getAllFollowersPosts(localStorage.getItem('user_id'))
  }, []);

  useEffect(() => {
    props.getUserById(localStorage.getItem('user_id'));
  }, []);

  useEffect(
    () => {
      if (!localStorage.getItem('token')) props.history.push('/');
      setLoading(props.loading);
      if (props.error) {
        props.clearState();
        props.logout();
        props.changeVisible(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        props.history.push('/');
      }
    },
    [props.history, props.loading]
  );
  return (
    <div className="home-wrapper">
      <Spin spinning={loading} size="large">
        <CreatePostForm/>
        <div className='posts'>
          {(props.posts && props.user) &&
          props.posts.map(({post, author, customization, reactions, comments}) =>
            <Post
              key={post._id}
              post={post}
              author={author}
              comments={comments}
              customization={customization}
              reactions={reactions}
              user={props.user}
            />
          )}
        </div>
      </Spin>
    </div>
  );
};

function mapState(state) {
  const {posts, loading, error} = state.post;
  const {user} = state.user;
  return {posts, loading, error, user};
}

const actionCreators = {
  getAllFollowersPosts: postActions.getAllFollowersPosts,
  clearState: postActions.clearState,
  logout: userActions.logout,
  getUserById: userActions.getUserById
};

export default connect(mapState, actionCreators)(withRouter(HomePage));
