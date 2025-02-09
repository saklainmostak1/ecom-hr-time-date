
import PayRollList from '@/app/(view)/admin/payroll/payroll_list/page';
import React from 'react';

const ListPayRoll = ({searchParams}) => {
    return (
        <div>
            <PayRollList
            searchParams={searchParams}
            ></PayRollList>
        </div>
    );
};

export default ListPayRoll;