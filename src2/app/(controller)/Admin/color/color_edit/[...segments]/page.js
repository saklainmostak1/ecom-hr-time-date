import EditColor from '@/app/(view)/admin/color/color_edit/page';
import React from 'react';

const ColorEdit = ({params}) => {
    const [id] = params.segments || []    
    console.log(id)   
    return (
        <div>
            <EditColor
            id={id}
            ></EditColor>
        </div>
    );
};

export default ColorEdit;