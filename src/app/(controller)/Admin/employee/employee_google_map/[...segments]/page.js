import EmployeeGoogleMap from '@/app/(view)/admin/employee/employee_google_map/page';
import React from 'react';

const EmployeeLocationMap = ({params}) => {

    const [id] = params.segments || []    
    console.log(id)  

    return (
        <div>
            <EmployeeGoogleMap
                id={id}
            ></EmployeeGoogleMap>
        </div>
    );
};

export default EmployeeLocationMap;