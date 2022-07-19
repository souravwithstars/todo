const request = require('supertest');
const { todo } = require('../src/todo.js');

const app = todo();

describe('serveSignUpPage', () => {
  it('Should serve html with status 200', done => {
    request(app)
      .get('/')
      .expect('Content-type', /html/)
      .expect(200)
      .end(done)
  });
});
