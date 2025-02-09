import CopyCompany from '@/app/(view)/admin/company/company_copy/page';
import React from 'react';

const CompanyCopy = ({params}) => {

    const [id] = params.segments || []    
    console.log(id) 

    return (
        <div>
            <CopyCompany id={id}></CopyCompany>
        </div>
    );
};

export default CompanyCopy;