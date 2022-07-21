const request = require('supertest');
const { todo } = require('../src/todo.js');

const config = {
  dir: 'test/database/',
  path: 'public',
  userDetails: 'userDetails.json',
  homeTemplate: '/resources/homeTemplate.txt',
  viewTemplate: '/resources/viewTemplate.txt'
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
  it('Should redirect to login.html for a correct user', done => {
    request(app)
      .post('/register-user')
      .set('Content-Type', 'application/json')
      .send('{ "username": "Sourav", "password": "1234" }')
      .expect(302)
      .end(done)
  });
});

describe('validateUser', () => {
  it('Should redirect to home-page for a successfull login', done => {
    request(app)
      .post('/logged-user')
      .set('Content-type', 'application/json')
      .send('{ "username": "Sourav", "password": "1234" }')
      .expect(302)
      .end(done)
  });
});

describe('homePageRouter', () => {
  it('Should response with home-page html with status 200', done => {
    request(app)
      .get('/home-page')
      .set('Content-type', 'text/html')
      .expect('Content-type', /plain/)
      .expect(302)
      .end(done)
  });
});

describe('viewPageRouter', () => {
  it('Should response with view-page html with status 200', done => {
    request(app)
      .get('/view/1')
      .set('Content-type', 'text/html')
      .expect('Content-type', /plain/)
      .expect(302)
      .end(done)
  });
});
