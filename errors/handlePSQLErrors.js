function handlePSQLErrors(error, request, response, next)
{
    // 22P02: INVALID TEXT REPRESENTATION
    // 23502: NOT NULL VIOLATION
    // 23503: FOREIGN KEY VIOLATION
    if (error.code === '22P02' || error.code === '23502')
    {
        response.status(400).send({msg: 'Bad Request'});
    }
    else if (error.code === '23503')
    {
        response.status(404).send({msg: 'Not Found'});
    }
    else
    {
        next(error);
    }
};

module.exports = handlePSQLErrors;