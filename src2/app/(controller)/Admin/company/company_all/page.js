import CompanyList from '@/app/(view)/admin/company/company_list/page';
import React from 'react';

const CompanyAll = ({searchParams}) => {
    return (
        <div>
            <CompanyList
            searchParams={searchParams}
            ></CompanyList>
        </div>
    );
};

export default CompanyAll;