'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';


const WareHouseCreates = () => {



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



    const [assetTypeName, setAssetType] = useState({
        name: '',
        email: '',
        mobile: '',
        address: '',
        created_by: created
    });


    const [name, setName] = useState('')
    const [mobile, setMobile] = useState('')
    const [error, setError] = useState([]);

    const brand_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...assetTypeName }
        attribute[name] = value
        setAssetType(attribute)
        // setSameBrandName('')

        const nameWareHouse = attribute['name'];
        if (nameWareHouse) {
            setName(""); // Clear the error message
        }

        const mobile = attribute['mobile'];
        if (mobile) {
            setMobile(""); // Clear the error message
        }

    };

    const router = useRouter()

    const asset_type_create = (e) => {
        e.preventDefault()

        if (!assetTypeName.name) {
            setName('Please Enter a Name.');
            return; // Prevent further execution
        }

        if (!assetTypeName.mobile) {
            setMobile('Please Enter a Name.');
            return; // Prevent further execution
        }



        else {

            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/ware_house/ware_house_create`, {
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
                        sessionStorage.setItem("message", "Data Save successfully!");
                        router.push('/Admin/ware_house/ware_house_all?page_group=asset_management')

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



    return (
        // col-md-12
        // <div class=" body-content bg-light">
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>
                        <div class=" border-primary shadow-sm border-0">
                            <div class="card-header py-1  custom-card-header clearfix bg-gradient-primary text-white">
                                <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create Ware House</h5>
                                <div class="card-title font-weight-bold mb-0 card-header-color float-right">
                                    <Link href={`/Admin/ware_house/ware_house_all?page_group=${page_group}`} class="btn btn-sm btn-info"> Ware House List</Link></div>
                            </div>
                            <form action="" onSubmit={asset_type_create}>

                                <div class="card-body">
                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Ware House  Person Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="name" value={assetTypeName.name} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter  Name'
                                                maxLength={256}
                                            />

                                            {
                                                name && (
                                                    <p className='text-danger'>{name}</p>
                                                )
                                            }
                                            {assetTypeName.name.length > 254 && (
                                                <p className='text-danger'> name cannot more than 255 characters.</p>
                                            )}

                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Mobile<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="mobile" value={assetTypeName.mobile} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter Mobile'
                                                maxLength={256}
                                            />
                                            {
                                                mobile && (
                                                    <p className='text-danger'>{mobile}</p>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Email:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="email" value={assetTypeName.email} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter Email'
                                                maxLength={256}
                                            />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Address:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="address" value={assetTypeName.address} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter Address'
                                                maxLength={256}
                                            />

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

export default WareHouseCreates;
