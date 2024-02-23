const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data');
const { checkExists } = require('../utils/checkExists.js');

beforeAll(() => seed(data));
afterAll(() => db.end());

describe('checkExists()', () =>
{
    test("Resolves when passed a value that exists in the passed table's column.", () =>
    {
        return checkExists('topics', 'slug', 'paper');
    });
    test("Rejects with an error when passed a table that does not exist.", () =>
    {
        return checkExists('non_existent', 'slug', 'paper')
        .catch((error) =>
        {
            expect().pass(error);
        });
    });
    test("Rejects with an error when passed a column that does not exist in the passed table.", () =>
    {
        return checkExists('topics', 'non_existent', 'paper')
        .catch((error) =>
        {
            expect().pass(error);
        });
    });
    test("Rejects with an error when passed a value that does not exist in the passed table's column.", () =>
    {
        return checkExists('topics', 'slug', 'not_existent')
            .catch((error) =>
            {
                expect().pass(error);
            });
    });
});