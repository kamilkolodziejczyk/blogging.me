const SERVER_ADDRESS = 'http://localhost:6969';

const POST_GET_ALL_FOLLOWERS = `${SERVER_ADDRESS}/posts/all/followers-post`;
const USER_FOLLOWERS = `${SERVER_ADDRESS}/users/followers`;
const USER_REGISTER = `${SERVER_ADDRESS}/users/register`;
const USER_UNFOLLOW = `${SERVER_ADDRESS}/users/unfollow`;
const USER_FOLLOW = `${SERVER_ADDRESS}/users/follow`;
const USER_SEARCH = `${SERVER_ADDRESS}/users/search`;
const USER_GET_BY_ID = `${SERVER_ADDRESS}/users`;
const REACTIONS = `${SERVER_ADDRESS}/reactions`;
const COMMENTS = `${SERVER_ADDRESS}/comments`;
const USER_LOGIN = `${SERVER_ADDRESS}/login`;
const POSTS = `${SERVER_ADDRESS}/posts`;
const BLOG = `${SERVER_ADDRESS}/blogs`;


export default {
  POST_GET_ALL_FOLLOWERS,
  USER_GET_BY_ID,
  USER_FOLLOWERS,
  USER_REGISTER,
  USER_UNFOLLOW,
  USER_FOLLOW,
  USER_SEARCH,
  USER_LOGIN,
  REACTIONS,
  COMMENTS,
  POSTS,
  BLOG
};
