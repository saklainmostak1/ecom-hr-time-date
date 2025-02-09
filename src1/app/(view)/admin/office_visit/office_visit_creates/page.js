'use client' 
 //ismile
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const OfficeVisitCreate = () => {



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
        office_name: '',
        office_address: '',
        office_mobile: '',
        office_email: '',
        created_by: created_by,
        add_office_date: '',
        user_id: created_by,
        remarks_date: '',
        remarks: '',
        person_name: '',
        person_mobile: '',
        person_email: '',
        add_person_date: ''
    });




    // const [selectedDate, setSelectedDate] = useState([]);
    // const [formattedDisplayDate, setFormattedDisplayDate] = useState('');

    // const handleDateSelection = (event) => {
    //     const inputDate = event.target.value; // Directly get the value from the input

    //     const day = String(inputDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
    //     const month = String(inputDate.split('-')[1]).padStart(2, '0');
    //     const year = String(inputDate.split('-')[0]);
    //     const formattedDate = `${day}-${month}-${year}`;
    //     const formattedDatabaseDate = `${year}-${month}-${day}`;
    //     setSelectedDate(formattedDate);
    //     setFormData(prevData => ({
    //         ...prevData,
    //         add_office_date: formattedDatabaseDate // Update the dob field in the state
    //     }));


    //     if (formattedDatabaseDate) {
    //         setAdd_office_date('')
    //     }

    // };

    // console.log(selectedDate);

    // useEffect(() => {
    //     const dob = formData.add_office_date;
    //     const formattedDate = dob?.split('T')[0];

    //     if (formattedDate?.includes('-')) {
    //         const [year, month, day] = formattedDate.split('-');
    //         setFormattedDisplayDate(`${day}-${month}-${year}`);
    //     } else {
    //         console.log("Date format is incorrect:", formattedDate);
    //     }
    // }, [formData]);
    const [displayDates, setDisplayDates] = useState(''); // Stores the formatted date as "11-08-2024"
    const [displayTimes, setDisplayTimes] = useState(''); // Stores the formatted time as "11:20 AM/PM"
    const [errors, setErrors] = useState(''); // State to manage error messages


    const handleDateSelection = (event) => {
        const inputDate = event.target.value; // Get the date-time input in yyyy-mm-ddTHH:MM format
        const [datePart, timePart] = inputDate.split('T'); // Separate the date and time parts

        const [year, month, day] = datePart.split('-');
        const formattedDisplayDate = `${day}-${month}-${year}`; // Format: 11-08-2024

        const selectedDate = new Date(datePart); // Create a new Date object
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
            add_office_date: `${datePart} ${timePart}`, // Store in MySQL format: "2024-08-11 11:20"
        }));
    };

    useEffect(() => {
        let dob = formData.add_office_date;

        // Auto-select current date and time if dob is empty
        if (!dob) {
            const currentDate = new Date();
            const datePart = currentDate.toISOString().split('T')[0]; // Format: 2024-08-11
            const timePart = currentDate.toTimeString().slice(0, 5); // Format: 11:20

            dob = `${datePart} ${timePart}`;
            setFormData((prevData) => ({
                ...prevData,
                add_office_date: dob,
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



    // const [selectedDates, setSelectedDates] = useState([]);
    // const [formattedDisplayDates, setFormattedDisplayDates] = useState('');

    // const handleDateSelections = (event) => {
    //     const inputDate = event.target.value; // Directly get the value from the input

    //     const day = String(inputDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
    //     const month = String(inputDate.split('-')[1]).padStart(2, '0');
    //     const year = String(inputDate.split('-')[0]);
    //     const formattedDate = `${day}-${month}-${year}`;
    //     const formattedDatabaseDate = `${year}-${month}-${day}`;
    //     setSelectedDates(formattedDate);
    //     setFormData(prevData => ({
    //         ...prevData,
    //         remarks_date: formattedDatabaseDate // Update the dob field in the state
    //     }));

    //     if (formattedDatabaseDate) {
    //         setRemarks_date('')
    //     }

    // };

    // console.log(selectedDates);

    // useEffect(() => {
    //     const dob = formData.remarks_date;
    //     const formattedDate = dob?.split('T')[0];

    //     if (formattedDate?.includes('-')) {
    //         const [year, month, day] = formattedDate.split('-');
    //         setFormattedDisplayDates(`${day}-${month}-${year}`);
    //     } else {
    //         console.log("Date format is incorrect:", formattedDate);
    //     }
    // }, [formData]);
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
            remarks_date: `${datePart} ${timePart}`, // Store in MySQL format: "2024-08-11 11:20"
        }));
    };

    useEffect(() => {
        let dob = formData.remarks_date;

        // Auto-select current date and time if dob is empty
        if (!dob) {
            const currentDate = new Date();
            const datePart = currentDate.toISOString().split('T')[0]; // Format: 2024-08-11
            const timePart = currentDate.toTimeString().slice(0, 5); // Format: 11:20

            dob = `${datePart} ${timePart}`;
            setFormData((prevData) => ({
                ...prevData,
                remarks_date: dob,
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

    // const [selectedDatess, setSelectedDatess] = useState([]);
    // const [formattedDisplayDatess, setFormattedDisplayDatess] = useState('');
    // const [error, setError] = useState(''); // State to manage error messages

    // const handleDateSelectionss = (event) => {
    //     const inputDate = event.target.value; // Directly get the value from the input

    //     const day = String(inputDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
    //     const month = String(inputDate.split('-')[1]).padStart(2, '0');
    //     const year = String(inputDate.split('-')[0]);
    //     const formattedDate = `${day}-${month}-${year}`;
    //     const formattedDatabaseDate = `${year}-${month}-${day}`;
    //     const selectedDate = new Date(formattedDatabaseDate);
    //     const currentDate = new Date();

    //     if (selectedDate > currentDate) {
    //         setError('Date cannot be in the future.');
    //         return; // Exit the function without updating the state
    //     } else {
    //         setError(''); // Clear any previous error
    //     }

    //     setSelectedDatess(formattedDate);
    //     setFormData(prevData => ({
    //         ...prevData,
    //         add_person_date: formattedDatabaseDate // Update the dob field in the state
    //     }));

    //     if (formattedDatabaseDate) {
    //         setAdd_person_date('')
    //     }
    // };
    // useEffect(() => {
    //     let dob = formData.add_person_date;

    //     // Auto-select current date if dob is empty
    //     if (!dob) {
    //         const currentDate = new Date().toISOString().split('T')[0];
    //         dob = currentDate;
    //         setFormData((prevData) => ({
    //             ...prevData,
    //             add_person_date: currentDate,
    //         }));
    //     }

    //     const formattedDate = dob.split('T')[0];

    //     if (formattedDate.includes('-')) {
    //         const [year, month, day] = formattedDate.split('-');
    //         setFormattedDisplayDatess(`${day}-${month}-${year}`);
    //     } else {
    //         console.log("Date format is incorrect:", formattedDate);
    //     }
    // }, [formData]);
    // last
    // const [displayDate, setDisplayDate] = useState(''); // Stores the formatted date as "11-08-2024"
    // const [displayTime, setDisplayTime] = useState(''); // Stores the formatted time as "11:20"
    // const [error, setError] = useState(''); // State to manage error messages

    // const handleDateSelectionss = (event) => {
    //     const inputDate = event.target.value; // Get the date-time input in yyyy-mm-ddTHH:MM format
    //     const [datePart, timePart] = inputDate.split('T'); // Separate the date and time parts

    //     const [year, month, day] = datePart.split('-');
    //     const formattedDisplayDate = `${day}-${month}-${year}`; // Format: 11-08-2024

    //     const selectedDate = new Date(datePart + ' ' + timePart); // Create a new Date object
    //     const currentDate = new Date();

    //     if (selectedDate > currentDate) {
    //         setError('Date cannot be in the future.');
    //         return; // Exit the function without updating the state
    //     } else {
    //         setError(''); // Clear any previous error
    //     }

    //     setDisplayDate(formattedDisplayDate); // Display format: 11-08-2024
    //     setDisplayTime(timePart); // Display format: 11:20

    //     setFormData((prevData) => ({
    //         ...prevData,
    //         add_person_date: `${datePart} ${timePart}`, // Store in MySQL format: "2024-08-11 11:20"
    //     }));
    // };

    // useEffect(() => {
    //     let dob = formData.add_person_date;

    //     // Auto-select current date and time if dob is empty
    //     if (!dob) {
    //         const currentDate = new Date();
    //         const datePart = currentDate.toISOString().split('T')[0]; // Format: 2024-08-11
    //         const timePart = currentDate.toTimeString().slice(0, 5); // Format: 11:20

    //         dob = `${datePart} ${timePart}`;
    //         setFormData((prevData) => ({
    //             ...prevData,
    //             add_person_date: dob,
    //         }));

    //         const [year, month, day] = datePart.split('-');
    //         setDisplayDate(`${day}-${month}-${year}`);
    //         setDisplayTime(timePart);
    //     }
    // }, [formData]);

    // console.log(formData)


    const [displayDate, setDisplayDate] = useState(''); // Stores the formatted date as "11-08-2024"
    const [displayTime, setDisplayTime] = useState(''); // Stores the formatted time as "11:20 AM/PM"
    const [error, setError] = useState(''); // State to manage error messages


    const handleDateSelectionss = (event) => {
        const inputDate = event.target.value; // Get the date-time input in yyyy-mm-ddTHH:MM format
        const [datePart, timePart] = inputDate.split('T'); // Separate the date and time parts

        const [year, month, day] = datePart.split('-');
        const formattedDisplayDate = `${day}-${month}-${year}`; // Format: 11-08-2024

        const selectedDate = new Date(datePart); // Create a new Date object
        const currentDate = new Date();

        if (selectedDate > currentDate) {
            setError('Date cannot be in the future.');
            return; // Exit the function without updating the state
        } else {
            setError(''); // Clear any previous error
        }

        // Convert time to 12-hour format with AM/PM
        let hours = parseInt(timePart?.split(':')[0], 10);
        const minutes = timePart.split(':')[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format
        const formattedDisplayTime = `${hours}:${minutes} ${ampm}`; // Format: 11:20 AM/PM

        setDisplayDate(formattedDisplayDate); // Display format: 11-08-2024
        setDisplayTime(formattedDisplayTime); // Display format: 11:20 AM/PM

        setFormData((prevData) => ({
            ...prevData,
            add_person_date: `${datePart} ${timePart}`, // Store in MySQL format: "2024-08-11 11:20"
        }));
    };

    useEffect(() => {
        let dob = formData.add_person_date;

        // Auto-select current date and time if dob is empty
        if (!dob) {
            const currentDate = new Date();
            const datePart = currentDate.toISOString().split('T')[0]; // Format: 2024-08-11
            const timePart = currentDate.toTimeString().slice(0, 5); // Format: 11:20

            dob = `${datePart} ${timePart}`;
            setFormData((prevData) => ({
                ...prevData,
                add_person_date: dob,
            }));

            const [year, month, day] = datePart.split('-');
            setDisplayDate(`${day}-${month}-${year}`);

            // Convert time to 12-hour format with AM/PM
            let hours = parseInt(timePart.split(':')[0], 10);
            const minutes = timePart.split(':')[1];
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            setDisplayTime(`${hours}:${minutes} ${ampm}`);
        }
    }, [formData]);


    // const [selectedDatess, setSelectedDatess] = useState([]);
    // const [formattedDisplayDatess, setFormattedDisplayDatess] = useState('');

    // const handleDateSelectionss = (event) => {
    //     const inputDate = event.target.value; // Directly get the value from the input

    //     const day = String(inputDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
    //     const month = String(inputDate.split('-')[1]).padStart(2, '0');
    //     const year = String(inputDate.split('-')[0]);
    //     const formattedDate = `${day}-${month}-${year}`;
    //     const formattedDatabaseDate = `${year}-${month}-${day}`;
    //     setSelectedDatess(formattedDate);
    //     setFormData(prevData => ({
    //         ...prevData,
    //         add_person_date: formattedDatabaseDate // Update the dob field in the state
    //     }));

    //     if (formattedDatabaseDate) {
    //         setAdd_person_date('')
    //     }



    // };

    // console.log(selectedDates);

    // useEffect(() => {
    //     const dob = formData.add_person_date;
    //     const formattedDate = dob?.split('T')[0];

    //     if (formattedDate?.includes('-')) {
    //         const [year, month, day] = formattedDate.split('-');
    //         setFormattedDisplayDatess(`${day}-${month}-${year}`);
    //     } else {
    //         console.log("Date format is incorrect:", formattedDate);
    //     }
    // }, [formData]);





    const [office_name, setOffice_name] = useState([])
    const [office_address, setOffice_address] = useState([])
    const [add_office_date, setAdd_office_date] = useState([])
    const [office_email, setOffice_email] = useState([])
    const [office_mobile, setOffice_mobile] = useState([])
    const [remarks_date, setRemarks_date] = useState([])
    const [remarks, setRemarks] = useState([])
    const [person_name, setPerson_name] = useState([])
    const [person_mobile, setPerson_mobile] = useState([])
    const [person_email, setPerson_email] = useState([])
    const [add_person_date, setAdd_person_date] = useState([])

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...formData }
        attribute[name] = value


        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (name === 'office_email') {
            // Validate the email format
            if (!emailRegex.test(value)) {
                setOffice_email("Please enter a valid email in the format abcd@abcd.com");
            } else {
                setOffice_email(""); // Clear the error message if valid
            }
        }

        // const office_email = attribute['office_email'];
        // if (office_email) {
        //     setOffice_email(""); // Clear the error message
        // }

        const office_mobile = attribute['office_mobile'];
        if (office_mobile) {
            setOffice_mobile(""); // Clear the error message
        }
        const office_address = attribute['office_address'];
        if (office_address) {
            setOffice_address(""); // Clear the error message
        }
        const office_name = attribute['office_name'];
        if (office_name) {
            setOffice_name(""); // Clear the error message
        }

        const remarks_date = attribute['remarks_date'];
        if (remarks_date) {
            setRemarks_date(""); // Clear the error message
        }

        const remarks = attribute['remarks'];
        if (remarks) {
            setRemarks(""); // Clear the error message
        }

        const person_name = attribute['person_name'];
        if (person_name) {
            setPerson_name(""); // Clear the error message
        }

        const person_mobile = attribute['person_mobile'];
        if (person_mobile) {
            setPerson_mobile(""); // Clear the error message
        }



        if (name === 'person_email') {
            // Validate the email format
            if (!emailRegex.test(value)) {
                setPerson_email("Please enter a valid email in the format abcd@abcd.com");
            } else {
                setPerson_email(""); // Clear the error message if valid
            }
        }

        // const person_email = attribute['person_email'];
        // if (person_email) {
        //     setPerson_email(""); // Clear the error message
        // }

        const add_person_date = attribute['add_person_date'];
        if (add_person_date) {
            setAdd_person_date(""); // Clear the error message
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

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!formData.office_name) {
            setOffice_name("Office Name Is Required");
            return
            // Clear the error message
        }

        if (!formData.office_address) {
            setOffice_address("Office Address Is Required");
            return
            // Clear the error message
        }


        if (!formData.office_mobile) {
            setOffice_mobile("mobile is required");
            return
            // Clear the error message
        }

        if (!emailRegex.test(formData.office_email)) {
            setOffice_email("Please enter a valid email in the format abcd@abcd.com");
            return
        } else if (!formData.office_email) {
            setOffice_email("email Is required"); // Clear the error message if valid
            return
        }




        if (!formData.add_office_date) {
            setAdd_office_date("Add Office Date is Required");
            return
            // Clear the error message
        }




        if (!formData.remarks) {
            setRemarks("remarks is required");
            return
            // Clear the error message
        }

        if (!formData.remarks_date) {
            setRemarks_date(" remarks date is required");
            return
            // Clear the error message
        }



        if (!formData.person_name) {
            setPerson_name("person name is required");
            return
            // Clear the error message
        }


        if (!formData.person_mobile) {
            setPerson_mobile(" person mobile is required");
            return
            // Clear the error message
        }


        if (!formData.person_email) {
            setPerson_email("email is required");
            return
            // Clear the error message
        }
        if (!emailRegex.test(formData.person_email)) {
            setPerson_email("Please enter a valid email in the format abcd@abcd.com");
            return
        } else if (!formData.person_email) {
            setPerson_email("email Is required"); // Clear the error message if valid
            return
        }


        if (!formData.add_person_date) {
            setAdd_person_date("add person date is required");
            return
            // Clear the error message
        }

        console.log(schoolShift)
        // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/mobile_allowance/mobile_allowance_create

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_create`, {
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
                    router.push('/Admin/office_visit/office_visit_all');
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
                                <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">Office Visit Create </h5>
                                <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
                                    <Link href="/Admin/office_visit/office_visit_all" className="btn btn-sm btn-info">Back to Office Visit List</Link>
                                </div>
                            </div>

                            <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                            </div>
                            <div className="card-body">
                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={user_create}>
                                    <div class=" row no-gutters">
                                        <div class="col-md-6">
                                            <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3"> Office Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <input required=""
                                                    onChange={handleChange}
                                                    class="form-control form-control-sm required" id="title" placeholder="Enter Office Name " type="text" name="office_name" />
                                                {
                                                    office_name && <p className='text-danger mb-0'>{office_name}</p> 
                                                }

                                            </div>
                                            </div>


                                            <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3"> Office Mobile:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <input required=""
                                                    onChange={handleChange}
                                                    class="form-control form-control-sm required mb-2" id="title" placeholder="Enter Office Mobile Number" type="text" name="office_mobile"
                                                    maxLength={11}
                                                />
                                                {
                                                    office_mobile && <p className='text-danger mb-0'>{office_mobile}</p>
                                                }

                                            </div>
                                            </div>

                                            <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3"> Person Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <input required=""
                                                    onChange={handleChange}
                                                    class="form-control form-control-sm required" id="title" placeholder="Enter Person Name" type="text" name="person_name" />
                                                {
                                                    person_name && <p className='text-danger mb-0'>{person_name}</p>
                                                }
                                            </div>
                                            </div>
                                            <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3"> Person Email:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <input required=""
                                                    onChange={handleChange}
                                                    class="form-control form-control-sm required" id="title" placeholder="Enter Person Email" type="text" name="person_email" />
                                                {
                                                    person_email && <p className='text-danger mb-0'>{person_email}</p>
                                                }
                                            </div>
                                            </div>

                                            <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3"> Remarks:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <textarea required=""
                                                    onChange={handleChange}
                                                    class="form-control form-control-sm required mb-2" id="title" placeholder="Enter Remarks" type="text" name="remarks" />
                                                {
                                                    remarks && <p className='text-danger mb-0'>{remarks}</p>
                                                }
                                            </div>
                                            </div>


                                          
                                            <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3">Office Visit Date:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={`${displayDates} ${displayTimes}`}
                                                    onClick={() => document.getElementById(`dateInput-nt`).showPicker()}
                                                    placeholder="dd-mm-YYYY"
                                                    className="form-control form-control-sm"
                                                    style={{ display: 'inline-block', }}
                                                />
                                                <input
                                                    name='add_office_date'
                                                    type="datetime-local"
                                                    id={`dateInput-nt`}
                                                    onChange={(e) => handleDateSelection(e)}
                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                                />
                                                {
                                                    add_office_date && <p className='text-danger mb-0'>{add_office_date}</p>
                                                }
                                                {
                                                    errors && <p className='text-danger mb-0'>{errors}</p>
                                                }

                                            </div>
                                            </div>
                                        </div>



                                        <div class="col-md-6">
                                            <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3"> Office Address:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <input required=""
                                                    onChange={handleChange}
                                                    class="form-control form-control-sm required mb-2" id="title" placeholder="Enter Office Address Name" type="text" name="office_address" />
                                                {
                                                    office_address && <p className='text-danger mb-0'>{office_address}</p>
                                                }

                                            </div>
                                            </div>
                                            <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3"> Office Email:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <input required=""
                                                    onChange={handleChange}
                                                    class="form-control form-control-sm required mb-2" id="title" placeholder="Enter Office Email" type="text" name="office_email" />
                                                {
                                                    office_email && <p className='text-danger mb-0'>{office_email}</p>
                                                }

                                            </div>
                                            </div>

                                            <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3"> Person Mobile:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <input required=""
                                                    onChange={handleChange}
                                                    class="form-control form-control-sm required" id="title" placeholder="Enter Person Mobile" type="text" name="person_mobile"
                                                    maxLength={11}
                                                />
                                                {
                                                    person_mobile && <p className='text-danger mb-0'>{person_mobile}</p>
                                                }
                                            </div>
                                            </div>

                                            <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3"> Person Entry Date:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                {/* <input
                                                    type="text"
                                                    readOnly0
                                                    defaultValue={selectedDatess}
                                                    onClick={() => document.getElementById(`dateInput-ntnn`).showPicker()}
                                                    placeholder="dd-mm-YYYY"
                                                    className="form-control form-control-sm mb-2"
                                                    style={{ display: 'inline-block', }}
                                                />
                                                <input
                                                    name='add_person_date'
                                                    type="datetime-local"
                                                    id={`dateInput-ntnn`}
                                                    onChange={(e) => handleDateSelectionss(e)}
                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                                /> */}

                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={`${displayDate} ${displayTime}`}
                                                    onClick={() => document.getElementById('dateInput-ntnn').showPicker()}
                                                    placeholder="DD-MM-YYYY HH:MM"
                                                    className="form-control form-control-sm mb-2"
                                                    style={{ display: 'inline-block' }}
                                                />
                                                <input
                                                    name="add_person_date"
                                                    type="datetime-local"
                                                    id="dateInput-ntnn"
                                                    onChange={(e) => handleDateSelectionss(e)}
                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
                                                />
                                                {error && <p className="text-danger">{error}</p>}

                                                {
                                                    add_person_date && <p className='text-danger mb-0'>{add_person_date}</p>
                                                }

                                            </div>
                                            </div>

                                            <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3"> Remarks Date:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
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
                                                    name='remarks_date'
                                                    type="datetime-local"
                                                    id={`dateInput-ntn`}
                                                    onChange={(e) => handleDateSelections(e)}
                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                                />
                                                {
                                                    remarks_date && <p className='text-danger mb-0'>{remarks_date}</p>
                                                }
                                                {
                                                    errorss && <p className='text-danger mb-0'>{errorss}</p>
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

export default OfficeVisitCreate;