import * as request from 'supertest';
import { getPublicPath } from '../src/shared/helpers/file';
const host = 'http://localhost:4000/api/rest';

describe('Files', () => {
    let token = '';
    const user = {
        email: 'Cade.Johns71@hotmail.com',
        password: 'password',
    };
    const file = {
        id: null,
    };
    const tmpPath = getPublicPath(`uploads/tmp/test.jpg`);

    it(`Login to obtain token. (POST)`, async (done) => {
        return await request('')
            .post(`${host}/users/login`)
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
                done();
            });
    });

    it(`Get all files. (GET)`, async (done) => {
        return await request('')
            .get(`${host}/files`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
                done();
            });
    });

    it(`Upload a new file. (POST)`, async (done) => {
        return await request('')
            .post(`${host}/files/upload`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .attach('filepond', tmpPath)
            .then(res => {
                expect(res.status).toBe(201);
                expect(res.body).toBeDefined();
                expect(res.body[0].success).toBe(true);
                expect(res.body[0].name).toBe('test.jpg');
                expect(res.body[0].type).toBe('image/jpeg');
                expect(res.body[0].size).toBe(429286);
                expect(res.body[0].original_author.email).toBe('Cade.Johns71@hotmail.com');
                expect(res.body[0].version).toBe(1);
                expect(res.body[0].history).toBeDefined();
                file.id = res.body[0].id;
                done();
            });
    });

    it(`Check the file in. (PUT)`, async (done) => {
        return await request('')
            .put(`${host}/files/${file.id}/check-in-or-out`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                status: 'CHECK_IN',
            })
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
                expect(res.body.success).toBe(true);
                expect(res.body.message).toBe('Successfully changed the status of the file to CHECK_IN');
                done();
            });
    });

    it(`Add new version of the file. (POST)`, async (done) => {
        return await request('')
            .post(`${host}/files/${file.id}/upload`)
            .set('Authorization', `Bearer ${token}`)
            .attach('filepond', getPublicPath(`uploads/tmp2/test.jpg`))
            .then(res => {
                expect(res.status).toBe(201);
                expect(res.body).toBeDefined();
                expect(res.body.success).toBe(true);
                expect(res.body.message).toBe('Successfully updated the file.');
                expect(res.body.file.name).toBe('test.jpg');
                expect(res.body.file.type).toBe('image/jpeg');
                expect(res.body.file.size).toBe(429286);
                expect(res.body.file.version).toBe(2);
                done();
            });
    });

    it(`Check the file out. (PUT)`, async (done) => {
        return await request('')
            .put(`${host}/files/${file.id}/check-in-or-out`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                status: 'CHECK_OUT',
            })
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
                expect(res.body.success).toBe(true);
                expect(res.body.message).toBe('Successfully changed the status of the file to CHECK_OUT');
                done();
            });
    });

    it(`Restore a older version. (PUT)`, async (done) => {
        return await request('')
            .put(`${host}/files/${file.id}/version`)
            .send({
                version: 1,
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
                done();
            });
    });

    it(`Archive the file. (PUT)`, async (done) => {
        return await request('')
            .put(`${host}/files/${file.id}/archive`)
            .send({
                status: 'archived',
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .then(res => {
                expect(res.status).toBe(200);
                expect(res.body).toBeDefined();
                expect(res.body.success).toBe(true);
                expect(res.body.message).toBe('Successfully set the status of the file to archived.');
                done();
            });
    });

});
