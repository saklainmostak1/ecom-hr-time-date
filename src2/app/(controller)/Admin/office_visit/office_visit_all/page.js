import OfficeVisitList from '@/app/(view)/admin/office_visit/office_visit_lists/page';
import React from 'react';

const OfficeVisitAll = ({searchParams}) => {
    return (
        <div>
            <OfficeVisitList
            searchParams={searchParams}
            ></OfficeVisitList>
        </div>
    );
};

export default OfficeVisitAll;