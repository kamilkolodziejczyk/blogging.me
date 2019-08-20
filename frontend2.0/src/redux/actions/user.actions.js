import { userConstants } from '../constants/user.constants';
import axios from 'axios';
import Api from '../../endpoints';

export const userActions = {
  login,
  logout
};

function login(email, password) {
  return dispatch => {
    dispatch(request({ email }));

    axios
      .post(Api.USER_LOGIN, { email, password })
      .then(res => {
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
  return { type: userConstants.LOGOUT };
}
