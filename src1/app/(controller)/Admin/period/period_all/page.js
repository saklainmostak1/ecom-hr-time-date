import PeriodList from '@/app/(view)/admin/period/period_list/page';
import React from 'react';

const PeriodAll = ({searchParams}) => {
    return (
        <div>
            <PeriodList searchParams={searchParams}></PeriodList>
        </div>
    );
};

export default PeriodAll;