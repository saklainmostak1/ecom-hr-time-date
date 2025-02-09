import EmployeeLiveLocation from '@/app/(view)/admin/employee/employee_live_locations/page';
import React from 'react';

const LiveLOcationEmployee = ({params}) => {
    const [id] = params.segments || []    
    console.log(id)  
    return (
        <div>
            <EmployeeLiveLocation
            id={id}
            ></EmployeeLiveLocation>
        </div>
    );
};

export default LiveLOcationEmployee;