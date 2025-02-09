import SliderUpdate from '@/app/(view)/admin/slider/slider_update/page';
import React from 'react';

const SliderEdit = ({params}) => {
    const [id] = params.segments || []    
    console.log(id)   

    return (
        <div>
            <SliderUpdate
            id={id}
            ></SliderUpdate>
        </div>
    );
};

export default SliderEdit;