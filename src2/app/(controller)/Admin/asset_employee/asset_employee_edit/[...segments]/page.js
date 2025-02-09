import AssetEmployeeUpdate from '@/app/(view)/admin/asset_employee/asset_employee_update/page';
import React from 'react';

const AssetEmployeeEdit = ({params}) => {
    const [id] = params.segments || [];
    console.log(id);
    return (
        <div>
            <AssetEmployeeUpdate
            id={id}
            ></AssetEmployeeUpdate>
        </div>
    );
};

export default AssetEmployeeEdit;