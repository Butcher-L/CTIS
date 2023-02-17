
const selectAllOrganization = ({ cma }) => {
    return async function get(){ 
        const user = await cma.selectAllOrganization()
    
        return user
    };
};

module.exports = selectAllOrganization;