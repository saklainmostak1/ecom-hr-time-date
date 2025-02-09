import EditModel from '@/app/(view)/admin/model/model_edit/page';
import React from 'react';

const ModelEdit = ({params}) => {

    const [id] = params.segments || []    
    console.log(id)   


    return (
        <div>
            <EditModel
            id={id}
            ></EditModel>
        </div>
    );
};

export default ModelEdit;