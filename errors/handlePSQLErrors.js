function handlePSQLErrors(error, request, response, next)
{
    // 22P02: INVALID TEXT REPRESENTATION
    if (error.code === '22P02')
    {
        response.status(400).send({msg: 'Bad Request'});
    }
    else
    {
        next(error);
    }
};

module.exports = handlePSQLErrors;