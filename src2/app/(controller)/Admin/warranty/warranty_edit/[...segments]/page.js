import WarrantyEdit from '@/app/(view)/admin/warranty/warranty_edit/page';
import React from 'react';

const EditWarranty = ({params}) => {

    const [id] = params.segments || []
    console.log(id)



    return (
        <div>
            <WarrantyEdit
            id={id}
            ></WarrantyEdit>
        </div>
    );
};

export default EditWarranty;