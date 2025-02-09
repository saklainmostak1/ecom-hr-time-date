import EditMaterial from '@/app/(view)/admin/material/material_edit/page';
import React from 'react';

const MaterialEdit = ({params}) => {

    const [id] = params.segments || []    
    console.log(id)   


    return (
        <div>
            <EditMaterial
            id={id}
            ></EditMaterial>
        </div>
    );
};

export default MaterialEdit;