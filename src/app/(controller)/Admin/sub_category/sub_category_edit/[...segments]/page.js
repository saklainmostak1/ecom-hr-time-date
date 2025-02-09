import EditSubCategory from '@/app/(view)/admin/sub_category/sub_category_edit/page';
import React from 'react';

const SubCategoryEdit = ({params}) => {

    const [id] = params.segments || []    
    console.log(id) 


    return (
        <div>
            <EditSubCategory
            id={id}
            ></EditSubCategory>
        </div>
    );
};

export default SubCategoryEdit;