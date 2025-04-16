const fs = require('fs');
const request = require('supertest');
const assert = require('assert');
const { todo } = require('../src/todo.js');
const { createDate } = require('../src/handlers/addListHandler.js');

const config = {
  dir: 'test/database/',
  path: 'public',
  env: 'testing',
  userDetails: 'userDetails.json',
  signUpPage: 'templates/signup.txt',
  loginPage: 'templates/login.txt',
  homeTemplate: 'templates/homeTemplate.txt',
  viewTemplate: 'templates/viewTemplate.txt',
  searchTemplate: 'templates/searchTemplate.txt'
};
const app = todo(config);

const userDataPath = username => `test/database/${username.toLowerCase()}.json`;

const writeUserData = (username, data = {
  username,
  password: '1234',
  nextId: 1,
  todos: []
}) => {
  fs.writeFileSync(userDataPath(username), JSON.stringify(data), 'utf-8');
};

const removeUserData = username => {
  fs.rmSync(userDataPath(username));
};

describe('Authentication & Page Serving', () => {
  before(() => {
    fs.writeFileSync('test/database/userDetails.json', JSON.stringify([]), 'utf-8');
  });

  after(() => {
    fs.writeFileSync('test/database/userDetails.json', JSON.stringify([]), 'utf-8');
  });

  it('Should serve login page', done => {
    request(app).get('/')
        .expect('Content-Type', /html/)
        .expect(200, done);
  });

  it('Should serve signup page', done => {
    request(app).get('/signup')
        .expect('Content-Type', /html/)
        .expect(200, done);
  });

  it('Should register a new user and redirect to home page', done => {
    request(app)
        .post('/register-user')
        .send('username=Sourav&password=1234')
        .expect('Location', '/home-page')
        .expect(302, done);
  });

  it('Should login and redirect to home page', done => {
    request(app)
        .post('/logged-user')
        .send('username=Sourav&password=1234')
        .expect('Location', '/home-page')
        .expect(302, done);
  });
});

describe('Session and Home Page Access', () => {
  let sessionCookie;

  before(done => {
    writeUserData('Sourav');
    request(app)
        .post('/logged-user')
        .send('username=Sourav&password=1234')
        .expect(res => sessionCookie = res.header['set-cookie'])
        .end(done);
  });

  after(() => removeUserData('Sourav'));

  it('Should serve home page if logged in', done => {
    request(app)
        .get('/home-page')
        .set('Cookie', sessionCookie.join('; '))
        .expect('Content-Type', /html/)
        .expect(200, done);
  });

  it('Should redirect to login page if not logged in', done => {
    request(app)
        .get('/home-page')
        .expect('Location', '/')
        .expect(302, done);
  });

  it('Should logout and destroy session', done => {
    request(app)
        .get('/logout')
        .set('Cookie', sessionCookie.join('; '))
        .expect('Location', '/')
        .expect(302, done);
  });
});

describe('Todo List Features', () => {
  let sessionCookie;

  before(done => {
    writeUserData('Sourav');
    request(app)
        .post('/logged-user')
        .send('username=Sourav&password=1234')
        .expect(res => sessionCookie = res.header['set-cookie'])
        .end(done);
  });

  after(() => removeUserData('Sourav'));

  it('Should add a new list and return JSON', done => {
    const date = createDate();
    request(app)
        .post('/add-list')
        .set('Cookie', sessionCookie.join('; '))
        .send('title=review')
        .expect('Content-Type', /json/)
        .expect(res => {
          const data = JSON.parse(res.text);
          assert.deepStrictEqual(data, {
            title: 'review',
            id: 1,
            items: [],
            nextItemId: 1,
            date,
            deleted: false
          });
        })
        .expect(200, done);
  });

  it('Should view the added list page', done => {
    request(app)
        .get('/list/1/view')
        .set('Cookie', sessionCookie.join('; '))
        .expect('Content-Type', /html/)
        .expect(200, done);
  });

  it('Should delete the list and return updated JSON', done => {
    const date = createDate();
    request(app)
        .post('/list/1/delete')
        .set('Cookie', sessionCookie.join('; '))
        .expect('Content-Type', /json/)
        .expect(res => {
          const data = JSON.parse(res.text);
          assert.deepStrictEqual(data, {
            title: 'review',
            id: 1,
            items: [],
            nextItemId: 1,
            date,
            deleted: true
          });
        })
        .expect(200, done);
  });

  it('Should redirect to login if viewing without session', done => {
    request(app)
        .get('/list/1/view')
        .expect('Location', '/')
        .expect(302, done);
  });
});

describe('Not Found Handler', () => {
  it('Should serve 404 page', done => {
    request(app)
        .get('/not-found')
        .expect('Content-Type', /plain/)
        .expect(404, done);
  });
});
