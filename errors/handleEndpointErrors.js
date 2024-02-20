function handleEndpointErrors(request, response, next)
{
    response.status(404).send({msg: 'Endpoint Not Found'});
};

module.exports = handleEndpointErrors;