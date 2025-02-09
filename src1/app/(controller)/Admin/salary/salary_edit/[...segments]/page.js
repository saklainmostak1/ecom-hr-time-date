import SalaryUpdate from '@/app/(view)/admin/salary/salary_update/page';
import React from 'react';

const SalaryEdit = ({params}) => {

    const [id] = params.segments || []    
    console.log(id) 

    return (
        <div>
            <SalaryUpdate
            id={id}
            ></SalaryUpdate>
        </div>
    );
};

export default SalaryEdit;