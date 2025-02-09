import OfficeVisitPersonUpdate from '@/app/(view)/admin/office_visit/office_visit_person_update/page';
import React from 'react';

const OfficeVisitPersonEdit = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <OfficeVisitPersonUpdate
            id={id}
            ></OfficeVisitPersonUpdate>
        </div>     
    );
};

export default OfficeVisitPersonEdit;