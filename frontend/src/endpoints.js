const SERVER_ADDRESS = 'http://localhost:6969';

const USER_LOGIN = `${SERVER_ADDRESS}/login`;
const USER_REGISTER = `${SERVER_ADDRESS}/users/register`;
const USER_SEARCH = `${SERVER_ADDRESS}/users/search`;

const BLOG = `${SERVER_ADDRESS}/blogs`;

const POST_GET_ALL_FOLLOWERS = `${SERVER_ADDRESS}/posts/all/followers-post`;

export default {
  USER_LOGIN,
  USER_REGISTER,
  USER_SEARCH,

  BLOG,

  POST_GET_ALL_FOLLOWERS
};
