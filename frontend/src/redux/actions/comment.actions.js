import {commentConstants} from '../constants';
import axios from 'axios';
import endpoints from '../../endpoints';

export const commentActions = {
  clearState,
  create
};

function create(postId, userId, content, date) {
  return dispatch => {
    dispatch(request(postId));

    axios
      .post(
        `${endpoints.COMMENTS}/${postId}`,
        {
          comment: {
            user_id: userId,
            content,
            date
          }
        },
        {
          headers: {'x-auth-token': localStorage.getItem('token')}
        }
      )
      .then(res => {
        dispatch(success(res.data.comment));
      })
      .catch(err => dispatch(failure(err)));
  };

  function request(blogId) {
    return {type: commentConstants.CREATE_REQUEST, blogId};
  }

  function success(comment) {
    return {type: commentConstants.CREATE_SUCCESS, comment};
  }

  function failure(error) {
    return {type: commentConstants.CREATE_FAILURE, error};
  }
}

function clearState() {
  return dispatch => {
    dispatch(clear());
  };

  function clear() {
    return {type: commentConstants.CLEAR_STATE};
  }
}
