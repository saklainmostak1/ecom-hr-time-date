'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import sha1 from 'crypto-js/sha1';
import { useRouter } from 'next/navigation';

const PassReset = ({ params }) => {

    const [id] = params.segments || []


    const [error, setError] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPasswordError, setCurrentPasswordError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const { data: changePassword = [], isLoading, refetch } = useQuery({
        queryKey: ['changePassword'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user/allUser/${id}`);
            const data = await res.json();
            return data;
        }
    });

    const router = useRouter()

    const hashedPassword = changePassword[0]?.password
    const validateFields = () => {
        let isValid = true;

        // if (!currentPassword) {
        //     setCurrentPasswordError('Current password is required');
        //     isValid = false;
        // } else {
        //     setCurrentPasswordError('');
        // }

        if (!newPassword) {
            setNewPasswordError('New password is required');
            isValid = false;
        } else {
            setNewPasswordError('');
        }

        if (!confirmPassword) {
            setConfirmPasswordError('Confirm password is required');
            isValid = false;
        } else {
            setConfirmPasswordError('');
        }

        return isValid;
    };
    console.log(hashedPassword)
    // Function to handle password reset
    const users_reset_password = async () => {


        if (!validateFields()) {
            return;
        }

        // const currentPasswordHash = sha1(currentPassword).toString();

        // console.log(currentPasswordHash)
        // console.log(hashedPassword)
        // if (currentPasswordHash !== hashedPassword) {
        //     setError('Current password is incorrect');
        //     return;
        // } else {
        //     setError('');
        // }

        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match');
            return;
        } else {
            setError('');
        }

        try {
            const response = await fetch(`http://localhost:5002/reset-password/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword }),
            });

            if (response.ok) {


                if (response.ok === true) {
                    // sessionStorage.setItem("message", "Password Change successfully!");
                    router.push('/Admin/dashboard')
                }

                console.log(response)
                console.log('Password reset successfully');
            } else {
                console.error('Failed to reset password');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCurrentPasswordChange = (e) => {
        setCurrentPassword(e.target.value);
        setCurrentPasswordError('');
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
        setNewPasswordError('');
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setConfirmPasswordError('');
    };

    return (
        
        <div className=" container mt-5 mx-auto border-primary border-0" style={{ width: '700px' }}>
            <div className="card-header py-1 custom-card-header clearfix text-white" style={{ background: '#4267b2' }}>
                <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Reset Your Password</h5>
                {/* <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                    <a href="/Admin/users/users_all?page_group=system_setup" className="btn btn-sm btn-info">Back to Users List</a>
                </div> */}
            </div>

            <div className="card-body">
                <form className="" method="post" autoComplete="off">
                    {/* <div className="form-group row">
                        <label className="col-form-label col-md-3"><strong>Current Password:</strong></label>
                        <div className="col-md-6">
                            <input required type="password" value={currentPassword} onChange={handleCurrentPasswordChange} className="form-control form-control-sm required current_password" id="current_password" placeholder="Enter Current Password" />
                            {currentPasswordError && <div className="text-danger">{currentPasswordError}</div>}
                            {error && <div className="text-danger">{error}</div>}
                        </div>
                    </div> */}
                    <div className="form-group row">
                        <label className="col-form-label col-md-3"><strong>New Password:</strong></label>
                        <div className="col-md-6">
                            <input type="password" required value={newPassword} onChange={handleNewPasswordChange} className="form-control form-control-sm required password" placeholder="Enter New Password" />
                            {newPasswordError && <div className="text-danger">{newPasswordError}</div>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-form-label col-md-3"><strong>Confirm New Password:</strong></label>
                        <div className="col-md-6">
                            <input type="password" required className="form-control form-control-sm required matches_password" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder="Enter Confirm Password" />
                            {confirmPasswordError && <div className="text-danger">{confirmPasswordError}</div>}

                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="offset-md-3 col-sm-6">
                            <input type="button" onClick={users_reset_password} className="btn btn-sm btn-success" value="Submit" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PassReset;