const ArticleModel = require('../mocks/models/article-model');
const { createArticle } = require('../controllers/articles-controller')(ArticleModel);

describe('POST /api/v1.0.1/articles', () => {
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
      body: {
        title: 'The Subject Matter',
        article: 'The body of the article, that is, the actual article content',
      },
    };

    let resStatusSpy;
    let resJsonSpy;
    beforeAll(async (done) => {
      resStatusSpy = spyOn(res, 'status').and.callThrough();
      resJsonSpy = spyOn(res, 'json');
      await createArticle(req, res);
      done();
    });

    it('responds status 201', async (done) => {
      expect(resStatusSpy).toHaveBeenCalledWith(201);
      done();
    });
    it('returns a json response', async (done) => {
      expect(resJsonSpy).toHaveBeenCalledWith({
        message: 'Article successfully posted',
        articleId: 2,
        title: req.body.title,
        article: req.body.article,
        createdOn: new Date().toLocaleDateString(),
      });
      done();
    });
  });

  describe('for user that does not exist', () => {
    const req = {
      userPayload: {
        uid: 0,
      },
      body: {
        title: 'The Subject Matter',
        article: 'The body of the article, that is, the actual article content',
      },
    };

    let resStatusSpy;
    let resSendSpy;
    beforeAll(async (done) => {
      resStatusSpy = spyOn(res, 'status').and.callThrough();
      resSendSpy = spyOn(res, 'send');
      await createArticle(req, res);
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
