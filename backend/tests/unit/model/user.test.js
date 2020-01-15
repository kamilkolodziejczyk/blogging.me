const {User, validate} = require('../../../model/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('User - model', () => {
  describe('user.generateToken', () => {
    it('should return a valid JWT', () => {
      const payload = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        email: '',
        firstName: '',
        lastName: ''
      };
      const user = new User(payload);
      const token = user.generateToken();
      const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
      expect(decoded).toMatchObject(payload);
    });
  });

  describe('user.validateUser', () => {
    it('should not return error object', () => {
      const user = {
        email: 'test@wp.pl',
        password: '12345678',
        firstName: 'Test',
        lastName: 'Test',
        avatar: 'randomImage'
      };
      const result = validate(user);
      expect(result.error).toEqual(null);
    });
    describe('user.email', () => {
      it('should return error about required email', () => {
        const user = {
          password: '12345678',
          firstName: 'Test',
          lastName: 'Test',
          avatar: 'randomImage'
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/email/);
        expect(result.error.details[0].message).toMatch(/required/);
      });
      it('should return error about email should be string', () => {
        const user = {
          email: 12345,
          password: '12345678',
          firstName: 'Test',
          lastName: 'Test',
          avatar: 'randomImage'
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/email/);
        expect(result.error.details[0].message).toMatch(/must/);
        expect(result.error.details[0].message).toMatch(/string/);
      });
      it('should return error about not allowed empty email', () => {
        const user = {
          email: '',
          password: '12345678',
          firstName: 'Test',
          lastName: 'Test',
          avatar: 'randomImage'
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/email/);
        expect(result.error.details[0].message).toMatch(/not/);
        expect(result.error.details[0].message).toMatch(/allowed/);
        expect(result.error.details[0].message).toMatch(/empty/);
      });
      it('should return error about too short email', () => {
        const user = {
          email: 't@p',
          password: '12345678',
          firstName: 'Test',
          lastName: 'Test',
          avatar: 'randomImage'
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/email/);
        expect(result.error.details[0].message).toMatch(/length/);
        expect(result.error.details[0].message).toMatch(/5/);
      });
      it('should return error about valid email ', () => {
        const user = {
          email: 'testtest',
          password: '12345678',
          firstName: 'Test',
          lastName: 'Test',
          avatar: ''
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/email/);
        expect(result.error.details[0].message).toMatch(/must/);
        expect(result.error.details[0].message).toMatch(/valid/);
      });
    });
    describe('user.password', () => {
      it('should return error about required password', () => {
        const user = {
          email: 'test@test.pl',
          firstName: 'Test',
          lastName: 'Test',
          avatar: 'randomImage'
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/password/);
        expect(result.error.details[0].message).toMatch(/required/);
      });
      it('should return error about password should be string', () => {
        const user = {
          email: 'test@wp.pl',
          password: 12345678,
          firstName: 'Test',
          lastName: 'Test',
          avatar: 'randomImage'
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/password/);
        expect(result.error.details[0].message).toMatch(/must/);
        expect(result.error.details[0].message).toMatch(/string/);
      });
      it('should return error about not allowed empty password', () => {
        const user = {
          email: 'test@test.pl',
          password: '',
          firstName: 'Test',
          lastName: 'Test',
          avatar: 'randomImage'
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/password/);
        expect(result.error.details[0].message).toMatch(/not/);
        expect(result.error.details[0].message).toMatch(/allowed/);
        expect(result.error.details[0].message).toMatch(/empty/);
      });
      it('should return error about too short password', () => {
        const user = {
          email: 'test@test.pl',
          password: '123',
          firstName: 'Test',
          lastName: 'Test',
          avatar: 'randomImage'
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/password/);
        expect(result.error.details[0].message).toMatch(/length/);
        expect(result.error.details[0].message).toMatch(/8/);
      });
      it('should return error about too long password ', () => {
        const user = {
          email: 'test@test.pl',
          password: 'a'.repeat(17),
          firstName: 'Test',
          lastName: 'Test',
          avatar: 'randomImage'
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/password/);
        expect(result.error.details[0].message).toMatch(/length/);
        expect(result.error.details[0].message).toMatch(/16/);
      });
    });
    describe('user.firstName', () => {
      it('should return error about required firstName', () => {
        const user = {
          email: 'test@test.pl',
          password: '12345678',
          lastName: 'Test',
          avatar: 'randomImage'
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/firstName/);
        expect(result.error.details[0].message).toMatch(/required/);
      });
      it('should return error about firstName should be string', () => {
        const user = {
          email: 'test@wp.pl',
          password: '12345678',
          firstName: 1234,
          lastName: 'Test',
          avatar: 'randomImage'
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/firstName/);
        expect(result.error.details[0].message).toMatch(/must/);
        expect(result.error.details[0].message).toMatch(/string/);
      });
      it('should return error about not allowed empty firstName', () => {
        const user = {
          email: 'test@test.pl',
          password: '12345678',
          firstName: '',
          lastName: 'Test',
          avatar: 'randomImage'
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/firstName/);
        expect(result.error.details[0].message).toMatch(/not/);
        expect(result.error.details[0].message).toMatch(/allowed/);
        expect(result.error.details[0].message).toMatch(/empty/);
      });
      it('should return error about too short firstName', () => {
        const user = {
          email: 'test@test.pl',
          password: '12345678',
          firstName: 'T',
          lastName: 'Test',
          avatar: 'randomImage'
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/firstName/);
        expect(result.error.details[0].message).toMatch(/length/);
        expect(result.error.details[0].message).toMatch(/2/);
      });
      it('should return error about too long firstName ', () => {
        const user = {
          email: 'test@test.pl',
          password: '12345678',
          firstName: 'a'.repeat(256),
          lastName: 'Test',
          avatar: 'randomImage'
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/firstName/);
        expect(result.error.details[0].message).toMatch(/length/);
        expect(result.error.details[0].message).toMatch(/255/);
      });
    });
    describe('user.lastName', () => {
      it('should return error about required lastName', () => {
        const user = {
          email: 'test@test.pl',
          password: '12345678',
          firstName: 'Test',
          avatar: 'randomImage'
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/lastName/);
        expect(result.error.details[0].message).toMatch(/required/);
      });
      it('should return error about lastName should be string', () => {
        const user = {
          email: 'test@wp.pl',
          password: '12345678',
          firstName: 'Test',
          lastName: 12345,
          avatar: 'randomImage'
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/lastName/);
        expect(result.error.details[0].message).toMatch(/must/);
        expect(result.error.details[0].message).toMatch(/string/);
      });
      it('should return error about not allowed empty lastName', () => {
        const user = {
          email: 'test@test.pl',
          password: '12345678',
          firstName: 'Test',
          lastName: '',
          avatar: 'randomImage'
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/lastName/);
        expect(result.error.details[0].message).toMatch(/not/);
        expect(result.error.details[0].message).toMatch(/allowed/);
        expect(result.error.details[0].message).toMatch(/empty/);
      });
      it('should return error about too short lastName', () => {
        const user = {
          email: 'test@test.pl',
          password: '12345678',
          firstName: 'Test',
          lastName: 'T',
          avatar: 'randomImage'
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/lastName/);
        expect(result.error.details[0].message).toMatch(/length/);
        expect(result.error.details[0].message).toMatch(/2/);
      });
      it('should return error about too long lastName ', () => {
        const user = {
          email: 'test@test.pl',
          password: '12345678',
          firstName: 'Test',
          lastName: 'a'.repeat(256),
          avatar: 'randomImage'
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/lastName/);
        expect(result.error.details[0].message).toMatch(/length/);
        expect(result.error.details[0].message).toMatch(/255/);
      });
    });
    describe('user.avatar', () => {
      it('should return error about avatar should be string', () => {
        const user = {
          email: 'test@wp.pl',
          password: '12345678',
          firstName: 'Test',
          lastName: 'Test',
          avatar: 1234
        };
        const result = validate(user);
        expect(result.error.details[0].message).toMatch(/avatar/);
        expect(result.error.details[0].message).toMatch(/must/);
        expect(result.error.details[0].message).toMatch(/string/);
      });
    });
  });
});
