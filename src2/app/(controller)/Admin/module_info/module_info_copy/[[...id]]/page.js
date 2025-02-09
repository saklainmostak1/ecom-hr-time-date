'use client' 
 //ismile
import AdminPageCopyAll from '@/app/(view)/admin/module_info/module_info_copy/page';
import React, { useState } from 'react';

const AdminPageCopy = ({ params }) => {
    const [id] = params.id || []
    return (
        <div>

            {
                <AdminPageCopyAll
                    Id={id}
                ></AdminPageCopyAll>
            }
        </div>
    );
};

export default AdminPageCopy;