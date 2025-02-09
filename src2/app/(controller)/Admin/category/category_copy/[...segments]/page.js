import CopyCategory from '@/app/(view)/admin/category/category_copy/page';
import React from 'react';

const CategoryCopy = ({params}) => {
    const [id] = params.segments || []    
    console.log(id)   
    return (
        <div>
            <CopyCategory
            id={id}
            ></CopyCategory>
        </div>
    );
};

export default CategoryCopy;