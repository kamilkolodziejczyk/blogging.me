const express = require('express');

const users = require('../routers/users');
const login = require('../routers/login');
const blogs = require('../routers/blogs');
const posts = require('../routers/posts');
const comments = require('../routers/comments');
const reactions = require('../routers/reactions');

module.exports = function (app) {
  app.use(express.json());
  app.use('/login', login);
  app.use('/users', users);
  app.use('/blogs', blogs);
  app.use('/posts', posts);
  app.use('/comments', comments);
  app.use('/reactions', reactions);
}
