import CopyColor from '@/app/(view)/admin/color/color_copy/page';
import React from 'react';

const ColorCopy = ({ params }) => {
    const [id] = params.segments || []
    console.log(id)
    return (
        <div>
            <CopyColor
                id={id}
            ></CopyColor>
        </div>
    );
};

export default ColorCopy;