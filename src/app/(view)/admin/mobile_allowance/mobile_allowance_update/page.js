// 'use client'
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';

// const MobileAllowanceEdit = ({ id }) => {



//     const [employeeName, setEmployeeName] = useState('')
//     console.log(employeeName)


//     const [userId, setUserId] = useState(() => {
//         if (typeof window !== 'undefined') {
//             return localStorage.getItem('userId') || '';
//         }
//         return '';
//     });

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             const storedUserId = localStorage.getItem('userId');
//             setUserId(storedUserId);
//         }
//     }, []);

//     const [formData, setFormData] = useState({
//         mobile: '', amount: '', recharge_user: employeeName || userId, recharge_time: '',
//         modified_by: userId, branch_id: ''
//     });

//     const { data: mobileAllowanceSingle, isLoading, refetch } = useQuery({
//         queryKey: ['mobileAllowanceSingle', id],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/mobile_allowance/mobile_allowance_all/${id}`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     useEffect(() => {
//         if (mobileAllowanceSingle && mobileAllowanceSingle[0]) {
//             const { mobile, amount, recharge_time, recharge_user, branch_id } = mobileAllowanceSingle[0];
//             setFormData({

//                 mobile, amount, recharge_time, recharge_user, branch_id, modified_by: userId
//             });
//         }
//     }, [mobileAllowanceSingle, userId]);


//     const [mobile, setMobile] = useState([])
//     const [amount, setAmount] = useState([])
//     const [recharge_time, setRecharge_time] = useState([])



//     const [displayDatess, setDisplayDatess] = useState(''); // Stores the formatted date as "11-08-2024"
//     const [displayTimess, setDisplayTimess] = useState(''); // Stores the formatted time as "11:20 AM/PM"
//     const [errorss, setErrorss] = useState(''); // State to manage error messages


//     const handleDateSelections = (event) => {
//         const inputDate = event.target.value; // Get the date-time input in yyyy-mm-ddTHH:MM format
//         const [datePart, timePart] = inputDate.split('T'); // Separate the date and time parts

//         const [year, month, day] = datePart.split('-');
//         const formattedDisplayDate = `${day}-${month}-${year}`; // Format: 11-08-2024

//         const selectedDate = new Date(datePart); // Create a new Date object
//         // const selectedDate = new Date(datePart + ' ' + timePart); // Create a new Date object
//         const currentDate = new Date();

//         if (selectedDate > currentDate) {
//             setErrorss('Date cannot be in the future.');
//             return; // Exit the function without updating the state
//         } else {
//             setErrorss(''); // Clear any previous error
//         }

//         // Convert time to 12-hour format with AM/PM
//         let hours = parseInt(timePart?.split(':')[0], 10);
//         const minutes = timePart.split(':')[1];
//         const ampm = hours >= 12 ? 'PM' : 'AM';
//         hours = hours % 12 || 12; // Convert to 12-hour format
//         const formattedDisplayTime = `${hours}:${minutes} ${ampm}`; // Format: 11:20 AM/PM

//         setDisplayDatess(formattedDisplayDate); // Display format: 11-08-2024
//         setDisplayTimess(formattedDisplayTime); // Display format: 11:20 AM/PM

//         setFormData((prevData) => ({
//             ...prevData,
//             recharge_time: `${datePart} ${timePart}`, // Store in MySQL format: "2024-08-11 11:20"
//         }));
//     };

//     useEffect(() => {
//         let dob = formData.recharge_time;

//         // Auto-select current date and time if dob is empty
//         if (!dob) {
//             const currentDate = new Date();
//             const datePart = currentDate.toISOString().split('T')[0]; // Format: 2024-08-11
//             const timePart = currentDate.toTimeString().slice(0, 5); // Format: 11:20

//             dob = `${datePart} ${timePart}`;
//             setFormData((prevData) => ({
//                 ...prevData,
//                 recharge_time: dob,
//             }));

//             const [year, month, day] = datePart.split('-');
//             setDisplayDatess(`${day}-${month}-${year}`);

//             // Convert time to 12-hour format with AM/PM
//             let hours = parseInt(timePart.split(':')[0], 10);
//             const minutes = timePart.split(':')[1];
//             const ampm = hours >= 12 ? 'PM' : 'AM';
//             hours = hours % 12 || 12;
//             setDisplayTimess(`${hours}:${minutes} ${ampm}`);
//         }
//     }, [formData]);


//     const handleChange = (event) => {
//         const { name, value } = event.target;

//         if (name === 'branch_id') {
//             setFormData(prevData => ({
//                 ...prevData,
//                 branch_id: value,
//                 recharge_user: '' // Clear the employee selection when branch changes
//             }));
//             return;
//         }
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

//     const router = useRouter()

//     const handleSubmit = async (e) => {
//         e.preventDefault();

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

//         try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/mobile_allowance/mobile_allowance_edit/${id}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(formData)
//             });
//             const data = await response.json();
//             if (data.affectedRows > 0) {

//                 if (typeof window !== 'undefined') {

//                     sessionStorage.setItem("message", "Data Updated successfully!");
//                 }
//                 router.push('/Admin/mobile_allowance/mobile_allowance_all');
//             }
//             console.log(data); // Handle response data or success message
//         } catch (error) {
//             console.error('Error updating school shift:', error);
//             // Handle error or show an error message to the user
//         }
//     };
//     console.log(mobileAllowanceSingle)

//     const { data: employeeList = [] } = useQuery({
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


//     const [filteredEmployees, setFilteredEmployees] = useState([]);

//     // Filter employees based on selected branch
//     useEffect(() => {
//         if (formData.branch_id) {
//             const employeesInBranch = employeeList.filter(employee => employee.branch_id === parseFloat(formData.branch_id));
//             setFilteredEmployees(employeesInBranch);
//         } else {
//             setFilteredEmployees(employeeList);
//         }
//     }, [formData, employeeList]);

//     // Group employees by their designation
//     const groupedEmployees = filteredEmployees.reduce((groups, employee) => {
//         const designation = employee.designation_name;
//         if (!groups[designation]) {
//             groups[designation] = [];
//         }
//         groups[designation].push(employee);
//         return groups;
//     }, {});


//     console.log(formData.recharge_time)

//     const date = new Date(formData.recharge_time);

//     // Formatting the date part as DD-MM-YYYY
//     const day = String(date.getUTCDate()).padStart(2, '0');
//     const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
//     const year = date.getUTCFullYear();
//     const formattedDate = `${day}-${month}-${year}`;

//     // Formatting the time part as hh:mm AM/PM
//     const options = {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true
//     };
//     const formattedTime = date.toLocaleTimeString('en-US', options);

//     console.log(`${formattedDate} ${formattedTime}`); // Outputs: "18-08-2024 11:42 AM"


//     return (
//         <div class="container-fluid">
//             <div class=" row ">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="card-default">
//                             <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
//                                 <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">Mobile Allowance Edit</h5>
//                                 <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
//                                     <Link href="/Admin/mobile_allowance/mobile_allowance_all" className="btn btn-sm btn-info">Back to Mobile Allowance List</Link>
//                                 </div>
//                             </div>

//                             <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                 (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                             </div>
//                             <div className="card-body">
//                                 <form className="form-horizontal" method="post" autoComplete="off" onSubmit={handleSubmit}>
//                                     <div className="form-group row">
//                                         <label className="col-form-label font-weight-bold col-md-3">Branch Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                         <div className="col-md-6">
//                                             <select
//                                                 onChange={
//                                                     handleChange
//                                                 }
//                                                 value={formData?.branch_id}

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
//                                                 value={formData.recharge_user}

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

//                                             value={formData.mobile}
//                                             class="form-control form-control-sm required" id="title" placeholder="Enter Mobile Number" type="text" name="mobile" />
//                                         {
//                                             mobile && <p className='text-danger'>{mobile}</p>
//                                         }
//                                     </div>
//                                     </div>

//                                     <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Recharge Amount<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
//                                         <input required=""
//                                             onChange={handleChange}
//                                             value={formData.amount}
//                                             class="form-control form-control-sm required" id="title" placeholder="Enter Recharge Amount " type="text" name="amount" />
//                                         {
//                                             amount && <p className='text-danger'>{amount}</p>
//                                         }
//                                     </div>
//                                     </div>
//                                     <div className="form-group row">
//                                         <label className="col-form-label font-weight-bold col-md-3">Recharge Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                         <div className="col-md-6">
//                                             <input
//                                                 type="text"
//                                                 readOnly
//                                                 // defaultValue={formattedDisplayDates}
//                                                 // value={`${displayDatess} ${displayTimess}`}
//                                                 value={`${formattedDate} ${formattedTime}`}
//                                                 onClick={() => document.getElementById(`dateInput-ntn`).showPicker()}
//                                                 placeholder="dd-mm-YYYY"
//                                                 className="form-control form-control-sm"
//                                                 style={{ display: 'inline-block', }}
//                                             />
//                                             <input
//                                                 name='recharge_time'
//                                                 type="datetime-local"
//                                                 id={`dateInput-ntn`}
//                                                 onChange={(e) => handleDateSelections(e)}
//                                                 style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

//                                             />
//                                             {
//                                                 recharge_time && <p className='text-danger mb-0'>{recharge_time}</p>
//                                             }
//                                             {
//                                                 errorss && <p className='text-danger mb-0'>{errorss}</p>
//                                             }

//                                         </div>
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

// export default MobileAllowanceEdit;

'use client'
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const MobileAllowanceEdit = ({ id }) => {
    const [employeeName, setEmployeeName] = useState('');

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
        mobile: '', amount: '', recharge_user: employeeName || userId, recharge_time: '',
        modified_by: userId, branch_id: ''
    });

    const { data: mobileAllowanceSingle, isLoading, refetch } = useQuery({
        queryKey: ['mobileAllowanceSingle', id],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/mobile_allowance/mobile_allowance_all/${id}`);
            const data = await res.json();
            return data;
        }
    });

    useEffect(() => {
        if (mobileAllowanceSingle && mobileAllowanceSingle[0]) {
            const { mobile, amount, recharge_time, recharge_user, branch_id } = mobileAllowanceSingle[0];
            setFormData({
                mobile, amount, recharge_time, recharge_user, branch_id, modified_by: userId
            });
        }
    }, [mobileAllowanceSingle, userId]);

    const [mobile, setMobile] = useState([]);
    const [amount, setAmount] = useState([]);
    const [recharge_time, setRecharge_time] = useState([]);
    const [displayDatess, setDisplayDatess] = useState(''); // Stores the formatted date as "11-08-2024"
    const [displayTimess, setDisplayTimess] = useState(''); // Stores the formatted time as "11:20 AM/PM"
    const [errorss, setErrorss] = useState(''); // State to manage error messages

    const handleDateSelections = (event) => {
        const inputDate = event.target.value; // Get the date-time input in yyyy-mm-ddTHH:MM format
        const [datePart, timePart] = inputDate.split('T'); // Separate the date and time parts

        const [year, month, day] = datePart.split('-');
        const formattedDisplayDate = `${day}-${month}-${year}`; // Format: 11-08-2024

        const selectedDate = new Date(datePart);
        const currentDate = new Date();

        if (selectedDate > currentDate) {
            setErrorss('Date cannot be in the future.');
            return; // Exit the function without updating the state
        } else {
            setErrorss(''); // Clear any previous error
        }

        let hours = parseInt(timePart?.split(':')[0], 10);
        const minutes = timePart.split(':')[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format
        const formattedDisplayTime = `${hours}:${minutes} ${ampm}`; // Format: 11:20 AM/PM

        setDisplayDatess(formattedDisplayDate);
        setDisplayTimess(formattedDisplayTime);

        setFormData((prevData) => ({
            ...prevData,
            recharge_time: `${datePart} ${timePart}`,
        }));
    };

    useEffect(() => {
        let dob = formData.recharge_time;

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

            let hours = parseInt(timePart.split(':')[0], 10);
            const minutes = timePart.split(':')[1];
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            setDisplayTimess(`${hours}:${minutes} ${ampm}`);
        }
    }, [formData]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'branch_id') {
            setFormData(prevData => ({
                ...prevData,
                branch_id: value,
                recharge_user: '' // Clear the employee selection when branch changes
            }));
            return;
        }

        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

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

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/mobile_allowance/mobile_allowance_edit/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.affectedRows > 0) {
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem("message", "Data Updated successfully!");
                }
                router.push('/Admin/mobile_allowance/mobile_allowance_all');
            }
            console.log(data);
        } catch (error) {
            console.error('Error updating school shift:', error);
        }
    };

    const { data: employeeList = [] } = useQuery({
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

    const [filteredEmployees, setFilteredEmployees] = useState([]);

    // useEffect(() => {
    //     if (formData.branch_id) {
    //         const employeesInBranch = employeeList.filter(employee => employee.branch_id === parseFloat(formData.branch_id));
    //         setFilteredEmployees(employeesInBranch);
    //     } else {
    //         setFilteredEmployees(employeeList);
    //     }
    // }, [formData.branch_id, employeeList]);
    useEffect(() => {
        if (formData.branch_id) {
            const employeesInBranch = employeeList.filter(employee => employee.branch_id === parseFloat(formData.branch_id));
            setFilteredEmployees(employeesInBranch);
        } else {
            setFilteredEmployees([]); // Set to empty array if no branch is selected
        }
    }, [formData.branch_id, employeeList]);


    const groupedEmployees = filteredEmployees.reduce((groups, employee) => {
        const designation = employee.designation_name;
        if (!groups[designation]) {
            groups[designation] = [];
        }
        groups[designation].push(employee);
        return groups;
    }, {});

    const [formattedTime, setformattedTime] = useState([])
    const [formattedDate, setformattedDate] = useState([])


    useEffect(() => {

        const date = new Date(formData.recharge_time);

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        setformattedDate(formattedDate)
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        const formattedTime = date.toLocaleTimeString('en-US', options);
        setformattedTime(formattedTime)
    }, [formData])







    return (

        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="card-default">
                            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">Mobile Allowance Edit</h5>
                                <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
                                    <Link href="/Admin/mobile_allowance/mobile_allowance_all" className="btn btn-sm btn-info">Back to Mobile Allowance List</Link>
                                </div>
                            </div>

                            <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                            </div>
                            <div className="card-body">
                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={handleSubmit}>
                                    <div className="form-group row">
                                        <label className="col-form-label font-weight-bold col-md-3">Branch Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                        <div className="col-md-6">
                                            <select
                                                className="form-control"
                                                id="branch_id"
                                                name="branch_id"
                                                value={formData.branch_id}
                                                onChange={(e) => {
                                                    setEmployeeName(e.target.value);
                                                    handleChange(e)
                                                }}
                                            >
                                                <option value="">Select a Branch</option>
                                                {branches.map(branch => (
                                                    <option key={branch.id} value={branch.id}>
                                                        {branch.branch_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-form-label font-weight-bold col-md-3">Mobile Allowance For:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                        <div className="col-md-6">
                                            <select
                                                className="form-control"
                                                id="recharge_user"
                                                name="recharge_user"
                                                value={formData.recharge_user}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select an Employee</option>
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

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Mobile Number:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}

                                            value={formData.mobile}
                                            class="form-control form-control-sm required" id="title" placeholder="Enter Mobile Number" type="text" name="mobile" />
                                        {
                                            mobile && <p className='text-danger'>{mobile}</p>
                                        }
                                    </div>
                                    </div>

                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Recharge Amount<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}
                                            value={formData.amount}
                                            class="form-control form-control-sm required" id="title" placeholder="Enter Recharge Amount " type="text" name="amount" />
                                        {
                                            amount && <p className='text-danger'>{amount}</p>
                                        }
                                    </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-form-label font-weight-bold col-md-3">Recharge Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                readOnly
                                                // defaultValue={formattedDisplayDates}
                                                // value={`${displayDatess} ${displayTimess}`}
                                                value={`${formattedDate} ${formattedTime}`}
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
}

export default MobileAllowanceEdit;


