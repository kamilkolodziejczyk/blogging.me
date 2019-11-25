import {postConstants} from '../constants';
import axios from 'axios';
import endpoints from '../../endpoints';

export const postActions = {
  getAllFollowersPosts,
  clearState,
  create
};

function getAllFollowersPosts(userId) {
  return dispatch => {
    dispatch(request(userId));

    axios
      .get(`${endpoints.POST_GET_ALL_FOLLOWERS}/${userId}`, {
        headers: {'x-auth-token': localStorage.getItem('token')}
      })
      .then(res => dispatch(success(res.data)))
      .catch(error => dispatch(failure(error)));
  };

  function request(userId) {
    return {type: postConstants.GET_ALL_BY_FOLLOWER_REQUEST, userId};
  }

  function success(posts) {
    return {type: postConstants.GET_ALL_BY_FOLLOWER_SUCCESS, posts};
  }

  function failure(error) {
    return {type: postConstants.GET_ALL_BY_FOLLOWER_FAILURE, error};
  }
}

function create(blogId, post) {
  return dispatch => {
    dispatch(request(blogId));

    axios
      .post(
        `${endpoints.POSTS}/${blogId}`,
        {post},
        {
          headers: {'x-auth-token': localStorage.getItem('token')}
        }
      )
      .then(res => {
        dispatch(success(res.data));
      })
      .catch(err => dispatch(failure(err)));
  };

  function request(blogId) {
    return {type: postConstants.CREATE_REQUEST, blogId};
  }

  function success(post) {
    return {type: postConstants.CREATE_SUCCESS, post};
  }

  function failure(error) {
    return {type: postConstants.CREATE_FAILURE, error};
  }
}

function clearState() {
  return dispatch => {
    dispatch(clear());
  };

  function clear() {
    return {type: postConstants.CLEAR_STATE};
  }
}
