import AccountHeadTypeList from '@/app/(view)/admin/account_head_type/account_head_type_list/page';
import React from 'react';

const ListAccountHeadType = ({ searchParams }) => {
    return (
        <div>
            <AccountHeadTypeList
                searchParams={searchParams}
            ></AccountHeadTypeList>
        </div>
    );
};

export default ListAccountHeadType;