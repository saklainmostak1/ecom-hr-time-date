import PopUpUpdate from '@/app/(view)/admin/pop_up/pop_up_update/page';
import React from 'react';

const PopUpEdit = ({params}) => {
    const [id] = params.segments || []    
    console.log(id)  
    return (
        <div>
            <PopUpUpdate
            id={id}
            ></PopUpUpdate>
        </div>
    );
};

export default PopUpEdit;