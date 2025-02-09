'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';


const LoanAuthorityUpdate = ({ id }) => {


    const { data: brands = [], isLoading, refetch } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/loan_authority/loan_authority_all`);
            const data = await res.json();
            // Filter out the brand with id 
            // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return data;
        }
    });
    const [created, setCreated] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setCreated(storedUserId);
        }
    }, []);

    console.log(brands);

    const [assetTypeName, setAssetType] = useState({
        name: '',
        status: '',
        email: '',
        contact_number: '',
        amount: '',
        address: '',
        note: '',
        modified_by: created
    });


    const [brandSingle, setBrandSingle] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/loan_authority/loan_authority_all/${id}`)
            .then(Response => Response.json())
            .then(data => setBrandSingle(data))
    }, [id])

    console.log(brandSingle[0])

    useEffect(() => {

        setAssetType({
            name: brandSingle[0]?.name || '',
            email: brandSingle[0]?.email || '',
            contact_number: brandSingle[0]?.contact_number || '',
            amount: brandSingle[0]?.amount || '',
            address: brandSingle[0]?.address || '',
            status: brandSingle[0]?.status || '',
            note: brandSingle[0]?.note || '',
            modified_by: created
        });

    }, [brandSingle, created]);

    const [sameBrandName, setSameBrandName] = useState([])
    const [brandName, setBrandName] = useState('')
    const [error, setError] = useState([]);
    const [email, setEmail] = useState('');
    const [contact_number, setContact_number] = useState('');
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');

    const brand_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...assetTypeName }
        attribute[name] = value
        setAssetType(attribute)
        // setSameBrandName('')
        const existingBrand = brands.find((brand) => brand?.name?.toLowerCase() === assetTypeName?.name?.toLowerCase());
        if (!existingBrand) {
            // Show error message
            setSameBrandName("");
        }
        const status = attribute['status'];
        if (status) {
            setError(""); // Clear the error message
        }
        const email = attribute['email'];
        if (email) {
            setEmail(""); // Clear the error message
        }
        const contact_number = attribute['contact_number'];
        if (contact_number) {
            setContact_number(""); // Clear the error message
        }
        const amount = attribute['amount'];
        if (amount) {
            setAmount(""); // Clear the error message
        }
        const address = attribute['address'];
        if (address) {
            setAddress(""); // Clear the error message
        }
        const brandName = attribute['name']
        if (!brandName || brandName === '') {
            setBrandName('Please enter a Asset Type name.');
        } else {
            setBrandName("");
        }

    };

    const router = useRouter()

    const asset_type_create = (e) => {
        e.preventDefault()
        if (!assetTypeName.name) {
            setBrandName('Please enter a  name.');
            return; // Prevent further execution
        }
        if (!assetTypeName.status) {
            setError('Please select a status.');
            return; // Prevent further execution
        }
        if (!assetTypeName.email) {
            setEmail('Please Enter A Email.');
            return; // Prevent further execution
        }
        if (!assetTypeName.contact_number) {
            setContact_number('Please Enter A Contact Number.');
            return; // Prevent further execution
        }
        if (!assetTypeName.amount) {
            setAmount('Please Enter A Amount.');
            return; // Prevent further execution
        }
        if (!assetTypeName.address) {
            setAddress('Please Enter A Adress.');
            return; // Prevent further execution
        }

        const existingBrand = brands.find((brand) => brand.name.toLowerCase() === assetTypeName.name.toLowerCase());
        if (existingBrand) {
            // Show error message
            setSameBrandName("Asset  name already exists. Please choose a different  name.");

        }

        else {

            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/loan_authority/loan_authority_edit/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(assetTypeName)
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data) {
                        sessionStorage.setItem("message", "Data Update successfully!");
                        router.push('/Admin/loan_authority/loan_authority_all?page_group=asset_management')

                    }
                    // Handle success or show a success message to the user
                })
                .catch(error => {
                    console.error('Error updating brand:', error);
                    // Handle error or show an error message to the user
                });
        }

    };




    const [page_group, setPageGroup] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pageGroup') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('pageGroup');
            setPageGroup(storedUserId);
        }
    }, []);





    const [status, setStatus] = useState([]);
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
            .then(res => res.json())
            .then(data => setStatus(data))
    }, [])


    console.log(assetTypeName)

    return (
        // col-md-12
        // <div class=" body-content bg-light">
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>
                        <div class=" border-primary shadow-sm border-0">
                            <div class="card-header py-1  custom-card-header clearfix bg-gradient-primary text-white">
                                <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Update Loan Othority</h5>
                                <div class="card-title font-weight-bold mb-0 card-header-color float-right">
                                    <Link href={`/Admin/loan_authority/loan_authority_all?page_group=${page_group}`} class="btn btn-sm btn-info">Back Loan Othority List</Link></div>
                            </div>
                            <form action="" onSubmit={asset_type_create}>

                                <div class="card-body">


                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="name" value={assetTypeName.name} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter  Name'
                                                maxLength={256}
                                            />
                                            {
                                                sameBrandName && (
                                                    <p className='text-danger'>{sameBrandName}</p>
                                                )
                                            }
                                            {
                                                brandName && (
                                                    <p className='text-danger'>{brandName}</p>
                                                )
                                            }
                                            {assetTypeName?.name?.length > 255 && (
                                                <p className='text-danger'>Brand name cannot more than 255 characters.</p>
                                            )}

                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Email:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="email" value={assetTypeName.email} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter Email adress'

                                            />

{
                                                email && (
                                                    <p className='text-danger'>{email}</p>
                                                )
                                            }
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Contact Number:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <input type="number" name="contact_number" value={assetTypeName.contact_number} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter contact number'

                                            />
{
                                                contact_number && (
                                                    <p className='text-danger'>{contact_number}</p>
                                                )
                                            }

                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Amount:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <input type="number" name="amount" value={assetTypeName.amount} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter amount'

                                            />
{
                                                amount && (
                                                    <p className='text-danger'>{amount}</p>
                                                )
                                            }

                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Address:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="address" value={assetTypeName.address} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter address'

                                            />

{
                                                address && (
                                                    <p className='text-danger'>{address}</p>
                                                )
                                            }
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Description:</strong></label>
                                        <div className='form-group col-md-6'>

                                            <textarea
                                                value={assetTypeName.note} onChange={brand_input_change}
                                                name="note"
                                                className="form-control form-control-sm"
                                                placeholder="Enter note"
                                                rows={5}
                                                cols={73}
                                                // style={{ width: '550px', height: '100px' }}
                                                maxLength={500}
                                            ></textarea>
                                            <small className="text-muted">{assetTypeName.note.length} / 500</small>
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <select
                                                value={assetTypeName.status} onChange={brand_input_change}
                                                name='status'

                                                class="form-control form-control-sm " placeholder="Enter Role Name">
                                                <option value=''>Select</option>
                                                {
                                                    status.map(sta =>
                                                        <>

                                                            <option value={sta.id}>{sta.status_name}</option>
                                                        </>

                                                    )
                                                }
                                            </select>
                                            {
                                                error && <p className='text-danger'>{error}</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="offset-md-3 col-sm-6">

                                            <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanAuthorityUpdate;
