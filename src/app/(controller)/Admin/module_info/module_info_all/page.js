import AdminPageListA from '@/app/(view)/admin/module_info/module_info_all/page';
import React from 'react';



const AdminPageListAll = ({searchParams}) => {
  
    return (
        <div >
        <React.Suspense
          fallback={<div className="bg-amber-300 text-dark">Fallback</div>}
        >
          <AdminPageListA searchParams={searchParams} />
        </React.Suspense>
      </div>
    );
};

export default AdminPageListAll;