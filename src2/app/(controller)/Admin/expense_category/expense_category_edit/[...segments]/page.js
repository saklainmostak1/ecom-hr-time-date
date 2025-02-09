import ExpenceCategoryUpdate from '@/app/(view)/admin/expense_category/expense_category_edits/page';
import React from 'react';

const ExpenceCategoryEdit = ({params}) => {

    const [id] = params.segments || []    
    console.log(id)   


    return (
        <div>
            <ExpenceCategoryUpdate id={id}></ExpenceCategoryUpdate>
        </div>
    );
};

export default ExpenceCategoryEdit;