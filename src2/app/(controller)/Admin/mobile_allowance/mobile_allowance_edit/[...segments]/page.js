import MobileAllowanceEdit from '@/app/(view)/admin/mobile_allowance/mobile_allowance_update/page';
import React from 'react';

const MobileAllowanceUpdate = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <MobileAllowanceEdit
            id={id}
            ></MobileAllowanceEdit>
        </div>
    );
};

export default MobileAllowanceUpdate;