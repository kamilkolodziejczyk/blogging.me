import { postConstants } from '../constants';

export function post(state = { loading: false }, action) {
  switch (action.type) {
    case postConstants.GET_ALL_BY_FOLLOWER_REQUEST:
      return { loading: true };
    case postConstants.GET_ALL_BY_FOLLOWER_SUCCESS:
      return { loading: false, posts: action.posts };
    case postConstants.GET_ALL_BY_FOLLOWER_FAILURE:
      return { loading: false, error: action.error };
    case postConstants.CLEAR_STATE:
      return { loading: false };
    default:
      return state;
  }
}
