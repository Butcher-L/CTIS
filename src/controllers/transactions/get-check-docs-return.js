const getCheckDocsreturnControllers = ({ getCheckDocsreturnUseCase }) => {
    return async function put(httpRequest) {
        try {
            const { source = {}, ...info } = httpRequest.body;
            source.ip = httpRequest.ip;
            source.browser = httpRequest.headers["User-Agent"];

            if (httpRequest.headers["Referrer"]) {
                source.referrer = httpRequest.headers["Referrer"];
            };
            const SessionId = httpRequest.headers["SessionId"];
            const toView = {
                ...info,
                source,
                id: httpRequest.params.id,
                company: httpRequest.query.company// when id is passed
            };
            const fetched = await getCheckDocsreturnUseCase(toView, SessionId);

            return {
                headers: {
                    "Content-Type": "application/json",
                    "Last-Modified": new Date(fetched.modifiedOn).toUTCString()
                },
                statusCode: 200,
                body: { fetched }
            };

        } catch (err) {
            console.log(err);

            return {
                headers: {
                    "Content-Type": "application/json"
                },
                statusCode: 400,
                body: {
                    error: err.message
                }
            };
        };
    }
}

module.exports = getCheckDocsreturnControllers;