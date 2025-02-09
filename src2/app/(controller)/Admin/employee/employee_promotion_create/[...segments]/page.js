import EmployeePromotionCreate from '@/app/(view)/admin/employee/employee_promotion_create/page';
import React from 'react';

const CreateEmployeePromotion = ({params}) => {

    const [id] = params.segments || []    
    console.log(id)  

    return (
        <div>
            <EmployeePromotionCreate id={id}></EmployeePromotionCreate>
        </div>
    );
};

export default CreateEmployeePromotion;