
const makeUserAccountSAPEntity = ({}) => {
    return function makeUserAccount({
        empID, firstName, lastName, middleName,ExtEmpNo, U_NAME, role,userGroup,
    }){

        if(!firstName){
            throw new Error('user must have firstname');
        }

        if(!lastName){
            throw new Error('user must have lastname');
        }

        // if(!middleName){
        //     throw new Error('user must have middlename');
        // }
        
        if(!empID){
            throw new Error('employee id should not be empty');
        }
        if(!role){
            throw new Error('user must have role')
        }
        if(!ExtEmpNo){
            throw new Error('Employee id should not be empty.')
        }
        if(!userGroup){
            throw new Error('user must have user group')
        }

        

        return Object.freeze({
            getEmployeeId: () => empID,
            getFirstname: () => firstName,
            getLastname: () => lastName,
            // getMiddlename: () => middleName,
            getExtEmpNo:() => ExtEmpNo,
            // getUsername: () => U_NAME,
            getUserGroup:() => userGroup,
            getRole:() =>role,

        })

    }
};

module.exports = makeUserAccountSAPEntity;