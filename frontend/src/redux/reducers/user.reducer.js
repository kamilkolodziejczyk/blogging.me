import { userConstants } from '../constants';

export function user(state = { loading: false }, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return { loading: true };
    case userConstants.LOGIN_SUCCESS:
      return { loading: false, loggedIn: true, user: action.user };
    case userConstants.LOGIN_FAILURE:
      return { loading: false, error: action.error };
    default:
      return state;
  }
}
