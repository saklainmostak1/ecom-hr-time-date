import IncomeCategoryUpdate from '@/app/(view)/admin/income_category/income_category_update/page';
import React from 'react';

const IncomeCategoryEdit = ({params}) => {

    const [id] = params.segments || []    
    console.log(id)   

    return (
        <div>
            <IncomeCategoryUpdate id={id}></IncomeCategoryUpdate>
        </div>
    );
};

export default IncomeCategoryEdit;