import { userConstants } from '../constants';

export function user(state = { loading: false }, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return { loading: true };
    case userConstants.LOGIN_SUCCESS:
      return { loading: false, loggedIn: true, user: action.user };
    case userConstants.LOGIN_FAILURE:
      return { loading: false, error: action.error };
    case userConstants.REGISTER_REQUEST:
      return { loading: true };
    case userConstants.REGISTER_SUCCESS:
      return { loading: false, registeredIn: true, user: action.user };
    case userConstants.REGISTER_FAILURE:
      return { loading: false, error: action.error };
    case userConstants.LOGOUT:
      return { loading: false };
    default:
      return state;
  }
}
