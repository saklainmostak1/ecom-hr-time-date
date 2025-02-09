'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const CreateTRansportAllowance = () => {

    const [leaveFor, setLeaveFor] = useState('')

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
        travel_from: '', travel_from_time: '', travel_to: '', travel_to_time: '', vehicle_name: '', km_travel: '', amount: '', user_id: leaveFor || created_by, created_by: created_by

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
            travel_to_time: `${datePart} ${timePart}`, // Store in MySQL format: "2024-08-11 11:20"
        }));
    };

    useEffect(() => {
        let dob = formData.travel_to_time;

        // Auto-select current date and time if dob is empty
        if (!dob) {
            const currentDate = new Date();
            const datePart = currentDate.toISOString().split('T')[0]; // Format: 2024-08-11
            const timePart = currentDate.toTimeString().slice(0, 5); // Format: 11:20

            dob = `${datePart} ${timePart}`;
            setFormData((prevData) => ({
                ...prevData,
                travel_to_time: dob,
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

    const [displayDates, setDisplayDates] = useState(''); // Stores the formatted date as "11-08-2024"
    const [displayTimes, setDisplayTimes] = useState(''); // Stores the formatted time as "11:20 AM/PM"
    const [errors, setErrors] = useState(''); // State to manage error messages


    const handleDateSelection = (event) => {
        const inputDate = event.target.value; // Get the date-time input in yyyy-mm-ddTHH:MM format
        const [datePart, timePart] = inputDate.split('T'); // Separate the date and time parts

        const [year, month, day] = datePart.split('-');
        const formattedDisplayDate = `${day}-${month}-${year}`; // Format: 11-08-2024

        const selectedDate = new Date(datePart); // Create a new Date object
        // const selectedDate = new Date(datePart + ' ' + timePart); // Create a new Date object
        const currentDate = new Date();

        if (selectedDate > currentDate) {
            setErrors('Date cannot be in the future.');
            return; // Exit the function without updating the state
        } else {
            setErrors(''); // Clear any previous error
        }

        // Convert time to 12-hour format with AM/PM
        let hours = parseInt(timePart?.split(':')[0], 10);
        const minutes = timePart.split(':')[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format
        const formattedDisplayTime = `${hours}:${minutes} ${ampm}`; // Format: 11:20 AM/PM

        setDisplayDates(formattedDisplayDate); // Display format: 11-08-2024
        setDisplayTimes(formattedDisplayTime); // Display format: 11:20 AM/PM

        setFormData((prevData) => ({
            ...prevData,
            travel_from_time: `${datePart} ${timePart}`, // Store in MySQL format: "2024-08-11 11:20"
        }));
    };

    useEffect(() => {
        let dob = formData.travel_from_time;

        // Auto-select current date and time if dob is empty
        if (!dob) {
            const currentDate = new Date();
            const datePart = currentDate.toISOString().split('T')[0]; // Format: 2024-08-11
            const timePart = currentDate.toTimeString().slice(0, 5); // Format: 11:20

            dob = `${datePart} ${timePart}`;
            setFormData((prevData) => ({
                ...prevData,
                travel_from_time: dob,
            }));

            const [year, month, day] = datePart.split('-');
            setDisplayDates(`${day}-${month}-${year}`);

            // Convert time to 12-hour format with AM/PM
            let hours = parseInt(timePart.split(':')[0], 10);
            const minutes = timePart.split(':')[1];
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            setDisplayTimes(`${hours}:${minutes} ${ampm}`);
        }
    }, [formData]);
    // const handleChange = (event) => {
    //     const { name, value } = event.target;
    //     setFormData(prevData => ({
    //         ...prevData,
    //         [name]: value
    //     }));
    // };
    const [travel_from, setTravel_from] = useState([])
    const [travel_from_time, setTravel_from_time] = useState([])
    const [travel_to, setTravel_to] = useState([])
    const [travel_to_time, setTravel_to_time] = useState([])
    const [vehicle_name, setVehicle_name] = useState([])
    const [km_travel, setKm_travel] = useState([])
    const [amount, setAmount] = useState([])
    const [user_id, setuser_id] = useState([])



    const handleChange = (event) => {


        const name = event.target.name
        const value = event.target.value
        const attribute = { ...formData }
        attribute[name] = value

        if (name === 'user_id') {
            setLeaveFor(value); // Update leaveFor state
        }

        const travel_from = attribute['travel_from'];
        if (travel_from) {
            setTravel_from(""); // Clear the error message
        }
        const user_id = attribute['user_id'];
        if (user_id) {
            setuser_id(""); // Clear the error message
        }

        const travel_from_time = attribute['travel_from_time'];
        if (travel_from_time) {
            setTravel_from_time(""); // Clear the error message
        }

        const travel_to = attribute['travel_to'];
        if (travel_to) {
            setTravel_to(""); // Clear the error message
        }

        const travel_to_time = attribute['travel_to_time'];
        if (travel_to_time) {
            setTravel_to_time(""); // Clear the error message
        }

        const vehicle_name = attribute['vehicle_name'];
        if (vehicle_name) {
            setVehicle_name(""); // Clear the error message
        }

        const km_travel = attribute['km_travel'];
        if (km_travel) {
            setKm_travel(""); // Clear the error message
        }

        const amount = attribute['amount'];
        if (amount) {
            setAmount(""); // Clear the error message
        }



        setFormData(attribute)

        // const { name, value } = event.target;
        // setFormData(prevData => ({
        //     ...prevData,
        //     [name]: value
        // }));
    };


    const user_create = (event) => {
        event.preventDefault();

        const schoolShift = {
            ...formData,
            created_by,

        };



        if (!formData.travel_from) {
            setTravel_from("Travel From Is Required");
            return
            // Clear the error message
        }
        if (!formData.user_id) {
            setuser_id("Travel Person Is Required");
            return
            // Clear the error message
        }


        if (!formData.travel_from_time) {
            setTravel_from_time("Travel From Time Is required");
            return
            // Clear the error message
        }


        if (!formData.travel_to) {
            setTravel_to("travel to is required");
            return
            // Clear the error message
        }


        if (!formData.travel_to_time) {
            setTravel_to_time("travel to time is required");
            return
            // Clear the error message
        }


        if (!formData.vehicle_name) {
            setVehicle_name("vehicle Name is required");
            return
            // Clear the error message
        }


        if (!formData.km_travel) {
            setKm_travel("travell km is required");
            return
            // Clear the error message
        }


        if (!formData.amount) {
            setAmount("amount is required");
            return
            // Clear the error message
        }


        console.log(schoolShift)
        // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/mobile_allowance/mobile_allowance_create

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/transport_allowance/transport_allowance_create`, {
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
                        router.push('/Admin/transport_allowance/transport_allowance_all');
                    }
                }
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => console.error(error));
    };

    const [selectedBranch, setSelectedBranch] = useState('');
    const { data: branches = [] } = useQuery({
        queryKey: ['branches'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`);
            const data = await res.json();
            return data;
        }
    });


    const { data: employeeList = [], isLoading } = useQuery({
        queryKey: ['employeeList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_all_list`);
            const data = await res.json();
            return data;
        }
    });
    const [filteredEmployees, setFilteredEmployees] = useState([]);

    // Filter employees based on selected branch
    useEffect(() => {
        if (selectedBranch) {
            const employeesInBranch = employeeList.filter(employee => employee.branch_id === parseFloat(selectedBranch));
            setFilteredEmployees(employeesInBranch);
        } else {
            setFilteredEmployees([]);
        }
    }, [selectedBranch, employeeList]);

    // Group employees by their designation
    const groupedEmployees = filteredEmployees.reduce((groups, employee) => {
        const designation = employee.designation_name;
        if (!groups[designation]) {
            groups[designation] = [];
        }
        groups[designation].push(employee);
        return groups;
    }, {});
    console.log(formData)
    return (
        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="card-default">
                            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">Transport Allowance Create </h5>
                                <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
                                    <Link href="/Admin/transport_allowance/transport_allowance_all" className="btn btn-sm btn-info">Back to Transport Allowance List</Link>
                                </div>
                            </div>

                            <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                            </div>
                            <div className="card-body">
                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={user_create}>

                                    <div class=" row no-gutters">
                                        <div class="col-md-6">

                                            <div className="form-group row">
                                                <label className="col-form-label font-weight-bold col-md-3">Branch Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                                <div className="col-md-8">
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

                                            <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> Travel From:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <input required=""
                                                    onChange={handleChange}
                                                    class="form-control form-control-sm required" id="title" placeholder="Enter Travel From Name" type="text" name="travel_from" />
                                                {
                                                    travel_from && <p className='text-danger m-0'>{travel_from}</p>
                                                }

                                            </div>
                                            </div>
                                            <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> Travel To:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <input required=""
                                                    onChange={handleChange}
                                                    class="form-control form-control-sm required" id="title" placeholder="Enter Travel To Name" type="text" name="travel_to" />
                                                {
                                                    travel_to && <p className='text-danger m-0'>{travel_to}</p>
                                                }
                                            </div>
                                            </div>

                                            <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Vehicle<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <input required=""
                                                    onChange={handleChange}
                                                    class="form-control form-control-sm required" id="title" placeholder="Enter Vehicle Name" type="text" name="vehicle_name" />
                                                {
                                                    vehicle_name && <p className='text-danger m-0'>{vehicle_name}</p>
                                                }
                                            </div>
                                            </div>
                                            <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Travel (KM)<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <input required=""
                                                    onChange={handleChange}
                                                    class="form-control form-control-sm required" id="title" placeholder="Enter Travel (KM)" type="text" name="km_travel" />
                                                {
                                                    km_travel && <p className='text-danger m-0'>{km_travel}</p>
                                                }
                                            </div>
                                            </div>

                                        </div>
                                        <div class="col-md-6">
                                            <div className="form-group row">
                                                <label className="col-form-label font-weight-bold col-md-3">Travel Person:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                                <div className="col-md-8">
                                                    <select
                                                        onChange={(e) => {
                                                            setLeaveFor(e.target.value);
                                                            handleChange(e);
                                                        }}
                                                        name="user_id"
                                                        className="form-control form-control-sm trim integer_no_zero whose_leave"
                                                        id="whose_leave"
                                                    // disabled={!selectedBranch}  // Disable if no branch is selected
                                                    >
                                                        <option value="">Select Travel Person</option>
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
                                                        user_id && <p className='text-danger m-0'>{user_id}</p>
                                                    }
                                                </div>
                                            </div>
                                            <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> Travel From Time:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={`${displayDates} ${displayTimes}`}
                                                    onClick={() => document.getElementById(`dateInput-nt`).showPicker()}
                                                    placeholder="dd-mm-yyyy"
                                                    className="form-control form-control-sm"
                                                    style={{ display: 'inline-block', }}
                                                />
                                                <input
                                                    name='travel_from_time'
                                                    type="datetime-local"
                                                    id={`dateInput-nt`}
                                                    onChange={(e) => handleDateSelection(e)}
                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                                />
                                                {
                                                    travel_from_time && <p className='text-danger m-0'>{travel_from_time}</p>
                                                }

                                            </div>
                                            </div>


                                            <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> Travel To Time:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={`${displayDatess} ${displayTimess}`}
                                                    onClick={() => document.getElementById(`dateInput-ntn`).showPicker()}
                                                    placeholder="dd-mm-yyyy"
                                                    className="form-control form-control-sm"
                                                    style={{ display: 'inline-block', }}
                                                />
                                                <input
                                                    name='travel_to_time'
                                                    type="datetime-local"
                                                    id={`dateInput-ntn`}
                                                    onChange={(e) => handleDateSelections(e)}
                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                                />
                                                {
                                                    travel_to_time && <p className='text-danger m-0'>{travel_to_time}</p>
                                                }

                                            </div>
                                            </div>





                                            <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3">Amount<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <input required=""
                                                    onChange={handleChange}
                                                    class="form-control form-control-sm required" id="title" placeholder="Enter Amount " type="text" name="amount" />
                                                {
                                                    amount && <p className='text-danger m-0'>{amount}</p>
                                                }
                                            </div>
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

export default CreateTRansportAllowance;