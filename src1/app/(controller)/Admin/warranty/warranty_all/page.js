import WarrantyList from '@/app/(view)/admin/warranty/warranty_list/page';
import React from 'react';

const WarrantyAll = ({searchParams}) => {
    return (
        <div>
            <WarrantyList searchParams={searchParams} ></WarrantyList>
            
        </div>
    );
};

export default WarrantyAll;