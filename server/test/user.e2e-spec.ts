import * as request from 'supertest';
describe('Users', () => {
  let token = '';
  const user = {
    id: null,
    email: 'test@test.com',
    password: 'test',
  };

  it(`Register. (POST)`, async (done) => {
    return await request('')
      .post('http://localhost:4000/api/rest/users/register')
      .set('Accept', 'application/json')
      .send({
        email: user.email,
        password: user.password,
      })
      .then(res => {
        expect(res.status).toBe(201);
        expect(res.body.id).toBeDefined();
        expect(res.body.email).toBeDefined();
        expect(res.body.token).toBeDefined();
        token = res.body.token;
        user.id = res.body.id;
        done();
      });
  });

  it(`Get all users. (GET)`, async (done) => {
    return await request('')
      .get('http://localhost:4000/api/rest/users')
      .set('Accept', 'application/json')
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        done();
      });
  });

  it(`Login. (POST)`, async (done) => {
    return await request('')
      .post('http://localhost:4000/api/rest/users/login')
      .set('Accept', 'application/json')
      .send({
        email: user.email,
        password: user.password,
      })
      .then(res => {
        expect(res.status).toBe(201);
        expect(res.body.id).toBeDefined();
        expect(res.body.email).toBeDefined();
        expect(res.body.token).toBeDefined();
        token = res.body.token;
        user.id = res.body.id;
        done();
      });
  });

  it(`Get current logged in user. (GET)`, async (done) => {
    return await request('')
      .get('http://localhost:4000/api/rest/users/me')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        done();
      });
  });

  it(`Get user by id. (GET)`, async (done) => {
    return await request('')
      .get(`http://localhost:4000/api/rest/users/${user.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        done();
      });
  });

  it(`Update a user by id. (PUT)`, async (done) => {
    return await request('')
      .put(`http://localhost:4000/api/rest/users/${user.id}`)
      .send({
        name: 'Test User',
        company: 'Test Company',
      })
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Successfully updated user.');
        done();
      });
  });

  it(`Partially update a user by id. (PATCH)`, async (done) => {
    return await request('')
      .patch(`http://localhost:4000/api/rest/users/${user.id}`)
      .send({
        name: 'Test User',
      })
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Successfully updated user (PATCH).');
        expect(res.body.user.name).toBe('Test User');
        done();
      });
  });

  it(`Delete a user. (DELETE)`, async (done) => {
    return await request('')
      .delete(`http://localhost:4000/api/rest/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        expect(res.status).toBe(200);
        done();
      });
  });

});
