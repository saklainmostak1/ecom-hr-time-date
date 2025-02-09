import CopyBrand from '@/app/(view)/admin/brand/brand_copy/page';
import React from 'react';

const BrandCopy = ({params}) => {
    const [id] = params.segments || []    
    console.log(id)   
    return (
        <div>
            <CopyBrand
            id={id}
            
            ></CopyBrand>
        </div>
    );
};

export default BrandCopy;