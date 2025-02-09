import TransportAllowanceList from '@/app/(view)/admin/transport_allowance/transport_allowance_list/page';
import React from 'react';

const TransportAllowanceAll = ({searchParams}) => {
    return (
        <div>
            <TransportAllowanceList
            searchParams={searchParams}
            ></TransportAllowanceList>
        </div>
    );
};

export default TransportAllowanceAll;