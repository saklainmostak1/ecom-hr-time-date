
// import { getAllUserData, getUserRoleData } from '@/api/adminPage';

// import toast from 'react-hot-toast';
// import Swal from 'sweetalert2';

// const notifyS = (text) => toast.success(text);
// const notifyE = (text) => toast.error(text);
// let count = 1;

// const handleSubmit = async (event) => {

//     event?.preventDefault();
//     const form = event?.target;
//     const email = form?.email?.value;
//     const password = form?.password?.value;

//     const loginDb = { email, password };

//     const EditValue = { email, password: 'AccountDIsable' }







//     if (email && password) {

//         getAllUserData().then(async allUser => {

//             const sUser = allUser.filter((users) => users?.email === email);
//             if (sUser[0]?.password === 'AccountDIsable') {

//                 notifyE('Your Account Disable!');
//                 count = 0;
//             }
//             else {
//                 if (count <= 3) {
//                     try {
//                         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/login`, {
//                             method: 'POST',
//                             headers: {
//                                 'Content-Type': 'application/json',
//                             },
//                             body: JSON.stringify(loginDb),
//                         });



//                         if (response.ok) {
//                             // Save email in session storage

//                             getAllUserData().then(allUser => {
//                                 const sUser = allUser.filter((users) => users?.email === email);
//                                 getAllUserData().then(allUser => {
//                                     const lUser = allUser?.filter((users) => users?.id === (sUser[0]?.id));
//                                     getUserRoleData().then(users => {
//                                         const userR = users?.filter((user) => user?.id === (lUser[0]?.role_name));
//                                         console.log((sUser[0]?.id), (lUser[0]?.full_name), (userR[0]?.role_name));

//                                         // localStorage data set         
//                                         localStorage.setItem('userId', (sUser[0]?.id));
//                                         localStorage.setItem('userName', (lUser[0]?.full_name));
//                                         localStorage.setItem('userRoleName', (userR[0]?.role_name));
//                                         localStorage.setItem('userEmail', sUser[0].email);

//                                         notifyS('Login Successful');
//                                         window.location.href = '/Admin/dashboard';
//                                     })
//                                 })
//                             })

//                         } else {
//                             notifyE('Incorrect Email OR Password');
//                             ++count
//                         }

//                     } catch (error) {
//                         console.error('Login failed:', error);
//                     }
//                 }
//                 else {
//                     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/updateLogin/${email}`, {
//                         method: 'PUT',
//                         headers: {
//                             'content-type': 'application/json'
//                         },
//                         body: JSON.stringify(EditValue)
//                     })
//                         .then(Response => Response.json())
//                         .then(data => {
//                             // console.log(data)
//                         })
//                 }
//             }
//         })

//     }

//     else {
//         notifyE('Please fill out all the form fields!');
//     }


// };

// export default handleSubmit;

// import { getAllUserData, getUserRoleData } from '@/api/adminPage';
// import axios from 'axios'; // Import axios library
// import toast from 'react-hot-toast';
// import Swal from 'sweetalert2';

// const notifyS = (text) => toast.success(text);
// const notifyE = (text) => toast.error(text);
// let count = 1;

// const handleSubmit = async (event) => {
//     event?.preventDefault();
//     const form = event?.target;
//     const email = form?.email?.value;
//     const password = form?.password?.value;

//     const loginDb = { email, password };
//     const EditValue = { email, password: 'AccountDIsable' };

//     if (email && password) {
//         getAllUserData().then(async allUser => {
//             const sUser = allUser.filter((users) => users?.email === email);
//             if (sUser[0]?.password === 'AccountDIsable') {
//                 notifyE('Your Account Disable!');
//                 count = 0;
//             } else {
//                 if (count <= 3) {
//                     try {
//                         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/login`, {
//                             method: 'POST',
//                             headers: {
//                                 'Content-Type': 'application/json',
//                             },
//                             body: JSON.stringify(loginDb),
//                         });

//                         if (response.ok) {
//                             // Send OTP to user's email
//                             await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/send-otp/email`, { email });

//                             getAllUserData().then(allUser => {
//                                 const sUser = allUser.filter((users) => users?.email === email);
//                                 getAllUserData().then(allUser => {
//                                     const lUser = allUser?.filter((users) => users?.id === (sUser[0]?.id));
//                                     getUserRoleData().then(users => {
//                                         const userR = users?.filter((user) => user?.id === (lUser[0]?.role_name));
//                                         localStorage.setItem('userId', (sUser[0]?.id));
//                                         localStorage.setItem('userName', (lUser[0]?.full_name));
//                                         localStorage.setItem('userRoleName', (userR[0]?.role_name));
//                                         localStorage.setItem('userEmail', sUser[0].email);
//                                         notifyS('Login Successful');
//                                         window.location.href = `/Admin/users/email_verification_code/${sUser[0]?.id}`;
//                                     });
//                                 });
//                             });

//                         } else {
//                             notifyE('Incorrect Email OR Password');
//                             ++count;
//                         }

//                     } catch (error) {
//                         console.error('Login failed:', error);
//                     }
//                 } else {
//                     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/updateLogin/${email}`, {
//                         method: 'PUT',
//                         headers: {
//                             'content-type': 'application/json'
//                         },
//                         body: JSON.stringify(EditValue)
//                     })
//                     .then(Response => Response.json())
//                     .then(data => {
//                         // console.log(data)
//                     });
//                 }
//             }
//         });
//     } else {
//         notifyE('Please fill out all the form fields!');
//     }
// };

// export default handleSubmit;

// import { getAllUserData, getUserRoleData } from '@/api/adminPage';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Swal from 'sweetalert2';

// const notifyS = (text) => toast.success(text);
// const notifyE = (text) => toast.error(text);
// let count = 1;

// const handleSubmit = async (event) => {
//     event?.preventDefault();
//     const form = event?.target;
//     const email = form?.email?.value;
//     const password = form?.password?.value;

//     const loginDb = { email, password };
//     const EditValue = { email, password: 'AccountDIsable' };

//     if (email && password) {
//         getAllUserData().then(async allUser => {
//             const sUser = allUser.filter((users) => users?.email === email);
//             if (sUser[0]?.password === 'AccountDIsable') {
//                 notifyE('Your Account Disable!');
//                 count = 0;
//             } else {
//                 if (count <= 3) {
//                     try {
//                         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/login`, {
//                             method: 'POST',
//                             headers: {
//                                 'Content-Type': 'application/json',
//                             },
//                             body: JSON.stringify(loginDb),
//                         });

//                         if (response.ok) {
//                             // Send OTP to user's email
//                             const emailOtp = generateOTP();
//                             await sendEmailOTP(email, emailOtp);

//                             // Send OTP to user's phone
//                             const phoneOtp = generateOTP();
//                             await sendPhoneOTP(sUser[0]?.mobile, phoneOtp);

//                             getAllUserData().then(allUser => {
//                                 const sUser = allUser.filter((users) => users?.email === email);
//                                 getAllUserData().then(allUser => {
//                                     const lUser = allUser?.filter((users) => users?.id === (sUser[0]?.id));
//                                     getUserRoleData().then(users => {
//                                         const userR = users?.filter((user) => user?.id === (lUser[0]?.role_name));
//                                         localStorage.setItem('userId', (sUser[0]?.id));
//                                         localStorage.setItem('userName', (lUser[0]?.full_name));
//                                         localStorage.setItem('userRoleName', (userR[0]?.role_name));
//                                         localStorage.setItem('userEmail', sUser[0].email);
//                                         notifyS('Login Successful');
//                                         window.location.href = `/Admin/users/email_verification_code/${sUser[0]?.id}`;
//                                     });
//                                 });
//                             });

//                         } else {
//                             notifyE('Incorrect Email OR Password');
//                             ++count;
//                         }

//                     } catch (error) {
//                         console.error('Login failed:', error);
//                     }
//                 } else {
//                     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/updateLogin/${email}`, {
//                         method: 'PUT',
//                         headers: {
//                             'content-type': 'application/json'
//                         },
//                         body: JSON.stringify(EditValue)
//                     })
//                     .then(Response => Response.json())
//                     .then(data => {
//                         // console.log(data)
//                     });
//                 }
//             }
//         });
//     } else {
//         notifyE('Please fill out all the form fields!');
//     }
// };

// const generateOTP = () => {
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     return otp.toString();
// };

// const sendEmailOTP = async (email, otp) => {
//     try {
//         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/send-otp/email`, {
//             email,

//         });
//         console.log(response.data); // Handle response if needed
//     } catch (error) {
//         console.error('Failed to send email OTP:', error);
//     }
// };
// const quickApi = '622bfee8efc9aff53';
// const sendPhoneOTP = async (mobile, otp) => {
//     try {
//         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/send-otp`, {
//             quick_api: quickApi, // Assuming you have an environment variable for quickApi
//             mobile,
//             msg: `Your OTP is ${otp}`,
//         });
//         const responseVerifyOTP = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}:5002/update/verification_code/${id}`, {
//             verifiy_codes: otp,
//             OTP: null,
//         });
//         console.log(responseVerifyOTP.data);
//         console.log(response.data); // Handle response if needed
//     } catch (error) {
//         console.error('Failed to send phone OTP:', error);
//     }
// };

// export default handleSubmit;


// import { getAllUserData, getUserRoleData } from '@/api/adminPage';
// import axios from 'axios';
// import toast from 'react-hot-toast';


// const notifyS = (text) => toast.success(text);
// const notifyE = (text) => toast.error(text);
// let count = 1;

// const handleSubmit = async (event) => {
//     event?.preventDefault();
//     const form = event?.target;
//     const email = form?.email?.value;
//     const password = form?.password?.value;

//     const loginDb = { email, password };
//     const EditValue = { email, password: 'AccountDIsable' };

//     if (email && password) {
//         getAllUserData().then(async allUser => {
//             const sUser = allUser.filter((users) => users?.email === email);
//             if (sUser[0]?.password === 'AccountDIsable') {
//                 notifyE('Your Account Disable!');
//                 count = 0;
//             } else {
//                 if (count <= 3) {
//                     try {
//                         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/login`, {
//                             method: 'POST',
//                             headers: {
//                                 'Content-Type': 'application/json',
//                             },
//                             body: JSON.stringify(loginDb),
//                         });

//                         if (response.ok) {
//                             console.log(sUser)
//                             // Send OTP based on the OTP value
//                             const otpValue = sUser[0]?.OTP;
//                             if (otpValue === '1') {
//                                 await sendPhoneOTP(sUser[0]?.mobile, generateOTP());
//                                 window.location.href = `/Admin/users/verification_otp/${sUser[0]?.id}`;
//                             } else if (otpValue === '2') {
//                                 await sendEmailOTP(email, generateOTP());
//                                 window.location.href = `/Admin/users/email_verification_code/${sUser[0]?.id}`;
//                             }
//                             else {
//                                 window.location.href = `/Admin/dashboard`;
//                             }


//                             // Continue with your existing logic
//                             getAllUserData().then(allUser => {
//                                 const sUser = allUser.filter((users) => users?.email === email);
//                                 getAllUserData().then(allUser => {
//                                     const lUser = allUser?.filter((users) => users?.id === (sUser[0]?.id));
//                                     getUserRoleData().then(users => {
//                                         const userR = users?.filter((user) => user?.id === (lUser[0]?.role_name));
//                                         localStorage.setItem('userId', (sUser[0]?.id));
//                                         localStorage.setItem('userName', (lUser[0]?.full_name));
//                                         localStorage.setItem('userRoleName', (userR[0]?.role_name));
//                                         localStorage.setItem('userEmail', sUser[0].email);
//                                         notifyS('Login Successful');
//                                     });
//                                 });
//                             });

//                         } else {
//                             notifyE('Incorrect Email OR Password');
//                             ++count;
//                         }

//                     } catch (error) {
//                         console.error('Login failed:', error);
//                     }
//                 } else {
//                     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/updateLogin/${email}`, {
//                         method: 'PUT',
//                         headers: {
//                             'content-type': 'application/json'
//                         },
//                         body: JSON.stringify(EditValue)
//                     })
//                         .then(Response => Response.json())
//                         .then(data => {
//                             // console.log(data)
//                         });
//                 }
//             }
//         });
//     } else {
//         notifyE('Please fill out all the form fields!');
//     }
// };

// const generateOTP = () => {
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     return otp.toString();
// };

// const sendEmailOTP = async (email, otp) => {
//     try {
//         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/send-otp/email`, {
//             email,

//         });
//         console.log(response.data); // Handle response if needed
//     } catch (error) {
//         console.error('Failed to send email OTP:', error);
//     }
// };

// const quickApi = '622bfee8efc9aff53';
// const sendPhoneOTP = async (mobile, otp) => {
//     try {
//         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/send-otp`, {
//             quick_api: quickApi, // Assuming you have an environment variable for quickApi
//             mobile,
//             msg: `Your OTP is ${otp}`,
//         });
//         const responseVerifyOTP = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}:5002/update/verification_code/${id}`, {
//             verifiy_codes: otp,
//             OTP: null,
//         });
//         console.log(responseVerifyOTP.data);
//         console.log(response.data); // Handle response if needed
//     } catch (error) {
//         console.error('Failed to send phone OTP:', error);
//     };


// };

// export default handleSubmit;
'use client' 
 //ismile
// import { getAllUserData } from '@/api/adminPage';
// import axios from 'axios';
// import toast from 'react-hot-toast';


// const notifyS = (text) => toast.success(text);
// const notifyE = (text) => toast.error(text);
// let count = 1;

// const handleSubmit = async (event) => {
//     event?.preventDefault();
//     const form = event?.target;
//     const email = form?.email?.value;
//     const password = form?.password?.value;

//     const loginDb = { email, password };
//     const EditValue = { email, password: 'AccountDIsable' };

//     if (email && password) {
        
//         getAllUserData().then(async allUser => {
//             const sUser = allUser.filter((users) => users?.email === email);

//             if (sUser[0]?.password === 'AccountDIsable') {
//                 notifyE('Your Account Disable!');
//                 count = 0;
//             } else {
//                 if (count <= 3) {
//                     try {
//                         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/login`, {
//                             method: 'POST',
//                             headers: {
//                                 'Content-Type': 'application/json',
//                             },
//                             body: JSON.stringify(loginDb),
//                         });

//                         if (response.ok) {
                           
//                             const rolePermissionResponses = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user/user-role-single/${sUser[0]?.role_name}`);

//                             const roleNameId = await rolePermissionResponses.json();

//                             console.log(roleNameId)





//                             if (typeof window !== 'undefined') {

//                                 localStorage.setItem('userId', sUser[0]?.id);
//                                 localStorage.setItem('userName', sUser[0]?.full_name);
//                                 localStorage.setItem('userRoleName', roleNameId?.user_role?.role_name);
//                                 localStorage.setItem('userEmail', sUser[0]?.email);
//                             }


//                             // Send OTP based on the OTP value
//                             const otpValue = sUser[0]?.OTP;
//                             const userId = sUser[0]?.id;
//                             console.log(sUser[0]?.id)

                         

//                             if (otpValue === '1') {
//                                 await sendPhoneOTP(sUser[0]?.mobile, userId, generateOTP(), roleNameId);
//                                 if (typeof window !== 'undefined') {
//                                     window.location.href = `/admin/users/verification_code/${sUser[0]?.id}`;
//                                 }
//                                 // router.push(`/admin/users/verification_code/${sUser[0]?.id}`);
//                             } else if (otpValue === '2') {
//                                 await sendEmailOTP(email, userId, generateOTP(), roleNameId);
//                                 if (typeof window !== 'undefined') {

//                                     window.location.href = `/admin/users/email_verify_code/${sUser[0]?.id}`;
//                                 }
                               
//                             }


//                             else {
//                                 // Fetch user role permissions based on role name
//                                 const rolePermissionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/users_role/users_role_permission/${sUser[0]?.role_name}`);
//                                 const rolePermissionData = await rolePermissionResponse.json();
//                                 const userDefaultPage = rolePermissionData[0]?.user_default_page;

//                                 // Fetch module info based on user id
//                                 const moduleInfoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${sUser[0]?.id}`);
//                                 const moduleInfoData = await moduleInfoResponse.json();

//                                 // Find matching user_default_page in moduleInfoData
//                                 const matchingPage = moduleInfoData?.find(info => info.id === parseFloat(userDefaultPage));
//                                 const passReset = sUser[0]?.pass_reset
//                                 if (passReset === '1') {
//                                     if (typeof window !== 'undefined') {

//                                         window.location.href = `/admin/users/password_reset/${sUser[0]?.id}`
//                                     }
//                                     // router.push(`/Admin/users/reset_password/${id}`)
                                   

//                                 }
//                                 else if (matchingPage) {

//                                     const method = matchingPage?.method_name
//                                     const controller = matchingPage?.controller_name
//                                     console.log(matchingPage)



//                                     // useEffect(() => {
//                                     if (typeof window !== 'undefined') {

//                                         sessionStorage.setItem('displayName', matchingPage?.display_name)
//                                         sessionStorage.setItem('controllerName', controller)
//                                     }
//                                     // }, [matchingPage, controller]);

//                                     if (typeof window !== 'undefined') {

//                                         window.location.href = `/Admin/${controller}/${method}`
//                                     }
                                    
                                    
//                                 }


//                                 else {
//                                     console.log(userDefaultPage)

//                                     if (typeof window !== 'undefined') {

//                                         window.location.href = `/Admin/dashboard`;
//                                     }
//                                     // Handle if no matching page is found
//                                 }

//                                 // Continue with your existing logic

//                                 notifyS('Login Successful');
//                             }

//                         } else {
//                             notifyE('Incorrect Email OR Password');
//                             ++count;
//                         }

//                     } catch (error) {
//                         console.error('Login failed:', error);
//                     }
//                 } else {
//                     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/updateLogin/${email}`, {
//                         method: 'PUT',
//                         headers: {
//                             'content-type': 'application/json'
//                         },
//                         body: JSON.stringify(EditValue)
//                     })
//                         .then(Response => Response.json())
//                         .then(data => {
//                             // console.log(data)
//                         });
//                 }
//             }
//         });
//     } else {
//         notifyE('Please fill out all the form fields!');
//     }
// };

// const generateOTP = () => {
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     return otp.toString();
// };



// const sendEmailOTP = async (email, userId, otp, roleNameId) => {



//     console.log(roleNameId?.user_role?.otp_expire)



//     const emailCodeTimeOut = parseFloat(roleNameId?.user_role?.otp_expire)

//     console.log(emailCodeTimeOut)
//     try {
//         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/send-otp/email`, {
//             email,
//             otp
//         });
//         console.log(response.data); // Handle response if needed
//         const responseVerifyOTP = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}:5002/update/verification_code_email/${userId}`, {
//             email_verifiy_code: otp,
//             OTP: 2,
//             emailCodeTimeOut
//         });
//         console.log(responseVerifyOTP.data);
//     } catch (error) {
//         console.error('Failed to send email OTP:', error);
//     }
// };

// const quickApi = '622bfee8efc9aff53';

// const sendPhoneOTP = async (mobile, userId, otp, roleNameId) => {
//     const emailCodeTimeOut = parseFloat(roleNameId?.user_role?.otp_expire)
//     try {
//         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/send-otp`, {
//             quick_api: quickApi,
//             mobile,
//             msg: `Your OTP is ${otp}`,
//         });
//         const responseVerifyOTP = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}:5002/update/verification_code/${userId}`, {
//             verifiy_codes: otp,
//             OTP: 1,
//             emailCodeTimeOut
//         });
//         console.log(responseVerifyOTP.data);
//         console.log(response.data); // Handle response if needed
//     } catch (error) {
//         console.error('Failed to send phone OTP:', error);
//     };
// };

// export default handleSubmit;

import { getAllUserData } from '@/api/adminPage';
import axios from 'axios';
import toast from 'react-hot-toast';

const notifyS = (text) => toast.success(text);
const notifyE = (text) => toast.error(text);
let count = 1;

const handleSubmit = async (event) => {
    event?.preventDefault();
    const form = event?.target;
    const email = form?.email?.value;
    const password = form?.password?.value;

    const loginDb = { email, password };
    const EditValue = { email, password: 'AccountDIsable' };

    if (email && password) {
        getAllUserData().then(async allUser => {
            const sUser = allUser.filter((users) => users?.email === email);

            if (sUser[0]?.password === 'AccountDIsable') {
                notifyE('Your Account Disable!');
                count = 0;
            } else {
                if (count <= 3) {
                    try {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/login`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(loginDb),
                        });

                        if (response.ok) {
                            const rolePermissionResponses = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user/user-role-single/${sUser[0]?.role_name}`);
                            const roleNameId = await rolePermissionResponses.json();
                            console.log(roleNameId);

                            if (typeof window !== 'undefined') {
                                localStorage.setItem('userId', sUser[0]?.id);
                                localStorage.setItem('userName', sUser[0]?.full_name);
                                localStorage.setItem('userRoleName', roleNameId?.user_role?.role_name);
                                localStorage.setItem('userEmail', sUser[0]?.email);
                            }

                            const otpValue = sUser[0]?.OTP;
                            const userId = sUser[0]?.id;
                            console.log(sUser[0]?.id);

                            if (otpValue === '1') {
                                await sendPhoneOTP(sUser[0]?.mobile, userId, generateOTP(), roleNameId);
                                if (typeof window !== 'undefined') {
                                    window.location.href = `/admin/users/verification_code/${sUser[0]?.id}`;
                                }
                            } else if (otpValue === '2') {
                                await sendEmailOTP(email, userId, generateOTP(), roleNameId);
                                if (typeof window !== 'undefined') {
                                    window.location.href = `/admin/users/email_verify_code/${sUser[0]?.id}`;
                                }
                            } else {
                                const rolePermissionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/users_role/users_role_permission/${sUser[0]?.role_name}`);
                                const rolePermissionData = await rolePermissionResponse.json();
                                const userDefaultPage = rolePermissionData[0]?.user_default_page;

                                const moduleInfoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${sUser[0]?.id}`);
                                const moduleInfoData = await moduleInfoResponse.json();

                                const matchingPage = moduleInfoData?.find(info => info.id === parseFloat(userDefaultPage));
                                const passReset = sUser[0]?.pass_reset;
                                if (passReset === '1') {
                                    if (typeof window !== 'undefined') {
                                        window.location.href = `/admin/users/password_reset/${sUser[0]?.id}`;
                                    }
                                } else if (matchingPage) {
                                    const method = matchingPage?.method_name;
                                    const controller = matchingPage?.controller_name;
                                    console.log(matchingPage);

                                    if (typeof window !== 'undefined') {
                                        sessionStorage.setItem('displayName', matchingPage?.display_name);
                                        sessionStorage.setItem('controllerName', controller);
                                        window.location.href = `/Admin/${controller}/${method}`;
                                    }
                                } else {
                                    console.log(userDefaultPage);
                                    if (typeof window !== 'undefined') {
                                        window.location.href = `/Admin/dashboard`;
                                    }
                                }

                                notifyS('Login Successful');
                            }
                        } else {
                            notifyE('Incorrect Email OR Password');
                            ++count;
                        }
                    } catch (error) {
                        console.error('Login failed:', error);
                    }
                } else {
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/updateLogin/${email}`, {
                        method: 'PUT',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify(EditValue),
                    })
                    .then((Response) => Response.json())
                    .then((data) => {
                        // console.log(data);
                    });
                }
            }
        });
    } else {
        notifyE('Please fill out all the form fields!');
    }
};

const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
};

const sendEmailOTP = async (email, userId, otp, roleNameId) => {
    console.log(roleNameId?.user_role?.otp_expire);
    const emailCodeTimeOut = parseFloat(roleNameId?.user_role?.otp_expire);
    console.log(emailCodeTimeOut);
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/send-otp/email`, {
            email,
            otp,
        });
        console.log(response.data); // Handle response if needed
        const responseVerifyOTP = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}:5002/update/verification_code_email/${userId}`, {
            email_verifiy_code: otp,
            OTP: 2,
            emailCodeTimeOut,
        });
        console.log(responseVerifyOTP.data);
    } catch (error) {
        console.error('Failed to send email OTP:', error);
    }
};

const quickApi = '622bfee8efc9aff53';

const sendPhoneOTP = async (mobile, userId, otp, roleNameId) => {
    const emailCodeTimeOut = parseFloat(roleNameId?.user_role?.otp_expire);
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/send-otp`, {
            quick_api: quickApi,
            mobile,
            msg: `Your OTP is ${otp}`,
        });
        const responseVerifyOTP = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}:5002/update/verification_code/${userId}`, {
            verifiy_codes: otp,
            OTP: 1,
            emailCodeTimeOut,
        });
        console.log(responseVerifyOTP.data);
        console.log(response.data); // Handle response if needed
    } catch (error) {
        console.error('Failed to send phone OTP:', error);
    }
};

export default handleSubmit;
