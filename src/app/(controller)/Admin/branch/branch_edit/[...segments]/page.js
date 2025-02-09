import BranchUpdate from '@/app/(view)/admin/brance/branch_edit/page';
import React from 'react';

const BranchEdit = ({params}) => {
    
    const [id] = params.segments || []    
    console.log(id)  
    return (
        <div>
            <BranchUpdate id={id}></BranchUpdate>
        </div>
    );
};

export default BranchEdit;