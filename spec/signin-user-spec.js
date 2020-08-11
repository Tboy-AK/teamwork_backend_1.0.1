require('dotenv').config();
const AuthModel = require('../mocks/models/auth-model');
const { signinUser } = require('../controllers/auths-controller')(AuthModel);

describe('POST /api/v1.0.1/auth/signin', () => {
  const res = {
    status: (statusCode) => ({ statusCode, ...res }),
    header: (key, value) => ({ key, value, ...res }),
    cookie: (key, value, options) => ({
      key, value, options, ...res,
    }),
    json: ({
      message, userId, accessExp, refreshExp,
    }) => ({
      message, userId, accessExp, refreshExp, ...res,
    }),
    send: (message) => ({ message, ...res }),
  };

  describe('with correct password', () => {
    const req = {
      body: {
        email: 'tboy@gmail.com',
        password: 'Password1234',
      },
    };

    let resStatusSpy;
    let resHeaderSpy;
    let resCookieSpy;
    let resJsonSpy;
    beforeAll(async (done) => {
      resStatusSpy = spyOn(res, 'status').and.callThrough();
      resHeaderSpy = spyOn(res, 'header').and.callThrough();
      resCookieSpy = spyOn(res, 'cookie').and.callThrough();
      resJsonSpy = spyOn(res, 'json');
      await signinUser(req, res);
      done();
    });

    it('responds status 201', async (done) => {
      expect(resStatusSpy).toHaveBeenCalledWith(201);
      done();
    });
    it('responds with access token in Authorization header', async (done) => {
      expect(resHeaderSpy).toHaveBeenCalled();
      done();
    });
    it('responds with refresh token in cookie', async (done) => {
      expect(resCookieSpy).toHaveBeenCalled();
      done();
    });
    it('returns a json response', async (done) => {
      expect(resJsonSpy).toHaveBeenCalledWith({
        message: 'Successfully signed in', userId: 1, accessExp: 600, refreshExp: 2592000,
      });
      done();
    });
  });

  describe('with unregistered user', () => {
    const req = {
      body: {
        email: 'tboy@gmail.co',
        password: 'Password1234',
      },
    };

    let resStatusSpy;
    let resJsonSpy;
    beforeAll(async (done) => {
      resStatusSpy = spyOn(res, 'status').and.callThrough();
      resJsonSpy = spyOn(res, 'send');
      await signinUser(req, res);
      done();
    });

    it('responds status 401', async (done) => {
      expect(resStatusSpy).toHaveBeenCalledWith(401);
      done();
    });
    it('responds with an error message', async (done) => {
      expect(resJsonSpy).toHaveBeenCalledWith('User not recognized');
      done();
    });
  });

  describe('with wrong password', () => {
    const req = {
      body: {
        email: 'tboy@gmail.com',
        password: 'Password1',
      },
    };

    let resStatusSpy;
    let resJsonSpy;
    beforeAll(async (done) => {
      resStatusSpy = spyOn(res, 'status').and.callThrough();
      resJsonSpy = spyOn(res, 'send');
      await signinUser(req, res);
      done();
    });

    it('responds status 401', async (done) => {
      expect(resStatusSpy).toHaveBeenCalledWith(401);
      done();
    });
    it('responds with an error message', async (done) => {
      expect(resJsonSpy).toHaveBeenCalledWith('Wrong password');
      done();
    });
  });
});
