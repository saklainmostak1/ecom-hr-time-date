import IncomeList from '@/app/(view)/admin/income/income_list/page';
import React from 'react';

const IncomeAll = ({ searchParams }) => {
    return (
        <div>
            <IncomeList searchParams={searchParams}> </IncomeList>
        </div>
    );
};
export default IncomeAll;