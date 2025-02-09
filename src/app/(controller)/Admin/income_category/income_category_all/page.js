import IncomeAllCategory from '@/app/(view)/admin/income_category/income_category_list/page';
import React from 'react';

const IncomeCategoryAll = ({searchParams}) => {
    return (
        <div>
            <IncomeAllCategory
            searchParams={searchParams}
            ></IncomeAllCategory>
        </div>
    );
};

export default IncomeCategoryAll;