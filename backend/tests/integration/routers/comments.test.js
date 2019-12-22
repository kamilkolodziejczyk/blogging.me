const request = require('supertest');
const {Comment} = require('../../../model/comment');
const {User} = require('../../../model/user');
const {Post} = require('../../../model/post');

describe('/comments', () => {
  const {app} = require('../../../index');
  beforeEach(async () => {
    await Comment.deleteMany({});
    await User.deleteMany({});
    await Post.deleteMany({});
  });
  describe('GET /', () => {
    it('should return all comments', async () => {
      await Comment.collection.insertMany([{
        user_id: '1',
        content: 'Test',
        date: Date.now()
      }, {
        user_id: '2',
        content: 'Test2',
        date: Date.now()
      }]);
      const res = await request(app).get('/comments/');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(c => c.content === 'Test')).toBeTruthy();
      expect(res.body.some(c => c.content === 'Test2')).toBeTruthy();
    })
  });
  describe('GET /:id', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(app).get('/comments/1');
      expect(res.status).toBe(401);
    });
    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateToken();
      const res = await request(app).get('/comments/1').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return 404 if can not find post with ID', async () => {
      const post = new Post({
        title: 'Test',
        publishDate: Date.now(),
        content: 'Test',
        image: '',
      });
      await post.save();
      const id = post._id;
      await Post.deleteMany({});
      const token = new User().generateToken();
      const res = await request(app).get(`/comments/${id}`).set('x-auth-token', token);
      expect(res.status).toBe(404);
      expect(res.text).toMatch(/Post/);
      expect(res.text).toMatch(/ID/);
      expect(res.text).toMatch(/not/);
      expect(res.text).toMatch(/exist/);
    });
    it('should return comment if valid id is passed', async () => {
      const post = new Post({
        title: 'Test',
        publishDate: Date.now(),
        content: 'Test',
        image: '',
      });
      await post.save();
      const id = post._id;
      const token = new User().generateToken();
      const res = await request(app).get(`/comments/${id}`).set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res).toHaveProperty('body', []);
    });
  });
  describe('POST /:id', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(app).post('/comments/1');
      expect(res.status).toBe(401);
    });
    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateToken();
      const res = await request(app).post('/comments/1').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return 400 if invalid comment object is passed', async () => {
      const post = new Post({
        title: 'Test',
        publishDate: Date.now(),
        content: 'Test',
        image: '',
      });
      await post.save();
      const id = post._id;
      const token = new User().generateToken();
      const res = await request(app).post(`/comments/${id}`).set('x-auth-token', token).send({
        comment: {
          user_id: '',
          content: '',
          date: ''
        }
      });
      expect(res.status).toBe(400);
    });
    it('should return 404 if can not find post with ID', async () => {
      const post = new Post({
        title: 'Test',
        publishDate: Date.now(),
        content: 'Test',
        image: '',
      });
      const comment = {
        user_id: '1',
        content: 'Test',
        date: Date.now()
      };
      await post.save();
      const id = post._id;
      await Post.deleteMany({});
      const token = new User().generateToken();
      const res = await request(app).post(`/comments/${id}`).set('x-auth-token', token).send({
        comment
      });
      expect(res.status).toBe(404);
      expect(res.text).toMatch(/Post/);
      expect(res.text).toMatch(/ID/);
      expect(res.text).toMatch(/not/);
      expect(res.text).toMatch(/exist/);
    });
    it('should return comment if valid id is passed', async () => {
      const post = new Post({
        title: 'Test',
        publishDate: Date.now(),
        content: 'Test',
        image: '',
      });
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await post.save();
      await user.save();
      const comment = {
        user_id: user._id,
        content: 'Test',
        date: Date.now()
      };
      const token = new User().generateToken();
      const res = await request(app).post(`/comments/${post._id}`).set('x-auth-token', token).send({comment});
      expect(res.status).toBe(200);
    });
  });
  describe('PUT /:id', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(app).put('/comments/1');
      expect(res.status).toBe(401);
    });
    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateToken();
      const res = await request(app).put('/comments/1').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return 400 if invalid comment object is passed', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await user.save();
      const comment = new Comment({
        user_id: user._id,
        content: 'Test',
        date: Date.now()
      });
      await comment.save();
      const id = comment._id;
      const token = new User().generateToken();
      const res = await request(app).put(`/comments/${id}`).set('x-auth-token', token).send({
        comment: {
          user_id: '',
          content: '',
          date: ''
        }
      });
      expect(res.status).toBe(400);
    });
    it('should return 404 if can not find comment with ID', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await user.save();
      const comment = new Comment({
        user_id: user._id,
        content: 'Test',
        date: Date.now()
      });
      await comment.save();
      const user_id = user._id;
      const id = comment._id;
      await Comment.deleteMany({});
      const token = new User().generateToken();
      const res = await request(app).put(`/comments/${id}`).set('x-auth-token', token).send({
        user_id,
        content: 'Test22',
        date: Date.now()
      });
      expect(res.status).toBe(404);
      expect(res.text).toMatch(/Comment/);
      expect(res.text).toMatch(/ID/);
      expect(res.text).toMatch(/not/);
      expect(res.text).toMatch(/exist/);
    });
    it('should return comment if valid id is passed', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await user.save();
      const comment = new Comment({
        user_id: user._id,
        content: 'Test',
        date: Date.now()
      });
      await comment.save();
      const id = comment._id;
      const token = new User().generateToken();
      const res = await request(app).put(`/comments/${id}`).set('x-auth-token', token).send({
        user_id: user._id,
        content: 'Test2',
        date: Date.now()
      });
      expect(res.status).toBe(200);
    });
  });
  describe('DELETE /:id', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(app).delete('/comments/1');
      expect(res.status).toBe(401);
    });
    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateToken();
      const res = await request(app).delete('/comments/1').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return 404 if can not find comment with ID', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await user.save();
      const comment = new Comment({
        user_id: user._id,
        content: 'Test',
        date: Date.now()
      });
      await comment.save();
      const id = comment._id;
      const token = new User().generateToken();
      await Comment.deleteMany({});
      const res = await request(app).delete(`/comments/${id}`).set('x-auth-token', token);
      expect(res.status).toBe(404);
      expect(res.text).toMatch(/Comment/);
      expect(res.text).toMatch(/ID/);
      expect(res.text).toMatch(/not/);
      expect(res.text).toMatch(/exist/);
    });
    it('should return message if valid comment ID is passed', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await user.save();
      const comment = new Comment({
        user_id: user._id,
        content: 'Test',
        date: Date.now()
      });
      await comment.save();
      const id = comment._id;
      const token = new User().generateToken();
      const res = await request(app).delete(`/comments/${id}`).set('x-auth-token', token);
      expect(res.status).toBe(200);
    });
  });
});
