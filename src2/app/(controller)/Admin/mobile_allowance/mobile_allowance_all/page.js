import MobileAllowanceList from '@/app/(view)/admin/mobile_allowance/mobile_allowance_list/page';
import React from 'react';

const MobileAllowanceAll = ({searchParams}) => {
    return (
        <div>
            <MobileAllowanceList
            searchParams={searchParams}
            ></MobileAllowanceList>
        </div>
    );
};

export default MobileAllowanceAll;