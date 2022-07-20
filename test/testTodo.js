const request = require('supertest');
const { todo } = require('../src/todo.js');

const config = {
  dir: 'test/testDatabase/',
  path: 'public',
  userDetails: 'userDetails.json',
  homeTemplate: '/resources/homeTemplate.html'
};
const app = todo(config);

describe('serveSignUpPage', () => {
  it('Should serve signup.html with status 200', done => {
    request(app)
      .get('/')
      .expect('Content-type', /html/)
      .expect(200)
      .end(done)
  });
});

describe('serveLoginPage', () => {
  it('Should serve login.html with status 200', done => {
    request(app)
      .get('/login.html')
      .expect('Content-type', /html/)
      .expect(200)
      .end(done)
  });
});

describe('registerUser', () => {
  it('Should reedirect to login.html for a correct user', done => {
    request(app)
      .post('/register-user')
      .set('Content-Type', 'application/json')
      .send('{ "username": "Sourav", "password": "1234" }')
      .expect(302)
      .end(done)
  });
});

describe('validateUser', () => {
  it('Should reedirect to home-page for a successfull login', done => {
    request(app)
      .post('/logged-user')
      .set('Content-Type', 'application/json')
      .send('{ "username": "Sourav", "password": "1234" }')
      .expect(302)
      .end(done)
  });
});

