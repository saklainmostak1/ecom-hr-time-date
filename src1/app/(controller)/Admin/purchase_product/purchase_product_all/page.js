import ProductPurchaseList from '@/app/(view)/admin/purchase_product/purchase_product_list/page';
import React from 'react';

const PurchaseProductAll = ({searchParams}) => {
    return (
        <div>
            <ProductPurchaseList
            searchParams={searchParams}
            ></ProductPurchaseList>
        </div>
    );
};

export default PurchaseProductAll;