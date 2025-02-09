import CopyModel from '@/app/(view)/admin/model/model_copy/page';
import React from 'react';

const ModelCopy = ({params}) => {

    const [id] = params.segments || []    
    console.log(id)   


    return (
        <div>
            <CopyModel
            id={id}
            ></CopyModel>
        </div>
    );
};

export default ModelCopy;