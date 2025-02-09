'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const PayRollEdit = ({ id }) => {



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
        title: '', basic: '', medical: '', house: '', convince: '', tax: '', notes: '', total: '',
        modified_by: userId
    });

    const { data: payRollSingle, isLoading, refetch } = useQuery({
        queryKey: ['payRollSingle', id],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/pay_roll/pay_roll_all/${id}`);
            const data = await res.json();
            return data;
        }
    });

    useEffect(() => {
        if (payRollSingle && payRollSingle[0]) {
            const { title, basic, medical, house, convince, tax, notes, total } = payRollSingle[0];
            setFormData({
                title, basic, medical, house, convince, tax, notes, total, modified_by: userId
            });
        }
    }, [payRollSingle, userId]);

    // const modified_by = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';

    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            total: parseFloat(prevData.basic)
        }));
    }, [formData.basic]);

    const [basic, setBasic] = useState([])
    const [title, setTitle] = useState([])

    const handleChange = (event) => {
        // const { name, value } = event.target;
        // setFormData(prevData => ({
        //     ...prevData,
        //     [name]: value
        // }));
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...formData }
        attribute[name] = value
        setFormData(attribute)


        const basic = attribute['basic'];
        if (basic) {
            setBasic(""); // Clear the error message
        }

        const title = attribute['title'];
        if (title) {
            setTitle(""); // Clear the error message
        }



    };

    const router = useRouter()

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.title) {
            setTitle('Tital Name Must Be filled')
            return
        }
        if (!formData.basic) {
            setBasic('Basic Must Be filled')
            return
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/pay_roll/pay_roll_edit/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log(data);
            if (data.affectedRows > 0) {
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem("message", "Data Update successfully!");
                }
                router.push('/Admin/payroll/payroll_all');
            }
            // Handle response data or success message
        } catch (error) {
            console.error('Error updating school shift:', error);
            // Handle error or show an error message to the user
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Edit PayRoll</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/payroll/payroll_all?page_group`} className="btn btn-sm btn-info">Back to PayRoll List</Link>
                                    </div>
                                </div>
                                <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                    (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                                </div>

                                <div className="card-body">


                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Title:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <input type="text" name="title" className="form-control form-control-sm required" id="title" placeholder="Enter Title" value={formData.title} onChange={handleChange} />
                                                {
                                                    title && <p className='text-danger'>{title}</p>
                                                }
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Basic:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <input type="number" step="1" name="basic" className="form-control form-control-sm required integer basic" id="basic" placeholder="Enter Basic" value={formData.basic} onChange={handleChange} />
                                                {
                                                    basic && <p className='text-danger'>{basic}</p>
                                                }
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Medical(%):<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <div className="input-group">
                                                    <select
                                                        name="medical"
                                                        className="form-control form-control-sm trim integer_no_zero whose_leave"
                                                        id="whose_leave"
                                                        value={formData.medical} onChange={handleChange}
                                                    >
                                                        {Array.from({ length: 101 }, (_, i) => (
                                                            <option key={i} value={i}>
                                                                {i}
                                                            </option>
                                                        ))}

                                                    </select>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">House(%):<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <div className="input-group">
                                                    <select
                                                        name="house"
                                                        className="form-control form-control-sm trim integer_no_zero whose_leave"
                                                        id="whose_leave"
                                                        value={formData.house} onChange={handleChange}
                                                    >
                                                        {Array.from({ length: 101 }, (_, i) => (
                                                            <option key={i} value={i}>
                                                                {i}
                                                            </option>
                                                        ))}

                                                    </select>

                                                    {/* <input type="hidden" name="house_val" className="house_val" value="0" />
                                                    <input type="number" step="1" name="house" className="form-control form-control-sm required integer" id="house" placeholder="Enter House" value={formData.house} onChange={handleChange} />
                                                    <span className="input-group-addon cal" id="basic-addon1"></span> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Convince(%):<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <div className="input-group">

                                                    <select
                                                        name="convince"
                                                        className="form-control form-control-sm trim integer_no_zero whose_leave"
                                                        id="whose_leave"
                                                        value={formData.convince} onChange={handleChange}
                                                    >
                                                        {Array.from({ length: 101 }, (_, i) => (
                                                            <option key={i} value={i}>
                                                                {i}
                                                            </option>
                                                        ))}

                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Tax(%):<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <div className="input-group">

                                                    <select
                                                        name="tax"
                                                        className="form-control form-control-sm trim integer_no_zero whose_leave"
                                                        id="whose_leave"
                                                        value={formData.tax} onChange={handleChange}
                                                    >
                                                        {Array.from({ length: 101 }, (_, i) => (
                                                            <option key={i} value={i}>
                                                                {i}
                                                            </option>
                                                        ))}

                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Total:</label>
                                            <div className="col-md-6">
                                                <input type="hidden" name="total_val" className="total_amount" />
                                                <p className="total_val">{formData.total}</p>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Notes:</label>
                                            <div className="col-md-6">
                                                <input type="text" name="notes" className="form-control form-control-sm" id="notes" placeholder="Enter Notes" value={formData.notes} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="offset-md-3 col-sm-6">
                                                <input type="submit" name="create" className="btn btn-sm btn-success" value="Submit" />
                                            </div>
                                        </div>
                                    </form>




                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayRollEdit;