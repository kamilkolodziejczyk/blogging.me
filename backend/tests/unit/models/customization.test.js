const {validate} = require('../../../model/customization');

describe('Customization - model', () => {
  describe('customization.validateCustomization', () => {
    it('should not return error object', () => {
      const customization = {
        likeButton: '+1',
        dislikeButton: '-1'
      };
      const result = validate(customization);
      expect(result.error).toEqual(null);
    });
    describe('customization.likeButton', () => {
      it('should return error about required likeButton', () => {
        const customization = {
          dislikeButton: '-1'
        };
        const result = validate(customization);
        expect(result.error.details[0].message).toMatch(/likeButton/);
        expect(result.error.details[0].message).toMatch(/required/);
      });
      it('should return error about likeButton should be string', () => {
        const customization = {
          likeButton: 123,
          dislikeButton: '-1'
        };
        const result = validate(customization);
        expect(result.error.details[0].message).toMatch(/likeButton/);
        expect(result.error.details[0].message).toMatch(/must/);
        expect(result.error.details[0].message).toMatch(/string/);
      });
      it('should return error about not allowed empty likeButton', () => {
        const customization = {
          likeButton: '',
          dislikeButton: '-1'
        };
        const result = validate(customization);
        expect(result.error.details[0].message).toMatch(/likeButton/);
        expect(result.error.details[0].message).toMatch(/not/);
        expect(result.error.details[0].message).toMatch(/allowed/);
        expect(result.error.details[0].message).toMatch(/empty/);
      });
    });
    describe('customization.dislikeButton', () => {
      it('should return error about required dislikeButton', () => {
        const customization = {
          likeButton: '+1'
        };
        const result = validate(customization);
        expect(result.error.details[0].message).toMatch(/dislikeButton/);
        expect(result.error.details[0].message).toMatch(/required/);
      });
      it('should return error about dislikeButton should be string', () => {
        const customization = {
          likeButton: '+1',
          dislikeButton: 1234
        };
        const result = validate(customization);
        expect(result.error.details[0].message).toMatch(/dislikeButton/);
        expect(result.error.details[0].message).toMatch(/must/);
        expect(result.error.details[0].message).toMatch(/string/);
      });
      it('should return error about not allowed empty dislikeButton', () => {
        const customization = {
          likeButton: '+1',
          dislikeButton: ''
        };
        const result = validate(customization);
        expect(result.error.details[0].message).toMatch(/dislikeButton/);
        expect(result.error.details[0].message).toMatch(/not/);
        expect(result.error.details[0].message).toMatch(/allowed/);
        expect(result.error.details[0].message).toMatch(/empty/);
      });
    });
  });
});
