
import ListProduct from '@/app/(view)/admin/product/product_all/page';
import React from 'react';

const ProductLAll = ({searchParams}) => {
    return (
        <div>
            <ListProduct searchParams={searchParams} ></ListProduct>
        </div>
    );
};

export default ProductLAll;