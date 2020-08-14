const ArticleModel = require('../mocks/models/article-model');
const { updateArticle } = require('../controllers/articles-controller')(ArticleModel);

describe('PATCH /api/v1.0.1/articles/:articleId', () => {
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
      await updateArticle(req, res);
      done();
    });

    it('responds status 201', async (done) => {
      expect(resStatusSpy).toHaveBeenCalledWith(201);
      done();
    });
    it('returns a json response', async (done) => {
      expect(resJsonSpy).toHaveBeenCalledWith({
        message: 'Article successfully updated',
        articleId: 1,
        title: req.body.title,
        article: req.body.article,
        createdOn: '12-08-2020T11:42:43.890Z',
        updatedOn: new Date().toLocaleDateString(),
      });
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
      await updateArticle(req, res);
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
      await updateArticle(req, res);
      done();
    });

    it('responds failure status 406', async (done) => {
      expect(resStatusSpy).toHaveBeenCalledWith(406);
      done();
    });
    it('returns failure message', async (done) => {
      expect(resSendSpy).toHaveBeenCalledWith('Article not found');
      done();
    });
  });
});
