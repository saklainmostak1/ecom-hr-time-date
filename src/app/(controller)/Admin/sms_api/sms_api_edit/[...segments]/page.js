import SmsApiUpdate from '@/app/(view)/admin/sms_api/sms_api_update/page';
import React from 'react';

const SmsApiEdit = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <SmsApiUpdate
            id={id}
            ></SmsApiUpdate>
        </div>
    );
};

export default SmsApiEdit;