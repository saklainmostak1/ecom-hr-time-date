import WareHouseUpdate from '@/app/(view)/admin/ware_house/ware_house_update/page';
import React from 'react';

const WareHouseEdit = ({params}) => {
    const [id] = params.segments || [];
    console.log(id);
    return (
        <div>
            <WareHouseUpdate
            id={id}
            ></WareHouseUpdate>
        </div>
    );
};

export default WareHouseEdit;