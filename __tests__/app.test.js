const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('/api/topics', () =>
{
    describe('GET', () =>
    {
        test("STATUS 200 - Responds with an array of topic objects with the properties: 'slug' and 'description'.", () =>
        {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({ body: { topics } }) =>
                {
                    expect(topics).toHaveLength(3);
                    topics.forEach(({ slug, description }) =>
                    {
                        expect(typeof slug).toBe('string');
                        expect(typeof description).toBe('string');
                    });
                });
        });
    });
});