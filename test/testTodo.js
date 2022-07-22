const fs = require('fs');
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
      .send('username=Sourav&password=1234')
      .expect(302)
      .end(done)
  });
});

describe('validateUser', () => {
  it('Should redirect to home-page for a successfull login', done => {
    request(app)
      .post('/logged-user')
      .send('username=Sourav&password=1234')
      .expect('location', '/home-page')
      .expect(302)
      .end(done)
  });
});

describe('homePageRouter', () => {
  it('Should response with home-page html with status 200', done => {
    request(app)
      .get('/home-page')
      .expect('Content-type', /plain/)
      .expect(302)
      .end(done)
  });
});

describe('viewPageRouter', () => {
  it('Should response with view-page html with status 200', done => {
    request(app)
      .get('/list/1/view')
      .set('Content-type', 'text/html')
      .expect('Content-type', /plain/)
      .expect(302)
      .end(done)
  });
});

describe('addListHandler', () => {
  let sessionCookie;
  before(done => {
    request(app)
      .post('/logged-user')
      .send('username=Sourav&password=1234')
      .expect(res => {
        sessionCookie = res.header['set-cookie'];
      })
      .end(done)
  })
  before(() => {
    const writeData = {
      username: "Sourav",
      password: 1234,
      nextId: 1,
      todos: []
    };
    fs.writeFileSync('test/database/sourav.json', JSON.stringify(writeData), 'utf-8');
  })
  after(() => {
    fs.rmSync('test/database/sourav.json')
  })
  it('Should response with a json of new list', done => {
    request(app)
      .post('/add-list')
      .set('cookie', sessionCookie.join('; '))
      .send('title=review')
      .expect('{"title":"review","id":1,"items":[],"nextItemId":1,"date":"22/07/2022","deleted":false}')
      .end(done)
  })
});

describe('viewPageRouter', () => {
  let sessionCookie;
  before(done => {
    request(app)
      .post('/logged-user')
      .send('username=Sourav&password=1234')
      .expect(res => {
        sessionCookie = res.header['set-cookie'];
      })
      .end(done)
  })
  before(() => {
    const writeData = { username: "Sourav", password: 1234, nextId: 2, todos: [{ title: "review", id: 1, items: [], nextItemId: 1, date: 22 / 07 / 2022, deleted: false }] };

    fs.writeFileSync('test/database/sourav.json', JSON.stringify(writeData), 'utf-8');
  })
  after(() => {
    fs.rmSync('test/database/sourav.json')
  })

  it('Should response with view-page html', done => {
    request(app)
      .get('/list/1/view')
      .set('cookie', sessionCookie.join('; '))
      .expect('Content-type', /html/)
      .expect(200)
      .end(done)
  });
});

describe('deleteListHandler', () => {
  let sessionCookie;
  before(done => {
    request(app)
      .post('/logged-user')
      .send('username=Sourav&password=1234')
      .expect(res => {
        sessionCookie = res.header['set-cookie'];
      })
      .end(done)
  })
  before(() => {
    const writeData = { username: "Sourav", password: 1234, nextId: 2, todos: [{ title: "review", id: 1, items: [], nextItemId: 1, date: "22/07/2022", deleted: false }] };

    fs.writeFileSync('test/database/sourav.json', JSON.stringify(writeData), 'utf-8');
  })
  after(() => {
    fs.rmSync('test/database/sourav.json')
  })

  it('Should response with the selected list deleted true', done => {
    request(app)
      .post('/list/1/delete')
      .set('cookie', sessionCookie.join('; '))
      .expect('{"title":"review","id":1,"items":[],"nextItemId":1,"date":"22/07/2022","deleted":true}')
      .expect(200)
      .end(done)
  });
});
