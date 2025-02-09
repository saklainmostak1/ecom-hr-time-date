import React from 'react';
import QuotationLists from '../../../../(view)/admin/quotation/quotation_list/page';

const AllQuotation = ({searchParams}) => {
    return (
        <div>
            <QuotationLists
            searchParams={searchParams}
            ></QuotationLists>
        </div>
    );
};

export default AllQuotation;