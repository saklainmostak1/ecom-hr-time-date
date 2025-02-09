import LoanOthorityLists from '@/app/(view)/admin/loan_authority/loan_authority_lists/page';
import React from 'react';

const LaonOthorityAll = ({ searchParams }) => {
    return (
        <div>
            <LoanOthorityLists
                searchParams={searchParams}
            ></LoanOthorityLists>
        </div>
    );
};

export default LaonOthorityAll;