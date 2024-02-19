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
        test("STATUS 200 - Responds with an array of all topic objects.", () =>
        {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({ body: { topics } }) =>
                {
                    expect(topics).toHaveLength(3);
                    topics.forEach(({ slug, description }) =>
                    {
                        expect(typeof slug).toBeString();
                        expect(typeof description).toBeString();
                    });
                });
        });
    });
});

describe('/api/articles', () =>
{
    describe('GET', () =>
    {
        test('STATUS 200 - Responds with an array of all article objects.', () =>
        {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body: { articles } }) =>
                {
                    expect(articles).toHaveLength(13);
                    articles.forEach(({ author, title, article_id, topic, created_at, votes, article_img_url, comment_count }) =>
                    {
                        expect(author).toBeString();
                        expect(title).toBeString();
                        expect(article_id).toBeNumber();
                        expect(topic).toBeString();
                        expect(created_at).toBeString();
                        expect(votes).toBeNumber();
                        expect(article_img_url).toBeString();
                        expect(comment_count).toBeNumber();
                    });
                    expect(articles).toBeSortedBy('created_at', {descending: true});
                });
        });
    });

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
                                article_id: 1,
                                title: "Living in the shadow of a great man",
                                topic: "mitch",
                                author: "butter_bridge",
                                body: "I find this existence challenging",
                                created_at: "2020-07-09T20:11:00.000Z",
                                votes: 100,
                                article_img_url:
                                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                            }
                        );
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

        describe('/comments', () =>
        {
            describe('GET', () =>
            {
                test("STATUS 200 - Responds with an array of all comment objects from the article object of the requested ID.", () =>
                {
                    return request(app)
                        .get('/api/articles/1/comments')
                        .expect(200)
                        .then(({ body: { comments } }) =>
                        {
                            expect(comments).toHaveLength(11);
                            comments.forEach(({ comment_id, votes, created_at, author, body, article_id }) =>
                            {
                                expect(comment_id).toBeNumber();
                                expect(votes).toBeNumber();
                                expect(created_at).toBeString();
                                expect(author).toBeString();
                                expect(body).toBeString();
                                expect(article_id).toBe(1);
                            });
                            expect(comments).toBeSortedBy('created_at', {descending: true});
                        });
                });
                test("STATUS 404 - Responds with 'Not Found' when requested with a valid article ID but it doesn't exist.", () =>
                {
                    return request(app)
                        .get('/api/articles/999999/comments')
                        .expect(404)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Not Found');
                        });
                });
                test("STATUS 400 - Responds with 'Bad Request' when requested with an invalid article ID.", () =>
                {
                    return request(app)
                        .get('/api/articles/not_a_number/comments')
                        .expect(400)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Bad Request');
                        });
                });
            });

            describe('POST', () =>
            {
                test("STATUS 201 - Responds with the posted comment object.", () =>
                {
                    return request(app)
                        .post('/api/articles/1/comments')
                        .send({ username: 'butter_bridge', body: 'This is a test comment.' })
                        .expect(201)
                        .then(({ body: { comment } }) =>
                        {
                            expect(comment).toMatchObject(
                                {
                                    comment_id: 19,
                                    votes: 0,
                                    author: 'butter_bridge',
                                    body: 'This is a test comment.',
                                    article_id: 1
                                }
                            );
                            expect(comment.created_at).toBeString(); // Dynamic test - separated due to 'created_at' being the current time of posting
                        });
                });
                test("STATUS 400 - Responds with 'Bad Request' when posted object is missing required properties.", () => {
                    return request(app)
                        .post('/api/articles/1/comments')
                        .send({ body: 'This is a test comment.' })
                        .expect(400)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Bad Request');
                        });
                });
                test("STATUS 400 - Responds with 'Bad Request' when posted object has invalid property values.", () => {
                    return request(app)
                        .post('/api/articles/1/comments')
                        .send({ username: 'not_an_existing_user', body: 'This is a test comment.' })
                        .expect(400)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Bad Request');
                        });
                });
            });
        });
    });
});