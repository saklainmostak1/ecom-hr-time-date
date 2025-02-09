import EditUnit from '@/app/(view)/admin/unit/unit_edit/page';
import React from 'react';

const UnitEdit = ({ params }) => {


    const [id] = params.segments || []
    console.log(id)

    return (
        <div>
            <EditUnit
                id={id}
            ></EditUnit>
        </div>
    );
};

export default UnitEdit;