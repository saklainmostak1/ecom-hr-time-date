
import AdminTemplateEdit from '@/app/(view)/admin/admin_template/admin_template_edit/page';
import React from 'react';

const AdminPanelSettingsEdit = ({params}) => {
    const [id] = params.segments || []    
    console.log(id) 
    return (
        <div>
            <AdminTemplateEdit
            id={id}
            ></AdminTemplateEdit>
        </div>
    );
};

export default AdminPanelSettingsEdit;