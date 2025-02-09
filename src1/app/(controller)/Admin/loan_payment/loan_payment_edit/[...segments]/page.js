import LoanPaymentUpdate from '@/app/(view)/admin/loan_payment/loan_payment_update/page';
import React from 'react';

const LoanPaymentEdit = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <LoanPaymentUpdate
            id={id}
            ></LoanPaymentUpdate>
        </div>
    );
};

export default LoanPaymentEdit;