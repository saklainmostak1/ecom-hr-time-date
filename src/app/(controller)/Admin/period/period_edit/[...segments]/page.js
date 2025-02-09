import EditPeriod from '@/app/(view)/admin/period/period_edit/page';
import React from 'react';

const PeriodEdit = ({params}) => {

    const [id] = params.segments || []    
    console.log(id)   


    return (
        <div>
            <EditPeriod
            id={id}
            ></EditPeriod>
        </div>
    );
};

export default PeriodEdit;