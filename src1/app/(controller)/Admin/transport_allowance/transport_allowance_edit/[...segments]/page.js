import TransportAllowanceEdit from '@/app/(view)/admin/transport_allowance/transport_allowance_edit/page';
import React from 'react';

const EditTransportAllowance = ({params}) => {


    const [id] = params.segments || []    
    console.log(id) 

    return (
        <div>
            <TransportAllowanceEdit
            id={id}
            ></TransportAllowanceEdit>
        </div>
    );
};

export default EditTransportAllowance;