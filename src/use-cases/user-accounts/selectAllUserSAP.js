
const selectAllUserSAP = ({ cma }) => {
    return async function get(info){ 
     
        const data = await cma.selectAllUser(info.Company)
 
       
        return data
    };
};

module.exports = selectAllUserSAP;