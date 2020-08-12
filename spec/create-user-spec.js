const UserModel = require('../mocks/models/employee-model');
const { createEmployee } = require('../controllers/employees-controller')(UserModel);

describe('POST /api/v1.0.1/auth/create-user', () => {
  const res = {
    status: (statusCode) => ({ statusCode, ...res }),
    header: (key, value) => ({ key, value, ...res }),
    cookie: (key, value, options) => ({
      key, value, options, ...res,
    }),
    json: ({ message, userId }) => ({ message, userId, ...res }),
    send: (message) => ({ message, ...res }),
  };

  describe('for new user', () => {
    const req = {
      body: {
        firstName: 'Tobi',
        lastName: 'Akanji',
        email: 'tboy@yahoo.com',
        password: 'Password1234',
        gender: 'male',
        jobRole: 'CTO',
        department: 'Software',
        address: 'CVilla',
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
      await createEmployee(req, res);
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
    it('returns a json response with a message and the user ID', async (done) => {
      expect(resJsonSpy).toHaveBeenCalledWith({
        message: 'User account successfully created', userId: 2, accessExp: 600, refreshExp: 2592000,
      });
      done();
    });
  });

  describe('for existing user', () => {
    const req = {
      body: {
        firstName: 'Tobi',
        lastName: 'Akanji',
        email: 'tboy@gmail.com',
        password: 'Password1234',
        gender: 'male',
        jobRole: 'CTO',
        department: 'Software',
        address: 'CVilla',
      },
    };

    let resStatusSpy;
    let resSendSpy;
    beforeAll(async (done) => {
      resStatusSpy = spyOn(res, 'status').and.callThrough();
      resSendSpy = spyOn(res, 'send');
      await createEmployee(req, res);
      done();
    });

    it('responds status 403', async (done) => {
      expect(resStatusSpy).toHaveBeenCalledWith(403);
      done();
    });
    it('responds with an error message', async (done) => {
      expect(resSendSpy).toHaveBeenCalledWith('User already exists.');
      done();
    });
  });
});
