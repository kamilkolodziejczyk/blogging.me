
const request = require('supertest');
const { User } = require('../../model/user');

describe('/users/', () => {
  const {app} = require('../../index');
  afterEach(async () => {
    await User.deleteMany({});
  });
  describe('GET /', () => {
    it('should return all users', async () => {
      await User.collection.insertMany([
        {email: 'test@wp.pl',
          password: '12345678',
          firstName: 'Test',
          lastName: 'Test',
          avatar: 'randomImage'},
        {email: 'test2@wp.pl',
          password: '12345678',
          firstName: 'Test2',
          lastName: 'Test2',
          avatar: 'randomImage'}
      ]);

      const res = await request(app).get('/users/');
      expect(res.status).toBe(200);
      expect(res.body.users.length).toBe(2);
    })
  })
});
