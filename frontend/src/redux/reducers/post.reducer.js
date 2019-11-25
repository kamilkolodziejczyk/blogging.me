import {postConstants} from '../constants';

export function post(state = {loading: false}, action) {
  switch (action.type) {
    case postConstants.GET_ALL_BY_FOLLOWER_REQUEST:
      return {...state, loading: true};
    case postConstants.GET_ALL_BY_FOLLOWER_SUCCESS:
      return {...state, loading: false, posts: action.posts};
    case postConstants.GET_ALL_BY_FOLLOWER_FAILURE:
      return {...state, loading: false, error: action.error};
    case postConstants.CREATE_REQUEST:
      return {...state, loading: true};
    case postConstants.CREATE_SUCCESS:
      return {...state, loading: false, posts: [action.post, ...state.posts]};
    case postConstants.CREATE_FAILURE:
      return {...state, loading: false, error: action.error};
    case postConstants.CLEAR_STATE:
      return {loading: false};
    default:
      return state;
  }
}
