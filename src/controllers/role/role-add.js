const makeRoleController = ({ makeRoleUseCase }) => {
    return async function post(httpRequest){
        try{
            const {source = {}, ...info} = httpRequest.body;
            source.ip = httpRequest.ip;
            source.browser = httpRequest.headers["User-Agent"];

            if(httpRequest.headers["Referrer"]){
                source.referrer = httpRequest.headers["Referrer"];
            };
            const SessionId = httpRequest.headers["SessionId"];
            
            const posted = await makeRoleUseCase(info.roleInfo, info.user_id,SessionId);


            return {
                headers: {
                  "Content-Type": "application/json",
                  "Last-Modified": new Date(posted.modifiedOn).toUTCString()
                },
                statusCode: 201,
                body: { posted }
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

module.exports = makeRoleController;