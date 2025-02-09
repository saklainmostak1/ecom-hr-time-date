import React from 'react';
import UpdateUserRoleAccess from '../../../../../(view)/admin/user_role_access/user_role_access_update/page';

const EditUserRoleAccess = ({params}) => {

    const [id] = params.segments || []
    console.log(id)


    return (
        <div>
            <UpdateUserRoleAccess
            id={id}
            ></UpdateUserRoleAccess>
        </div>
    );
};

export default EditUserRoleAccess;