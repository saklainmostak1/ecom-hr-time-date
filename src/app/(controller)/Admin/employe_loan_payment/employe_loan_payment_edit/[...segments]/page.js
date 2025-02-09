import EmployeLoanPaymentUpdate from '@/app/(view)/admin/employe_loan_payment/employe_loan_payment_update/page';
import React from 'react';

const EmployeLoanPaymentEdit = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 

    return (
        <div>
            <EmployeLoanPaymentUpdate
            id={id}
            ></EmployeLoanPaymentUpdate>
        </div>
    );
};

export default EmployeLoanPaymentEdit;