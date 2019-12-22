const request = require('supertest');
const {User} = require('../../../model/user');

describe('/users', () => {
  const {app} = require('../../../index');
  afterEach(async () => {
    await User.deleteMany({});
  });
  describe('GET /', () => {
    it('should return all users', async () => {
      await User.collection.insertMany([
        {
          email: 'test@wp.pl',
          password: '12345678',
          firstName: 'Test',
          lastName: 'Test',
          avatar: 'randomImage'
        },
        {
          email: 'test2@wp.pl',
          password: '12345678',
          firstName: 'Test2',
          lastName: 'Test2',
          avatar: 'randomImage'
        }
      ]);

      const res = await request(app).get('/users/');
      expect(res.status).toBe(200);
      expect(res.body.users.length).toBe(2);
      expect(res.body.users.some(u => u.email === 'test@wp.pl')).toBeTruthy();
      expect(res.body.users.some(u => u.email === 'test2@wp.pl')).toBeTruthy();
    });
  });
  describe('GET /:id', () => {
    it('should return a user if valid id is passed', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await user.save();

      const res = await request(app).get('/users/' + user._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', user.email);
    });
    it('should return 404 if invalid id is passed', async () => {
      const res = await request(app).get('/users/1');

      expect(res.status).toBe(404);
    });
  });
  describe('GET /all-info/search/:id', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(app).get('/users/all-info/search/1');
      expect(res.status).toBe(401);
    });
    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateToken();
      const res = await request(app).get('/users/all-info/search/1').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return a user if valid id is passed', async () => {
      const token = new User().generateToken();
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await user.save();

      const res = await request(app).get('/users/all-info/search/' + user._id).set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty('email', user.email);
      expect(res.body).toHaveProperty('blogs', []);
      expect(res.body).toHaveProperty('following', []);
    });
  });
  describe('GET /followers/:id', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(app).get('/users/followers/1');
      expect(res.status).toBe(401);
    });
    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateToken();
      const res = await request(app).get('/users/followers/1').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return 404 if can not find user with ID', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await user.save();
      const id = user._id;
      await User.deleteMany({});
      const token = new User().generateToken();
      const res = await request(app).get(`/users/followers/${id}`).set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return array of following if valid id is passed', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await user.save();
      const id = user._id;
      const token = new User().generateToken();
      const res = await request(app).get(`/users/followers/${id}`).set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject([]);
    });
  });
  describe('GET /search/:id', () => {
    it('should return 404 if invalid id is passed', async () => {
      const res = await request(app).get('/users/search/1');
      expect(res.status).toBe(404);
    });
    it('should return user if valid id is passed', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      const user2 = new User({
        email: 'test2@wp.pl',
        password: '12345678',
        firstName: 'Test2',
        lastName: 'Test2',
        avatar: 'randomImage'
      });
      await user.save();
      await user2.save();
      const id = user._id;
      const res = await request(app).get(`/users/search/${id}`);
      expect(res.status).toBe(200);
      expect(res.body[0].email).toBe(user2.email);
    });
  });
  describe('POST /register', () => {
    it('should return 400 if invalid body is passed', async () => {
      const res = await request(app).post('/users/register').send({});
      expect(res.status).toBe(400);
    });
    it('should return 400 if user is already registered', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await user.save();
      const res = await request(app).post('/users/register').send({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/User/);
      expect(res.text).toMatch(/already/);
      expect(res.text).toMatch(/registered/);
    });
    it('should return user and token if valid user is passed', async () => {
      const user = {
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      };
      const res = await request(app).post('/users/register').send(user);
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(user.email);
      expect(res.body.token).toBeDefined();
    });
  });
  describe('POST /follow/:id', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(app).post('/users/follow/1');
      expect(res.status).toBe(401);
    });
    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateToken();
      const res = await request(app).post('/users/follow/1').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return 404 if can not find user with ID', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await user.save();
      const id = user._id;
      await User.deleteMany({});
      const token = new User().generateToken();
      const res = await request(app).post(`/users/follow/${id}`).set('x-auth-token', token);
      expect(res.status).toBe(404);
      expect(res.text).toMatch(/User/);
      expect(res.text).toMatch(/ID/);
      expect(res.text).toMatch(/not/);
      expect(res.text).toMatch(/exist/);
    });
    it('should return 404 if can not find user with email', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await user.save();
      const id = user._id;
      const token = new User().generateToken();
      const res = await request(app).post(`/users/follow/${id}`).set('x-auth-token', token).send({email: '1234@wp.pl'});
      expect(res.status).toBe(404);
      expect(res.text).toMatch(/User/);
      expect(res.text).toMatch(/email/);
      expect(res.text).toMatch(/not/);
      expect(res.text).toMatch(/exist/);
    });
    it('should return 404 if can not find user with email', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      const user2 = new User({
        email: 'test2@wp.pl',
        password: '12345678',
        firstName: 'Test2',
        lastName: 'Test2',
        avatar: 'randomImage'
      });
      await user.save();
      await user2.save();
      const id = user._id;
      const token = new User().generateToken();
      const res = await request(app).post(`/users/follow/${id}`).set('x-auth-token', token).send({email: user2.email});
      expect(res.status).toBe(200);
    });
  });
  describe('PUT /unfollow/:id', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(app).put('/users/unfollow/1');
      expect(res.status).toBe(401);
    });
    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateToken();
      const res = await request(app).put('/users/unfollow/1').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return 404 if can not find user with ID', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await user.save();
      const id = user._id;
      await User.deleteMany({});
      const token = new User().generateToken();
      const res = await request(app).put(`/users/unfollow/${id}`).set('x-auth-token', token);
      expect(res.status).toBe(404);
      expect(res.text).toMatch(/User/);
      expect(res.text).toMatch(/ID/);
      expect(res.text).toMatch(/not/);
      expect(res.text).toMatch(/exist/);
    });
    it('should return 404 if can not find user with email', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      const user2 = new User({
        email: 'test2@wp.pl',
        password: '12345678',
        firstName: 'Test2',
        lastName: 'Test2',
        avatar: 'randomImage'
      });
      await user.save();
      await user2.save();
      const id = user._id;
      const id2 = user2._id;
      const token = new User().generateToken();
      const res = await request(app).put(`/users/unfollow/${id}`).set('x-auth-token', token).send({follower: id2});
      expect(res.status).toBe(200);
    });
  });
  describe('PUT /:id', () => {
    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateToken();
      const res = await request(app).put('/users/1').set('x-auth-token', token);
      expect(res.status).toBe(404);
    });
    it('should return 400 if updating object is invalid', async () => {
      const user = new User({
        email: 'test@wp.pl',
        firstName: 'Test',
        password: '12345678',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await user.save();
      const id = user._id;
      const res = await request(app).put(`/users/${id}`).send({
        email: 'test@wp.pl',
        firstName: 'T',
        lastName: 'T',
        avatar: 'randomImage'
      });
      expect(res.status).toBe(400);
    });
    it('should return a user if valid object is passed', async () => {
      const user = new User({
        email: 'test@wp.pl',
        firstName: 'Test',
        password: '12345678',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await user.save();
      const id = user._id;
      const res = await request(app).put(`/users/${id}`).send({
        email: 'test@wp.pl',
        firstName: 'Test2',
        lastName: 'Test2',
        avatar: 'randomImage'
      });
      expect(res.status).toBe(200);
      expect(res.body.email).toBe(user.email);
    });
  });
  describe('DELETE /:id', () => {
    it('should return 404 if invalid id is passed', async () => {
      const res = await request(app).delete('/users/1');
      expect(res.status).toBe(404);
    });
    it('should return a user if valid id is passed', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      });
      await user.save();
      const id = user._id;
      const res = await request(app).get(`/users/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.email).toBe(user.email);
    });
  });
});
