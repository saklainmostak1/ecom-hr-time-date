
import HolydayCategoryEdit from '@/app/(view)/admin/holiday_category/holiday_category_update/page';
import React from 'react';

const HolidayCategoryUpdate = ({params}) => {

    const [id] = params.segments || []    
    console.log(id)  
    return (
        <div>
            <HolydayCategoryEdit id={id}></HolydayCategoryEdit>
        </div>
    );
};

export default HolidayCategoryUpdate;