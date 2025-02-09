import OfficeVisitRemarksEdit from '@/app/(view)/admin/office_visit/office_visit_remarks_update/page';
import React from 'react';

const RemarksEdit = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <OfficeVisitRemarksEdit
            id={id}
            ></OfficeVisitRemarksEdit>
        </div>
    );
};

export default RemarksEdit;