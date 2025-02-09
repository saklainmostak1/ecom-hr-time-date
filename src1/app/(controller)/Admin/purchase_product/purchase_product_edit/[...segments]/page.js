import PurchaseProductUpdate from '@/app/(view)/admin/purchase_product/purchase_product_update/page';
import React from 'react';

const PurchaseProductEdit = ({ params }) => {
    const [id] = params.segments || [];
    console.log(id);
    return (
        <div>
            <PurchaseProductUpdate
                id={id}
            ></PurchaseProductUpdate>
        </div>
    );
};

export default PurchaseProductEdit;