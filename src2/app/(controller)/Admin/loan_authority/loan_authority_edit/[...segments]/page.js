import LoanAuthorityUpdate from '@/app/(view)/admin/loan_authority/loan_authority_update/page';
import React from 'react';

const LaonAuthorityEdit = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <LoanAuthorityUpdate
            id={id}
            ></LoanAuthorityUpdate>
        </div>
    );
};

export default LaonAuthorityEdit;