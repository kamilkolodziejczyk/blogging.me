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
    case userConstants.EDIT_USER_REQUEST:
      return { ...state, loading: true };
    case userConstants.EDIT_USER_SUCCESS:
      return { ...state, loading: false, user: action.user };
    case userConstants.EDIT_USER_FAILURE:
      return { ...state, loading: false, error: action.error };
    case userConstants.GET_BLOGS_REQUEST:
      return { ...state, loading: true };
    case userConstants.GET_BLOGS_SUCCESS:
      return { ...state, loading: false, blogs: action.blogs };
    case userConstants.GET_BLOGS_FAILURE:
      return { ...state, loading: false, error: action.error };
    case userConstants.DELETE_USER_BLOG_REQUEST:
      return { ...state, loading: true };
    case userConstants.DELETE_USER_BLOG_SUCCESS:
      return {
        ...state,
        loading: false,
        blogs: state.blogs.filter(blog => blog._id !== action.blogId)
      };
    case userConstants.DELETE_USER_BLOG_FAILURE:
      return { ...state, loading: false, error: action.error };
    case userConstants.UNFOLLOW_REQUEST:
      return { ...state, loading: true };
    case userConstants.UNFOLLOW_SUCCESS:
      return { ...state, loading: false, following: action.following };
    case userConstants.UNFOLLOW_FAILURE:
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
