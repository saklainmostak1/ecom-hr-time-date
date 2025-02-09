import MaterialList from '@/app/(view)/admin/material/material_list/page';
import React from 'react';

const MaterialAll = ({searchParams}) => {
    return (
        <div>
            <MaterialList searchParams={searchParams}></MaterialList>
        </div>
    );
};

export default MaterialAll;