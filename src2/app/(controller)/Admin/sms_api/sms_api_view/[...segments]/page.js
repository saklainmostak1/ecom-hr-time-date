import SmsApiViews from '@/app/(view)/admin/sms_api/sms_api_views/page';
import React from 'react';

const SmsApiView = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <SmsApiViews
            id={id}
            ></SmsApiViews>
        </div>
    );
};

export default SmsApiView;