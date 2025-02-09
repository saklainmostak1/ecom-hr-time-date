import EditProduct from '@/app/(view)/admin/product/product_edit/page';
import React from 'react';

const ProductEdit = ({params}) => {
    const [id] = params.segments || []    
    console.log(id)   

    return (
        <div>
            <EditProduct id={id} ></EditProduct>
        </div>
    );
};

export default ProductEdit;