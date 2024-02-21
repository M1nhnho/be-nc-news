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


    describe('/topics', () =>
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
                            expect(slug).toBeString();
                            expect(description).toBeString();
                        });
                    });
            });
        });
    });


    describe('/articles', () =>
    {
        describe('GET', () =>
        {
            test('STATUS 200 - Responds with an array of all article objects sorted by most recent by default.', () =>
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

            describe('?topic=:topic', () =>
            {
                test('STATUS 200 - Responds with an array of all article objects of the queried topic sorted by most recent by default.', () =>
                {
                    return request(app)
                        .get('/api/articles?topic=mitch')
                        .expect(200)
                        .then(({ body: { articles } }) =>
                        {
                            expect(articles).toHaveLength(12);
                            articles.forEach(({ author, title, article_id, topic, created_at, votes, article_img_url, comment_count }) =>
                            {
                                expect(author).toBeString();
                                expect(title).toBeString();
                                expect(article_id).toBeNumber();
                                expect(topic).toBe('mitch');
                                expect(created_at).toBeString();
                                expect(votes).toBeNumber();
                                expect(article_img_url).toBeString();
                                expect(comment_count).toBeNumber();
                            });
                            expect(articles).toBeSortedBy('created_at', {descending: true});
                        });
                });
                test('STATUS 200 - Responds with an empty array when there are no article objects of the queried topic.', () =>
                {
                    return request(app)
                        .get('/api/articles?topic=paper')
                        .expect(200)
                        .then(({ body: { articles } }) =>
                        {
                            expect(articles).toHaveLength(0);
                        });
                });
                test("STATUS 404 - Responds with 'Not Found' when queried with an valid but non-existent topic.", () =>
                {
                    return request(app)
                        .get('/api/articles?topic=not_an_existing_topic')
                        .expect(404)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Not Found');
                        });
                });
            });
            describe('?sort_by=:sort_by', () =>
            {
                test('STATUS 200 - Responds with an array of all article objects sorted by the queried sort_by in descending order by default.', () =>
                {
                    return request(app)
                        .get('/api/articles?sort_by=title')
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
                            expect(articles).toBeSortedBy('title', {descending: true});
                        });
                });
                test("STATUS 400 - Responds with 'Bad Request' when queried with an invalid sort_by (column does not exist).", () =>
                {
                    return request(app)
                        .get('/api/articles?sort_by=not_an_existing_column')
                        .expect(400)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Bad Request');
                        });
                });
            });
            describe('?order=:order', () =>
            {
                test('STATUS 200 - Responds with an array of all article objects sorted by date by default in the queried order.', () =>
                {
                    return request(app)
                        .get('/api/articles?order=asc')
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
                            expect(articles).toBeSortedBy('created_at', {descending: false});
                        });
                });
                test("STATUS 400 - Responds with 'Bad Request' when queried with an invalid order (must be 'asc' or 'desc').", () =>
                {
                    return request(app)
                        .get('/api/articles?order=neither_asc_nor_desc')
                        .expect(400)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Bad Request');
                        });
                });
            });
        });

        describe('/:article_id', () =>
        {
            describe('GET', () =>
            {
                test("STATUS 200 - Responds with the article object of the requested ID.", () =>
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
                                    "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                                    comment_count: 11
                                }
                            );
                        });
                });
                test("STATUS 404 - Responds with 'Not Found' when requested with a valid but non-existent ID.", () =>
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

            describe('PATCH', () =>
            {
                test("STATUS 200 - Responds with the updated article object of the requested ID with the INcremented 'votes'.", () =>
                {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({ inc_votes: 1 })
                        .expect(200)
                        .then(({ body: { article } }) =>
                        {
                            expect(article).toMatchObject(
                                {
                                    votes: 101, // <-- Main focus here
                                    article_id: 1,
                                    title: "Living in the shadow of a great man",
                                    topic: "mitch",
                                    author: "butter_bridge",
                                    body: "I find this existence challenging",
                                    created_at: "2020-07-09T20:11:00.000Z",
                                    article_img_url:
                                    "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                                }
                            );
                        });
                });
                test("STATUS 200 - Responds with the updated article object of the requested ID with the DEcremented 'votes'.", () =>
                {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({ inc_votes: -100 })
                        .expect(200)
                        .then(({ body: { article } }) =>
                        {
                            expect(article).toMatchObject(
                                {
                                    votes: 0, // <-- Main focus here
                                    article_id: 1,
                                    title: "Living in the shadow of a great man",
                                    topic: "mitch",
                                    author: "butter_bridge",
                                    body: "I find this existence challenging",
                                    created_at: "2020-07-09T20:11:00.000Z",
                                    article_img_url:
                                    "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                                }
                            );
                        });
                });
                test("STATUS 404 - Responds with 'Not Found' when requested with a valid but non-existent ID.", () =>
                {
                    return request(app)
                        .patch('/api/articles/999999')
                        .send({ inc_votes: 1 })
                        .expect(404)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Not Found');
                        });
                });
                test("STATUS 400 - Responds with 'Bad Request' when requested with an invalid ID.", () =>
                {
                    return request(app)
                        .patch('/api/articles/not_a_number')
                        .send({ inc_votes: 1 })
                        .expect(400)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Bad Request');
                        });
                });
                test("STATUS 400 - Responds with 'Bad Request' when the object sent is missing required property.", () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({})
                        .expect(400)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Bad Request');
                        });
                });
                test("STATUS 400 - Responds with 'Bad Request' when the object sent has an invalid property value.", () => {
                    return request(app)
                        .patch('/api/articles/1')
                        .send({ inc_votes: 'not_a_number' })
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
                    test("STATUS 200 - Responds with an array of all comment objects (sorted by most recent by default) from the article object of the requested ID.", () =>
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
                    test("STATUS 200 - Responds with an empty array when the article object of the requested ID has no comments.", () =>
                    {
                        return request(app)
                            .get('/api/articles/11/comments')
                            .expect(200) // Either 200 or 204 works but opted for 200 in that something does get returned, it's just empty
                            .then(({ body: { comments } }) =>
                            {
                                expect(comments).toHaveLength(0);
                            });
                    });
                    test("STATUS 404 - Responds with 'Not Found' when requested with a valid but non-existent article ID.", () =>
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
                    test("STATUS 201 - Responds with the new comment object.", () =>
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
                    test("STATUS 404 - Responds with 'Not Found' when requested with a valid but non-existent article ID.", () =>
                    {
                        return request(app)
                            .post('/api/articles/999999/comments')
                            .send({ username: 'butter_bridge', body: 'This is a test comment.' })
                            .expect(404)
                            .then(({ body: { msg } }) =>
                            {
                                expect(msg).toBe('Not Found');
                            });
                    });
                    test("STATUS 400 - Responds with 'Bad Request' when requested with an invalid article ID.", () =>
                    {
                        return request(app)
                            .post('/api/articles/not_a_number/comments')
                            .send({ username: 'butter_bridge', body: 'This is a test comment.' })
                            .expect(400)
                            .then(({ body: { msg } }) =>
                            {
                                expect(msg).toBe('Bad Request');
                            });
                    });
                    test("STATUS 404 - Responds with 'Not Found' when the object sent has a non-existent username.", () =>
                    {
                        return request(app)
                            .post('/api/articles/1/comments')
                            .send({ username: 'not_an_existing_user', body: 'This is a test comment.' })
                            .expect(404)
                            .then(({ body: { msg } }) =>
                            {
                                expect(msg).toBe('Not Found');
                            });
                    });
                    test("STATUS 400 - Responds with 'Bad Request' when the object sent is missing required properties.", () =>
                    {
                        return request(app)
                            .post('/api/articles/1/comments')
                            .send({ body: 'This is a test comment.' })
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


    describe('/comments', () =>
    {
        describe('/:comment_id', () =>
        {
            describe('PATCH', () =>
            {
                test("STATUS 200 - Responds with the updated comment object of the requested ID with the INcremented 'votes'.", () =>
                {
                    return request(app)
                        .patch('/api/comments/1')
                        .send({ inc_votes: 1 })
                        .expect(200)
                        .then(({ body: { comment } }) =>
                        {
                            expect(comment).toMatchObject(
                                {
                                    votes: 17, // <-- Main focus here
                                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                                    author: "butter_bridge",
                                    article_id: 9,
                                    created_at: "2020-04-06T12:17:00.000Z"
                                }
                            );
                        });
                });
                test("STATUS 200 - Responds with the updated comment object of the requested ID with the DEcremented 'votes'.", () =>
                {
                    return request(app)
                        .patch('/api/comments/1')
                        .send({ inc_votes: -1 })
                        .expect(200)
                        .then(({ body: { comment } }) =>
                        {
                            expect(comment).toMatchObject(
                                {
                                    votes: 15, // <-- Main focus here
                                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                                    author: "butter_bridge",
                                    article_id: 9,
                                    created_at: "2020-04-06T12:17:00.000Z"
                                }
                            );
                        });
                });
                test("STATUS 404 - Responds with 'Not Found' when requested with a valid but non-existent ID.", () =>
                {
                    return request(app)
                        .patch('/api/comments/999999')
                        .send({ inc_votes: 1 })
                        .expect(404)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Not Found');
                        });
                });
                test("STATUS 400 - Responds with 'Bad Request' when requested with an invalid ID.", () =>
                {
                    return request(app)
                        .patch('/api/comments/not_a_number')
                        .send({ inc_votes: 1 })
                        .expect(400)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Bad Request');
                        });
                });
                test("STATUS 400 - Responds with 'Bad Request' when the object sent is missing required property.", () => {
                    return request(app)
                        .patch('/api/comments/1')
                        .send({})
                        .expect(400)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Bad Request');
                        });
                });
                test("STATUS 400 - Responds with 'Bad Request' when the object sent has an invalid property value.", () => {
                    return request(app)
                        .patch('/api/comments/1')
                        .send({ inc_votes: 'not_a_number' })
                        .expect(400)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Bad Request');
                        });
                });
            });

            describe('DELETE', () =>
            {
                test('STATUS 204 - Responds with only the status code and no content.', () =>
                {
                    return request(app)
                        .delete('/api/comments/1')
                        .expect(204);
                });
                test("STATUS 404 - Responds with 'Not Found' when requested with a valid but non-existent ID.", () =>
                {
                    return request(app)
                        .delete('/api/comments/999999')
                        .expect(404)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Not Found');
                        });
                });
                test("STATUS 400 - Responds with 'Bad Request' when requested with an invalid ID.", () =>
                {
                    return request(app)
                        .delete('/api/comments/not_a_number')
                        .expect(400)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Bad Request');
                        });
                });
            });
        });
    });


    describe('/users', () =>
    {
        describe('GET', () =>
        {
            test("STATUS 200 - Responds with an array of all user objects.", () =>
            {
                return request(app)
                    .get('/api/users')
                    .expect(200)
                    .then(({ body: { users } }) =>
                    {
                        expect(users).toHaveLength(4);
                        users.forEach(({ username, name, avatar_url }) =>
                        {
                            expect(username).toBeString();
                            expect(name).toBeString();
                            expect(avatar_url).toBeString();
                        });
                    });
            });
        });

        describe('/:username', () =>
        {
            describe('GET', () =>
            {
                test("STATUS 200 - Responds with the user object of the requested username.", () =>
                {
                    return request(app)
                        .get('/api/users/butter_bridge')
                        .expect(200)
                        .then(({ body: { user } }) =>
                        {
                            expect(user).toMatchObject(
                                {
                                    username: 'butter_bridge',
                                    name: 'jonny',
                                    avatar_url:
                                    'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                                }
                            );
                        });
                });
                test("STATUS 404 - Responds with 'Not Found' when requested with a valid but non-existent username.", () =>
                {
                    return request(app)
                        .get('/api/users/not_an_existing_user')
                        .expect(404)
                        .then(({ body: { msg } }) =>
                        {
                            expect(msg).toBe('Not Found');
                        });
                });
            });
        });
    });
});



describe('/*', () =>
{
    describe('GET', () =>
    {
        test("STATUS 404 - Responds with 'Endpoint Not Found' when requesting to a non-existent endpoint.", () =>
        {
            return request(app)
                .get('/not_an_existing_endpoint')
                .expect(404)
                .then(({ body: { msg } }) =>
                {
                    expect(msg).toBe('Endpoint Not Found');
                });
        });
    });
});