import BrandList from '@/app/(view)/admin/brand/brand_all/page';
import React from 'react';

const BrandAll = ({ searchParams }) => {
    return (
        // <div>
        //     <BrandList></BrandList>
        // </div>
        <div >
            {/* <React.Suspense
                fallback={<div className="bg-amber-300 text-dark">Fallback</div>}
            > */}
                <BrandList searchParams={searchParams} />
            {/* </React.Suspense> */}
        </div>
    );
};

export default BrandAll;