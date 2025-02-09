import EmployeeLoadEdit from '@/app/(view)/admin/employe_loan/employe_loan_update/page';
import React from 'react';

const EditEmployeeLoan = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <EmployeeLoadEdit
            id={id}
            ></EmployeeLoadEdit>
        </div>
    );
};

export default EditEmployeeLoan;