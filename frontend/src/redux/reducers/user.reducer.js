import { userConstants } from '../constants';

export function user(state = { loading: false }, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return { ...state, loading: true };
    case userConstants.LOGIN_SUCCESS:
      return { ...state, loading: false, loggedIn: true, user: action.user };
    case userConstants.LOGIN_FAILURE:
      return { ...state, loading: false, error: action.error };
    case userConstants.GET_BY_ID_REQUEST:
      return { ...state, loading: true };
    case userConstants.GET_BY_ID_SUCCESS:
      return { ...state, loading: false, user: action.user };
    case userConstants.GET_BY_ID_FAILURE:
      return { ...state, loading: false, error: action.error };
    case userConstants.GET_FOLLOWERS_REQUEST:
      return { ...state, loading: true };
    case userConstants.GET_FOLLOWERS_SUCCESS:
      return { ...state, loading: false, following: action.following };
    case userConstants.GET_FOLLOWERS_FAILURE:
      return { ...state, loading: false, error: action.error };
    case userConstants.REGISTER_REQUEST:
      return { ...state, loading: true };
    case userConstants.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        registeredIn: true,
        user: action.user
      };
    case userConstants.REGISTER_FAILURE:
      return { ...state, loading: false, error: action.error };
    case userConstants.LOGOUT:
      return { ...state, loading: false };
    default:
      return state;
  }
}
