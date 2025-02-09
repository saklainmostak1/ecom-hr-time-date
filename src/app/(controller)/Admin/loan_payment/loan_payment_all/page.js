import LoanPaymentLists from '@/app/(view)/admin/loan_payment/loan_payment_lists/page';
import React from 'react';

const LoanPaymentAll = ({searchParams}) => {
    return (
        <div>
            <LoanPaymentLists
            searchParams={searchParams}
            ></LoanPaymentLists>
        </div>
    );
};

export default LoanPaymentAll;