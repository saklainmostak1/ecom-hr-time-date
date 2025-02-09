'use client'
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const CoountHeadTypeCreate = () => {



    const [sameBrandName, setSameBrandName] = useState([])
    const { data: brands = []
    } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_head_type/account_head_type_all`)

            const data = await res.json()
            return data
        }
    })




    const [created_by, setCreated_by] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setCreated_by(storedUserId);
        }
    }, []);

    const router = useRouter()
    const [formData, setFormData] = useState({
        account_head_type_name: '', created_by: created_by

    });


   

    const [company, setCompany] = useState([])



    const handleChange = (event) => {
        // const { name, value } = event.target;
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...formData }
        attribute[name] = value

        const company = attribute['account_head_type_name'];
        if (company) {
            setCompany('')
        }

        const existingBrand = brands.find((brand) => brand?.account_head_type_name?.toLowerCase() === formData?.account_head_type_name?.toLowerCase());
        if (!existingBrand) {
            // Show error message
            setSameBrandName("");
        }

        setFormData(attribute)

        // setFormData(prevData => ({
        //     ...prevData,
        //     [name]: value
        // }));
    };

    const user_create = (event) => {
        event.preventDefault();
        if (!formData.account_head_type_name || formData.account_head_type_name.trim() === '') {
            setCompany('Account Head Type name is required');
            // You can show this error message to the user in the UI as needed
            return;
        }

        const normalizebrandName = (name) => {
            return name?.trim().replace(/\s+/g, '');
        };


        const existingBrand = brands.find((brand) => normalizebrandName(brand.account_head_type_name.toLowerCase()) === normalizebrandName(formData.account_head_type_name.toLowerCase()));
        if (existingBrand) {
            // Show error message
            setSameBrandName("Account Head Type name already exists. Please choose a different Account Head Type name.");
            return

        }
        const schoolShift = {
            ...formData,
            created_by
        };

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_head_type/account_head_type_create`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(schoolShift),
        })
            .then((Response) => {
                Response.json();
                console.log(Response);
                if (Response.ok === true) {
                    if (typeof window !== 'undefined') {

                        sessionStorage.setItem("message", "Data saved successfully!");
                    }
                    router.push('/Admin/account_head_type/account_head_type_all');
                }
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => console.error(error));
    };

    return (
        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="card-default">
                            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">Account Head Type Create </h5>
                                <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
                                    <Link href="/Admin/account_head_type/account_head_type_all" className="btn btn-sm btn-info">Back to Account Head Type List</Link>
                                </div>
                            </div>

                            <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                            </div>
                            <div className="card-body">
                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={user_create}>

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Account Head Type Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}
                                            class="form-control form-control-sm required" id="title" placeholder="Enter Account head type Name" type="text" name="account_head_type_name" />
                                            {
                                                company && <p className='text-danger'>{company}</p>
                                            }
                                            {
                                                sameBrandName && <p className='text-danger'>{sameBrandName}</p>
                                            }
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

export default CoountHeadTypeCreate;