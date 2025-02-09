import CustomPageUpdate from '@/app/(view)/admin/custom_page/custom_page_update/page';
import React from 'react';

const CustomPageEdit = ({params}) => {
    const [id] = params.segments || []    
    console.log(id)  
    return (
        <div>
            <CustomPageUpdate
            id={id}
            ></CustomPageUpdate>
        </div>
    );
};

export default CustomPageEdit;