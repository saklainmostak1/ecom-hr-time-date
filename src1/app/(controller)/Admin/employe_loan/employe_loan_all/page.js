import EmployeeLoanLists from '@/app/(view)/admin/employe_loan/employe_loan_lists/page';
import React from 'react';

const EmployeeLoanAll = ({searchParams}) => {
    return (
        <div>
            <EmployeeLoanLists
            searchParams={searchParams}
            ></EmployeeLoanLists>
        </div>
    );
};

export default EmployeeLoanAll;