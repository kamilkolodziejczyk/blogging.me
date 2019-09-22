import { userConstants } from '../constants';
import axios from 'axios';
import endpoints from '../../endpoints';

export const userActions = {
  login,
  register,
  logout
};

function login(email, password) {
  return dispatch => {
    dispatch(request({ email }));

    axios
      .post(endpoints.USER_LOGIN, { email, password })
      .then(res => {
        setLocalStorageData(res.data);
        dispatch(success(res.data));
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

function logout() {
  return dispatch => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_firstname');
    localStorage.removeItem('token');
    dispatch(clear());
  };
  function clear() {
    return { type: userConstants.LOGOUT };
  }
}

function register(user) {
  return dispatch => {
    dispatch(request(user));

    axios
      .post(endpoints.USER_REGISTER, user)
      .then(res => {
        setLocalStorageData(res.data);
        dispatch(success(res.data));
      })
      .catch(err => {
        dispatch(failure(err));
      });
  };

  function request(user) {
    return { type: userConstants.REGISTER_REQUEST, user };
  }
  function success(user) {
    return { type: userConstants.REGISTER_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.REGISTER_FAILURE, error };
  }
}

function setLocalStorageData({ token, user }) {
  localStorage.setItem('token', token);
  localStorage.setItem('user_id', user._id);
  localStorage.setItem('user_firstname', user.firstName);
}
