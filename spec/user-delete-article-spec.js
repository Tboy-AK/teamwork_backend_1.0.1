const ArticleModel = require('../mocks/models/article-model');
const { deleteArticle } = require('../controllers/articles-controller')(ArticleModel);

describe('DELETE /api/v1.0.1/articles/:articleID', () => {
  const res = {
    status: (statusCode) => ({ statusCode, ...res }),
    json: ({ message, userId }) => ({ message, userId, ...res }),
    send: (message) => ({ message, ...res }),
  };

  describe('for existing user', () => {
    const req = {
      userPayload: {
        uid: 1,
      },
      params: {
        articleId: 1,
      },
    };

    let resStatusSpy;
    let resSendSpy;
    beforeAll(async (done) => {
      resStatusSpy = spyOn(res, 'status').and.callThrough();
      resSendSpy = spyOn(res, 'send');
      await deleteArticle(req, res);
      done();
    });

    it('responds status 200', async (done) => {
      expect(resStatusSpy).toHaveBeenCalledWith(200);
      done();
    });
    it('responds a success message', async (done) => {
      expect(resSendSpy).toHaveBeenCalledWith('Article successfully deleted');
      done();
    });
  });

  describe('for user that does not exist', () => {
    const req = {
      userPayload: {
        uid: 0,
      },
      params: {
        articleId: 1,
      },
    };

    let resStatusSpy;
    let resSendSpy;
    beforeAll(async (done) => {
      resStatusSpy = spyOn(res, 'status').and.callThrough();
      resSendSpy = spyOn(res, 'send');
      await deleteArticle(req, res);
      done();
    });

    it('responds failure status 403', async (done) => {
      expect(resStatusSpy).toHaveBeenCalledWith(403);
      done();
    });
    it('returns failure message', async (done) => {
      expect(resSendSpy).toHaveBeenCalledWith('Unauthorized request');
      done();
    });
  });

  describe('for article that does not exist', () => {
    const req = {
      userPayload: {
        uid: 1,
      },
      params: {
        articleId: 0,
      },
    };

    let resStatusSpy;
    let resSendSpy;
    beforeAll(async (done) => {
      resStatusSpy = spyOn(res, 'status').and.callThrough();
      resSendSpy = spyOn(res, 'send');
      await deleteArticle(req, res);
      done();
    });

    it('responds failure status 403', async (done) => {
      expect(resStatusSpy).toHaveBeenCalledWith(403);
      done();
    });
    it('returns failure message', async (done) => {
      expect(resSendSpy).toHaveBeenCalledWith('Unauthorized request');
      done();
    });
  });
});
