const { getViews } = require('../controllers/api-nav-controller')();

describe('GET /', () => {
  const req = {};
  const res = {
    status: (statusCode) => ({ statusCode, ...res }),
    json: (resData) => ({ resData, ...res }),
  };
  it('returns status 200', async (done) => {
    const resStatusSpy = spyOn(res, 'status').and.callThrough();
    await getViews(req, res);
    expect(resStatusSpy).toHaveBeenCalledWith(200);
    done();
  });
  it('returns json response', async (done) => {
    const resStatusSpy = spyOn(res, 'json');
    await getViews(req, res);
    expect(resStatusSpy).toHaveBeenCalled();
    done();
  });
  it('returns array of data', async (done) => {
    const response = await getViews(req, res);
    expect(response.resData.length).toBeGreaterThan(0);
    done();
  });
});
