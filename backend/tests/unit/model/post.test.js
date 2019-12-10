const {validate} = require('../../../model/post');

describe('Post - model', () => {
  describe('post.validatePost', () => {
    it('should not return error object', () => {
      const post = {
        title: 'Gotowanie',
        publishDate: Date.now(),
        image: '',
        content: 'Test'
      };
      const result = validate(post);
      expect(result.error).toEqual(null);
    });
    describe('post.title', () => {
      it('should return error about required title', () => {
        const post = {
          publishDate: Date.now(),
          image: '',
          content: 'Test'
        };
        const result = validate(post);
        expect(result.error.details[0].message).toMatch(/title/);
        expect(result.error.details[0].message).toMatch(/required/);
      });
      it('should return error about title should be string', () => {
        const post = {
          title: 1234,
          publishDate: Date.now(),
          image: '',
          content: 'Test'
        };
        const result = validate(post);
        expect(result.error.details[0].message).toMatch(/title/);
        expect(result.error.details[0].message).toMatch(/must/);
        expect(result.error.details[0].message).toMatch(/string/);
      });
      it('should return error about not allowed empty title', () => {
        const post = {
          title: '',
          publishDate: Date.now(),
          image: '',
          content: 'Test'
        };
        const result = validate(post);
        expect(result.error.details[0].message).toMatch(/title/);
        expect(result.error.details[0].message).toMatch(/not/);
        expect(result.error.details[0].message).toMatch(/allowed/);
        expect(result.error.details[0].message).toMatch(/empty/);
      });
      it('should return error about too short title', () => {
        const post = {
          title: 'Te',
          publishDate: Date.now(),
          image: '',
          content: 'Test'
        };
        const result = validate(post);
        expect(result.error.details[0].message).toMatch(/title/);
        expect(result.error.details[0].message).toMatch(/length/);
        expect(result.error.details[0].message).toMatch(/3/);
      });
      it('should return error about too long title', () => {
        const post = {
          title: 'a'.repeat(256),
          publishDate: Date.now(),
          image: '',
          content: 'Test'
        };
        const result = validate(post);
        expect(result.error.details[0].message).toMatch(/title/);
        expect(result.error.details[0].message).toMatch(/length/);
        expect(result.error.details[0].message).toMatch(/255/);
      });
    });
    describe('post.publishDate', () => {
      it('should return error about required publishDate', () => {
        const post = {
          title: 'Gotowanie',
          image: '',
          content: 'Test'
        };
        const result = validate(post);
        expect(result.error.details[0].message).toMatch(/publishDate/);
        expect(result.error.details[0].message).toMatch(/required/);
      });
      it('should return error about publishDate should be Date', () => {
        const post = {
          title: 'Gotowanie',
          publishDate: 'random',
          image: '',
          content: 'Test'
        };
        const result = validate(post);
        expect(result.error.details[0].message).toMatch(/publishDate/);
        expect(result.error.details[0].message).toMatch(/must/);
        expect(result.error.details[0].message).toMatch(/date/);
      });
    });
    describe('post.image', () => {
      it('should return error about image should be string', () => {
        const post = {
          title: 'Gotowanie',
          publishDate: Date.now(),
          image: 1234,
          content: 'Test'
        };
        const result = validate(post);
        expect(result.error.details[0].message).toMatch(/image/);
        expect(result.error.details[0].message).toMatch(/must/);
        expect(result.error.details[0].message).toMatch(/string/);
      });
    });
    describe('post.content', () => {
      it('should return error about required content', () => {
        const post = {
          title: 'Gotowanie',
          publishDate: Date.now(),
          image: '',
        };
        const result = validate(post);
        expect(result.error.details[0].message).toMatch(/content/);
        expect(result.error.details[0].message).toMatch(/required/);
      });
      it('should return error about content should be string', () => {
        const post = {
          title: 'Gotowanie',
          publishDate: Date.now(),
          image: '',
          content: 1234
        };
        const result = validate(post);
        expect(result.error.details[0].message).toMatch(/content/);
        expect(result.error.details[0].message).toMatch(/must/);
        expect(result.error.details[0].message).toMatch(/string/);
      });
      it('should return error about not allowed empty content', () => {
        const post = {
          title: 'Gotowanie',
          publishDate: Date.now(),
          image: '',
          content: ''
        };
        const result = validate(post);
        expect(result.error.details[0].message).toMatch(/content/);
        expect(result.error.details[0].message).toMatch(/not/);
        expect(result.error.details[0].message).toMatch(/allowed/);
        expect(result.error.details[0].message).toMatch(/empty/);
      });
    });
  });
});
