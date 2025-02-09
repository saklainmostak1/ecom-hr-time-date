

import PasswordReset from '@/app/(view)/admin/users/pass_reset/page';
import React from 'react';

const ChangePassword = ({ params }) => {
    const [id] = params.segments || []
    console.log(id)
    return (
        <div>
            <PasswordReset
                id={id}
            ></PasswordReset>
        </div>
    );
};

export default ChangePassword;