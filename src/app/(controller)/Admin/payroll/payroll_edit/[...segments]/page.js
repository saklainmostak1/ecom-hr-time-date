import PayRollEdit from '@/app/(view)/admin/payroll/payroll_edit/page';
import React from 'react';

const EditPayRoll = ({params}) => {

    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
     <PayRollEdit
     id={id}
     ></PayRollEdit>
        </div>
    );
};

export default EditPayRoll;