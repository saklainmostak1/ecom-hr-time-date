import React from 'react';
import SmsEmailQuotation from '../../../../../(view)/admin/quotation/quotation_email_smses/page';

const EmailSMsQuotation = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <SmsEmailQuotation
            id={id}
            ></SmsEmailQuotation>
        </div>
    );
};

export default EmailSMsQuotation;