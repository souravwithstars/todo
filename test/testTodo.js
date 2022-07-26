const fs = require('fs');
const request = require('supertest');
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

describe('serveLoginPage', () => {
  it('Should serve login page with status 200', done => {
    request(app)
      .get('/')
      .expect('Content-type', /html/)
      .expect(200)
      .end(done)
  });
});

describe('serveSignUpPage', () => {
  it('Should serve signup page with status 200', done => {
    request(app)
      .get('/signup')
      .expect('Content-type', /html/)
      .expect(200)
      .end(done)
  });
});

describe('registerUser', () => {
  before(() => {
    const userDetails = [];
    fs.writeFileSync('test/database/userDetails.json', JSON.stringify(userDetails), 'utf-8');
  })

  after(() => {
    const userDetails = [];
    fs.writeFileSync('test/database/userDetails.json', JSON.stringify(userDetails), 'utf-8');
  })

  it('Should redirect to home-page for a new user', done => {
    request(app)
      .post('/register-user')
      .send('username=Sourav&password=1234')
      .expect('location', '/home-page')
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

describe('logoutHandler', () => {
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
  it('Should logout and remove the session', done => {
    request(app)
      .get('/logout')
      .set('cookie', sessionCookie.join('; '))
      .expect('location', '/')
      .expect(302)
      .end(done)
  });
});

describe('homePageRouter', () => {
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
  it('Should serve home-page if already logged-in', done => {
    request(app)
      .get('/home-page')
      .set('cookie', sessionCookie.join('; '))
      .expect('Content-type', /html/)
      .expect(200)
      .end(done)
  });

  it('Should redirect to login page if not logged-in', done => {
    request(app)
      .get('/home-page')
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
    const date = createDate();
    request(app)
      .post('/add-list')
      .set('cookie', sessionCookie.join('; '))
      .send('title=review')
      .expect(`{"title":"review","id":1,"items":[],"nextItemId":1,"date":"${date}","deleted":false}`)
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
    const writeData = {
      username: "Sourav",
      password: 1234,
      nextId: 1,
      todos: []
    };
    fs.writeFileSync('test/database/sourav.json', JSON.stringify(writeData), 'utf-8');
  })
  before(done => {
    request(app)
      .post('/add-list')
      .set('cookie', sessionCookie.join('; '))
      .send('title=review')
      .end(done)
  })
  after(() => {
    fs.rmSync('test/database/sourav.json')
  })

  it('Should serve view-page if already logged-in', done => {
    request(app)
      .get('/list/1/view')
      .set('cookie', sessionCookie.join('; '))
      .expect('Content-type', /html/)
      .expect(200)
      .end(done)
  });

  it('Should redirect to login page if not logged-in', done => {
    request(app)
      .get('/list/1/view')
      .expect('location', '/')
      .expect(302)
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
    const writeData = {
      username: "Sourav",
      password: 1234,
      nextId: 1,
      todos: []
    };
    fs.writeFileSync('test/database/sourav.json', JSON.stringify(writeData), 'utf-8');
  })
  before(done => {
    request(app)
      .post('/add-list')
      .set('cookie', sessionCookie.join('; '))
      .send('title=review')
      .end(done)
  })
  after(() => {
    fs.rmSync('test/database/sourav.json')
  })

  it('Should response with the selected list deleted true', done => {
    const date = createDate();
    request(app)
      .post('/list/1/delete')
      .set('cookie', sessionCookie.join('; '))
      .expect(`{"title":"review","id":1,"items":[],"nextItemId":1,"date":"${date}","deleted":true}`)
      .expect(200)
      .end(done)
  });
});

describe('notFoundHandler', () => {
  it('Should serve not found page with status 404', done => {
    request(app)
      .get('/not-found')
      .expect('COntent-type', 'text/plain')
      .expect(404)
      .end(done)
  });
});
