import {reactionsConstants} from '../constants';
import axios from 'axios';
import endpoints from '../../endpoints';

export const reactionActions = {
  getAllReactions,
  update
};

function getAllReactions(reactionId) {
  return dispatch => {
    dispatch(request(reactionId));

    axios
      .get(`${endpoints.REACTIONS}/${reactionId}`, {
        headers: {'x-auth-token': localStorage.getItem('token')}
      })
      .then(res => dispatch(success(res.data)))
      .catch(error => dispatch(failure(error)));
  };

  function request(reactionId) {
    return {type: reactionsConstants.GET_ALL_BY_ID_REQUEST, reactionId};
  }

  function success(reaction) {
    return {type: reactionsConstants.GET_ALL_BY_ID_SUCCESS, reaction};
  }

  function failure(error) {
    return {type: reactionsConstants.GET_ALL_BY_ID_FAILURE, error};
  }
}

function update(postId, reactionType) {
  return dispatch => {
    dispatch(request(postId));

    axios.put(`${endpoints.REACTIONS}/${postId}`, {
      user_id: localStorage.getItem('user_id'),
      reactionType
    }, {
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    }).then(res => {
      dispatch(success(res.data));
    }).catch(err => {
      dispatch(failure(err));
    })
  };

  function request(postId) {
    return {type: reactionsConstants.UPDATE_SUCCESS, postId}
  }

  function success(reaction) {
    return {type: reactionsConstants.UPDATE_SUCCESS, reaction}
  }

  function failure(error) {
    return {type: reactionsConstants.UPDATE_FAILURE, error}
  }
}
