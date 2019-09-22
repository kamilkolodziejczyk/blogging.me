import { postConstants } from '../constants';
import axios from 'axios';
import endpoints from '../../endpoints';

export const postActions = {
  getAllFollowersPosts,
  clearState
};

function getAllFollowersPosts(userId) {
  return dispatch => {
    dispatch(request(userId));

    axios
      .get(`${endpoints.POST_GET_ALL_FOLLOWERS}/${userId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      .then(res => dispatch(success(res.data)))
      .catch(error => dispatch(failure(error)));
  };

  function request(userId) {
    return { type: postConstants.GET_ALL_BY_FOLLOWER_REQUEST, userId };
  }
  function success(posts) {
    return { type: postConstants.GET_ALL_BY_FOLLOWER_SUCCESS, posts };
  }
  function failure(error) {
    return { type: postConstants.GET_ALL_BY_FOLLOWER_FAILURE, error };
  }
}

function clearState() {
  return dispatch => {
    dispatch(clear());
  };
  function clear() {
    return { type: postConstants.CLEAR_STATE };
  }
}
