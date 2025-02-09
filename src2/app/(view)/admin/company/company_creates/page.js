'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const ComapanyCreate = () => {


    const { data: companyAll = [], isLoading, refetch
    } = useQuery({
        queryKey: ['companyAll'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company/company_all`)

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
        company_name: '', created_by: created_by

    });


    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            total: parseFloat(prevData.basic)
        }));
    }, [formData.basic]);

    const [company, setCompany] = useState([])
    const [errorMessage, setErrorMessage] = useState([])
    const handleChange = (event) => {
        // const { name, value } = event.target;
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...formData }
        attribute[name] = value

        const company = attribute['company_name'];
        if (company) {
            setCompany('')
        }

        const existingBrand = companyAll.find((brand) => brand?.company_name?.toLowerCase() === formData?.company_name?.toLowerCase());
        if (!existingBrand) {
          // Show error message
          setErrorMessage("");
        }

        setFormData(attribute)

        // setFormData(prevData => ({
        //     ...prevData,
        //     [name]: value
        // }));
    };

    const user_create = (event) => {
        event.preventDefault();



        if (!formData.company_name || formData.company_name.trim() === '') {
            setCompany('Company name is required');
            // You can show this error message to the user in the UI as needed
            return;
        }

        const normalizebrandName = (name) => {
            return name?.trim().replace(/\s+/g, ' ');
          };
      
      
          const existingBrand = companyAll.find((brand) => normalizebrandName(brand.company_name.toLowerCase()) === normalizebrandName(formData.company_name.toLowerCase()));
          if (existingBrand) {
            // Show error message
            setErrorMessage("company  name already exists. Please choose a different company  name.");
            return
      
          }


        const schoolShift = {
            ...formData,
            created_by
        };

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company/company_create`, {
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
                    router.push('/Admin/company/company_all');
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
                                <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">Company Create </h5>
                                <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
                                    <Link href="/Admin/company/company_all" className="btn btn-sm btn-info">Back to Company List</Link>
                                </div>
                            </div>

                            <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                            </div>
                            <div className="card-body">
                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={user_create}>

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Company Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}
                                            class="form-control form-control-sm required" id="title" placeholder="Enter Company Name" type="text" name="company_name" />
                                            {
                                                company && <p className='text-danger m-0'>{company}</p>
                                            }
                                            {
                                                errorMessage && <p className='text-danger m-0'>{errorMessage}</p>
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

export default ComapanyCreate;