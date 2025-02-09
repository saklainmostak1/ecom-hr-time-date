import BranchList from '@/app/(view)/admin/brance/branch_all/page';
import React from 'react';

const BranchAll = ({searchParams}) => {
    return (
        <div>
            <BranchList
            searchParams={searchParams}
            ></BranchList>
        </div>
    );
};

export default BranchAll;