const request = require('supertest');
const {Reaction} = require('../../../model/reaction');
const {User} = require('../../../model/user');
const {Post} = require('../../../model/post');

describe('/reactions', () => {
  const {app} = require('../../../index');
  afterEach(async () => {
    await Reaction.deleteMany({});
    await Post.deleteMany({});
    await User.deleteMany({});
  });
  describe('GET /:id', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(app).get('/reactions/1');
      expect(res.status).toBe(401);
    });
    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateToken();
      const res = await request(app).get('/reactions/1').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return 404 if can not find reaction with id', async () => {
      const token = new User().generateToken();
      const reaction = new Reaction({likes: [], dislikes: []});
      await reaction.save();
      const id = reaction._id;
      await Reaction.deleteMany({});
      const res = await request(app).get(`/reactions/${id}`).set('x-auth-token', token);
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/Reaction/);
      expect(res.text).toMatch(/ID/);
      expect(res.text).toMatch(/not/);
      expect(res.text).toMatch(/exist/);
    });
    it('should return reaction if valid id is passed', async () => {
      const token = new User().generateToken();
      const reaction = new Reaction({likes: [], dislikes: []});
      await reaction.save();
      const id = reaction._id;
      const res = await request(app).get(`/reactions/${id}`).set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('likes', []);
      expect(res.body).toHaveProperty('dislikes', []);
    });
  });
  describe('PUT /:id', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(app).put('/reactions/1');
      expect(res.status).toBe(401);
    });
    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateToken();
      const res = await request(app).put('/reactions/1').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return 400 if can not find post with ID', async () => {
      const token = new User().generateToken();
      const post = new Post({
        title: 'Test',
        publishDate: Date.now(),
        content: 'Test',
        image: '',
      });
      await post.save();
      const id = post._id;
      await Post.deleteMany({});
      const res = await request(app).put(`/reactions/${id}`).set('x-auth-token', token);
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/Post/);
      expect(res.text).toMatch(/ID/);
      expect(res.text).toMatch(/not/);
      expect(res.text).toMatch(/exist/);
    });
    it('should return 400 if can not find reaction with ID', async () => {
      const token = new User().generateToken();
      const post = new Post({
        title: 'Test',
        publishDate: Date.now(),
        content: 'Test',
        image: '',
      });
      await post.save();
      const id = post._id;
      await Reaction.deleteMany({});
      const res = await request(app).put(`/reactions/${id}`).set('x-auth-token', token);
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/Reaction/);
      expect(res.text).toMatch(/ID/);
      expect(res.text).toMatch(/not/);
      expect(res.text).toMatch(/exist/);
    });
    it('should return 400 if can not find user with ID', async () => {
      const reactions = new Reaction({likes: [], dislikes: []});
      await reactions.save();
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      const post = new Post({
        title: 'Test',
        publishDate: Date.now(),
        content: 'Test',
        image: '',
        reactions: reactions._id
      });
      await post.save();
      await user.save();
      const token = user.generateToken();
      const userId = user._id;
      const id = post._id;
      await User.deleteMany({});
      const res = await request(app).put(`/reactions/${id}`).send({user_id: userId}).set('x-auth-token', token);
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/User/);
      expect(res.text).toMatch(/ID/);
      expect(res.text).toMatch(/not/);
      expect(res.text).toMatch(/exist/);
    });
    it('should return 404 if user already like post', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await user.save();
      const reactions = new Reaction({likes: [user._id], dislikes: []});
      await reactions.save();
      const post = new Post({
        title: 'Test',
        publishDate: Date.now(),
        content: 'Test',
        image: '',
        reactions: reactions._id
      });
      await post.save();
      const token = user.generateToken();
      const userId = user._id;
      const id = post._id;
      const res = await request(app).put(`/reactions/${id}`).send({
        user_id: userId,
        reactionType: 'like'
      }).set('x-auth-token', token);
      expect(res.status).toBe(404);
      expect(res.text).toMatch(/You/);
      expect(res.text).toMatch(/already/);
      expect(res.text).toMatch(/like/);
      expect(res.text).toMatch(/post/);
    });
    it('should return 404 if user already dislike post', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await user.save();
      const reactions = new Reaction({likes: [], dislikes: [user._id]});
      await reactions.save();
      const post = new Post({
        title: 'Test',
        publishDate: Date.now(),
        content: 'Test',
        image: '',
        reactions: reactions._id
      });
      await post.save();
      const token = user.generateToken();
      const userId = user._id;
      const id = post._id;
      const res = await request(app).put(`/reactions/${id}`).send({
        user_id: userId,
        reactionType: 'dislike'
      }).set('x-auth-token', token);
      expect(res.status).toBe(404);
      expect(res.text).toMatch(/You/);
      expect(res.text).toMatch(/already/);
      expect(res.text).toMatch(/dislike/);
      expect(res.text).toMatch(/post/);
    });
    it('should return reaction if valid like object is passed', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await user.save();
      const reactions = new Reaction({likes: [], dislikes: []});
      await reactions.save();
      const post = new Post({
        title: 'Test',
        publishDate: Date.now(),
        content: 'Test',
        image: '',
        reactions: reactions._id
      });
      await post.save();
      const token = user.generateToken();
      const userId = user._id;
      const id = post._id;
      const res = await request(app).put(`/reactions/${id}`).send({
        user_id: userId,
        reactionType: 'like'
      }).set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.likes[0]).toBe(user._id.toString());
    });
    it('should return reaction if valid dislike object is passed', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await user.save();
      const reactions = new Reaction({likes: [], dislikes: []});
      await reactions.save();
      const post = new Post({
        title: 'Test',
        publishDate: Date.now(),
        content: 'Test',
        image: '',
        reactions: reactions._id
      });
      await post.save();
      const token = user.generateToken();
      const userId = user._id;
      const id = post._id;
      const res = await request(app).put(`/reactions/${id}`).send({
        user_id: userId,
        reactionType: 'dislike'
      }).set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.dislikes[0]).toBe(user._id.toString());
    });
  })
});
