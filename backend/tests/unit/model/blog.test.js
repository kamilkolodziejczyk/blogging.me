const {validate} = require('../../../model/blog');

describe('Blog - model', () => {
  describe('blog.validateBlog', () => {
    it('should not return error object', () => {
      const blog = {
        name: 'Gotowanie'
      };
      const result = validate(blog);
      expect(result.error).toEqual(null);
    });
    describe('blog.name', () => {
      it('should return error about required name', () => {
        const blog = {};
        const result = validate(blog);
        expect(result.error.details[0].message).toMatch(/name/);
        expect(result.error.details[0].message).toMatch(/required/);
      });
      it('should return error about name should be string', () => {
        const blog = {
          name: 1234
        };
        const result = validate(blog);
        expect(result.error.details[0].message).toMatch(/name/);
        expect(result.error.details[0].message).toMatch(/must/);
        expect(result.error.details[0].message).toMatch(/string/);
      });
      it('should return error about not allowed empty name', () => {
        const blog = {
          name: ''
        };
        const result = validate(blog);
        expect(result.error.details[0].message).toMatch(/name/);
        expect(result.error.details[0].message).toMatch(/not/);
        expect(result.error.details[0].message).toMatch(/allowed/);
        expect(result.error.details[0].message).toMatch(/empty/);
      });
      it('should return error about too short name', () => {
        const blog = {
          name: 'Te'
        };
        const result = validate(blog);
        expect(result.error.details[0].message).toMatch(/name/);
        expect(result.error.details[0].message).toMatch(/length/);
        expect(result.error.details[0].message).toMatch(/3/);
      });
      it('should return error about too long name', () => {
        const blog = {
          name: 'a'.repeat(256)
        };
        const result = validate(blog);
        expect(result.error.details[0].message).toMatch(/name/);
        expect(result.error.details[0].message).toMatch(/length/);
        expect(result.error.details[0].message).toMatch(/255/);
      });
    });
  });
});
