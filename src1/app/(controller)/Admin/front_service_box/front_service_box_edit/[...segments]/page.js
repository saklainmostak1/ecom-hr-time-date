import FontServiceBoxUpdate from '@/app/(view)/admin/front_service_box/front_service_box_update/page';
import React from 'react';

const FrontServiceBoxEdit = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <FontServiceBoxUpdate
            id={id}
            ></FontServiceBoxUpdate>
        </div>
    );
};

export default FrontServiceBoxEdit;