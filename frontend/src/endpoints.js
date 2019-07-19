const SERVER_ADDR = 'http://localhost:6969';

const USER_LOGIN = `${SERVER_ADDR}/login`;
const USER_REGISTRATION = `${SERVER_ADDR}/users/register`;
const USER_GET_BY_ID = `${SERVER_ADDR}/users`;
const USER_SEARCH = `${SERVER_ADDR}/users/search`;
const USER_FOLLOWERS = `${SERVER_ADDR}/users/followers`;
const USER_FOLLOW = `${SERVER_ADDR}/users/follow`;
const USER_UNFOLLOW = `${SERVER_ADDR}/users/unfollow`;
const USER_GET_ALL_SEARCHING_DATA = `${SERVER_ADDR}/users/all-info/search`;

const BLOG = `${SERVER_ADDR}/blogs`;

const POST = `${SERVER_ADDR}/posts`;
const POST_GET_ALL_FOLLOWERS = `${POST}/all/followers-post`;

const REACTION = `${SERVER_ADDR}/reactions`;

export default {
  USER_LOGIN,
  USER_REGISTRATION,
  USER_GET_BY_ID,
  USER_SEARCH,
  USER_FOLLOWERS,
  USER_FOLLOW,
  USER_UNFOLLOW,
  USER_GET_ALL_SEARCHING_DATA,
  BLOG,
  POST,
  POST_GET_ALL_FOLLOWERS,
  REACTION
};
