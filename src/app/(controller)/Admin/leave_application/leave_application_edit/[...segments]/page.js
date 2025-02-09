import LeaveApplicationEdit from '@/app/(view)/admin/leave_application/leave_application_update/page';
import React from 'react';

const EditLeaveApplication = ({params}) => {


    const [id] = params.segments || []    
    console.log(id)   


    return (
        <div>
            <LeaveApplicationEdit
            id={id}
            ></LeaveApplicationEdit>
        </div>
    );
};

export default EditLeaveApplication;