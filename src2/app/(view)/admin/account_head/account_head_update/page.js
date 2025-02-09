'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const AccountHeadUpdate = ({ id }) => {


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
        account_type_id: '',
        account_head_name: '', opening_balance: '',
        modified_by: userId
    });

    const [sameBrandName, setSameBrandName] = useState([])
    const { data: brands = [],  } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_head/account_head_all`);
            const data = await res.json();
            // Filter out the brand with id 
            const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return filteredBrands;
        }
    });



    const { data: accountHeadTypeSingle, isLoading, refetch } = useQuery({
        queryKey: ['accountHeadTypeSingle', id],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_head/account_head_all/${id}`);
            const data = await res.json();
            return data;
        }
    });



    const { data: accountHeadType = []
    } = useQuery({
        queryKey: ['accountHeadType'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_head_type/account_head_type_all`)

            const data = await res.json()
            return data
        }
    })


    useEffect(() => {
        if (accountHeadTypeSingle && accountHeadTypeSingle[0]) {
            const { account_type_id,
                account_head_name, opening_balance, } = accountHeadTypeSingle[0];
            setFormData({
                account_type_id,
                account_head_name, opening_balance,
                modified_by: userId
            });
        }
    }, [accountHeadTypeSingle, userId]);




    const [account_head_name, setAccount_head_name] = useState([])
    const [account_type_id, setAccount_type_id] = useState([])
    const [opening_balance, setOpening_balance] = useState([])

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...formData }
        attribute[name] = value

     
     
        
        const account_head_name = attribute['account_head_name'];
        if (account_head_name) {
            setAccount_head_name('')
        }
        const existingBrand = brands.find((brand) => brand?.account_head_name?.toLowerCase() === formData?.account_head_name?.toLowerCase());
        if (!existingBrand) {
            // Show error message
            setSameBrandName("");
        }
        const account_type_id = attribute['account_type_id'];
        if (account_type_id) {
            setAccount_type_id('')
        }
        const opening_balance = attribute['opening_balance'];
        if (opening_balance) {
            setOpening_balance('')
        }

        setFormData(attribute)
        // const { name, value } = event.target;
        // setFormData(prevData => ({
        //     ...prevData,
        //     [name]: value
        // }));
    };

    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.account_head_name ) {
            setAccount_head_name('Account Head name is required');
            // You can show this error message to the user in the UI as needed
            return;
        }
        if (!formData.account_type_id ) {
            setAccount_type_id('Account Head Type name is required');
            // You can show this error message to the user in the UI as needed
            return;
        }
        if (!formData.opening_balance ) {
            setOpening_balance('Opening Balance  is required');
            // You can show this error message to the user in the UI as needed
            return;
        }

        const normalizebrandName = (name) => {
            return name?.trim().replace(/\s+/g, '');
        };


        const existingBrand = brands.find((brand) => normalizebrandName(brand.account_head_name.toLowerCase()) === normalizebrandName(formData.account_head_name.toLowerCase()));
        if (existingBrand) {
            // Show error message
            setSameBrandName("Account Head name already exists. Please choose a different Account Head name.");
            return

        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_head/account_head_edit/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log(data); 
            if (data) {
                sessionStorage.setItem("message", "Data Update successfully!");
                router.push('/Admin/account_head/account_head_all');
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
                                <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">Account Head  Edit </h5>
                                <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
                                    <Link href="/Admin/account_head/account_head_all" className="btn btn-sm btn-info">Back to Account Head  List</Link>
                                </div>
                            </div>

                            <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                            </div>
                            <div className="card-body">
                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={handleSubmit}>

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Account Head Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}
                                            value={formData.account_head_name}
                                            class="form-control form-control-sm required" id="title" placeholder="Enter Account Head Type Name" type="text" name="account_head_name" />
                                        {
                                            account_head_name && <p className='text-danger m-0'>{account_head_name}</p>
                                        }
                                        {
                                            sameBrandName && <p className='text-danger m-0'>{sameBrandName}</p>
                                        }
                                    </div></div>
                                    <div class="form-group row">
                                        <label class="control-label font-weight-bold col-md-3">Account Head Type :</label>
                                        <div class="col-md-6">

                                            <select
                                             onChange={handleChange}
                                             value={formData.account_type_id}
                                            required="" name="account_type_id" class="form-control form-control-sm trim " id="account_type_id" placeholder="Enter Account Type Id">
                                                <option value="">Select Account Head Type</option>
                                                {
                                                    accountHeadType.map(accountHead =>
                                                        <>

                                                            <option value={accountHead.id}>{accountHead.account_head_type_name}</option>
                                                        </>
                                                    )
                                                }
                                            </select>
                                            {
                                            account_type_id && <p className='text-danger m-0'>{account_type_id}</p>
                                        }

                                        </div>
                                    </div>
                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Opening Balance::<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}
                                            value={formData.opening_balance}
                                            class="form-control form-control-sm required" id="title" placeholder="Enter Account Head Type Name" type="text" name="opening_balance" />
                                        {
                                            opening_balance && <p className='text-danger m-0'>{opening_balance}</p>
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

export default AccountHeadUpdate;