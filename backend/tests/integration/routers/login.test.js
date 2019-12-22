const request = require('supertest');
const bcrypt = require("bcrypt");
const {User} = require('../../../model/user');

describe('/login', () => {
  const {app} = require('../../../index');
  afterEach(async () => {
    await User.deleteMany({});
  });
  describe('POST /', () => {
    it('should return 400 if invalid input is passed', async () => {
      const loginObject = {
        email: 'Test',
        password: 'Test'
      };
      const res = await request(app).post('/login').send(loginObject);
      expect(res.status).toBe(400);
    });
    it('should return 400 if invalid email is passed', async () => {
      const loginObject = {
        email: 'test1@wp.pl',
        password: '12345678'
      };
      const res = await request(app).post('/login').send(loginObject);
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/Invalid/);
      expect(res.text).toMatch(/email/);
    });
    it('should return 400 if invalid password is passed', async () => {
      const user = new User({
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test1',
        lastName: 'Test1'
      });
      await user.save();
      const loginObject = {
        email: 'test@wp.pl',
        password: 'asdfghjk'
      };
      const res = await request(app).post('/login').send(loginObject);
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/Invalid/);
      expect(res.text).toMatch(/password/);
    });
    it('should return token and user if valid input is passed', async () => {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash('12345678', salt);
      const user = new User({
        email: 'test@wp.pl',
        password,
        firstName: 'Test1',
        lastName: 'Test1'
      });
      await user.save();
      const loginObject = {
        email: 'test@wp.pl',
        password: '12345678'
      };
      const res = await request(app).post('/login').send(loginObject);
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(user.email);
      expect(res.body.token).toBeDefined();
    });
  });
});
