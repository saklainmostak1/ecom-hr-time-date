import HolidayCategoryList from '@/app/(view)/admin/holiday_category/holiday_category_list/page';
import React from 'react';

const ListHolidayCategory = ({searchParams}) => {
    return (
        <div>
            <HolidayCategoryList
            searchParams={searchParams}
            ></HolidayCategoryList>
        </div>
    );
};

export default ListHolidayCategory;