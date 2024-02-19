const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('/api', () =>
{
    describe('GET', () =>
    {
        test("STATUS 200 - Responds with a JSON object describing all the available endpoints.", () =>
        {
            return request(app)
                .get('/api')
                .expect(200)
                .then(({ body: { endpoints } }) =>
                {
                    parsedEndpoints = JSON.parse(endpoints);

                    // 'GET /api' only has the 'description' property.
                    expect(parsedEndpoints['GET /api'].description).toBe('Serves up a JSON representation of all the available endpoints of the API.');

                    // Otherwise, rest should have all 4 properties: 'description', 'queries', 'requestFormat', and 'exampleResponse'.
                    const remainingEndpoints = Object.values(parsedEndpoints).slice(1, Object.values(parsedEndpoints).length);
                    remainingEndpoints.forEach(({ description, queries, requestFormat, exampleResponse }) =>
                    {
                        expect(typeof description).toBe('string');
                        expect(Array.isArray(queries)).toBe(true);
                        expect(typeof requestFormat).toBe('object');
                        expect(typeof exampleResponse).toBe('object');
                    });
                });
        });
    });
});

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