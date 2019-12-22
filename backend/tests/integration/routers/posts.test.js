const request = require('supertest');
const {Post} = require('../../../model/post');
const {User} = require('../../../model/user');
const {Blog} = require('../../../model/blog');

describe('/posts', () => {
  const {app} = require('../../../index');
  afterEach(async () => {
    await Post.deleteMany({});
    await User.deleteMany({});
    await Blog.deleteMany({});
  });
  describe('GET /', () => {
    it('should return all posts', async () => {
      await Post.collection.insertMany([{
        title: 'Post test',
        publishDate: Date.now(),
        content: 'Test',
        image: ''
      }, {
        title: 'Post test2',
        publishDate: Date.now(),
        content: 'Test2',
        image: ''
      }]);
      const res = await request(app).get('/posts/');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(p => p.title === 'Post test')).toBeTruthy();
      expect(res.body.some(p => p.title === 'Post test2')).toBeTruthy();
    });
  });
  describe('GET /all/followers-post/:id', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(app).get('/posts/all/followers-post/1');
      expect(res.status).toBe(401);
    });
    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateToken();
      const res = await request(app).get('/posts/all/followers-post/1').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return 404 if can not find user with ID', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test'
      });
      await user.save();
      const id = user._id;
      await User.deleteMany({});
      const token = new User().generateToken();
      const res = await request(app).get(`/posts/all/followers-post/${id}`).set('x-auth-token', token);
      expect(res.status).toBe(404);
      expect(res.text).toMatch(/User/);
      expect(res.text).toMatch(/ID/);
      expect(res.text).toMatch(/not/);
      expect(res.text).toMatch(/exist/);
    });
    it('should return posts if valid id is passed', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test'
      });
      await user.save();
      const id = user._id;
      const token = new User().generateToken();
      const res = await request(app).get(`/posts/all/followers-post/${id}`).set('x-auth-token', token);
      expect(res.status).toBe(200);
    });
  });
  describe('POST /:id', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(app).post('/posts/1');
      expect(res.status).toBe(401);
    });
    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateToken();
      const res = await request(app).post('/posts/1').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return 400 if invalid post object is passed', async () => {
      const blog = new Blog({name: 'Blog test'});
      await blog.save();
      const token = new User().generateToken();
      const res = await request(app).post(`/posts/${blog._id}`).set('x-auth-token', token).send({
        post: {
          title: 'P',
          publishDate: '',
          content: '',
          image: ''
        }
      });
      expect(res.status).toBe(400);
    });
    it('should return 404 if can not find blog with ID', async () => {
      const blog = new Blog({name: 'Blog test'});
      await blog.save();
      await Blog.deleteMany({});
      const token = new User().generateToken();
      const res = await request(app).post(`/posts/${blog._id}`).set('x-auth-token', token).send({
        post: {
          title: 'Post test',
          publishDate: Date.now(),
          content: 'Test',
          image: ''
        }
      });
      expect(res.status).toBe(404);
      expect(res.text).toMatch(/Blog/);
      expect(res.text).toMatch(/ID/);
      expect(res.text).toMatch(/not/);
      expect(res.text).toMatch(/exist/);
    });
    it('should return post if valid id is passed', async () => {
      const blog = new Blog({name: 'Blog test'});
      await blog.save();
      const token = new User().generateToken();
      const res = await request(app).post(`/posts/${blog._id}`).set('x-auth-token', token).send({
        post: {
          title: 'Post test',
          publishDate: Date.now(),
          content: 'Test',
          image: ''
        }
      });
      expect(res.status).toBe(200);
      expect(res.body.post.title).toBe('Post test');
    });
  });
  describe('PUT /:id', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(app).put('/posts/1');
      expect(res.status).toBe(401);
    });
    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateToken();
      const res = await request(app).put('/posts/1').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return 400 if invalid post object is passed', async () => {
      const blog = new Blog({name: 'Blog test'});
      await blog.save();
      const token = new User().generateToken();
      const res = await request(app).put(`/posts/${blog._id}`).set('x-auth-token', token).send({
        title: 'P',
        publishDate: '',
        content: '',
        image: ''
      });
      expect(res.status).toBe(400);
    });
    it('should return 404 if can not find post with ID', async () => {
      const post = new Post({
        title: 'Post test',
        publishDate: Date.now(),
        content: 'Test',
        image: ''
      });
      await post.save();
      const id = post._id;
      await Post.deleteMany({});
      const token = new User().generateToken();
      const res = await request(app).put(`/posts/${id}`).set('x-auth-token', token).send({
        title: 'Post test2',
        publishDate: Date.now(),
        content: 'Test2',
        image: ''
      });
      expect(res.status).toBe(404);
      expect(res.text).toMatch(/Post/);
      expect(res.text).toMatch(/ID/);
      expect(res.text).toMatch(/not/);
      expect(res.text).toMatch(/exist/);
    });
    it('should return post if valid object is passed', async () => {
      const post = new Post({
        title: 'Post test',
        publishDate: Date.now(),
        content: 'Test',
        image: ''
      });
      await post.save();
      const id = post._id;
      const token = new User().generateToken();
      const res = await request(app).put(`/posts/${id}`).set('x-auth-token', token).send({
        title: 'Post test2',
        publishDate: Date.now(),
        content: 'Test2',
        image: ''
      });
      expect(res.status).toBe(200);
      expect(res.body.post.title).toBe('Post test2');
    });
  });
  describe('DELETE /:id', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(app).delete('/posts/1');
      expect(res.status).toBe(401);
    });
    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateToken();
      const res = await request(app).delete('/posts/1').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return 404 if can not find post with ID', async () => {
      const post = new Post({
        title: 'Post test',
        publishDate: Date.now(),
        content: 'Test',
        image: ''
      });
      await post.save();
      const id = post._id;
      await Post.deleteMany({});
      const token = new User().generateToken();
      const res = await request(app).delete(`/posts/${id}`).set('x-auth-token', token);
      expect(res.status).toBe(404);
      expect(res.text).toMatch(/Post/);
      expect(res.text).toMatch(/ID/);
      expect(res.text).toMatch(/not/);
      expect(res.text).toMatch(/exist/);
    });
    it('should return message if valid id is passed', async () => {
      const post = new Post({
        title: 'Post test',
        publishDate: Date.now(),
        content: 'Test',
        image: ''
      });
      await post.save();
      const id = post._id;
      const token = new User().generateToken();
      const res = await request(app).delete(`/posts/${id}`).set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Success delete post');
    });
  });
});
