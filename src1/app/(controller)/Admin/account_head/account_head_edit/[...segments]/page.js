import AccountHeadUpdate from '@/app/(view)/admin/account_head/account_head_update/page';
import React from 'react';

const AccountHeadEdit = ({params}) => {


    const [id] = params.segments || []    
    console.log(id)  


    return (
        <div>
            <AccountHeadUpdate
            id={id}
            >

            </AccountHeadUpdate>
        </div>
    );
};

export default AccountHeadEdit;