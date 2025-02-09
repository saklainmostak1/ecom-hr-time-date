'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const GenderCopy = ({ id }) => {

    const [page_group, setPage_group] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pageGroup') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('pageGroup');
            setPage_group(storedUserId);
        }
    }, []);

    const [userId, setUserId] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setUserId(storedUserId);
        }
    }, []);

    const [formData, setFormData] = useState({
        gender_name: '', gender_code: '',
        created_by: userId
    });

    const { data: genderSingle, isLoading, refetch } = useQuery({
        queryKey: ['genderSingle', id],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/gender/gender_all/${id}`);
            const data = await res.json();
            return data;
        }
    });

    useEffect(() => {
        if (genderSingle && genderSingle[0]) {
            const { gender_name, gender_code } = genderSingle[0];
            setFormData({
                gender_name, gender_code, created_by: userId
            });
        }
    }, [genderSingle, userId]);

    console.log(genderSingle);




    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/gender/gender_create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log(data); // Handle response data or success message
        } catch (error) {
            console.error('Error updating school shift:', error);
            // Handle error or show an error message to the user
        }
    };
    console.log(genderSingle)
    return (
        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="card-default">
                            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">Gender Create </h5>
                                <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
                                    <Link href="/Admin/gender/gender_all" className="btn btn-sm btn-info">Back to Gender List</Link>
                                </div>
                            </div>

                            <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                            </div>
                            <div className="card-body">
                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={handleSubmit}>

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Gender Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}
                                            value={formData.gender_name}
                                            class="form-control form-control-sm required" id="title" placeholder="Enter Gender Name" type="text" name="gender_name" />
                                    </div></div>
                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Gender Code:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}
                                            value={formData.gender_code}
                                            class="form-control form-control-sm required" id="title" placeholder="Enter Gender Code" type="text" name="gender_code" />
                                    </div></div>

                                    <div className="form-group row">
                                        <div className="offset-md-3 col-sm-6">
                                            <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenderCopy;