import EmployeeAll from '@/app/(view)/admin/employee/employee_list/page';
import React from 'react';

const EmployeeList = ({searchParams}) => {
    return (
        <div>
            <EmployeeAll
            searchParams={searchParams}
            ></EmployeeAll>
        </div>
    );
};

export default EmployeeList;