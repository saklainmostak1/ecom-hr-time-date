
import AdminTemplateCopy from '@/app/(view)/admin/admin_template/admin_template_copy/page';
import React from 'react';

const AdminPanelSettingsCopy = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
         <AdminTemplateCopy
         id={id}
         
         ></AdminTemplateCopy>
        </div>
    );
};

export default AdminPanelSettingsCopy;