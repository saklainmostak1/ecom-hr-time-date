import ListSupplier from '@/app/(view)/admin/supplier/supplier_list/page';
import React from 'react';

const SupplierAll = ({searchParams}) => {
    return (
        <div>
            <ListSupplier
            searchParams={searchParams}
            ></ListSupplier>
        </div>
    );
};

export default SupplierAll;