function handleCustomErrors(error, request, response, next)
{
    if (error.status && error.msg)
    {
        response.status(error.status).send({msg: error.msg});
    }
    else
    {
        next(error);
    }
};

module.exports = handleCustomErrors;