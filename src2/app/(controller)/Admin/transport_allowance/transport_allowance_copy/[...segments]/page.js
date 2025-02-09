import CopyTransportAllowance from '@/app/(view)/admin/transport_allowance/transport_allowance_copy/page';
import React from 'react';

const TransportAllowanceCopy = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <CopyTransportAllowance
            id={id}
            ></CopyTransportAllowance>
        </div>
    );
};

export default TransportAllowanceCopy;