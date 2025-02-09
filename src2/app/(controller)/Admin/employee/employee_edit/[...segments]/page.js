import EmployeeEdit from '@/app/(view)/admin/employee/employee_edit/page';
import React from 'react';

const EmployeeUpdate = ({params}) => {


    const [id] = params.segments || []    
    console.log(id)  

    return (
        <div>
            <EmployeeEdit
            id={id}
            ></EmployeeEdit>
        </div>
    );
};

export default EmployeeUpdate;