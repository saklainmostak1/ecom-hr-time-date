// 'use client'
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';

// const MobileAllowanceCreate = () => {



//     const [employeeName, setEmployeeName] = useState('')
//     console.log(employeeName)

//     const [created_by, setCreated_by] = useState(() => {
//         if (typeof window !== 'undefined') {
//             return localStorage.getItem('userId') || '';
//         }
//         return '';
//     });

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             const storedUserId = localStorage.getItem('userId');
//             setCreated_by(storedUserId);
//         }
//     }, []);

//     const router = useRouter()
//     const [formData, setFormData] = useState({
//         mobile: '', amount: '', recharge_user: employeeName || created_by, created_by: created_by, recharge_time: ''

//     });



//     const [selectedDate, setSelectedDate] = useState([]);
//     const [formattedDisplayDate, setFormattedDisplayDate] = useState('');

//     const handleDateSelection = (event) => {
//         const inputDate = event.target.value; // Directly get the value from the input

//         const day = String(inputDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
//         const month = String(inputDate.split('-')[1]).padStart(2, '0');
//         const year = String(inputDate.split('-')[0]);
//         const formattedDate = `${day}-${month}-${year}`;
//         const formattedDatabaseDate = `${year}-${month}-${day}`;
//         setSelectedDate(formattedDate);
//         setFormData(prevData => ({
//             ...prevData,
//             recharge_time: formattedDatabaseDate // Update the dob field in the state
//         }));

//         if (!formattedDatabaseDate) {
//             setRecharge_time('Recharge time is Required')
//         }
//         else {
//             setRecharge_time('')
//         }
//     };

//     console.log(selectedDate);

//     useEffect(() => {
//         const dob = formData.recharge_time;
//         const formattedDate = dob?.split('T')[0];

//         if (formattedDate?.includes('-')) {
//             const [year, month, day] = formattedDate.split('-');
//             setFormattedDisplayDate(`${day}-${month}-${year}`);
//         } else {
//             console.log("Date format is incorrect:", formattedDate);
//         }
//     }, [formData]);

//     const [mobile, setMobile] = useState([])
//     const [amount, setAmount] = useState([])
//     const [recharge_time, setRecharge_time] = useState([])

//     const handleChange = (event) => {
//         const { name, value } = event.target;




//         if (name === 'mobile') {
//             setMobile('')
//         }
//         if (name === 'amount') {
//             setAmount('')
//         }
//         if (name === 'recharge_time') {
//             setRecharge_time('')
//         }

//         setFormData(prevData => ({
//             ...prevData,
//             [name]: value
//         }));
//     };

//     const user_create = (event) => {
//         event.preventDefault();

//         const schoolShift = {
//             ...formData,
//             created_by,

//         };



//         if (!formData.mobile) {
//             setMobile('Mobile number is Required')
//             return
//         }
//         if (!formData.amount) {
//             setAmount('Amount is Required')
//             return
//         }
//         if (!formData.recharge_time) {
//             setRecharge_time('Recharge time is Required')
//             return
//         }
//         console.log(schoolShift)
//         // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/mobile_allowance/mobile_allowance_create

//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/mobile_allowance/mobile_allowance_create`, {
//             method: 'POST',
//             headers: {
//                 'content-type': 'application/json',
//             },
//             body: JSON.stringify(schoolShift),
//         })
//             .then((Response) => {
//                 Response.json();
//                 console.log(Response);
//                 if (Response.ok === true) {
//                     if (typeof window !== 'undefined') {

//                         sessionStorage.setItem("message", "Data saved successfully!");
//                     }
//                     router.push('/Admin/mobile_allowance/mobile_allowance_all');
//                 }
//             })
//             .then((data) => {
//                 console.log(data);
//             })
//             .catch((error) => console.error(error));
//     };

//     const { data: employeeList = [], isLoading } = useQuery({
//         queryKey: ['employeeList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_all_list`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     // Fetch the list of branches
//     const { data: branches = [] } = useQuery({
//         queryKey: ['branches'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`);
//             const data = await res.json();
//             return data;
//         }
//     });


//     const [selectedBranch, setSelectedBranch] = useState('');
//     const [filteredEmployees, setFilteredEmployees] = useState([]);

//     // Filter employees based on selected branch
//     useEffect(() => {
//         if (selectedBranch) {
//             const employeesInBranch = employeeList.filter(employee => employee.branch_id === parseFloat(selectedBranch));
//             setFilteredEmployees(employeesInBranch);
//         } else {
//             setFilteredEmployees(employeeList);
//         }
//     }, [selectedBranch, employeeList]);

//     // Group employees by their designation
//     const groupedEmployees = filteredEmployees.reduce((groups, employee) => {
//         const designation = employee.designation_name;
//         if (!groups[designation]) {
//             groups[designation] = [];
//         }
//         groups[designation].push(employee);
//         return groups;
//     }, {});



//     return (
//         <div class="container-fluid">
//             <div class=" row ">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="card-default">
//                             <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
//                                 <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">Mobile Allowance Create </h5>
//                                 <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
//                                     <Link href="/Admin/mobile_allowance/mobile_allowance_all" className="btn btn-sm btn-info">Back to Mobile Allowance List</Link>
//                                 </div>
//                             </div>

//                             <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                 (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                             </div>
//                             <div className="card-body">
//                                 <form className="form-horizontal" method="post" autoComplete="off" onSubmit={user_create}>


//                                     <div className="form-group row">
//                                         <label className="col-form-label font-weight-bold col-md-3">Branch Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                         <div className="col-md-6">
//                                             <select
//                                                 onChange={(e) => {
//                                                     const branchId = e.target.value;
//                                                     setSelectedBranch(branchId);
//                                                     handleChange(e);
//                                                 }}

//                                                 name="whose_leave"
//                                                 className="form-control form-control-sm trim integer_no_zero whose_leave"
//                                                 id="whose_leave"
//                                             >
//                                                 <option value="">Select Branch</option>
//                                                 {branches.map(branch => (
//                                                     <option key={branch.id} value={branch.id}>{branch.branch_name}</option>
//                                                 ))}
//                                             </select>
//                                         </div>
//                                     </div>
//                                     <div className="form-group row">
//                                         <label className="col-form-label font-weight-bold col-md-3">Mobile Allowance For:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                         <div className="col-md-6">
//                                             <select
//                                                 onChange={
//                                                     (e) => {
//                                                         setEmployeeName(e.target.value);
//                                                         handleChange(e)
//                                                     }}


//                                                 name="recharge_user"
//                                                 className="form-control form-control-sm trim integer_no_zero recharge_user"
//                                                 id="recharge_user"
//                                             >
//                                                 <option value="">Select Mobile Allownace Person</option>
//                                                 {Object.keys(groupedEmployees).map(designation => (
//                                                     <optgroup key={designation} label={designation}>
//                                                         {groupedEmployees[designation].map(employee => (
//                                                             <option key={employee.user_id} value={employee.user_id}>
//                                                                 {employee.full_name}
//                                                             </option>
//                                                         ))}
//                                                     </optgroup>
//                                                 ))}
//                                             </select>
//                                         </div>
//                                     </div>


//                                     <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Mobile Number:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
//                                         <input required=""
//                                             onChange={handleChange}
//                                             class="form-control form-control-sm required" id="title" placeholder="Enter Mobile Number" type="text" name="mobile" />
//                                         {
//                                             mobile && <p className='text-danger'>{mobile}</p>
//                                         }
//                                     </div>
//                                     </div>

//                                     <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Recharge Amount<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
//                                         <input required=""
//                                             onChange={handleChange}
//                                             class="form-control form-control-sm required" id="title" placeholder="Enter Recharge Amount" type="number" name="amount" />
//                                         {
//                                             amount && <p className='text-danger'>{amount}</p>
//                                         }
//                                     </div>
//                                     </div>
//                                     <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Recharge Time<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
//                                         <input
//                                             type="text"
//                                             readOnly

//                                             defaultValue={formattedDisplayDate}
//                                             onClick={() => document.getElementById(`dateInput-nt`).showPicker()}
//                                             placeholder="dd-mm-yyyy"
//                                             className="form-control form-control-sm mb-2"
//                                             style={{ display: 'inline-block', }}
//                                         />
//                                         <input
//                                             name='recharge_time'
//                                             type="datetime-local"
//                                             id={`dateInput-nt`}
//                                             onChange={(e) => handleDateSelection(e)}
//                                             style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

//                                         />
//                                         {
//                                             recharge_time && <p className='text-danger'>{recharge_time}</p>
//                                         }
//                                     </div>
//                                     </div>


//                                     <div className="form-group row">
//                                         <div className="offset-md-3 col-sm-6">
//                                             <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MobileAllowanceCreate;
'use client'
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const MobileAllowanceCreate = () => {
    const [employeeName, setEmployeeName] = useState('');
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

    const router = useRouter();
    const [formData, setFormData] = useState({
        mobile: '', amount: '', recharge_user: employeeName || created_by, created_by: created_by, recharge_time: ''
    });

    const [displayDatess, setDisplayDatess] = useState(''); // Stores the formatted date as "11-08-2024"
    const [displayTimess, setDisplayTimess] = useState(''); // Stores the formatted time as "11:20 AM/PM"
    const [errorss, setErrorss] = useState(''); // State to manage error messages


    const handleDateSelections = (event) => {
        const inputDate = event.target.value; // Get the date-time input in yyyy-mm-ddTHH:MM format
        const [datePart, timePart] = inputDate.split('T'); // Separate the date and time parts

        const [year, month, day] = datePart.split('-');
        const formattedDisplayDate = `${day}-${month}-${year}`; // Format: 11-08-2024

        const selectedDate = new Date(datePart); // Create a new Date object
        // const selectedDate = new Date(datePart + ' ' + timePart); // Create a new Date object
        const currentDate = new Date();

        if (selectedDate > currentDate) {
            setErrorss('Date cannot be in the future.');
            return; // Exit the function without updating the state
        } else {
            setErrorss(''); // Clear any previous error
        }

        // Convert time to 12-hour format with AM/PM
        let hours = parseInt(timePart?.split(':')[0], 10);
        const minutes = timePart.split(':')[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format
        const formattedDisplayTime = `${hours}:${minutes} ${ampm}`; // Format: 11:20 AM/PM

        setDisplayDatess(formattedDisplayDate); // Display format: 11-08-2024
        setDisplayTimess(formattedDisplayTime); // Display format: 11:20 AM/PM

        setFormData((prevData) => ({
            ...prevData,
            recharge_time: `${datePart} ${timePart}`, // Store in MySQL format: "2024-08-11 11:20"
        }));
    };

    useEffect(() => {
        let dob = formData.recharge_time;

        // Auto-select current date and time if dob is empty
        if (!dob) {
            const currentDate = new Date();
            const datePart = currentDate.toISOString().split('T')[0]; // Format: 2024-08-11
            const timePart = currentDate.toTimeString().slice(0, 5); // Format: 11:20

            dob = `${datePart} ${timePart}`;
            setFormData((prevData) => ({
                ...prevData,
                recharge_time: dob,
            }));

            const [year, month, day] = datePart.split('-');
            setDisplayDatess(`${day}-${month}-${year}`);

            // Convert time to 12-hour format with AM/PM
            let hours = parseInt(timePart.split(':')[0], 10);
            const minutes = timePart.split(':')[1];
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            setDisplayTimess(`${hours}:${minutes} ${ampm}`);
        }
    }, [formData]);

    const [mobile, setMobile] = useState([]);
    const [amount, setAmount] = useState([]);
    const [recharge_time, setRecharge_time] = useState([]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'mobile') setMobile('');
        if (name === 'amount') setAmount('');
        if (name === 'recharge_time') setRecharge_time('');

        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const user_create = (event) => {
        event.preventDefault();

        const schoolShift = {
            ...formData,
            created_by,
        };

        if (!formData.mobile) {
            setMobile('Mobile number is Required');
            return;
        }
        if (!formData.amount) {
            setAmount('Amount is Required');
            return;
        }
        if (!formData.recharge_time) {
            setRecharge_time('Recharge time is Required');
            return;
        }
        console.log(schoolShift);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/mobile_allowance/mobile_allowance_create`, {
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
                    router.push('/Admin/mobile_allowance/mobile_allowance_all');
                }
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => console.error(error));
    };

    const { data: employeeList = [], isLoading } = useQuery({
        queryKey: ['employeeList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_all_list`);
            const data = await res.json();
            return data;
        }
    });

    const { data: branches = [] } = useQuery({
        queryKey: ['branches'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`);
            const data = await res.json();
            return data;
        }
    });

    const [selectedBranch, setSelectedBranch] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);

    useEffect(() => {
        if (selectedBranch) {
            const employeesInBranch = employeeList.filter(employee => employee.branch_id === parseFloat(selectedBranch));
            setFilteredEmployees(employeesInBranch);
        } else {
            setFilteredEmployees([]);
        }
    }, [selectedBranch, employeeList]);

    const groupedEmployees = filteredEmployees.reduce((groups, employee) => {
        const designation = employee.designation_name;
        if (!groups[designation]) {
            groups[designation] = [];
        }
        groups[designation].push(employee);
        return groups;
    }, {});

    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="card-default">
                            <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-period font-weight-bold mb-0 float-left mt-1">Mobile Allowance Create</h5>
                                <div className="card-title card-header-period font-weight-bold mb-0 float-right">
                                    <Link href="/Admin/mobile_allowance/mobile_allowance_all" className="btn btn-sm btn-info">Back to Mobile Allowance List</Link>
                                </div>
                            </div>

                            <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                            </div>
                            <div className="card-body">
                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={user_create}>
                                    <div className="form-group row">
                                        <label className="col-form-label font-weight-bold col-md-3">Branch Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                        <div className="col-md-6">
                                            <select
                                                onChange={(e) => {
                                                    const branchId = e.target.value;
                                                    setSelectedBranch(branchId);
                                                }}
                                                name="branch"
                                                className="form-control form-control-sm trim integer_no_zero whose_leave"
                                                id="branch"
                                            >
                                                <option value="">Select Branch</option>
                                                {branches.map(branch => (
                                                    <option key={branch.id} value={branch.id}>{branch.branch_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-form-label font-weight-bold col-md-3">Mobile Allowance For:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                        <div className="col-md-6">
                                            <select
                                                onChange={(e) => {
                                                    setEmployeeName(e.target.value);
                                                    handleChange(e);
                                                }}
                                                name="recharge_user"
                                                className="form-control form-control-sm trim integer_no_zero recharge_user"
                                                id="recharge_user"
                                            // disabled={!selectedBranch}  // Disable if no branch is selected
                                            >
                                                <option value="">Select Mobile Allowance Person</option>
                                                {Object.keys(groupedEmployees).map(designation => (
                                                    <optgroup key={designation} label={designation}>
                                                        {groupedEmployees[designation].map(employee => (
                                                            <option key={employee.user_id} value={employee.user_id}>
                                                                {employee.full_name}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-form-label font-weight-bold col-md-3">Mobile Number:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                        <div className="col-md-6">
                                            <input
                                                required
                                                onChange={handleChange}
                                                className="form-control form-control-sm required"
                                                id="mobile"
                                                placeholder="Enter Mobile Number"
                                                type="text"
                                                name="mobile"
                                            />
                                            {mobile && <p className='text-danger'>{mobile}</p>}
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-form-label font-weight-bold col-md-3">Recharge Amount:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                        <div className="col-md-6">
                                            <input
                                                required
                                                onChange={handleChange}
                                                className="form-control form-control-sm required"
                                                id="amount"
                                                placeholder="Enter Amount"
                                                type="text"
                                                name="amount"
                                            />
                                            {amount && <p className='text-danger'>{amount}</p>}
                                        </div>
                                    </div>


                                    <div className="form-group row">
                                        <label className="col-form-label font-weight-bold col-md-3">Recharge Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                readOnly
                                                // defaultValue={formattedDisplayDates}
                                                value={`${displayDatess} ${displayTimess}`}
                                                onClick={() => document.getElementById(`dateInput-ntn`).showPicker()}
                                                placeholder="dd-mm-YYYY"
                                                className="form-control form-control-sm"
                                                style={{ display: 'inline-block', }}
                                            />
                                            <input
                                                name='recharge_time'
                                                type="datetime-local"
                                                id={`dateInput-ntn`}
                                                onChange={(e) => handleDateSelections(e)}
                                                style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                            />
                                            {
                                                recharge_time && <p className='text-danger mb-0'>{recharge_time}</p>
                                            }
                                            {
                                                errorss && <p className='text-danger mb-0'>{errorss}</p>
                                            }

                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <div className="col-md-6 offset-md-3">
                                            <button type="submit" className="btn btn-sm btn-success">Save</button>
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

export default MobileAllowanceCreate;


