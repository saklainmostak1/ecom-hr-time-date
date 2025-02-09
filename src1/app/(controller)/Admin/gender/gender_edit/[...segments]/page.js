import GenderEdit from '@/app/(view)/admin/gender/gender_edit/page';
import React from 'react';

const EditGender = ({params}) => {

    const [id] = params.segments || []    
    console.log(id)  

    return (
        <div>
           <GenderEdit
           id={id}
           ></GenderEdit> 
        </div>
    );
};

export default EditGender;