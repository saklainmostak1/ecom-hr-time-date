'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const CreateHolydayCategory = () => {

    const router = useRouter()

    const [isSameAsLivingAddress, setIsSameAsLivingAddress] = useState(false);

    const [sameBrandName, setSameBrandName] = useState([])
    const { data: brands = []
    } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/holiday_category/holiday_category_all`)

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


    const [formData, setFormData] = useState({
        name: '', created_by: created_by, is_weekly_holiday: ''

    });




    const [company, setCompany] = useState([])
    const handleChange = (event) => {
        // const { name, value } = event.target;
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

        // setFormData(prevData => ({
        //     ...prevData,
        //     [name]: value
        // }));
    };

    const user_create = (event) => {
        event.preventDefault();

        const form = event.target;

        const name = form.name.value
        const is_weekly_holiday = form.is_weekly_holiday.value

        const schoolShift = {
            name,
            is_weekly_holiday,
            created_by
        };

        if (!name) {
            setCompany('Holyday Category name is required');
            // You can show this error message to the user in the UI as needed
            return;
        }
        console.log(schoolShift)

        const normalizebrandName = (name) => {
            return name?.trim().replace(/\s+/g, '');
        };


        const existingBrand = brands.find((brand) => normalizebrandName(brand.name.toLowerCase()) === normalizebrandName(formData.name.toLowerCase()));
        if (existingBrand) {
            // Show error message
            setSameBrandName("Holyday Category name already exists. Please choose a different Holyday Category name.");
            return

        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/holiday_category/holiday_category_create`, {
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
                    router.push('/Admin/holiday_category/holiday_category_all');
                }
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => console.error(error));
    };

    console.log(isSameAsLivingAddress)
    console.log(formData)

    return (
        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="card-default">
                            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">Holiday Category Create </h5>
                                <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
                                    <Link href="/Admin/holiday_category/holiday_category_all" className="btn btn-sm btn-info">Back to Holiday Category List</Link>
                                </div>
                            </div>

                            <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                            </div>
                            <div className="card-body">
                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={user_create}>

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input
                                            onChange={handleChange}
                                            class="form-control form-control-sm required" id="title" placeholder="Enter Holiday Category Name" type="text" name="name" />
                                        {
                                            company && <p className='text-danger'>{company}</p>
                                        }
                                        {
                                            sameBrandName && <p className='text-danger'>{sameBrandName}</p>
                                        }
                                    </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-form-label font-weight-bold col-md-3">Is Weekly Holiday?:</label>
                                        <div class="col-md-6">
                                            <div class=" col-md-10 checkbox">
                                                <label><input
                                                    value={isSameAsLivingAddress === true ? 1 : 0}
                                                    id="sameAsCheckbox"
                                                    checked={isSameAsLivingAddress}
                                                    onChange={() => setIsSameAsLivingAddress(!isSameAsLivingAddress)}
                                                    type="checkbox" name="is_weekly_holiday" /> Yes</label>
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

export default CreateHolydayCategory;