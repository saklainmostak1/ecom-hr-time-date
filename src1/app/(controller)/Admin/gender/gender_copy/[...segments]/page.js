import GenderCopy from '@/app/(view)/admin/gender/gender_copy/page';
import React from 'react';

const CopyGender = ({params}) => {
    const [id] = params.segments || []    
    console.log(id)  
    return (
        <div>
            <GenderCopy
            id={id}
            ></GenderCopy>
        </div>
    );
};

export default CopyGender;