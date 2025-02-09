import SliderList from '@/app/(view)/admin/slider/slider_list/page';
import React from 'react';

const ListSlider = ({searchParams}) => {
    return (
        <div>
            <SliderList
            searchParams={searchParams}
            ></SliderList>
        </div>
    );
};

export default ListSlider;