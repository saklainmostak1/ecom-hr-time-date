import React from 'react';
import Product from '@/app/(view)/admin/product/quick_category_update/page';

const quick_category_update = ({searchParams}) => {
    return (
        <div>
            <Product searchParams={searchParams} />
        </div>
    );
};

export default quick_category_update;