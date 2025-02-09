import EditCategory from '@/app/(view)/admin/category/category_edit/page';
import React from 'react';

const CategoryEdit = ({params}) => {

    const [id] = params.segments || []    
    console.log(id)   


    return (
        <div>
            <EditCategory
            id={id}
            ></EditCategory>
        </div>
    );
};

export default CategoryEdit;