import SchoolShiftEdit from '@/app/(view)/admin/school_shiftt/school_shift_edit/page';
import React from 'react';

const EditSchoolShift = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 

    return (
        <div>
            <SchoolShiftEdit
            id={id}
            ></SchoolShiftEdit>
        </div>
    );
};

export default EditSchoolShift;