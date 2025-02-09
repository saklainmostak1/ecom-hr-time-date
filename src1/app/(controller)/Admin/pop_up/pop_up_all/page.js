import PopUpList from '@/app/(view)/admin/pop_up/pop_up_list/page';
import React from 'react';

const PopUpAll = ({searchParams}) => {
    return (
        <div>
            <PopUpList
            searchParams={searchParams}
            ></PopUpList>
        </div>
    );
};

export default PopUpAll;