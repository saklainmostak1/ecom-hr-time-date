'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const HolydayCategoryEdit = ({ id }) => {

    const router = useRouter()

    const [isSameAsLivingAddress, setIsSameAsLivingAddress] = useState(false);

    const [sameBrandName, setSameBrandName] = useState([])
    const { data: brands = [],  } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/holiday_category/holiday_category_all`);
            const data = await res.json();
            // Filter out the brand with id 
            const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return filteredBrands;
        }
    });



    const { data: holiday_categorys_single = [], isLoading, refetch
    } = useQuery({
        queryKey: ['holiday_category'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/holiday_category/holiday_category_all/${id}`)
            const data = await res.json()
            return data
        }
    })

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
        name: '', modified_by: userId, is_weekly_holiday: ''
    });

    useEffect(() => {
        if (holiday_categorys_single && holiday_categorys_single[0]) {
            const { name, is_weekly_holiday } = holiday_categorys_single[0];
            setFormData({
                name, is_weekly_holiday, modified_by: userId
            });
            setIsSameAsLivingAddress(is_weekly_holiday === 1);
        }
    }, [holiday_categorys_single, userId]);

    const [company, setCompany] = useState('')
    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...formData }
        attribute[name] = value
        const company = attribute['name'];
        if (company) {
            setCompany('')
        }

        const existingBrand = brands.find((brand) => brand?.name?.toLowerCase() === formData?.name?.toLowerCase());
        if (!existingBrand) {
            // Show error message
            setSameBrandName("");
        }

        setFormData(attribute)
    };

    const user_create = (event) => {
        event.preventDefault();

        if (!formData.name) {
            setCompany('Holiday Category name is required');
            return;
        }

        const normalizebrandName = (name) => {
            return name?.trim().replace(/\s+/g, '');
        };


        const existingBrand = brands.find((brand) => normalizebrandName(brand.name.toLowerCase()) === normalizebrandName(formData.name.toLowerCase()));
        if (existingBrand) {
            // Show error message
            setSameBrandName("Holyday Category name already exists. Please choose a different Holyday Category name.");
            return

        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/holiday_category/holiday_category_edit/${id}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ ...formData, is_weekly_holiday: isSameAsLivingAddress ? 1 : 0 }),
        })
            .then((Response) => {
                Response.json();
                if (Response.ok) {
                    if (typeof window !== 'undefined') {
                        sessionStorage.setItem("message", "Data Update successfully!");
                    }
                    router.push('/Admin/holiday_category/holiday_category_all');
                }
            })
            .catch((error) => console.error(error));
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="card-default">
                            <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-period font-weight-bold mb-0 float-left mt-1">Holiday Category Edit</h5>
                                <div className="card-title card-header-period font-weight-bold mb-0 float-right">
                                    <Link href="/Admin/holiday_category/holiday_category_all" className="btn btn-sm btn-info">Back to Holiday Category List</Link>
                                </div>
                            </div>

                            <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                            </div>
                            <div className="card-body">
                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={user_create}>

                                    <div className="form-group row">
                                        <label className="col-form-label font-weight-bold col-md-3">Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                        <div className="col-md-6">
                                            <input
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="form-control form-control-sm required" id="title" placeholder="Enter Holiday Category Name" type="text" name="name" />
                                            {company && <p className='text-danger'>{company}</p>}
                                            {sameBrandName && <p className='text-danger'>{sameBrandName}</p>}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-form-label font-weight-bold col-md-3">Is Weekly Holiday?:</label>
                                        <div className="col-md-6">
                                            <div className="col-md-10 checkbox">
                                                <label>
                                                    <input
                                                        value={isSameAsLivingAddress ? 1 : 0}
                                                        id="sameAsCheckbox"
                                                        checked={isSameAsLivingAddress}
                                                        onChange={() => setIsSameAsLivingAddress(!isSameAsLivingAddress)}
                                                        type="checkbox" name="is_weekly_holiday" /> Yes
                                                </label>
                                            </div>
                                        </div>
                                    </div>
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

export default HolydayCategoryEdit;
