import EditBrand from '@/app/(view)/admin/brand/brand_edit/page';
import React from 'react';

const BrandEdit = ({params}) => {

    const [id] = params.segments || []    
    console.log(id) 


    return (
        <div>
            <EditBrand
            id={id}
            ></EditBrand>
        </div>
    );
};

export default BrandEdit;