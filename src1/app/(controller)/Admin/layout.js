'use client' 
 //ismile
import React, { useEffect, useState } from 'react';
import '../../(view)/admin/adminStyle.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminSidebar from '@/app/(view)/admin_layout/sidebar/page';
import { useRouter } from 'next/navigation';
import Login from './login/page';
import { useFileSystemPublicRoutes } from '../../../../next.config';







const AdminTemplate = ({ children }) => {


    const router = useRouter()

    const [isSidebarActive, setSidebarActive] = useState(false);

    const toggleSidebar = () => {
        setSidebarActive(!isSidebarActive);
    };




    const [userId, setuserId] = useState(() => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem('userId') || '';
        }
        return '';
      });
    
      useEffect(() => {
        console.log(useFileSystemPublicRoutes, 'useFileSystemPublicRoutes')
        if (typeof window !== 'undefined') {
          const storedUserId = localStorage.getItem('userId');
          setuserId(storedUserId);
        }
      }, []);
 



    return (
        // <div>
        //     {/* class="wrapper" */}
        //     <div>

                <div id='wrapper' className={`wrapper ${isSidebarActive ? 'sidebar-active' : ''}`}>
                     {userId ? ( 
                        <AdminSidebar
                            isSidebarActive={isSidebarActive}
                            child={children}
                            toggleSidebar={toggleSidebar}
                        />
                       ) : <>
                        <Login></Login>
                    </>}   
                </div>
        //     </div>

        // </div>
    );
};

export default AdminTemplate;


 // else if (passReset === '1') {

        
        //     // router.push(`/Admin/users/reset_password/${userId}`);
        //      router.push(`/admin/users/password_reset/${userId}`)
          
        // }
        // else if (verifyCode === '1') {

        
        //     // router.push(`/admin/users/verification_code/${userId}`);
        //      router.push(`/admin/users/password_reset/${userId}`)
          
        // }
        // else if (verifyCode === '2') {

        
        //     router.push(`/admin/users/email_verify_code/${userId}`);
        //      // router.push(`/admin/users/password_reset/${id}`)
          
        // }
        // else if(defaultPage !== ''){
        //     router.push(`/Admin/${controller}/${method}`);
        // }