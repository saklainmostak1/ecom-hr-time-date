import OfficeVisitPerson from '@/app/(view)/admin/office_visit/office_visit_person/page';
import React from 'react';

const PersonOfficeVisit = ({params, searchParams}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <OfficeVisitPerson
            id={id}
            searchParams={searchParams}
            ></OfficeVisitPerson>
        </div>
    );
};

export default PersonOfficeVisit;