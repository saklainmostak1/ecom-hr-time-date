import PurchaseList from '@/app/(view)/admin/purchase/purchase_list/page';
import React from 'react';

const PurchaseAll = ({searchParams}) => {
    return (
        <div>
            <PurchaseList
            searchParams={searchParams}
            ></PurchaseList>
        </div>
    );
};

export default PurchaseAll;