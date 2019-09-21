import { userConstants } from '../constants';
import axios from 'axios';
import endpoints from '../../endpoints';

export const userActions = {
  login
};

function login(email, password) {
  return dispatch => {
    dispatch(request({ email }));

    axios
      .post(endpoints.USER_LOGIN, { email, password })
      .then(res => {
        dispatch(success(res.data));
        setLocalStorageData(res.data);
      })
      .catch(err => {
        dispatch(failure(err));
      });
  };

  function request(user) {
    return { type: userConstants.LOGIN_REQUEST, user };
  }
  function success(user) {
    return { type: userConstants.LOGIN_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.LOGIN_FAILURE, error };
  }
}

function setLocalStorageData({ token, user }) {
  localStorage.setItem('token', token);
  localStorage.setItem('user_id', user._id);
}
