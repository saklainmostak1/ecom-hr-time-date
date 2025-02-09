import WebFooter from '@/app/(view)/(web)/web-layout/footer/page';
import WebHeader from '@/app/(view)/(web)/web-layout/header/page';
import React from 'react';



const WebTemplate = ({ children }) => {
    
    return (
        <div>
            <WebHeader></WebHeader>
            {children}
            <WebFooter></WebFooter>
        </div>
    );
};

export default WebTemplate;