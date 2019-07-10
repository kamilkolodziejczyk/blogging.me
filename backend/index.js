const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const app = express();

const users = require('./routers/users');
const login = require('./routers/login');
const blogs = require('./routers/blogs');
const posts = require('./routers/posts');
const comments = require('./routers/comments');
const reactions = require('./routers/reactions');

if (!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}

mongoose
  .connect('mongodb://localhost/blogging_me', {
    useNewUrlParser: true
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('Could not connect to MongoDB with error: ', err));

app.use(express.json());

app.use('/login', login);
app.use('/users', users);
app.use('/blogs', blogs);
app.use('/posts', posts);
app.use('/comments', comments);
app.use('/reactions', reactions);

const port = process.env.PORT || 6969;

app.listen(port, () => {
  console.log(`App start listening on ${port} port...`);
});
