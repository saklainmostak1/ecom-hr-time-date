import ListLeaveApplication from '@/app/(view)/admin/leave_application/leave_application_list/page';
import React from 'react';

const LeaveApplicationList = ({searchParams}) => {
    return (
        <div>
            <ListLeaveApplication
              searchParams={searchParams}
            ></ListLeaveApplication>
        </div>
    );
};

export default LeaveApplicationList;