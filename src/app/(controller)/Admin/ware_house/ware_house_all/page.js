import WareHouseLists from '@/app/(view)/admin/ware_house/ware_house_lists/page';
import React from 'react';

const WareHouseAll = ({searchParams}) => {
    return (
        <div>
            <WareHouseLists
            searchParams={searchParams}
            ></WareHouseLists>
        </div>
    );
};

export default WareHouseAll;