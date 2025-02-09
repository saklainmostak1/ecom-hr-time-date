import ModuleInfoTutorials from '@/app/(view)/admin/module_info/module_info_tutorials/page';
import React from 'react';

const ModuleInfoTutorial = ({ searchParams }) => {
    return (
        <div>
            <ModuleInfoTutorials
            searchParams={searchParams}
            ></ModuleInfoTutorials>
        </div>
    );
};

export default ModuleInfoTutorial;