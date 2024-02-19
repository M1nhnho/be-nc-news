const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data');
const endpointsData = require('../endpoints.json');

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
                    const parsedEndpointsResponse = JSON.parse(endpoints);
                    expect(parsedEndpointsResponse).toEqual(endpointsData);
                });
        });
    });
});

describe('/api/topics', () =>
{
    describe('GET', () =>
    {
        test("STATUS 200 - Responds with an array of topic objects each with the properties: 'slug' and 'description'.", () =>
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

describe('/api/articles', () =>
{
    describe('/:article_id', () =>
    {
        describe('GET', () =>
        {
            test("STATUS 200 - Responds with an article object of the requested ID.", () =>
            {
                return request(app)
                    .get('/api/articles/1')
                    .expect(200)
                    .then(({ body: { article } }) =>
                    {
                        expect(article).toMatchObject(
                        {
                            title: "Living in the shadow of a great man",
                            topic: "mitch",
                            author: "butter_bridge",
                            body: "I find this existence challenging",
                            created_at: "2020-07-09T20:11:00.000Z",
                            votes: 100,
                            article_img_url:
                            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                        });
                    });
            });
            test("STATUS 404 - Responds with 'Not Found' when requested with a valid ID but it doesn't exist.", () =>
            {
                return request(app)
                    .get('/api/articles/999999')
                    .expect(404)
                    .then(({ body: { msg } }) =>
                    {
                        expect(msg).toBe('Not Found');
                    });
            });
            test("STATUS 400 - Responds with 'Bad Request' when requested with an invalid ID.", () =>
            {
                return request(app)
                    .get('/api/articles/not_a_number')
                    .expect(400)
                    .then(({ body: { msg } }) =>
                    {
                        expect(msg).toBe('Bad Request');
                    });
            });
        });
    });
});