import OfficeVisitEdits from '@/app/(view)/admin/office_visit/office_visit_edits/page';
import React from 'react';

const OfficeVisitEdit = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <OfficeVisitEdits
            id={id}
            ></OfficeVisitEdits>
        </div>
    );
};

export default OfficeVisitEdit;