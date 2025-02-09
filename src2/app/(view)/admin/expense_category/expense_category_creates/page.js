'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const CreateExpenceCategory = () => {



    const router = useRouter()

   

    const [sameBrandName, setSameBrandName] = useState([])
    const { data: brands = []
    } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expence_category/expence_category_all`)

            const data = await res.json()
            return data
        }
    })

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


      const [formData, setFormData] = useState({
        expense_category_name: '', created_by: created

    });


    const expence_category_create = (event) => {
        event.preventDefault();
        // const form = event.target
        // const expense_category_name = form.expense_category_name.value

        // // Add your form submission logic here using the 'fields' state.
        // if (!expense_category_name.trim()) {
        //     setErrorMessage('Expense Category Name is required');
        //     return; // stop execution if there's an error
        // }
        // const addValue = {
        //     expense_category_name, created_by: created
        // }

        if (!formData.expense_category_name || formData.expense_category_name.trim() === '') {
            setCompany('Expense Category name is required');
            // You can show this error message to the user in the UI as needed
            return;
        }

        const normalizebrandName = (name) => {
            return name?.trim().replace(/\s+/g, '');
        };


        const existingBrand = brands.find((brand) => normalizebrandName(brand.expense_category_name.toLowerCase()) === normalizebrandName(formData.expense_category_name.toLowerCase()));
        if (existingBrand) {
            // Show error message
            setSameBrandName("Expense Category name already exists. Please choose a different Expense Category  name.");
            return

        }

        const schoolShift = {
            ...formData,
            created
        };

 
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expence_category/expence_category_create`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(schoolShift),
        })
            .then((Response) => {
                Response.json()
                console.log(Response)
                if (Response.ok === true) {
                    if(typeof window !== 'undefined'){

                        sessionStorage.setItem("message", "Data saved successfully!");
                    }
                    router.push('/Admin/expense_category/expense_category_all')
                }
            })
            .then((data) => {

                console.log(data);

            })
            .catch((error) => console.error(error));

    }


    const [company, setCompany] = useState([])
    const handleInputChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...formData }
        attribute[name] = value

        const company = attribute['expense_category_name'];
        if (company) {
            setCompany('')
        }

        const existingBrand = brands.find((brand) => brand?.expense_category_name?.toLowerCase() === formData?.expense_category_name?.toLowerCase());
        if (!existingBrand) {
            // Show error message
            setSameBrandName("");
        }

        setFormData(attribute)

       
    };



    return (
        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div class=" border-primary shadow-sm border-0">
                            <div class="card-header custom-card-header  py-1  clearfix bg-gradient-primary text-white" style={{ backgroundColor: '#4267b2' }}>
                                <h5 class="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Create Expense Category</h5>
                                <div class="card-title card-header-color font-weight-bold mb-0  float-right"> <Link href="/Admin/expense_category/expense_category_all?page_group=account_management" class="btn btn-sm btn-info">Back to Expense category List</Link></div>
                            </div>
                            <div class="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i class="text-danger fas fa-star"></i></sup></small>) field required
                            </div>
                            <div class="card-body">
                                <form onSubmit={expence_category_create}>
                                    <div class="form-group row">
                                        <label class="col-form-label font-weight-bold col-md-3">Expense Category Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                        <div class="col-md-6">
                                            <input type="text" required="" name="expense_category_name" class="form-control form-control-sm  required  unique_expense_category_name" id="expense_category_name" placeholder="Enter expense category name" onChange={handleInputChange} />

                                            {company && <div className="text-danger">{company}</div>}
                                            {sameBrandName && <div className="text-danger">{sameBrandName}</div>}
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <div class="offset-md-3 col-sm-6">
                                            <input type="submit" name="create" class="btn btn-sm btn-success" value="Submit" />
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

export default CreateExpenceCategory;