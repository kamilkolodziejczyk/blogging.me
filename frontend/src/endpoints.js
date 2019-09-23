const SERVER_ADDRESS = 'http://localhost:6969';

const USER_LOGIN = `${SERVER_ADDRESS}/login`;
const USER_REGISTER = `${SERVER_ADDRESS}/users/register`;
const USER_SEARCH = `${SERVER_ADDRESS}/users/search`;
const USER_GET_BY_ID = `${SERVER_ADDRESS}/users`;
const USER_FOLLOWERS = `${SERVER_ADDRESS}/users/followers`;

const BLOG = `${SERVER_ADDRESS}/blogs`;

const POST_GET_ALL_FOLLOWERS = `${SERVER_ADDRESS}/posts/all/followers-post`;

export default {
  USER_LOGIN,
  USER_REGISTER,
  USER_SEARCH,
  USER_GET_BY_ID,
  USER_FOLLOWERS,

  BLOG,

  POST_GET_ALL_FOLLOWERS
};
