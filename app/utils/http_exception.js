const errors = [
    { name: 'BadRequest', statusCode: 400, message: 'Bad Request' },
    { name: 'NotAuthorized', statusCode: 401, message: 'Not Authorized' },
    { name: 'Forbidden', statusCode: 403, message: 'Forbidden' },
    { name: 'NotFound', statusCode: 404, message: 'Not Found' },
    { name: 'UnprocessableEntity', statusCode: 422, message: 'Unprocessable Entity' },
    { name: 'InternalServerError', statusCode: 500, message: 'Internal Server Error' }
];

errors.forEach((e) => {
    exports[e.name] = (detail) => {
        const err = new Error(e.message);
        err.status = e.statusCode;
        if (detail) err.detail = detail;
        return err;
    };
});

module.exports = exports;
