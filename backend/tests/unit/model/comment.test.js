const {validate} = require('../../../model/comment');

describe('Comment - model', () => {
  describe('comment.validateComment', () => {
    it('should not return error object', () => {
      const comment = {
        user_id: '1',
        content: 'Test',
        date: Date.now()
      };
      const result = validate(comment);
      expect(result.error).toEqual(null);
    });
    describe('comment.user_id', () => {
      it('should return error about required user_id', () => {
        const comment = {
          content: 'Test',
          date: Date.now()
        };
        const result = validate(comment);
        expect(result.error.details[0].message).toMatch(/user_id/);
        expect(result.error.details[0].message).toMatch(/required/);
      });
      it('should return error about user_id should be string', () => {
        const comment = {
          user_id: 1,
          content: 'Test',
          date: Date.now()
        };
        const result = validate(comment);
        expect(result.error.details[0].message).toMatch(/user_id/);
        expect(result.error.details[0].message).toMatch(/must/);
        expect(result.error.details[0].message).toMatch(/string/);
      });
      it('should return error about not allowed empty user_id', () => {
        const comment = {
          user_id: '',
          content: 'Test',
          date: Date.now()
        };
        const result = validate(comment);
        expect(result.error.details[0].message).toMatch(/user_id/);
        expect(result.error.details[0].message).toMatch(/not/);
        expect(result.error.details[0].message).toMatch(/allowed/);
        expect(result.error.details[0].message).toMatch(/empty/);
      });
    });
    describe('comment.content', () => {
      it('should return error about required content', () => {
        const comment = {
          user_id: '1',
          date: Date.now()
        };
        const result = validate(comment);
        expect(result.error.details[0].message).toMatch(/content/);
        expect(result.error.details[0].message).toMatch(/required/);
      });
      it('should return error about content should be string', () => {
        const comment = {
          user_id: '1',
          content: 1234,
          date: Date.now()
        };
        const result = validate(comment);
        expect(result.error.details[0].message).toMatch(/content/);
        expect(result.error.details[0].message).toMatch(/must/);
        expect(result.error.details[0].message).toMatch(/string/);
      });
      it('should return error about not allowed empty content', () => {
        const comment = {
          user_id: '1',
          content: '',
          date: Date.now()
        };
        const result = validate(comment);
        expect(result.error.details[0].message).toMatch(/content/);
        expect(result.error.details[0].message).toMatch(/not/);
        expect(result.error.details[0].message).toMatch(/allowed/);
        expect(result.error.details[0].message).toMatch(/empty/);
      });
    });
    describe('comment.date', () => {
      it('should return error about required date', () => {
        const comment = {
          user_id: '1',
          content: 'Test'
        };
        const result = validate(comment);
        expect(result.error.details[0].message).toMatch(/date/);
        expect(result.error.details[0].message).toMatch(/required/);
      });
      it('should return error about date should be Date', () => {
        const comment = {
          user_id: '1',
          content: 'Test',
          date: 'random'
        };
        const result = validate(comment);
        expect(result.error.details[0].message).toMatch(/date/);
        expect(result.error.details[0].message).toMatch(/must/);
        expect(result.error.details[0].message).toMatch(/date/);
      });
    });
  });
});
