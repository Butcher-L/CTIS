const voidCheckController = ({ voidCheckUseCase }) => {
    return async function post(httpRequest){
        try{
            const {source = {}, ...info} = httpRequest.body;
            source.ip = httpRequest.ip;
            source.browser = httpRequest.headers["User-Agent"];

            if(httpRequest.headers["Referrer"]){
                source.referrer = httpRequest.headers["Referrer"];
            };
            
            const SessionId = httpRequest.headers["SessionId"];
            const patched = await voidCheckUseCase(info,SessionId);

            return {
                headers: {
                  "Content-Type": "application/json",
                  "Last-Modified": new Date(patched.modifiedOn).toUTCString()
                },
                statusCode: 201,
                body: { patched }
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
    };
};

module.exports = voidCheckController;