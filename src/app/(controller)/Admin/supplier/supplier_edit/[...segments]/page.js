import SupplierUpdate from '@/app/(view)/admin/supplier/supplier_update/page';
import React from 'react';

const SuplierEdit = ({params}) => {
    
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <SupplierUpdate
            id={id}
            ></SupplierUpdate>
        </div>
    );
};

export default SuplierEdit;