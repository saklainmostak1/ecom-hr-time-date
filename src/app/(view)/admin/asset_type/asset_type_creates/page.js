'use client'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';


const AssetTypeCreates = () => {


    const { data: brands = [], isLoading, refetch } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/asset_type/asset_type_all`);
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
        asset_type_name: '',
        status: '',
        note: '',
        created_by: created
    });




    const [sameBrandName, setSameBrandName] = useState([])
    const [brandName, setBrandName] = useState('')
    const [error, setError] = useState([]);

    const brand_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...assetTypeName }
        attribute[name] = value
        setAssetType(attribute)
        // setSameBrandName('')
        const existingBrand = brands.find((brand) => brand?.asset_type_name?.toLowerCase() === assetTypeName?.asset_type_name?.toLowerCase());
        if (!existingBrand) {
            // Show error message
            setSameBrandName("");
        }
        const status = attribute['status'];
        if (status) {
            setError(""); // Clear the error message
        }
        const brandName = attribute['asset_type_name']
        if (!brandName || brandName === '') {
            setBrandName('Please enter a Asset Type name.');
        } else {
            setBrandName("");
        }

    };

    const router = useRouter()

    const asset_type_create = (e) => {
        e.preventDefault()
        if (!assetTypeName.asset_type_name) {
            setBrandName('Please enter a Asset Type name.');
            return; // Prevent further execution
        }
        if (!assetTypeName.status) {
            setError('Please select a status.');
            return; // Prevent further execution
        }

        const existingBrand = brands.find((brand) => brand.asset_type_name.toLowerCase() === assetTypeName.asset_type_name.toLowerCase());
        if (existingBrand) {
            // Show error message
            setSameBrandName("Asset Type name already exists. Please choose a different Asset Type name.");

        }

        else {

            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/asset_type/asset_type_create`, {
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
                        router.push('/Admin/asset_type/asset_type_all?page_group=asset_management')

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


    return (
        // col-md-12
        // <div class=" body-content bg-light">
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>
                        <div class=" border-primary shadow-sm border-0">
                            <div class="card-header py-1  custom-card-header clearfix bg-gradient-primary text-white">
                                <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create Asset Type</h5>
                                <div class="card-title font-weight-bold mb-0 card-header-color float-right">
                                    <Link href={`/Admin/asset_type/asset_type_all?page_group=${page_group}`} class="btn btn-sm btn-info">Back Asset Type List</Link></div>
                            </div>
                            <form action="" onSubmit={asset_type_create}>

                                <div class="card-body">


                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Asset Type Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="asset_type_name" value={assetTypeName.asset_type_name} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter asset type Name'
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
                                            {assetTypeName.asset_type_name.length > 255 && (
                                                <p className='text-danger'>Brand name cannot more than 255 characters.</p>
                                            )}

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

export default AssetTypeCreates;
