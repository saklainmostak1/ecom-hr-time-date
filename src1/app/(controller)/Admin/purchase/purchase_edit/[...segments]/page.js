import PurchaseUpdate from '@/app/(view)/admin/purchase/purchase_update/page';
import React from 'react';

const PurchaseEdit = ({params}) => {
    const [id] = params.segments || [];
    console.log(id);
    return (
        <div>
            <PurchaseUpdate
            id={id}
            ></PurchaseUpdate>
        </div>
    );
};

export default PurchaseEdit;