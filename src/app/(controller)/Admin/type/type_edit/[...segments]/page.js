import EditType from '@/app/(view)/admin/type/type_edit/page';
import React from 'react';

const TypeEdit = ({params}) => {


    const [id] = params.segments || []    
    console.log(id) 



    return (
        <div>
            <EditType
            
            id={id}
            ></EditType>
        </div>
    );
};

export default TypeEdit;