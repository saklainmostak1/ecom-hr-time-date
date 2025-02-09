import AssetEmployeeList from '@/app/(view)/admin/asset_employee/asset_employee_list/page';
import React from 'react';

const AssetEmployeeAll = ({ searchParams }) => {
    return (
        <div>
            <AssetEmployeeList
                searchParams={searchParams}
            ></AssetEmployeeList>
        </div>
    );
};

export default AssetEmployeeAll;