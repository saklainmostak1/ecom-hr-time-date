import CopyProduct from '@/app/(view)/admin/product/product_copy/page';
import React from 'react';

const ProductCopy = ({params}) => {
    const [id] = params.segments || []    
    console.log(id)   
    return (
        <div>
            <CopyProduct id={id}></CopyProduct>
        </div>
    );
};

export default ProductCopy;