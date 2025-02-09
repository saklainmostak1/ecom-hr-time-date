import LoanLists from '@/app/(view)/admin/loan/loan_lists/page';
import React from 'react';

const LoanList = ({searchParams}) => {
    return (
        <div>
        <LoanLists
        searchParams={searchParams}
        ></LoanLists>    
        </div>
    );
};

export default LoanList;