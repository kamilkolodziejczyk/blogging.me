import {combineReducers} from 'redux';

import {user} from './user.reducer';
import {post} from './post.reducer';
import {reaction} from './reaction.readucer';

const rootReducer = combineReducers({
  user,
  post,
  reaction
});

export default rootReducer;
