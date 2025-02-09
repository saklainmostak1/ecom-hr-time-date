import SalesLists from '@/app/(view)/admin/sales/sales_list/page';
import React from 'react';

const SalesAll = ({ searchParams }) => {
    return (
        <div>
            <SalesLists
            searchParams={searchParams}
            ></SalesLists>
        </div>
    );
};

export default SalesAll;