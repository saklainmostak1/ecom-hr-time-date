import TypeList from '@/app/(view)/admin/type/type_list/page';
import React from 'react';

const PageAll = ({searchParams}) => {
    return (
        <div>
            <TypeList searchParams={searchParams} ></TypeList>
        </div>
    );
};

export default PageAll;