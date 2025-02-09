import React from 'react';
import Product from '@/app/(view)/admin/product/quick_brand_update/page';

const quick_brand_entry = ({searchParams}) => {
    return (
        <div>
            <Product searchParams={searchParams} />
        </div>
    );
};

export default quick_brand_entry;