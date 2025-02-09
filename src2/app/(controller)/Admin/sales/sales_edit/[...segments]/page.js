import SaleUpdate from '@/app/(view)/admin/sales/sales_update/page';
import React from 'react';

const EditSales = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <SaleUpdate
            id={id}
            ></SaleUpdate>
        </div>
    );
};

export default EditSales;