import OfficeVisistRemarks from '@/app/(view)/admin/office_visit/office_visit_remarks/page';
import React from 'react';

const RemarksOfficeVisit = ({params, searchParams}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <OfficeVisistRemarks
            id={id}
            searchParams={searchParams}
            ></OfficeVisistRemarks>
        </div>
    );
};

export default RemarksOfficeVisit;