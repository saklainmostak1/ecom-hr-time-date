import UnitList from '@/app/(view)/admin/unit/unit_list/page';
import React from 'react';

const UnitAll = ({searchParams}) => {
    return (
        <div>
            <UnitList searchParams={searchParams} ></UnitList>
        </div>
    );
};

export default UnitAll;