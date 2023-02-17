const getTransferTransactionController = ({ getTransferredTransactionUseCase }) => {
    return async function get(httpRequest){
        try{
            const {source = {}, ...info} = httpRequest.body;
            source.ip = httpRequest.ip;
            source.browser = httpRequest.headers["User-Agent"];


            if(httpRequest.headers["Referrer"]){
                source.referrer = httpRequest.headers["Referrer"];
            };
            
            const id = httpRequest.params.id
            const SessionId = httpRequest.headers["SessionId"];
            const data=httpRequest.query

            const fetched = await getTransferredTransactionUseCase(id,SessionId,data);

            return {
                headers: {
                  "Content-Type": "application/json",
                  "Last-Modified": new Date(fetched.modifiedOn).toUTCString()
                },
                statusCode: 200,
                body: { fetched }
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

module.exports = getTransferTransactionController;