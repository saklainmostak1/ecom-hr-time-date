import CopyWarranty from '@/app/(view)/admin/warranty/warranty_copy/page';
import React from 'react';

const Warrantycopy = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <CopyWarranty
            id={id}
            ></CopyWarranty>
        </div>
    );
};

export default Warrantycopy;