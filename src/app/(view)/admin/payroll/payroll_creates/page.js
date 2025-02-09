// 'use client' 
 //ismile
// import Link from 'next/link';
// import React from 'react';

// const PayRollCreate = () => {


//     const created_by = localStorage.getItem('userId')

//     const user_create = (event) => {
// 		event.preventDefault();
// 		const form = event.target;
// 		const title = form.title.value;
// 		const basic = form.basic.value;
// 		const medical = form.medical.value;
// 		const house = form.house.value;
// 		const convince = form.convince_val.value;
// 		const tax = form.tax_val.value;
// 		const total = form.total.value;



// 		const schoolShift = {
// 			title,
// 			basic,
// 			medical,
// 			house,
// 			convince,
// 			created_by,
//             tax,
//             total

// 		};

// 		fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/pay_roll/pay_roll_create`, {
// 			method: 'POST',
// 			headers: {
// 				'content-type': 'application/json',
// 			},
// 			body: JSON.stringify(schoolShift),
// 		})
// 			.then((Response) => {
// 				Response.json()
// 				console.log(Response)
// 				if (Response.ok === true) {
// 					sessionStorage.setItem("message", "Data saved successfully!");
// 					router.push('/Admin/school_shift/school_shift_all')
// 				}
// 			})
// 			.then((data) => {
// 				console.log(data);

// 			})
// 			.catch((error) => console.error(error));
// 	};



//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create School Shift</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <Link href={`/Admin/school_shift/school_shift_all?page_group`} className="btn btn-sm btn-info">Back School Shift List</Link>
//                                     </div>
//                                 </div>
//                                 <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                     (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                                 </div>
//                                 <div class="card-body">

//                                     <form onSubmit={user_create}>

//                                         <div class="form-group row">
//                                             <label class="col-form-label font-weight-bold col-md-3">Title:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div class="col-md-6">
//                                                 <input type="text" required="" name="title" class="form-control form-control-sm  required " id="title" placeholder="Enter Title" value="" />

//                                             </div>
//                                         </div>
//                                         <div class="form-group row">
//                                             <label class="col-form-label font-weight-bold col-md-3">Basic:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div class="col-md-6">
//                                                 <input type="number" required="" step="1" name="basic" class="form-control form-control-sm  required integer basic" id="basic" placeholder="Enter Basic" value="" />
//                                             </div>
//                                         </div>
//                                         <div class="form-group row">
//                                             <label class="col-form-label font-weight-bold col-md-3">Medical(%):<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div class="col-md-6">
//                                                 <div class="input-group">
//                                                     <input type="hidden" name="medical_val" class="medical_val" value="0" />
//                                                     <input type="number" required="" step="1" name="medical" class="form-control form-control-sm  required integer" id="medical" placeholder="Enter Medical" value="" />
//                                                     <span class="input-group-addon cal" id="basic-addon1"></span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div class="form-group row">
//                                             <label class="col-form-label font-weight-bold col-md-3">House(%):<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div class="col-md-6">
//                                                 <div class="input-group">
//                                                     <input type="hidden" name="house_val" class="house_val" value="0" />
//                                                     <input type="number" required="" step="1" name="house" class="form-control form-control-sm  required integer" id="house" placeholder="Enter House" value="" />
//                                                     <span class="input-group-addon cal" id="basic-addon1"></span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div class="form-group row">
//                                             <label class="col-form-label font-weight-bold col-md-3">Convince(%):<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div class="col-md-6">
//                                                 <div class="input-group">
//                                                     <input type="hidden" name="convince_val" class="convince_val" value="0" />
//                                                     <input type="number" required="" step="1" name="convince" class="form-control form-control-sm  required integer" id="convince" placeholder="Enter Convince" value="" />
//                                                     <span class="input-group-addon cal" id="basic-addon1"></span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div class="form-group row">
//                                             <label class="col-form-label font-weight-bold col-md-3">Tax(%):<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div class="col-md-6">
//                                                 <div class="input-group">
//                                                     <input type="hidden" name="tax_val" class="tax_val" value="0" />
//                                                     <input type="number" required="" step="1" name="tax" class="form-control form-control-sm  required integer" id="tax" placeholder="Enter Tax" value="" />
//                                                     <span class="input-group-addon cal" id="basic-addon1"></span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div class="form-group row">
//                                             <label class="col-form-label font-weight-bold col-md-3">Total:</label>
//                                             <div class="col-md-6 ">
//                                                 <input type="hidden" name="total_val" class="total_amount" />
//                                                 <p class="total_val"></p>
//                                             </div>
//                                         </div>
//                                         <div class="form-group row">
//                                             <label class="col-form-label font-weight-bold col-md-3">Notes:</label>
//                                             <div class="col-md-6">
//                                                 <input type="text" name="notes" class="form-control form-control-sm  " id="notes" placeholder="Enter Notes" value="" />

//                                             </div>
//                                         </div>

//                                         <div class="form-group row">
//                                             <div class="offset-md-3 col-sm-6">
//                                                 <input type="submit" name="create" class="btn btn-sm btn-success" value="Submit" />
//                                             </div>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>

//     );
// };

// export default PayRollCreate;

'use client' 
 //ismile
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const PayRollCreate = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: '',
        basic: '',
        medical: '',
        house: '',
        convince: '',
        tax: '',
        total: 0,
        notes: ''
    });



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

    const user_create = (event) => {
        event.preventDefault();

        const schoolShift = {
            ...formData,
            created_by
        };

        if (!formData.title) {
            setTitle('Tital Name Must Be filled')
            return
        }
        if (!formData.basic) {
            setBasic('Basic Must Be filled')
            return
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/pay_roll/pay_roll_create`, {
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
                    router.push('/Admin/payroll/payroll_all');
                }
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => console.error(error));
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create PayRoll</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/payroll/payroll_all?page_group`} className="btn btn-sm btn-info">Back PayRoll List</Link>
                                    </div>
                                </div>
                                <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                    (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                                </div>
                                <div className="card-body">
                                    <form onSubmit={user_create}>
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
                                                        value={formData.medical}
                                                        onChange={handleChange}
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
                                                    {/* <input type="hidden" name="convince_val" className="convince_val" value="0" />
                                                    <input type="number" step="1" name="convince" className="form-control form-control-sm required integer" id="convince" placeholder="Enter Convince" value={formData.convince} onChange={handleChange} />
                                                    <span className="input-group-addon cal" id="basic-addon1"></span> */}
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
                                                    {/* <input type="hidden" name="tax_val" className="tax_val" value="0" />
                                                    <input type="number" step="1" name="tax" className="form-control form-control-sm required integer" id="tax" placeholder="Enter Tax" value={formData.tax} onChange={handleChange} />
                                                    <span className="input-group-addon cal" id="basic-addon1"></span> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Total:</label>
                                            <div className="col-md-6">
                                                <input type="hidden" name="total_val" className="total_amount" />
                                                <p className="total_val">{formData.total ? formData.total : 0}</p>
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

export default PayRollCreate;
