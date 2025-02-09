import AccountHeadList from '@/app/(view)/admin/account_head/account_head_list/page';
import React from 'react';

const AccountHeadAll = ({searchParams}) => {
    return (
        <div>
            <AccountHeadList
            searchParams={searchParams}
            ></AccountHeadList>
        </div>
    );
};

export default AccountHeadAll;