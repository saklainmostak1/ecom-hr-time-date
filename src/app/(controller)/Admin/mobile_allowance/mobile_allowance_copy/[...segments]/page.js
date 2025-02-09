import MobileAllowanceCopy from '@/app/(view)/admin/mobile_allowance/mobile_allowance_copy/page';
import React from 'react';

const CopyMobileAllwoance = ({params}) => {

    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <MobileAllowanceCopy
            id={id}
            ></MobileAllowanceCopy>
        </div>
    );
};

export default CopyMobileAllwoance;