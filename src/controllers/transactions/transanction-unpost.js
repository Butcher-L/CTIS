const unpostTransactionController = ({ unpostTransactionUseCase }) => {
    return async function put(httpRequest){
        try{
            const {source = {}, ...info} = httpRequest.body;
            source.ip = httpRequest.ip;
            source.browser = httpRequest.headers["User-Agent"];

            if(httpRequest.headers["Referrer"]){
                source.referrer = httpRequest.headers["Referrer"];
            };
            
            const roleId = httpRequest.params.id
            const SessionId = httpRequest.headers["SessionId"];

            const put = await unpostTransactionUseCase(info,SessionId);

            return {
                headers: {
                  "Content-Type": "application/json",
                  "Last-Modified": new Date(put.modifiedOn).toUTCString()
                },
                statusCode: 200,
                body: { put }
              };

        } catch(err){
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

module.exports = unpostTransactionController;