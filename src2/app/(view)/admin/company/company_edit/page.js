'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const EditCompany = ({id}) => {

 
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
        company_name: '',
        modified_by: userId
    });

    const { data: companySingle, isLoading, refetch } = useQuery({
        queryKey: ['companySingle', id],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company/company_all/${id}`);
            const data = await res.json();
            return data;
        }
    });

    useEffect(() => {
        if (companySingle && companySingle[0]) {
            const { company_name  } = companySingle[0];
            setFormData({
                company_name,  modified_by: userId
            });
        }
    }, [companySingle, userId]);

   

    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            total: parseFloat(prevData.basic)
        }));
    }, [formData.basic]);
    const [company, setCompany] = useState([])
    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...formData }
        attribute[name] = value

        const company = attribute['company_name'];
        if (company) {
            setCompany('')
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

        if (!formData.company_name || formData.company_name.trim() === '') {
            setCompany('Company name is required');
            // You can show this error message to the user in the UI as needed
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company/company_edit/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log(data);
            if (data.affectedRows > 0) {
                sessionStorage.setItem("message", "Data updated successfully!");
                router.push('/Admin/company/company_all');
            } // Handle response data or success message
        } catch (error) {
            console.error('Error updating school shift:', error);
            // Handle error or show an error message to the user
        }
    };
console.log(companySingle)
    return (
        <div class="container-fluid">
        <div class=" row ">
            <div className='col-12 p-4'>
                <div className='card'>
                    <div className="card-default">
                        <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                            <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">Company Edit </h5>
                            <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
                                <Link href="/Admin/company/company_all" className="btn btn-sm btn-info">Back to Company List</Link>
                            </div>
                        </div>

                        <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                            (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                        </div>
                        <div className="card-body">
                            <form className="form-horizontal" method="post" autoComplete="off" onSubmit={handleSubmit}>

                                <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Company Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                    <input required=""
                                    onChange={handleChange}
                                    value={formData.company_name}
                                    class="form-control form-control-sm required" id="title" placeholder="Enter Company Name" type="text"  name="company_name" />
                                    {
                                        company && <p className='text-danger'>{company}</p>
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

export default EditCompany;