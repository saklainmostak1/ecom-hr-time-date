// 'use client' 
 //ismile
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';

// const LeaveApplicationEdit = ({id}) => {

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

//     const [formData, setFormData] = useState({
//         leave_category: '', start_date: '', receiver: '', whose_leave: '', end_date: '', created_by: created_by

//     });


//     const { data: LeaveApplicationSingle } = useQuery({
//         queryKey: ['LeaveApplicationSingle', id],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_all/${id}`);
//             const data = await res.json();
//             return data;
//         }
//     });


//     // console.log(LeaveApplicationSingle[0])

//     useEffect(() => {
//         if (LeaveApplicationSingle && LeaveApplicationSingle[0]) {
//             const { leave_category, whose_leave, start_date, end_date, receiver,   } = LeaveApplicationSingle[0];
//             setFormData({
//                 leave_category, whose_leave, start_date, end_date, receiver,  modified_by: created_by
//             });
//         }
//     }, [LeaveApplicationSingle, created_by]);

//     const handleChange = (event) => {

//         const name = event.target.name
//         const value = event.target.value
//         const attribute = { ...formData }
//         attribute[name] = value


//         setFormData(attribute)

//     };

//     const { data: employeeList = [], isLoading, refetch
//     } = useQuery({
//         queryKey: ['employeeList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`)

//             const data = await res.json()
//             return data
//         }
//     })

//     console.log(employeeList)

//     const groupedEmployees = employeeList.reduce((groups, employee) => {
//         const designation = employee.designation_name;
//         if (!groups[designation]) {
//             groups[designation] = [];
//         }
//         groups[designation].push(employee);
//         return groups;
//     }, {});

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
//             start_date: formattedDatabaseDate // Update the dob field in the state
//         }));


//     };

//     console.log(selectedDate);

//     useEffect(() => {
//         const dob = formData.start_date;
//         const formattedDate = dob?.split('T')[0];

//         if (formattedDate?.includes('-')) {
//             const [year, month, day] = formattedDate.split('-');
//             setFormattedDisplayDate(`${day}-${month}-${year}`);
//         } else {
//             console.log("Date format is incorrect:", formattedDate);
//         }
//     }, [formData]);

//     const [selectedDates, setSelectedDates] = useState([]);
//     const [formattedDisplayDates, setFormattedDisplayDates] = useState('');

//     const handleDateSelections = (event) => {
//         const inputDate = event.target.value; // Directly get the value from the input

//         const day = String(inputDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
//         const month = String(inputDate.split('-')[1]).padStart(2, '0');
//         const year = String(inputDate.split('-')[0]);
//         const formattedDate = `${day}-${month}-${year}`;
//         const formattedDatabaseDate = `${year}-${month}-${day}`;
//         setSelectedDates(formattedDate);
//         setFormData(prevData => ({
//             ...prevData,
//             end_date: formattedDatabaseDate // Update the dob field in the state
//         }));


//     };

//     console.log(selectedDates);

//     useEffect(() => {
//         const dob = formData.end_date;
//         const formattedDate = dob?.split('T')[0];

//         if (formattedDate?.includes('-')) {
//             const [year, month, day] = formattedDate.split('-');
//             setFormattedDisplayDates(`${day}-${month}-${year}`);
//         } else {
//             console.log("Date format is incorrect:", formattedDate);
//         }
//     }, [formData]);

//     const router = useRouter()

//     const user_create = (event) => {
//         event.preventDefault();


//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_edit/${id}`, {
//             method: 'POST',
//             headers: {
//                 'content-type': 'application/json',
//             },
//             body: JSON.stringify(formData),
//         })
//             .then((response) => {

//                 response.json()
//                 if (response.ok === true) {
//                     if (typeof window !== 'undefined') {
//                         sessionStorage.setItem("message", "Data saved successfully!");
//                     }
//                     router.push('/Admin/leave_application/leave_application_all');
//                 }
//             })
//             .then((data) => {
//                 console.log(data);

//             })
//             .catch((error) => console.error(error));
//     };

//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create PayRoll</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <Link href={`/Admin/payroll/payroll_all?page_group`} className="btn btn-sm btn-info">Back PayRoll List</Link>
//                                     </div>
//                                 </div>
//                                 <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                     (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                                 </div>
//                                 <div class="card-body">

//                                     <form class="" method="post" autocomplete="off" onSubmit={user_create}>

//                                         <div class="form-group row d-none">
//                                             <label class="col-form-label font-weight-bold col-md-3">Leave For:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div class="col-md-6">

//                                                 <select
//                                                 value={formData.whose_leave}
//                                                     onChange={handleChange}
//                                                     required="" name="whose_leave" class="form-control form-control-sm  trim integer_no_zero whose_leave " 
//                                                     readOnly
//                                                     id="whose_leave">
//                                                     <option value="">Select Applicant</option>
//                                                     {Object.keys(groupedEmployees).map(designation => (
//                                                         <optgroup key={designation} label={designation}>
//                                                             {groupedEmployees[designation].map(employee => (
//                                                                 <option key={employee.user_id} value={employee.user_id}>
//                                                                     {employee.full_name}
//                                                                 </option>
//                                                             ))}
//                                                         </optgroup>
//                                                     ))}

//                                                 </select>
//                                             </div>
//                                         </div>
//                                         <div class="form-group row">
//                                             <label class="col-form-label font-weight-bold col-md-3">Leave Category:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div class="col-md-6">
//                                                 <select
//                                                   value={formData.leave_category}
//                                                     onChange={handleChange}
//                                                     required="" name="leave_category" class="form-control form-control-sm  trim integer_no_zero" id="leave_category" placeholder="Enter Leave Category">
//                                                     <option value="">Select Leave Category</option>
//                                                     <option value="1">অসুস্থ</option>
//                                                     <option value="2">পারিবারিক সমস্যা</option>
//                                                     <option value="3">বিবাহ</option>

//                                                 </select>
//                                             </div>
//                                         </div>
//                                         <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> Start Date:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
//                                             <input
//                                                 type="text"
//                                                 readOnly0
//                                                 defaultValue={formattedDisplayDate}
//                                                 onClick={() => document.getElementById(`dateInput-nt`).showPicker()}
//                                                 placeholder="dd-mm-yyyy"
//                                                 className="form-control form-control-sm mb-2"
//                                                 style={{ display: 'inline-block', }}
//                                             />
//                                             <input
//                                                 name='start_date'
//                                                 type="date"
//                                                 id={`dateInput-nt`}
//                                                 onChange={(e) => handleDateSelection(e)}
//                                                 style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

//                                             />


//                                         </div>
//                                         </div>





//                                         <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> End Date:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
//                                             <input
//                                                 type="text"
//                                                 readOnly0
//                                                 defaultValue={formattedDisplayDates}
//                                                 onClick={() => document.getElementById(`dateInput-ntn`).showPicker()}
//                                                 placeholder="dd-mm-yyyy"
//                                                 className="form-control form-control-sm mb-2"
//                                                 style={{ display: 'inline-block', }}
//                                             />
//                                             <input
//                                                 name='end_date'
//                                                 type="date"
//                                                 id={`dateInput-ntn`}
//                                                 onChange={(e) => handleDateSelections(e)}
//                                                 style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

//                                             />


//                                         </div>
//                                         </div>
//                                         {/* <div class="form-group row">
//                                             <label class="col-form-label font-weight-bold col-md-3">Receiver:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div class="col-md-6">
//                                                 <select required="" name="receiver" class="form-control form-control-sm  trim integer_no_zero" id="receiver">
//                                                     <optgroup label="Principal">
//                                                         <option value="12498" selected="">মোঃ ইসমাঈল হোসেন</option>
//                                                     </optgroup>
//                                                 </select>
//                                             </div>
//                                         </div> */}
//                                         <div class="form-group row">
//                                             <label class="col-form-label font-weight-bold col-md-3">Receiver:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div class="col-md-6">

//                                                 <select
//                                                   value={formData.receiver}
//                                                     onChange={handleChange}
//                                                     required="" name="receiver" class="form-control form-control-sm  trim integer_no_zero whose_leave" id="whose_leave">
//                                                     <option value="">Select Receiver</option>
//                                                     {Object.keys(groupedEmployees).map(designation => (
//                                                         <optgroup key={designation} label={designation}>
//                                                             {groupedEmployees[designation].map(employee => (
//                                                                 <option key={employee.user_id} value={employee.user_id}>
//                                                                     {employee.full_name}
//                                                                 </option>
//                                                             ))}
//                                                         </optgroup>
//                                                     ))}

//                                                 </select>
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

// export default LeaveApplicationEdit;

'use client' 
 //ismile;
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const LeaveApplicationEdit = ({ id }) => {

    const [leaveFor, setLeaveFor] = useState([])

    console.log(leaveFor)
    // State for storing user ID
    const [created_by, setCreated_by] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });

    // Effect to initialize created_by state from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setCreated_by(storedUserId);
        }
    }, []);

    // State for form data
    const [formData, setFormData] = useState({
        leave_category: '', start_date: '', receiver: '', whose_leave: '', end_date: '', modified_by: created_by, leave_date: '', branch_id: '',
    });

    const { data: LeaveApplicationSingle } = useQuery({
        queryKey: ['LeaveApplicationSingle', id],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_all/${id}`);
            const data = await res.json();
            return data;
        }
    });


    // console.log(LeaveApplicationSingle[0])

    useEffect(() => {
        if (LeaveApplicationSingle && LeaveApplicationSingle[0]) {
            const { leave_category, whose_leave, start_date, end_date, receiver, branch_id } = LeaveApplicationSingle[0];
            setFormData({
                leave_category, whose_leave, start_date, end_date, receiver, branch_id, modified_by: created_by
            });
        }
    }, [LeaveApplicationSingle, created_by]);

    
    const [leave_category, setleave_category] = useState([])
    const [start_date, setstart_date] = useState([])
    const [receiver, setreceiver] = useState([])
    const [branch_id, setbranch_id] = useState([])
    const [end_date, setend_date] = useState([])
    const [whose_leave, setwhose_leave] = useState([])


    // Handle input changes for the form fields
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        if (name === 'whose_leave') {
            setLeaveFor(value); // Update leaveFor state
        }
        if (name === 'branch_id') {
            setFormData(prevData => ({
                ...prevData,
                branch_id: value,
                whose_leave: '' // Clear the employee selection when branch changes
            }));
            return;
        }


        if(name === 'leave_category'){
            setleave_category('')
        }
        if(name === 'start_date'){
            setstart_date('')
        }
        if(name === 'receiver'){
            setreceiver('')
        }
        if(name === 'branch_id'){
            setbranch_id('')
        }
        if(name === 'end_date'){
            setend_date('')
        }
        if(name === 'whose_leave'){
            setwhose_leave('')
        }
        

        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Fetch the list of employees
    const { data: employeeList = [], isLoading } = useQuery({
        queryKey: ['employeeList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_all_list`);
            const data = await res.json();
            return data;
        }
    });

    // Fetch the list of branches
    const { data: branches = [] } = useQuery({
        queryKey: ['branches'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`);
            const data = await res.json();
            return data;
        }
    });

    // State for selected branch and filtered employees
    const [selectedBranch, setSelectedBranch] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);

    // Filter employees based on selected branch
    useEffect(() => {
        if (formData.branch_id) {
            const employeesInBranch = employeeList.filter(employee => employee.branch_id === parseFloat(formData.branch_id));
            setFilteredEmployees(employeesInBranch);
        } else {
            setFilteredEmployees([]);
        }
    }, [formData, employeeList]);

    // Group employees by their designation
    const groupedEmployees = filteredEmployees.reduce((groups, employee) => {
        const designation = employee.designation_name;
        if (!groups[designation]) {
            groups[designation] = [];
        }
        groups[designation].push(employee);
        return groups;
    }, {});

    // Handle date selection for start date
    const [selectedDate, setSelectedDate] = useState([]);
    const [formattedDisplayDate, setFormattedDisplayDate] = useState('');

    const handleDateSelection = (event) => {
        const inputDate = event.target.value;
        const day = String(inputDate.split('-')[2]).padStart(2, '0');
        const month = String(inputDate.split('-')[1]).padStart(2, '0');
        const year = String(inputDate.split('-')[0]);
        const formattedDate = `${day}-${month}-${year}`;
        const formattedDatabaseDate = `${year}-${month}-${day}`;
        setSelectedDate(formattedDate);
        setFormData(prevData => ({
            ...prevData,
            start_date: formattedDatabaseDate
        }));

        if(formattedDatabaseDate){
            setstart_date('')
        }
    };

    useEffect(() => {
        const dob = formData.start_date;
        const formattedDate = dob?.split('T')[0];

        if (formattedDate?.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            setFormattedDisplayDate(`${day}-${month}-${year}`);
        } else {
            console.log("Date format is incorrect:", formattedDate);
        }
    }, [formData]);

    // Handle date selection for end date
    const [selectedDates, setSelectedDates] = useState([]);
    const [formattedDisplayDates, setFormattedDisplayDates] = useState('');

    const handleDateSelections = (event) => {
        const inputDate = event.target.value;
        const day = String(inputDate.split('-')[2]).padStart(2, '0');
        const month = String(inputDate.split('-')[1]).padStart(2, '0');
        const year = String(inputDate.split('-')[0]);
        const formattedDate = `${day}-${month}-${year}`;
        const formattedDatabaseDate = `${year}-${month}-${day}`;
        setSelectedDates(formattedDate);
        setFormData(prevData => ({
            ...prevData,
            end_date: formattedDatabaseDate
        }));
        if(formattedDatabaseDate){
            setend_date('')
        }
    };

    useEffect(() => {
        const dob = formData.end_date;
        const formattedDate = dob?.split('T')[0];

        if (formattedDate?.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            setFormattedDisplayDates(`${day}-${month}-${year}`);
        } else {
            console.log("Date format is incorrect:", formattedDate);
        }
    }, [formData]);

    // Generate a date range array
    const generateDateRange = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const dateArray = [];

        while (startDate <= endDate) {
            const currentDate = new Date(startDate);
            const day = String(currentDate.getDate()).padStart(2, '0');
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const year = currentDate.getFullYear();
            const formattedDate = `${year}-${month}-${day}`;
            dateArray.push(formattedDate);
            startDate.setDate(startDate.getDate() + 1);
        }

        return dateArray;
    };



    const router = useRouter()

    const user_create = (event) => {
        event.preventDefault();


        if(!formData.leave_category){
            setleave_category('Select a leave category')
            return
        }
        if(!formData.start_date){
            setstart_date('Start date is required')
            return
        }
        if(!formData.receiver){
            setreceiver('Receiver is required')
            return
        }
        if(!formData.branch_id){
            setbranch_id('Branch is required')
            return
        }
        else{
            setbranch_id('')
        }
        if(!formData.end_date){
            setend_date('End date is required')
            return
        }
        if(!formData.whose_leave){
            setwhose_leave('whose leave  is required')
            return
        }


        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_edit/${id}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {

                response.json()
                if (response.ok === true) {
                    if (typeof window !== 'undefined') {
                        sessionStorage.setItem("message", "Data saved successfully!");
                    }
                    router.push('/Admin/leave_application/leave_application_all');
                }
            })
            .then((data) => {
                console.log(data);

            })
            .catch((error) => console.error(error));
    };

    // Fetch the list of leave categories
    const { data: leaveCategory = [] } = useQuery({
        queryKey: ['leaveCategory'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_category/leave_category_list`);
            const data = await res.json();
            return data;
        }
    });



    // const groupedReceivers = employeeList.reduce((groups, employee) => {
    //     const designation = employee.designation_name;

    //     // Skip the employee with user_id 14012
    //     if (employee.user_id === parseFloat(leaveFor)) {
    //         return groups;
    //     }

    //     if (!groups[designation]) {
    //         groups[designation] = [];
    //     }

    //     groups[designation].push(employee);
    //     return groups;
    // }, {});

    const filteredOutEmployee = filteredEmployees.filter(employee => employee.user_id !== parseFloat(leaveFor));

    const groupedReceivers = filteredOutEmployee.reduce((groups, employee) => {
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
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create Leave Application</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/leave_application/leave_application_all?page_group`} className="btn btn-sm btn-info">Back Leave Application List</Link>
                                    </div>
                                </div>
                                <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                    (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                                </div>
                                <div className="card-body">
                                    <form method="post" autoComplete="off" onSubmit={user_create}>
                                        {/* <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Branch Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <select
                                                    onChange={(e) => {
                                                        const branchId = e.target.value;
                                                        setSelectedBranch(branchId);
                                                        handleChange(e);
                                                    }}
                                                    value={employee14012?.branch_id}
                                                    required
                                                    name="branch_id"
                                                    className="form-control form-control-sm trim integer_no_zero whose_leave"
                                                    id="whose_leave"
                                                    // value={formData.receiver}
                                                >
                                                    <option value="">Select Branch</option>
                                                    {branches.map(branch => (
                                                        <option key={branch.id} value={branch.id}>{branch.branch_name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Leave For:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <select
                                                    onChange={handleChange}
                                                    value={formData.whose_leave}
                                                    required
                                                    name="whose_leave"
                                                    className="form-control form-control-sm trim integer_no_zero whose_leave"
                                                    id="whose_leave"
                                                >
                                                    <option value="">Select Applicant</option>
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
                                        </div> */}
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Branch Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <select
                                                    value={formData.branch_id}
                                                    onChange={(e) => {
                                                      
                                                        setSelectedBranch(e.target.value);
                                                        handleChange(e)
                                                    }}
                                                    name="branch_id"
                                                    className="form-control form-control-sm trim integer_no_zero whose_leave"
                                                    id="branch"
                                                >
                                                    <option value="">Select Branch</option>
                                                    {branches.map(branch => (
                                                        <option key={branch.id} value={branch.id}>{branch.branch_name}</option>
                                                    ))}
                                                </select>
                                                {
                                                    branch_id && <p className='text-danger m-0'>{branch_id}</p>
                                                }
                                                 {/* <select
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
                                            </select> */}
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Leave For:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <select
                                                    onChange={(e) => {
                                                        setLeaveFor(e.target.value);
                                                        handleChange(e);
                                                    }}
                                                    value={formData.whose_leave}
                                                    name="whose_leave"
                                                    className="form-control form-control-sm trim integer_no_zero whose_leave"
                                                    id="whose_leave"
                                                // disabled={!selectedBranch}  // Disable if no branch is selected
                                                >
                                                    <option value="">Select Applicant</option>
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
                                                {
                                                    whose_leave && <p className='text-danger m-0'>{whose_leave}</p>
                                                }
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Leave Category:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <select
                                                    value={formData.leave_category}
                                                    onChange={handleChange}
                                                    
                                                    name="leave_category"
                                                    className="form-control form-control-sm trim integer_no_zero"
                                                    id="leave_category"
                                                    placeholder="Enter Leave Category"
                                                >
                                                    <option value="">Select Leave Category</option>
                                                    {leaveCategory.map(category => (
                                                        <option key={category.id} value={category.id}>{category.name}</option>
                                                    ))}
                                                </select>
                                                {
                                                    leave_category && <p className='text-danger m-0'>{leave_category}</p>
                                                }
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Start Date:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    defaultValue={formattedDisplayDate}
                                                    onClick={() => document.getElementById(`dateInput-nt`).showPicker()}
                                                    placeholder="dd-mm-yyyy"
                                                    className="form-control form-control-sm mb-2"
                                                    style={{ display: 'inline-block' }}
                                                />
                                                <input
                                                    name='start_date'
                                                    type="date"
                                                    id={`dateInput-nt`}
                                                    onChange={(e) => handleDateSelection(e)}
                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
                                                />
                                                 {
                                                    start_date && <p className='text-danger m-0'>{start_date}</p>
                                                }
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">End Date:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    defaultValue={formattedDisplayDates}
                                                    onClick={() => document.getElementById(`dateInput-ntn`).showPicker()}
                                                    placeholder="dd-mm-yyyy"
                                                    className="form-control form-control-sm mb-2"
                                                    style={{ display: 'inline-block' }}
                                                />
                                                <input
                                                    name='end_date'
                                                    type="date"
                                                    id={`dateInput-ntn`}
                                                    onChange={(e) => handleDateSelections(e)}
                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
                                                />
                                                 {
                                                    end_date && <p className='text-danger m-0'>{end_date}</p>
                                                }
                                            </div>
                                        </div>
                                        {/* <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Receiver:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <select
                                                    onChange={handleChange}
                                                    required
                                                    name="receiver"
                                                    className="form-control form-control-sm trim integer_no_zero"
                                                    id="receiver"
                                                >
                                                    <option value="">Select Receiver</option>
                                                    {employeeList.map(employee => (
                                                        <option key={employee.user_id} value={employee.user_id}>
                                                            {employee.full_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div> */}
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Receiver:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <select
                                                    onChange={handleChange}
                                                    
                                                    name="receiver"
                                                    className="form-control form-control-sm trim integer_no_zero"
                                                    id="receiver"
                                                    value={formData.receiver}
                                                >
                                                    <option value="">Select Receiver</option>
                                                    {Object.keys(groupedReceivers).map(designation => (
                                                        <optgroup key={designation} label={designation}>
                                                            {groupedReceivers[designation].map(employee => (
                                                                <option key={employee.user_id} value={employee.user_id}>
                                                                    {employee.full_name}
                                                                </option>
                                                            ))}
                                                        </optgroup>
                                                    ))}
                                                </select>
                                                {
                                                    receiver && <p className='text-danger m-0'>{receiver}</p>
                                                }
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

export default LeaveApplicationEdit;
