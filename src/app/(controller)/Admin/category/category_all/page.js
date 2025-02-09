import CategoryList from '@/app/(view)/admin/category/category_list/page';
import React from 'react';

const ListCategory = ({searchParams}) => {
    return (
        // <div>
        //     <CategoryList></CategoryList>
        // </div>
          <div >
          
            <CategoryList searchParams={searchParams} />
         
        </div>
    );
};

export default ListCategory;