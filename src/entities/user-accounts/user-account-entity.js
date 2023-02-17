const makeUserAccountEntity = ({}) => {
    return function makeUserAccount({
        employeeId, firstname, lastname, middlename, role, username, password, userGroup, isActive, id
    }){

        if(!firstname){
            throw new Error('user must have firstname');
        }

        if(!lastname){
            throw new Error('user must have lastname');
        }

        // if(!middlename){
        //     throw new Error('user must have middlename');
        // }

        if(!role){
            throw new Error('user must have role');
        }

        if(isNaN(role)){
            throw new Error('role id should be an integer');
        }

        // if(!username){
        //     throw new Error('user must have username');
        // }

        if(!id){
            if(!password){
                throw new Error('user must have password');
            }
        }

        if(!userGroup){
            throw new Error('user must belong to a user group');
        }

        if(isNaN(userGroup)){
            throw new Error('user group id must be a number');
        }

        if(isActive == null){
            isActive = true;
        }

        if(!employeeId){
            throw new Error('employee id should not be empty');
        }

        if (employeeId.match(/[a-z]/i)) {
            // alphabet letters found
            throw new Error('this is not a valid employee id')
        }

        return Object.freeze({
            getEmployeeId: () => employeeId,
            getFirstname: () => firstname,
            getLastname: () => lastname,
            getMiddlename: () => middlename,
            getRole: () => role,
            getUsername: () => username,
            getPassword: () => password,
            getUserGroup: () => userGroup,
            getIsActive: () => isActive
        })

    }
};

module.exports = makeUserAccountEntity;