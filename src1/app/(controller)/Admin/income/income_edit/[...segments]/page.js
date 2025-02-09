import EditIncome from '@/app/(view)/admin/income/income_update/page';
import React from 'react';

const IncomeEdit = ({params}) => {
    const [id] = params.segments || []    
    console.log(id)   
    return (
        <div>
            <EditIncome
            id={id}
            ></EditIncome>
        </div>
    );
};

export default IncomeEdit;