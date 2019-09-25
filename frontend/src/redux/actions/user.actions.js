import { userConstants } from '../constants';
import axios from 'axios';
import endpoints from '../../endpoints';
import { notification } from 'antd';

export const userActions = {
  login,
  register,
  logout,
  getUserById,
  getFollowing,
  editUser,
  getBlogs,
  deleteUserBlog
};

function login(email, password) {
  return dispatch => {
    dispatch(request({ email }));

    axios
      .post(endpoints.USER_LOGIN, { email, password })
      .then(res => {
        setLocalStorageData(res.data);
        dispatch(success(res.data));
      })
      .catch(err => {
        dispatch(failure(err));
      });
  };

  function request(user) {
    return { type: userConstants.LOGIN_REQUEST, user };
  }
  function success(user) {
    return { type: userConstants.LOGIN_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.LOGIN_FAILURE, error };
  }
}

function getBlogs(userId) {
  return dispatch => {
    dispatch(request(userId));

    axios
      .get(`${endpoints.BLOG}/${userId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      .then(res => dispatch(success(res.data.blogs)))
      .catch(err => dispatch(failure(err)));
  };

  function request(userId) {
    return { type: userConstants.GET_BLOGS_REQUEST, userId };
  }
  function success(blogs) {
    return { type: userConstants.GET_BLOGS_SUCCESS, blogs };
  }
  function failure(error) {
    return { type: userConstants.GET_BLOGS_FAILURE, error };
  }
}

function deleteUserBlog(blogId) {
  return dispatch => {
    dispatch(request(blogId));

    axios
      .delete(`${endpoints.BLOG}/${blogId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      .then(res => {
        notification['success']({
          message: 'The blog is successfully delete'
        });
        dispatch(success(blogId));
      })
      .catch(err => {
        notification['error']({
          message: err.response.data
        });
        dispatch(failure(err));
      });
  };

  function request(blogId) {
    return { type: userConstants.DELETE_USER_BLOG_REQUEST, blogId };
  }
  function success(blogId) {
    return { type: userConstants.DELETE_USER_BLOG_SUCCESS, blogId };
  }
  function failure(error) {
    return { type: userConstants.DELETE_USER_BLOG_FAILURE, error };
  }
}

function editUser(user) {
  return dispatch => {
    dispatch(request(user));

    axios
      .put(
        `${endpoints.USER_GET_BY_ID}/${localStorage.getItem('user_id')}`,
        user,
        {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        }
      )
      .then(res => {
        notification['success']({
          message: 'Successfully edit'
        });

        dispatch(success(res.data));
      })
      .catch(err => {
        if (err.response) {
          notification['error']({
            message: err.response.data
          });
        }
        dispatch(failure(err));
      });
  };

  function request(userId) {
    return { type: userConstants.EDIT_USER_REQUEST, userId };
  }
  function success(user) {
    return { type: userConstants.EDIT_USER_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.EDIT_USER_FAILURE, error };
  }
}

function getFollowing(userId) {
  return dispatch => {
    dispatch(request(userId));

    axios
      .get(`${endpoints.USER_FOLLOWERS}/${userId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      .then(res => dispatch(success(res.data)))
      .catch(err => dispatch(failure(err)));
  };

  function request(userId) {
    return { type: userConstants.GET_FOLLOWERS_SUCCESS, userId };
  }
  function success(following) {
    return { type: userConstants.GET_FOLLOWERS_SUCCESS, following };
  }
  function failure(error) {
    return { type: userConstants.GET_FOLLOWERS_FAILURE, error };
  }
}

function getUserById(userId) {
  return dispatch => {
    dispatch(request(userId));

    axios
      .get(`${endpoints.USER_GET_BY_ID}/${userId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      .then(res => dispatch(success(res.data)))
      .catch(err => dispatch(failure(err)));
  };

  function request(userId) {
    return { type: userConstants.GET_BY_ID_REQUEST, userId };
  }
  function success(user) {
    return { type: userConstants.GET_BY_ID_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.GET_BY_ID_FAILURE, error };
  }
}

function logout() {
  return dispatch => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_firstname');
    localStorage.removeItem('token');
    dispatch(clear());
  };
  function clear() {
    return { type: userConstants.LOGOUT };
  }
}

function register(user) {
  return dispatch => {
    dispatch(request(user));

    axios
      .post(endpoints.USER_REGISTER, user)
      .then(res => {
        setLocalStorageData(res.data);
        dispatch(success(res.data));
      })
      .catch(err => {
        dispatch(failure(err));
      });
  };

  function request(user) {
    return { type: userConstants.REGISTER_REQUEST, user };
  }
  function success(user) {
    return { type: userConstants.REGISTER_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.REGISTER_FAILURE, error };
  }
}

function setLocalStorageData({ token, user }) {
  localStorage.setItem('token', token);
  localStorage.setItem('user_id', user._id);
  localStorage.setItem('user_firstname', user.firstName);
}
