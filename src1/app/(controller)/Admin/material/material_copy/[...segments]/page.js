import CopyMaterial from '@/app/(view)/admin/material/material_copy/page';
import React from 'react';

const MaterialCopy = ({params}) => {

    const [id] = params.segments || []    
    console.log(id)   


    return (
        <div>
            <CopyMaterial
            id={id}
            ></CopyMaterial>
        </div>
    );
};

export default MaterialCopy;