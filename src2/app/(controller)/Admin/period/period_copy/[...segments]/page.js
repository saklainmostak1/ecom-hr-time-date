import CopyPeriod from '@/app/(view)/admin/period/period_copy/page';
import React from 'react';

const PeriodCopy = ({params}) => {
    const [id] = params.segments || []    
    console.log(id)   
    return (
        <div>
            <CopyPeriod
            id={id}
            ></CopyPeriod>
        </div>
    );
};

export default PeriodCopy;