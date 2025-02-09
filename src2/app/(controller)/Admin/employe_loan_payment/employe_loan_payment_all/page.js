import EmployePaymentLoanList from '@/app/(view)/admin/employe_loan_payment/employe_loan_payment_lists/page';
import React from 'react';

const LoanEmployePaymentList = ({searchParams}) => {
    return (
        <div>
            <EmployePaymentLoanList
            searchParams={searchParams}
            ></EmployePaymentLoanList>
        </div>
    );
};

export default LoanEmployePaymentList;