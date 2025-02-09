'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';


const PurchaseProductCreates = () => {

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



    const [assetInfo, setAssetInfo] = useState({
        product_id: '', quantity: '', unit_id: '', purchase_price: '', sale_price: '', created_by: created
    });


    const { data: units = [],
    } = useQuery({
        queryKey: ['units'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/unit/unit_all`)

            const data = await res.json()
            return data
        }
    })

    const { data: products = [],
    } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/product_list`)

            const data = await res.json()
            return data
        }
    })


    const [product_id, setProduct_id] = useState('')
    const [quantity, setQuantity] = useState('')
    const [unit_id, setUnit_id] = useState('')
    const [purchase_price, setPurchase_price] = useState('')
    const [sale_price, setSale_price] = useState('')


    const brand_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...assetInfo }
        attribute[name] = value
        setAssetInfo(attribute)
        // setSameBrandName('')
        const product_id = attribute['product_id'];
        if (product_id) {
            setProduct_id(""); // Clear the error message
        }

        const quantity = attribute['quantity'];
        if (quantity) {
            setQuantity(""); // Clear the error message
        }

        const unit_id = attribute['unit_id'];
        if (unit_id) {
            setUnit_id(""); // Clear the error message
        }

        const purchase_price = attribute['purchase_price'];
        if (purchase_price) {
            setPurchase_price(""); // Clear the error message
        }

        const sale_price = attribute['sale_price'];
        if (sale_price) {
            setSale_price(""); // Clear the error message
        }


    };

    const router = useRouter()

    const brand_update = (e) => {
        e.preventDefault();
        if (!assetInfo.product_id) {

            return setProduct_id("Select A Product"); // Clear the error message
        }

        if (!assetInfo.quantity) {

            return setQuantity("Enter Quantity"); // Clear the error message
        }
        if (!assetInfo.unit_id) {

            return setUnit_id("Select A Unit"); // Clear the error message
        }
        if (!assetInfo.purchase_price) {

            return setPurchase_price("Enter purchase price"); // Clear the error message
        }
        if (!assetInfo.sale_price) {

            return setSale_price("Enter sale price"); // Clear the error message
        }



        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase_product/purchase_product_create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(assetInfo)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data) {
                    sessionStorage.setItem("message", "Data Save successfully!");
                    router.push(`/Admin/purchase_product/purchase_product_all?page_group=${page_group}`);
                }
            })
            .catch(error => {
                console.error('Error updating brand:', error);
            });
    };




    return (
        // col-md-12
        // <div class=" body-content bg-light">
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>
                        <div class=" border-primary shadow-sm border-0">
                            <div class="card-header py-1  custom-card-header clearfix bg-gradient-primary text-white">
                                <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create Purchase Product</h5>
                                <div class="card-title font-weight-bold mb-0 card-header-color float-right">
                                    <Link href={`/Admin/purchase_product/purchase_product_all?page_group=${page_group}`} class="btn btn-sm btn-info">Purchase Product List</Link></div>
                            </div>
                            <form action="" onSubmit={brand_update}>
                                <div class="card-body">




                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Product Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-8">
                                            <select
                                                value={assetInfo.product_id} onChange={brand_input_change}
                                                name='product_id'

                                                class="form-control form-control-sm " placeholder="Enter Role Name">
                                                <option value=''>Select Product Name</option>
                                                {
                                                    products.map(sta =>
                                                        <>

                                                            <option value={sta.id}>{sta.product_name}</option>
                                                        </>

                                                    )
                                                }
                                            </select>
                                            {
                                                product_id && <p className='text-danger'>{product_id}</p>
                                            }
                                        </div>
                                    </div>


                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Quantity<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-8">
                                            <input type="number" name="quantity" value={assetInfo.quantity} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter Quantity'
                                                maxLength={256}
                                            />

                                            {
                                                quantity && <p className='text-danger'>{quantity}</p>
                                            }

                                        </div>
                                    </div>



                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Unit Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-8">
                                            <select
                                                value={assetInfo.unit_id} onChange={brand_input_change}
                                                name='unit_id'

                                                class="form-control form-control-sm " placeholder="Enter Role Name">
                                                <option value=''>Select Unit Name</option>
                                                {
                                                    units.map(sta =>
                                                        <>

                                                            <option value={sta.id}>{sta.unit_name}</option>
                                                        </>

                                                    )
                                                }
                                            </select>
                                            {
                                                unit_id && <p className='text-danger'>{unit_id}</p>
                                            }
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Purchase Price<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-8">
                                            <input type="number" name="purchase_price" value={assetInfo.purchase_price} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter Purchase Price'
                                                maxLength={256}
                                            />

                                            {
                                                purchase_price && <p className='text-danger'>{purchase_price}</p>
                                            }

                                        </div>
                                    </div>


                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Sale Price<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-8">
                                            <input type="number" name="sale_price" value={assetInfo.sale_price} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter Sale Price'
                                                maxLength={256}
                                            />

                                            {
                                                sale_price && <p className='text-danger'>{sale_price}</p>
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

export default PurchaseProductCreates;
