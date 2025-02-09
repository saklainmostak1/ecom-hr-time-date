import CustomPageList from '@/app/(view)/admin/custom_page/custom_page_list/page';
import React from 'react';

const CustomPageAll = ({searchParams}) => {
    return (
        <div>
            <CustomPageList
            searchParams={searchParams}
            ></CustomPageList>
        </div>
    );
};

export default CustomPageAll;