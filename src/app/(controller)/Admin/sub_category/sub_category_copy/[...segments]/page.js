import CopySubCategory from '@/app/(view)/admin/sub_category/sub_category_copy/page';
import React from 'react';

const SubCategoryCopy = ({params}) => {

    const [id] = params.segments || []    
    console.log(id) 


    return (
        <div>
        <CopySubCategory
        id={id}
        ></CopySubCategory>
        </div>
    );
};

export default SubCategoryCopy;