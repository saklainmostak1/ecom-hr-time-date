import ModelList from '@/app/(view)/admin/model/model_list/page';
import React from 'react';

const ModelAll = ({searchParams}) => {
    return (
        <div>
            {/* <ModelList></ModelList> */}
            <ModelList searchParams={searchParams} />
        </div>
    );
};

export default ModelAll;