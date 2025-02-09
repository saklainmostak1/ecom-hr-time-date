import AccountHeadTypeCopy from '@/app/(view)/admin/account_head_type/account_head_type_copy/page';
import React from 'react';

const CopyAccountHeadType = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <AccountHeadTypeCopy
            id={id}
            ></AccountHeadTypeCopy>
        </div>
    );
};

export default CopyAccountHeadType;