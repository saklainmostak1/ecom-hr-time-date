'use client'
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const AccountHeadTypeUpdate = ({ id }) => {



    const [sameBrandName, setSameBrandName] = useState([])
    const { data: brands = [],  } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_head_type/account_head_type_all`);
            const data = await res.json();
            // Filter out the brand with id 
            const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return filteredBrands;
        }
    });

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
        account_head_type_name: '',
        modified_by: userId
    });

    const { data: accountHeadTypeSingle, isLoading, refetch } = useQuery({
        queryKey: ['accountHeadTypeSingle', id],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_head_type/account_head_type_all/${id}`);
            const data = await res.json();
            return data;
        }
    });

    useEffect(() => {
        if (accountHeadTypeSingle && accountHeadTypeSingle[0]) {
            const { account_head_type_name } = accountHeadTypeSingle[0];
            setFormData({
                account_head_type_name, modified_by: userId
            });
        }
    }, [accountHeadTypeSingle, userId]);



    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            total: parseFloat(prevData.basic)
        }));
    }, [formData.basic]);
    const [company, setCompany] = useState([])

    const router = useRouter()

    const handleChange = (event) => {
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
        // const { name, value } = event.target;
        // setFormData(prevData => ({
        //     ...prevData,
        //     [name]: value
        // }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            setSameBrandName("Account Head type name already exists. Please choose a different Account Head type name.");
            return

        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_head_type/account_head_type_edit/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log(data); 
            if(data){

                if (typeof window !== 'undefined') {
    
                    sessionStorage.setItem("message", "Data Update successfully!");
                }
                router.push('/Admin/account_head_type/account_head_type_all');
            }
            // Handle response data or success message
        } catch (error) {
            console.error('Error updating school shift:', error);
            // Handle error or show an error message to the user
        }
    };
    console.log(accountHeadTypeSingle)
    return (
        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="card-default">
                            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">Account Head Type Edit </h5>
                                <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
                                    <Link href="/Admin/account_head_type/account_head_type_all" className="btn btn-sm btn-info">Back to Account Head Type List</Link>
                                </div>
                            </div>

                            <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                            </div>
                            <div className="card-body">
                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={handleSubmit}>

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Account Head Type Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}
                                            value={formData.account_head_type_name}
                                            class="form-control form-control-sm required" id="title" placeholder="Enter Account Head Type Name" type="text" name="account_head_type_name" />
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

export default AccountHeadTypeUpdate;