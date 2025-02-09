import ExpenceAllCategory from '@/app/(view)/admin/expense_category/expense_category_list/page';
import React from 'react';

const ExpenceCategoryAll = ({searchParams}) => {
    return (
        <div>
            <ExpenceAllCategory
            searchParams={searchParams}
            ></ExpenceAllCategory>
        </div>
    );
};

export default ExpenceCategoryAll;