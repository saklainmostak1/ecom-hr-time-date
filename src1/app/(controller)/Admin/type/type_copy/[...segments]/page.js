import CopyType from '@/app/(view)/admin/type/type_copy/page';
import React from 'react';

const TypeCopy = ({params}) => {

    const [id] = params.segments || []    
    console.log(id) 


    return (
        <div>
            <CopyType
            id={id}
            ></CopyType>
        </div>
    );
};

export default TypeCopy;