const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const { Post, validate } = require('../model/post');
const { Reaction } = require('../model/reaction');
const { Blog } = require('../model/blog');
const { User } = require('../model/user');
const { Customization } = require('../model/customization');
const router = express.Router();
router.use(cors());

router.get('/', async (req, res) => {
  res.send(await Post.find());
});

router.get('/all/followers-post/:user_id', auth, async (req, res) => {
  const user = await User.findById(req.params.user_id);
  if (!user) return res.status(404).send('User with this ID not exist.');

  const users = await User.find();
  const blogs = await Blog.find();
  const posts = await Post.find();
  const customizations = await Customization.find();

  const followers = await user.following.map(follower =>
    users.find(user => mongoose.Types.ObjectId(user._id).equals(follower))
  );
  followers.push(user);
  const followersBlogs = [];

  await followers.map(follower => {
    follower.blogs.map(followerBlog => {
      blogs.map(blog => {
        if (mongoose.Types.ObjectId(blog._id).equals(followerBlog)) {
          customizations.map(c => {
            if (mongoose.Types.ObjectId(c._id).equals(blog.customization)) {
              const blogWithFollower = { blog, follower, customization: c };
              followersBlogs.push(blogWithFollower);
            }
          });
        }
      });
    });
  });

  const followersPosts = [];
  await followersBlogs.map(followerBlog => {
    followerBlog.blog.posts.map(fposts =>
      posts.map(post => {
        if (mongoose.Types.ObjectId(post._id).equals(fposts)) {
          const followerPostWithAuthor = {
            post,
            author: followerBlog.follower,
            customization: followerBlog.customization
          };
          followersPosts.push(followerPostWithAuthor);
        }
      })
    );
  });

  followersPosts.sort(function(a, b) {
    return new Date(b.post.publishDate) - new Date(a.post.publishDate);
  });

  res.send(followersPosts);
});

router.post('/:current_blog_id', auth, async (req, res) => {
  const { error } = validate(req.body.post);
  if (error) return res.status(400).send(error.details[0].message);

  let blog = await Blog.findById(req.params.current_blog_id);
  if (!blog) return res.status(404).send('Blog with this ID not exist.');

  const reactions = new Reaction({
    likes: [],
    dislikes: []
  });
  await reactions.save();

  const post = new Post({
    title: req.body.post.title,
    publishDate: req.body.post.publishDate,
    content: req.body.post.content,
    image: req.body.post.image ? req.body.post.image : '',
    reactions
  });
  await post.save();

  blog.posts.push(post);
  await blog.save();

  if (req.token) {
    return res.send({
      token: req.token,
      post
    });
  }
  return res.send({
    post
  });
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { title, publishDate, content } = req.body;

  const post = await Post.findOneAndUpdate(
    req.params.id,
    {
      title,
      publishDate,
      content,
      image: req.body.post.image ? req.body.post.image : ''
    },
    { new: true }
  );
  if (!post) return res.status(404).send('Post with this ID not exist');
  if (req.token) {
    return res.send({
      token: req.token,
      post
    });
  }
  return res.send({
    post
  });
});

router.delete('/:id', auth, async (req, res) => {
  let blogs = await Blog.find();
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send('Post with this ID not exist');

  await blogs.map(blog => {
    blog.posts = blog.posts.filter(post_id => {
      post_id === post._id;
    });
    blog.save();
  });
  await post.remove();

  if (req.token) {
    return res.send({
      token: req.token,
      message: 'Success delete post'
    });
  }
  return res.send({ message: 'Success delete post' });
});

module.exports = router;
