import UpdateAssetInfo from '@/app/(view)/admin/asset_info/asset_info_update/page';
import React from 'react';

const EditAssetInfo = ({params}) => {
    const [id] = params.segments || [];
    console.log(id);
    return (
        <div>
            <UpdateAssetInfo
            id={id}
            ></UpdateAssetInfo>
        </div>
    );
};

export default EditAssetInfo;