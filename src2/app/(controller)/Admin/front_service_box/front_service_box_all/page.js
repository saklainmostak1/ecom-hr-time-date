import FrontServiceBoxList from '@/app/(view)/admin/front_service_box/front_service_box_list/page';
import React from 'react';

const LIstFrontServiceBox = ({searchParams}) => {
    return (
        <div>
            <FrontServiceBoxList
            searchParams={searchParams}
            ></FrontServiceBoxList>
        </div>
    );
};

export default LIstFrontServiceBox;