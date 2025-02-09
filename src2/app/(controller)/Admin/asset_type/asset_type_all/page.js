import AssetTypeLists from '@/app/(view)/admin/asset_type/asset_type_lists/page';
import React from 'react';

const AssetTypeAll = ({searchParams}) => {
    return (
        <div>
            <AssetTypeLists
            searchParams={{searchParams}}
            ></AssetTypeLists>
        </div>
    );
};

export default AssetTypeAll;