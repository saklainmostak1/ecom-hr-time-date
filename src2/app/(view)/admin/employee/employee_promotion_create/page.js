// 'use client' 
 //ismile
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';

// const EmployeePromotionCreate = ({ id }) => {


//     const { data: designationList = [],
//     } = useQuery({
//         queryKey: ['designationList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_list`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: payRoll = [], isLoading, refetch
//     } = useQuery({
//         queryKey: ['payRoll'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/pay_roll/pay_roll_all`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: branches = [], 
//     } = useQuery({
//         queryKey: ['branches'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`)

//             const data = await res.json()
//             return data
//         }
//     })



//     const { data: employeeList = [] } = useQuery({
//         queryKey: ['employeeList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_all_list/${id}`);
//             const data = await res.json();
//             return data;
//         }
//     });


//     console.log(employeeList)

//     const [modified_by, setModified_by] = useState(() => {
//         if (typeof window !== 'undefined') {
//           return localStorage.getItem('userId') || '';
//         }
//         return '';
//       });

//       useEffect(() => {
//         if (typeof window !== 'undefined') {
//           const storedUserId = localStorage.getItem('userId');
//           setModified_by(storedUserId);
//         }
//       }, []);


//     const employee_promotion_create = (event) => {

//         event.preventDefault();
//         const form = event.target;

//         const designation_id = form.designation_id.value;
//         const promotion_month = form.promotion_month.value;
//         const payroll_id = form.payroll_id.value;
//         const branch_id = form.branch_id.value;



//         const uniqueFields = {
//             designation_id,
//             promotion_month,
//             payroll_id,
//             branch_id,
//             modified_by: modified_by
//         }

//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_promotion_create/${id}`, {
//             method: 'POST',
//             headers: {
//                 'content-type': 'application/json',
//             },
//             body: JSON.stringify(uniqueFields),
//         })
//             .then((Response) =>
//                 Response.json()
//             )
//             .then((data) => {
//                 if (data[0]?.affectedRows > 0) {
//                     sessionStorage.setItem("message", "Data saved successfully!");
//                     // router.push('/Admin/brand/brand_all');
//                 }
//                 console.log(data)

//             })
//             .catch((error) => console.error(error));
//     }

// // const employeePromotion = employeeList.filter(employee => employee.user_id === parseFloat(id))
// console.log(employeeList)

//     return (
//         <div className="container-fluid">

//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create Employee Promotion</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <Link href={`/Admin/employee/employee_all?page_group`} className="btn btn-sm btn-info">Back Employee List</Link>
//                                     </div>
//                                 </div>
//                                 <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                     (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                                 </div>
//                                 <div class="card-body ">
//                                     <form class="" method="post" autocomplete="off" onSubmit={employee_promotion_create}>
//                                         <div class="card bg-white mb-3 shadow-sm ">
//                                             <div class="card-body">
//                                                 <div class=" row no-gutters">
//                                                     <div class="col-md-6">
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Branch:</label></div>
//                                                             <div class="col-md-8">
//                                                                 <select
//                                                                 value={employeeList[0]?.branch_id}
//                                                                 required="" name="branch_id" class=" form-control form-control-sm  required integer_no_zero " id="designation_name">
//                                                                     <option value="">Select Branch</option>
//                                                                     {
//                                                                         branches.map(branch =>

//                                                                             <>
//                                                                                 <option value={branch.id}>{branch.branch_name}</option>

//                                                                             </>
//                                                                         )
//                                                                     }
//                                                                 </select>
//                                                             </div>
//                                                         </div>

//                                                     </div>

//                                                     <div class="col-md-6">
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Promotion Date:</label></div>
//                                                             <div class="col-md-8">
//                                                                 <input type="date" name="promotion_month" class="form-control form-control-sm  required urban_datepicker" id="join_date" placeholder="Enter Join Date" />
//                                                             </div>
//                                                         </div>

//                                                     </div>
//                                                     <div class="col-md-6">
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Designation:</label></div>
//                                                             <div class="col-md-8">
//                                                                 <select
//                                                                 value={employeeList[0]?.designation_id}
//                                                                 required="" name="designation_id" class=" form-control form-control-sm  required integer_no_zero " id="designation_name">
//                                                                     <option value="">Select Designation</option>
//                                                                     {
//                                                                         designationList.map(designation =>

//                                                                             <>
//                                                                                 <option value={designation.id}>{designation.designation_name}</option>

//                                                                             </>
//                                                                         )
//                                                                     }
//                                                                 </select>
//                                                             </div>
//                                                         </div>

//                                                     </div>
//                                                     <div class="col-md-6">
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Payroll:</label></div>
//                                                             <div class="col-md-8">
//                                                                 <select 
//                                                                  value={employeeList[0]?.payroll_id}
//                                                                 required="" name="payroll_id" class="form-control form-control-sm  required integer_no_zero " id="title">
//                                                                     <option value="">Select payroll</option>
//                                                                     {payRoll.map(item => (
//                                                                         < >
//                                                                             <option value={item.id}>{`${item.title} (${item.basic}/-)`}</option>
//                                                                         </>
//                                                                     ))}
//                                                                 </select>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             <div class="row no-gutters">
//                                                 <div class="col-md-12 offset-md-3">
//                                                     <input type="submit" name="create" class="btn btn-sm btn-success" value="Submit" />
//                                                 </div>
//                                             </div>
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

// export default EmployeePromotionCreate;

'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const EmployeePromotionCreate = ({ id }) => {
    const { data: designationList = [] } = useQuery({
        queryKey: ['designationList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_list`);
            return res.json();
        },
    });

    const { data: payRoll = [] } = useQuery({
        queryKey: ['payRoll'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/pay_roll/pay_roll_all`);
            return res.json();
        },
    });

    const { data: branches = [] } = useQuery({
        queryKey: ['branches'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`);
            return res.json();
        },
    });

    const { data: employeeList = [] } = useQuery({
        queryKey: ['employeeList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_all_list/${id}`);
            return res.json();
        },
    });

    const [modified_by, setModified_by] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });


    const [branch_id, setbranch_id] = useState([])
    const [designation_id, setdesignation_id] = useState([])
    const [payroll_id, setpayroll_id] = useState([])
    const [promotion_month, setpromotion_month] = useState([])

    const [formValues, setFormValues] = useState({
        branch_id: '',
        designation_id: '',
        payroll_id: '',
        promotion_month: '',
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setModified_by(storedUserId);
        }

        if (employeeList.length > 0) {
            setFormValues({
                branch_id: employeeList[0]?.branch_id || '',
                designation_id: employeeList[0]?.designation_id || '',
                payroll_id: employeeList[0]?.payroll_id || '',
                promotion_month: '',
            });
        }
    }, [employeeList]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'branch_id') setbranch_id('');
        if (name === 'designation_id') setdesignation_id('');
        if (name === 'payroll_id') setpayroll_id('');
        if (name === 'promotion_month') setpromotion_month('');
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };
    const router = useRouter()
    const employee_promotion_create = (event) => {
        event.preventDefault();
        const { branch_id, designation_id, payroll_id, promotion_month } = formValues;

        const uniqueFields = {
            branch_id,
            designation_id,
            payroll_id,
            promotion_month,
            modified_by,
        };


        if (!branch_id) {
            setbranch_id('Brunch Must Be filled')
            return
        }
        if (!designation_id) {
            setdesignation_id('Designation Must Be filled')
            return
        }
        if (!payroll_id) {
            setpayroll_id('payroll Must Be filled')
            return
        }
        if (!promotion_month) {
            setpromotion_month('Promotion Months Must Be filled')
            return
        }


        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_promotion_create/${id}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(uniqueFields),
        })
            .then((Response) => Response.json())
            .then((data) => {
                if (data?.affectedRows > 0) {
                    sessionStorage.setItem('message', 'Data saved successfully!');
                    router.push('/Admin/employee/employee_all');
                }
                console.log(data);
            })
            .catch((error) => console.error(error));
    };

    const [currentDate, setCurrentDate] = useState([])
    const handleDateChange = (event) => {
        const selectedDate = event.target.value; // Directly get the value from the input

        const day = String(selectedDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
        const month = String(selectedDate.split('-')[1]).padStart(2, '0');
        const year = String(selectedDate.split('-')[0]);
        const formattedDate = `${day}-${month}-${year}`;
        const formattedDatabaseDate = `${year}-${month}-${day}`;
        setCurrentDate(formattedDate)
        setFormValues(prevData => ({
            ...prevData,
            promotion_month: formattedDatabaseDate // Update the period_name field in the state
        }));

        if (!formattedDatabaseDate) {
            setpromotion_month('Promotion Months Must Be filled')
        }
        else {
            setpromotion_month('')
        }

    };
    console.log(currentDate)

    // const period_name = allEmployeeList.dob;
    // const formattedDate = period_name.split('T')[0];
    const [reformattedDate, setReformattedDate] = useState('');

    useEffect(() => {
        const period_name = formValues.promotion_month;
        const formattedDate = period_name?.split('T')[0];

        if (formattedDate?.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            setReformattedDate(`${day}-${month}-${year}`);
        } else {
            console.log("Date format is incorrect:", formattedDate);
        }
    }, [formValues]);

    console.log(formValues)

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 p-4">
                    <div className="card">
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create Employee Promotion</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/employee/employee_all?page_group`} className="btn btn-sm btn-info">Back Employee List</Link>
                                    </div>
                                </div>
                                <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                    (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                                </div>
                                <div className="card-body">
                                    <form method="post" autocomplete="off" onSubmit={employee_promotion_create}>
                                        <div className="card bg-white mb-3 shadow-sm">
                                            <div className="card-body">
                                                <div className="row no-gutters">
                                                    <div className="col-md-6">
                                                        <div className="form-group row no-gutters">
                                                            <div className="col-md-3">
                                                                <label className="font-weight-bold text-right">Branch:</label>
                                                            </div>
                                                            <div className="col-md-8">
                                                                <select
                                                                    value={formValues.branch_id}
                                                                    onChange={handleInputChange}

                                                                    name="branch_id"
                                                                    className="form-control form-control-sm required integer_no_zero"
                                                                >
                                                                    <option value="">Select Branch</option>
                                                                    {branches.map((branch) => (
                                                                        <option key={branch.id} value={branch.id}>
                                                                            {branch.branch_name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                {
                                                                    branch_id && <p className='text-danger'>{branch_id}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group row no-gutters">
                                                            <div className="col-md-3">
                                                                <label className="font-weight-bold text-right">Promotion Month:</label>
                                                            </div>
                                                            <div className="col-md-8">
                                                                <input
                                                                    type="text"
                                                                    readOnly

                                                                    defaultValue={reformattedDate}
                                                                    onClick={() => document.getElementById(`dateInput-n`).showPicker()}
                                                                    placeholder="dd-mm-yyyy"
                                                                    className="form-control form-control-sm mb-2"
                                                                    style={{ display: 'inline-block', }}
                                                                />
                                                                <input
                                                                    name='promotion_month'
                                                                    type="date"
                                                                    id={`dateInput-n`}
                                                                    onChange={(e) => handleDateChange(e)}

                                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                                                />
                                                                {
                                                                    promotion_month && <p className='text-danger'>{promotion_month}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="form-group row no-gutters">
                                                            <div className="col-md-3">
                                                                <label className="font-weight-bold text-right">Designation:</label>
                                                            </div>
                                                            <div className="col-md-8">
                                                                <select
                                                                    value={formValues.designation_id}
                                                                    onChange={handleInputChange}

                                                                    name="designation_id"
                                                                    className="form-control form-control-sm required integer_no_zero"
                                                                >
                                                                    <option value="">Select Designation</option>
                                                                    {designationList.map((designation) => (
                                                                        <option key={designation.id} value={designation.id}>
                                                                            {designation.designation_name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                {
                                                                    designation_id && <p className='text-danger'>{designation_id}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group row no-gutters">
                                                            <div className="col-md-3">
                                                                <label className="font-weight-bold text-right">Payroll:</label>
                                                            </div>
                                                            <div className="col-md-8">
                                                                <select
                                                                    value={formValues.payroll_id}
                                                                    onChange={handleInputChange}

                                                                    name="payroll_id"
                                                                    className="form-control form-control-sm required integer_no_zero"
                                                                >
                                                                    <option value="">Select Payroll</option>
                                                                    {payRoll.map((item) => (
                                                                        <option key={item.id} value={item.id}>
                                                                            {`${item.title} (${item.basic}/-)`}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                {
                                                                    payroll_id && <p className='text-danger'>{payroll_id}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row no-gutters">
                                                    <div className="col-md-12 offset-md-3">
                                                        <input type="submit" name="create" className="btn btn-sm btn-success" value="Submit" />
                                                    </div>
                                                </div>
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

export default EmployeePromotionCreate;
