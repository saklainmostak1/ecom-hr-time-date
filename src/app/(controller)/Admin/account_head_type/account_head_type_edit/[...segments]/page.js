import AccountHeadTypeUpdate from '@/app/(view)/admin/account_head_type/account_head_type_update/page';
import React from 'react';

const AccountHeadTypeEdit = ({params}) => {

    const [id] = params.segments || []    
    console.log(id)  


    return (
        <div>
            <AccountHeadTypeUpdate
            id={id}
            ></AccountHeadTypeUpdate>
        </div>
    );
};

export default AccountHeadTypeEdit;