# Northcoders News API
As part of *Northcoder's Skills Bootcamp in Software Development*, we were tasked with building a RESTful news API backend which can provide information to my other frontend project. This API will allow clients to access articles, grouped under topics, along with comments and the users behind them - akin to Reddit or similar news services.

This backend project follows the MVC pattern and was built in Javascript using <a src='https://expressjs.com/'>Express</a> to enable easier server routing and error handling. <a src='https://www.postgresql.org/'>PostgreSQL</a> was used for the databases and <a src='https://jestjs.io/'>Jest</a> with <a src='https://www.npmjs.com/package/supertest'>SuperTest</a> for testing.

## Hosted version
The hosted version of my backend project can be found here:  
https://nc-news-452q.onrender.com/api

The online database is hosted via <a src='https://www.elephantsql.com/'>ElephantSQL</a> whereas the API is hosted via <a src='https://render.com/'>Render</a>.

## Local setup
If you wish to run this backend project locally, ensure you fulfill the requirements below before following the instructions.

### Minimum Requirements
- <a src='https://nodejs.org/en/download'>Node.js</a> (v20.11.0)
- <a src='https://www.postgresql.org/download/'>PostgreSQL</a> (v14.9)

### Instructions
1. Navigate to the directory you wish to download the repository to
2. Run the following commands inside the terminal:
    ```
    git clone https://github.com/M1nhnho/nc-news.git
    ```
3. Navigate into the newly created `nc-news` directory
4. Run the following command to install all the needed dependencies:
    ```
    npm install
    ```
5. You may need to start your PostgreSQL server if it hasn't already
6. Run the following command inside the terminal to create your local databases:
    ```
    npm run setup-dbs
    ```
7. Create the following 2 files inside the root directory:
    - `.env.test`
    - `.env.development`
8. Add the following single line to each file: `PGDATABASE=<database_name>`
9. Replace `<database_name>` with the appropriate name (these can be found in the `/db/setup.sql` file)
10. Run the following command inside the terminal to ensure everything has been set up correctly:
    ```
    npm t
    ```
11. If everything passes, you are free to play around as you wish 🎉