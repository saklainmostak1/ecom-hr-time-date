import CopyUnit from '@/app/(view)/admin/unit/unit_copy/page';
import UnitList from '@/app/(view)/admin/unit/unit_list/page';
import React from 'react';

const UnitCopy = ({params}) => {

    const [id] = params.segments || []    
    console.log(id) 


    return (
        <div>
          <CopyUnit
          id={id}
          ></CopyUnit>
        </div>
    );
};

export default UnitCopy;