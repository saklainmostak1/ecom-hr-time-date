import SchoolShiftAll from '@/app/(view)/admin/school_shiftt/school_shiftt_all/page';
import React from 'react';

const AllShiftSchool = ({searchParams}) => {
    return (
        <div>
            <SchoolShiftAll
            searchParams={searchParams}
            ></SchoolShiftAll>
        </div>
    );
};

export default AllShiftSchool;