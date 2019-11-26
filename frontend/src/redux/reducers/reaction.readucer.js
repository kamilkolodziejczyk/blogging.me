import {reactionsConstants} from '../constants';

export function reaction(state = {loading: false}, action) {
  switch (action.type) {
    case reactionsConstants.GET_ALL_BY_ID_REQUEST:
      return {...state, loading: true};
    case reactionsConstants.GET_ALL_BY_ID_SUCCESS:
      return {...state, loading: false, reaction: action.reaction};
    case reactionsConstants.GET_ALL_BY_ID_FAILURE:
      return {...state, loading: false, error: action.error};
    case reactionsConstants.UPDATE_REQUEST:
      return {...state, loading: true};
    case reactionsConstants.UPDATE_SUCCESS:
      return {...state, loading: false};
    case reactionsConstants.UPDATE_FAILURE:
      return {...state, loading: false, error: action.error};
    default:
      return state;
  }
}
