import SubCategoryList from '@/app/(view)/admin/sub_category/sub_category_list/page';
import React from 'react';

const SubCategoryAll = ({searchParams}) => {
    return (
        <div>
            <SubCategoryList searchParams={searchParams} ></SubCategoryList>
        </div>
    );
};

export default SubCategoryAll;