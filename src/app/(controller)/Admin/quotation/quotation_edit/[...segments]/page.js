import React from 'react';
import UpdateQuotation from '../../../../../(view)/admin/quotation/quotation_update/page';

const EditQuotation = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <UpdateQuotation
            id={id}
            ></UpdateQuotation>
        </div>
    );
};

export default EditQuotation;