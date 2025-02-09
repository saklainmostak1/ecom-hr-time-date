import EditCompany from '@/app/(view)/admin/company/company_edit/page';
import React from 'react';

const UpdateCompany = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <EditCompany
            id={id}
            ></EditCompany>
        </div>
    );
};

export default UpdateCompany;