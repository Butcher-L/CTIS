

const getAutoReleasedControllers = ({ getAutoReleasewithCompanyUseCase }) => {
  return async function get(httpRequest) {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      //get the httprequest body
      const { source = {}, ...info } = httpRequest.body;
      source.ip = httpRequest.ip;
      source.browser = httpRequest.headers["User-Agent"];
      if (httpRequest.headers["Referer"]) {
        source.referrer = httpRequest.headers["Referer"];
      }
      const toView = {
        ...info,
        source,
        id: httpRequest.params.id,
        company: httpRequest.query.company// when id is passed
      };
      const SessionId = httpRequest.headers["SessionId"];
      const fetched = await getAutoReleasewithCompanyUseCase(toView, SessionId);
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
        body: { fetched },
      };
    } catch (e) {
      // TODO: Error logging
      console.log(e);
      return {
        headers,
        statusCode: 400,
        body: {
          error: e.message,
        },
      };
    }
  };
}

module.exports = getAutoReleasedControllers