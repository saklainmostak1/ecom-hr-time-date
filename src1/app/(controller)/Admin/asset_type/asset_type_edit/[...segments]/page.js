import AssetTypeUpdate from '@/app/(view)/admin/asset_type/asset_type_update/page';
import React from 'react';

const AssetTypeEdit = ({params}) => {
    const [id] = params.segments || [];
    console.log(id);
    return (
        <div>
            <AssetTypeUpdate
            id={id}
            ></AssetTypeUpdate>
        </div>
    );
};

export default AssetTypeEdit;