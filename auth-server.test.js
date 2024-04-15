const request = require('supertest');

let server;
describe('Session management tests', () => {
  beforeEach(() => {
    server = require('./auth-server.js');
  })

  afterEach(async() => {
    server.close();
  });
  it('POST /login must return a user if the user is valid, has a session, and a token', async () => {
    // Request CSRF token
    const respToken = await request(server)
      .get('/csrf-token');
  
    // Extract CSRF token from response body
    const token = respToken.body.csrfToken;
  
    // Extract connect.sid cookie value from response headers
    let connectSidValue = null;
    respToken.headers['set-cookie'].forEach(cookie => {
      if (cookie.includes('connect.sid')) {
        connectSidValue = cookie.split('=')[1].split(';')[0];
      }
    });
  
    // Create a fake user object
    const fakeUser = { username: 'user1', password: 'password1' };
  
    // Send login request with fake user credentials, CSRF token, and session cookie
    const respLogin = await request(server)
      .post('/login')
      .send(fakeUser)
      .set('x-csrf-token', token)
      .set('Cookie', [`connect.sid=${connectSidValue}`]);
  
    // Assert that the login request was successful
    expect(respLogin.status).toBe(200);
  
    // Assert that the response body contains the expected user object
    expect(respLogin.body.user.username).toBe(fakeUser.username);
    expect(respLogin.body.user.password).toBe(fakeUser.password);
  });
  

  it('POST /login must return 401 status if the user gives invalid password, has a session, and a token', async () => {
    const respToken = await request(server)
      .get('/csrf-token');

    const token = respToken.body.csrfToken;
    let connectSidValue = null;
    respToken.headers['set-cookie'].forEach(cookie => {
    if (cookie.includes('connect.sid')) {
      connectSidValue = cookie.split('=')[1].split(';')[0];
    }
    });

    const fakeUser = { username: 'user1', password: 'password2' };
    const respLogin = await request(server)
      .post('/login')
      .send(fakeUser)
      .set('x-csrf-token', token)
      .set('Cookie', [`connect.sid=${connectSidValue}`]);
      expect(respLogin.status).toBe(401);
  });

  it('POST /login must return 403 forbidden if the user is valid but has no token', async () => {
    const respToken = await request(server)
      .get('/csrf-token');

    const token = respToken.body.csrfToken;
    let connectSidValue = null;
    respToken.headers['set-cookie'].forEach(cookie => {
    if (cookie.includes('connect.sid')) {
      connectSidValue = cookie.split('=')[1].split(';')[0];
    }
    });

    const fakeUser = { username: 'user1', password: 'password1' };
    const respLogin = await request(server)
      .post('/login')
      .send(fakeUser)
      .set('Cookie', [`connect.sid=${connectSidValue}`]);
      expect(respLogin.status).toBe(403);
  });

  it('POST /login must return 403 forbidden if the user is valid but has no session', async () => {
    const respToken = await request(server)
      .get('/csrf-token');

    const token = respToken.body.csrfToken;
    let connectSidValue = null;
    respToken.headers['set-cookie'].forEach(cookie => {
    if (cookie.includes('connect.sid')) {
      connectSidValue = cookie.split('=')[1].split(';')[0];
    }
    });

    const fakeUser = { username: 'user1', password: 'password1' };
    const respLogin = await request(server)
      .post('/login')
      .send(fakeUser)
      .set('x-csrf-token', token)
      expect(respLogin.status).toBe(403);
  });
});
