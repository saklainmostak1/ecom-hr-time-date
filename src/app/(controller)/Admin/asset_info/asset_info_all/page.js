import AssetInfoLists from '@/app/(view)/admin/asset_info/asset_info_lists/page';
import React from 'react';

const AssentInfoAll = ({searchParams}) => {
    return (
        <div>
            <AssetInfoLists
            searchParams={searchParams}
            ></AssetInfoLists>
        </div>
    );
};

export default AssentInfoAll;