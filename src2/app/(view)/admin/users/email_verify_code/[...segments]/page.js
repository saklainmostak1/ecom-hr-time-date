"use client"

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import CountDown from './page2';

const EmailVerifyCode = ({ params }) => {



    const [id] = params.segments || []

    const router = useRouter()

    console.log(id, 'user')

    const userInfo = localStorage?.getItem('userId')
    console.log(typeof (userInfo))

    const { data: singleUsers = [] } = useQuery({
        queryKey: ['singleUsers'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user/allUser/${id}`);
            const data = await res.json();

            return data;
        },
    });

    console.log(singleUsers[0]?.email)


    const userEmail = singleUsers[0]?.email
    console.log(userEmail)

    const roleName = parseFloat(singleUsers[0]?.role_name)

    console.log(roleName)

    // const { data: pass_reset = [] } = useQuery({
    //     queryKey: ['pass_reset'],
    //     queryFn: async () => {
    //         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user/user-role-single/${roleName}`);
    //         const data = await res.json();

    //         return data;
    //     },
    // });

    const [pass_reset, setPass_reset] = useState([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user/user-role-single/${roleName}`)
            .then(res => res.json())
            .then(data => setPass_reset(data))

    }, [roleName])

    // console.log(pass_reset?.user_role?.otp_expire, '868547687')

    // const otp_expire = pass_reset?.user_role?.otp_expire
    // console.log(typeof(otp_expire))
 
    // const otpTimeLimite = 2
    // const otpTimeLimite =  parseInt(pass_reset?.user_role?.otp_expire)
    
    const otp_expire = pass_reset?.user_role?.otp_expire;
    console.log(typeof (otp_expire));
    
    
    let otpTimeLimite = pass_reset?.user_role?.otp_expire;
   

    

    const { data: roleDefaultPage = []
    } = useQuery({
        queryKey: ['roleDefaultPage'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/users_role/users_role_permission/${roleName}`)

            const data = await res.json()
            return data
        }
    })

    console.log(roleDefaultPage)

    const defaultPage = roleDefaultPage[0]?.user_default_page


    const { data: moduleInfo = []
    } = useQuery({
        queryKey: ['moduleInfo'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${id}`)

            const data = await res.json()
            return data
        }
    })

    console.log(moduleInfo)

    const matchingIds = moduleInfo.filter(info => info.id === parseFloat(defaultPage))

    console.log(matchingIds[0]?.controller_name)
    console.log(matchingIds[0]?.method_name)

    const method = matchingIds[0]?.method_name
    const controller = matchingIds[0]?.controller_name


    console.log(`/Admin/${controller}/${method}`)



    const [error, setError] = useState('');

    const { data: singleUser = [], isLoading, refetch } = useQuery({
        queryKey: ['singleUser'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user/allUser/${id}`);
            const data = await res.json();

            return data;
        },
    });
    console.log(singleUser)

    const verifyCode = singleUser[0]?.email_verifiy_code




    const [enteredOtp, setEnteredOtp] = useState('');

    const handleOtpChange = (event) => {
        setEnteredOtp(event.target.value);
    };



    const user_logout = async () => {

        if (verifyCode === enteredOtp) {
            try {
                // Clear the verifyCode by making a PUT request
                const responseVerifyOTP = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}:5002/update/verification_code_email/${id}`, {
                    email_verifiy_code: null,
                    OTP: null,
                    // emailCodeTimeOut
                });

                console.log(responseVerifyOTP);

                // Check if the update was successful
                if (responseVerifyOTP.status === 200) {
                    console.log("Verification successful. verifyCode cleared.");
                    // Perform additional actions if needed


                    // localStorage.removeItem('userEmail');
                    // localStorage.removeItem('userId');
                    // localStorage.removeItem('userName');
                    // localStorage.removeItem('userRoleName');
                    // localStorage.removeItem('pageGroup');
                    // sessionStorage.removeItem('controllerName')
                    if (singleUsers[0]?.pass_reset === '1') {
                        // router.push(`/Admin/users/reset_password/${id}`)
                        router.push(`/admin/users/password_reset/${id}`)
                    }
                    else {

                        router.push(`/Admin/dashboard`)
                    }
                    // router.push(`/Admin/${controller}/${method}`)


                    // Example: Redirect to a new page
                    // router.push('/some-page');
                } else {

                    console.log("Failed to clear verifyCode. Server returned an error.");
                    // Handle the error accordingly
                }
            } catch (error) {

                console.error("Error updating verification code:", error);
                // Handle the error accordingly
            }
        } else {
            // Codes don't match, handle accordingly
            console.log("Verification failed");
            setError('Code Does Not Match')
        }

    }



    const email = singleUsers[0]?.email;
    const maskedEmail = email?.replace(/^(.)(.*)(.@.*\..*)$/, (match, firstChar, middleChars, domain) => {
        const maskedMiddleChars = middleChars.replace(/./g, '*');
        return firstChar + maskedMiddleChars + domain;
    });

    const emails = singleUsers[0]?.email;
    const maskedEmails = emails?.replace(/(?<=.).(?=.*@)/g, '*');






    return (

        <div className=" container mx-auto" style={{ width: '700px' }}>
            <div class="alert alert-warning mb-0  mt-4 text-danger font-weight-bold text-center" role="alert">Your Verification Code Send To This ( {maskedEmail} ) Email</div>
            <div class="alert alert-warning mb-0  mt-4 text-danger font-weight-bold text-center" role="alert">Your Verification Code Send To This ( {maskedEmails} ) Email</div>

            <div className="bg-light mt-3">
                <div className="card-header h5 text-dark text-center">Verification code</div>
                <div className="card-body">
                    <p className="card-text py-2">Enter Your 6 Digit Verification Code</p>
                    <div className="my-3 d-flex justify-content-center">
                        <div className="d-lg-flex d-md-flex  ">

                            <div className="login-form">
                                <form method="post" autoComplete="off">
                                    <div className="form-group log-status">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="otp"
                                            placeholder="Enter Verification Code"
                                            value={enteredOtp}
                                            onChange={handleOtpChange}

                                        />

                                    </div>
                                    {error && <p style={{ color: 'red' }}>{error}</p>}
                                    <div>
                                        <CountDown
                                            otpTimeLimite={otpTimeLimite}
                                            userEmail={userEmail}
                                            id={id}
                                        ></CountDown>
                                    </div>
                                    <button
                                        onClick={user_logout}
                                        type="button"
                                        className="btn text-white btn btn-primary"
                                        style={{ backgroundColor: 'rgb(43, 52, 103)' }}
                                    >
                                        Submit
                                    </button>
                                </form>
                            </div>



                        </div>
                    </div>


                </div>
            </div>
        </div>

    );
};

export default EmailVerifyCode;

