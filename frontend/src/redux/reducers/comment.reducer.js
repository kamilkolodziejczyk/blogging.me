import {commentConstants} from '../constants';

export function comment(state = {loading: false}, action) {
  switch (action.type) {
    case commentConstants.CREATE_REQUEST:
      return {...state, loading: true};
    case commentConstants.CREATE_SUCCESS:
      return {...state, loading: false};
    case commentConstants.CREATE_FAILURE:
      return {...state, loading: false, error: action.error};
    case commentConstants.CLEAR_STATE:
      return {loading: false};
    default:
      return state;
  }
}
