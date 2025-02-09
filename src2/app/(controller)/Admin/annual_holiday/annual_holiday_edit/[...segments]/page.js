import UpdateEarlyHoliday from '@/app/(view)/admin/annual_holiday/yearly_holiday_update/page';
import React from 'react';

const EditYearlyHoliday = ({params}) => {


    const [id] = params.segments || []    
    console.log(id)   

    return (
        <div>
            <UpdateEarlyHoliday
            id={id}
            ></UpdateEarlyHoliday>
        </div>
    );
};

export default EditYearlyHoliday;