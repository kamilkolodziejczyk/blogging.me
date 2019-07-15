const SERVER_ADDR = 'http://localhost:6969';

const USER_LOGIN = `${SERVER_ADDR}/login`;
const USER_REGISTRATION = `${SERVER_ADDR}/users/register`;
const USER_GET_BY_ID = `${SERVER_ADDR}/users`;
const USER_SEARCH = `${SERVER_ADDR}/users/search`;
const USER_FOLLOWERS = `${SERVER_ADDR}/users/followers`;

const BLOG = `${SERVER_ADDR}/blogs`;

export default {
  USER_LOGIN,
  USER_REGISTRATION,
  USER_GET_BY_ID,
  USER_SEARCH,
  USER_FOLLOWERS,
  BLOG
};
