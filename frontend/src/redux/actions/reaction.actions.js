import {reactionsConstants} from '../constants';
import axios from 'axios';
import endpoints from '../../endpoints';

export const reactionActions = {
  getAllReactions
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
