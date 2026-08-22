const AppError = require('../../utils/AppError');

describe('AppError', () => {
  it('sets statusCode and status = "fail" for 4xx codes', () => {
    const error = new AppError('Not found', 404);
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
  });

  it('sets status = "error" for 5xx codes', () => {
    const error = new AppError('Server error', 500);
    expect(error.status).toBe('error');
  });

  it('defaults isOperational to true', () => {
    const error = new AppError('Something failed', 400);
    expect(error.isOperational).toBe(true);
  });

  it('is an instance of the native Error class', () => {
    const error = new AppError('Oops', 400);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Oops');
  });
});
