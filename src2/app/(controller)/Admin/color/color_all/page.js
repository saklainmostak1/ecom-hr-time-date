import ColorList from '@/app/(view)/admin/color/color_list/page';
import React from 'react';

const ColorAll = ({searchParams}) => {
    return (
        <div>
            <ColorList searchParams={searchParams} ></ColorList>
        </div>
    );
};

export default ColorAll;