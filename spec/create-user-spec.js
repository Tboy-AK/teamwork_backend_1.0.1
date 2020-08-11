const UserModel = require('../mocks/models/employee-model');
const { createUser } = require('../controllers/employees-controller')(UserModel);

describe('POST /api/v1.0.1/auth/create-user', () => {
  const res = {
    status: (statusCode) => ({ statusCode, ...res }),
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
    let resJsonSpy;
    beforeAll(async (done) => {
      resStatusSpy = spyOn(res, 'status').and.callThrough();
      resJsonSpy = spyOn(res, 'json');
      await createUser(req, res);
      done();
    });

    it('responds status 201', async (done) => {
      expect(resStatusSpy).toHaveBeenCalledWith(201);
      done();
    });
    it('returns a json response with a message and the user ID', async (done) => {
      expect(resJsonSpy).toHaveBeenCalledWith({
        message: 'User account successfully created', userId: 2,
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
      await createUser(req, res);
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
