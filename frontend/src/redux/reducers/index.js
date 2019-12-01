import {combineReducers} from 'redux';

import {user} from './user.reducer';
import {post} from './post.reducer';
import {reaction} from './reaction.readucer';
import {comment} from './comment.reducer';

const rootReducer = combineReducers({
  user,
  post,
  comment,
  reaction
});

export default rootReducer;
