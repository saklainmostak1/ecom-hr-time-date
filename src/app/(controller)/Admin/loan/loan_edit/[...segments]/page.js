import LoanUpdate from '@/app/(view)/admin/loan/loan_update/page';
import React from 'react';

const LoanEdit = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <LoanUpdate
            id={id}
            ></LoanUpdate>
        </div>
    );
};

export default LoanEdit;