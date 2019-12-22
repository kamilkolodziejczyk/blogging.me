const request = require('supertest');
const {Blog} = require('../../../model/blog');
const {User} = require('../../../model/user');

describe('/blogs', () => {
  const {app} = require('../../../index');
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
  });
  describe('GET /', () => {
    it('should return all blogs', async () => {
      await Blog.collection.insertMany([{name: 'Blog test'}, {name: 'Blog test2'}]);
      const res = await request(app).get('/blogs/');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(b => b.name === 'Blog test')).toBeTruthy();
      expect(res.body.some(b => b.name === 'Blog test2')).toBeTruthy();
    });
  });
  describe('GET /:id', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(app).get('/blogs/1');
      expect(res.status).toBe(401);
    });
    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateToken();
      const res = await request(app).get('/blogs/1').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return 404 if can not find user with ID', async () => {
      const token = new User().generateToken();
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test'
      });
      await user.save();
      const id = user._id;
      await User.deleteMany({});
      const res = await request(app).get(`/blogs/${id}`).set('x-auth-token', token);
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/User/);
      expect(res.text).toMatch(/ID/);
      expect(res.text).toMatch(/not/);
      expect(res.text).toMatch(/exist/);
    });
    it('should return blogs if valid id is passed', async () => {
      const token = new User().generateToken();
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test'
      });
      await user.save();
      const id = user._id;
      const res = await request(app).get(`/blogs/${id}`).set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('blogs', []);
    });
  });
  describe('POST /:id', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(app).post('/blogs/1');
      expect(res.status).toBe(401);
    });
    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateToken();
      const res = await request(app).post('/blogs/1').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return 400 if invalid blog object is passed', async () => {
      const token = new User().generateToken();
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test'
      });
      const blog = {};
      await user.save();
      const id = user._id;
      const res = await request(app).post(`/blogs/${id}`).set('x-auth-token', token).send({blog});
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/name/);
      expect(res.text).toMatch(/required/);
    });
    it('should return 400 if invalid customization object without likeButton is passed', async () => {
      const token = new User().generateToken();
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test'
      });
      const blog = {name: 'Test'};
      const customization = {dislikeButton: '+1'};
      await user.save();
      const id = user._id;
      const res = await request(app).post(`/blogs/${id}`).set('x-auth-token', token).send({blog, customization});
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/likeButton/);
      expect(res.text).toMatch(/required/);
    });
    it('should return 400 if invalid customization object without dislikeButton is passed', async () => {
      const token = new User().generateToken();
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test'
      });
      const blog = {name: 'Test'};
      const customization = {likeButton: '+1'};
      await user.save();
      const id = user._id;
      const res = await request(app).post(`/blogs/${id}`).set('x-auth-token', token).send({blog, customization});
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/dislikeButton/);
      expect(res.text).toMatch(/required/);
    });
    it('should return 400 if can not find user with ID', async () => {
      const token = new User().generateToken();
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test'
      });
      const blog = {name: 'Test'};
      const customization = {likeButton: '+1', dislikeButton: '-1'};
      await user.save();
      await User.deleteMany({});
      const id = user._id;
      const res = await request(app).post(`/blogs/${id}`).set('x-auth-token', token).send({blog, customization});
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/Author/);
      expect(res.text).toMatch(/not/);
      expect(res.text).toMatch(/exist/);
      expect(res.text).toMatch(/database/);
    });
    it('should return 400 if blog with this name was already created', async () => {
      const token = new User().generateToken();
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test'
      });
      const blog1 = new Blog({name: 'Test'});
      await blog1.save();
      const blog = {name: 'Test'};
      const customization = {likeButton: '+1', dislikeButton: '-1'};
      await user.save();
      const id = user._id;
      const res = await request(app).post(`/blogs/${id}`).set('x-auth-token', token).send({blog, customization});
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/Blog/);
      expect(res.text).toMatch(/name/);
      expect(res.text).toMatch(/already/);
      expect(res.text).toMatch(/created/);
    });
    it('should return blog if valid input is passed', async () => {
      const token = new User().generateToken();
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test'
      });
      const blog = {name: 'Test'};
      const customization = {likeButton: '+1', dislikeButton: '-1'};
      await user.save();
      const id = user._id;
      const res = await request(app).post(`/blogs/${id}`).set('x-auth-token', token).send({blog, customization});
      expect(res.status).toBe(200);
      expect(res.body.blog.name).toBe(blog.name);
    });
  });
  describe('PUT /:id', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(app).put('/blogs/1');
      expect(res.status).toBe(401);
    });
    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateToken();
      const res = await request(app).put('/blogs/1').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return 400 if invalid blog object is passed', async () => {
      const token = new User().generateToken();
      const blog = new Blog({name: 'Test'});
      await blog.save();
      const id = blog._id;
      const res = await request(app).put(`/blogs/${id}`).set('x-auth-token', token).send({blog: {}});
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/name/);
      expect(res.text).toMatch(/required/);
    });
    it('should return 400 if blog with this name was already created', async () => {
      const token = new User().generateToken();
      const blog = new Blog({name: 'Test'});
      await blog.save();
      const id = blog._id;
      await Blog.deleteMany({});
      const res = await request(app).put(`/blogs/${id}`).set('x-auth-token', token).send({blog: {name: 'Test'}});
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/Blog/);
      expect(res.text).toMatch(/ID/);
      expect(res.text).toMatch(/not/);
      expect(res.text).toMatch(/exist/);
    });
    it('should return blog if valid input is passed', async () => {
      const token = new User().generateToken();
      const blogObject = new Blog({name: 'Test'});
      await blogObject.save();
      const id = blogObject._id;
      const blog = {name: 'Test'};
      const res = await request(app).put(`/blogs/${id}`).set('x-auth-token', token).send({blog});
      expect(res.status).toBe(200);
      expect(res.body.name).toBe(blog.name);
    });
  });
  describe('DELETE /:id', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(app).delete('/blogs/1');
      expect(res.status).toBe(401);
    });
    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateToken();
      const res = await request(app).delete('/blogs/1').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return 404 if can not find blog with ID', async () => {
      const token = new User().generateToken();
      const blog = new Blog({name: 'Test'});
      await blog.save();
      const id = blog._id;
      await Blog.deleteMany({});
      const res = await request(app).delete(`/blogs/${id}`).set('x-auth-token', token);
      expect(res.status).toBe(404);
      expect(res.text).toMatch(/Blog/);
      expect(res.text).toMatch(/ID/);
      expect(res.text).toMatch(/not/);
      expect(res.text).toMatch(/exist/);
    });
    it('should return message about successfully remove blog', async () => {
      const token = new User().generateToken();
      const blog = new Blog({name: 'Test'});
      await blog.save();
      const id = blog._id;
      const res = await request(app).delete(`/blogs/${id}`).set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Success delete blog');
    });
  });
});

