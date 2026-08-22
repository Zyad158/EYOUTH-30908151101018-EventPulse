const asyncHandler = require('../../utils/asyncHandler');

describe('asyncHandler', () => {
  it('invokes the wrapped function with req, res and next', async () => {
    const req = {};
    const res = {};
    const next = jest.fn();
    const fn = jest.fn().mockResolvedValue('ok');

    const wrapped = asyncHandler(fn);
    await wrapped(req, res, next);

    expect(fn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('forwards a thrown/rejected error to next()', async () => {
    const req = {};
    const res = {};
    const next = jest.fn();
    const error = new Error('boom');
    const fn = jest.fn().mockRejectedValue(error);

    const wrapped = asyncHandler(fn);
    await wrapped(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
