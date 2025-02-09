'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const OfficeVisitEdits = ({id}) => {



    const [modified_by, setCreated_by] = useState(() => {
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
        modified_by: modified_by,
        add_office_date: '',
        
    });


    const { data: office_visits_single = [], isLoading, refetch
    } = useQuery({
        queryKey: ['office_visits_single'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_list_single/${id}`)
            const data = await res.json()
            return data
        }
    })

    
    
    useEffect(() => {
        if (office_visits_single && office_visits_single[0]) {
            const { office_name, office_address, office_mobile, office_email, add_office_date } = office_visits_single[0];
            setFormData({

                office_name, office_address, office_mobile, office_email, add_office_date, modified_by: modified_by
            });
        }
    }, [office_visits_single, modified_by]);


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

 
    const [office_name, setOffice_name] = useState([])
    const [office_address, setOffice_address] = useState([])
    const [add_office_date, setAdd_office_date] = useState([])
    const [office_email, setOffice_email] = useState([])
    const [office_mobile, setOffice_mobile] = useState([])


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

    

        setFormData(attribute)
       
    };

    const user_create = (event) => {
        event.preventDefault();

        const schoolShift = {
            ...formData,
            modified_by,

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



        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_edit/${id}`, {
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

                        sessionStorage.setItem("message", "Data Update successfully!");
                    }
                    router.push('/Admin/office_visit/office_visit_all');
                }
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => console.error(error));
    };

    const date = new Date(formData.add_office_date);

    // Formatting the date part as DD-MM-YYYY
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getUTCFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    // Formatting the time part as hh:mm AM/PM
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    const formattedTime = date.toLocaleTimeString('en-US', options);

    console.log(`${formattedDate} ${formattedTime}`); // Outputs: "18-08-2024 11:42 AM"


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
                                                    value={formData.office_name}
                                                    class="form-control form-control-sm required" id="title" placeholder="Enter Office Name " type="text" name="office_name" />
                                                {
                                                    office_name && <p className='text-danger mb-0'>{office_name}</p> 
                                                }

                                            </div>
                                            </div>


                                            <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3"> Office Mobile:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <input required=""
                                                value={formData.office_mobile}
                                                    onChange={handleChange}
                                                    class="form-control form-control-sm required mb-2" id="title" placeholder="Enter Office Mobile Number" type="text" name="office_mobile"
                                                    maxLength={11}
                                                />
                                                {
                                                    office_mobile && <p className='text-danger mb-0'>{office_mobile}</p>
                                                }

                                            </div>
                                            </div>

                                          
                                          
                                            <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3">Office Visit Date:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={`${formattedDate} ${formattedTime}`}
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
                                                value={formData.office_address}
                                                    onChange={handleChange}
                                                    class="form-control form-control-sm required mb-2" id="title" placeholder="Enter Office Address Name" type="text" name="office_address" />
                                                {
                                                    office_address && <p className='text-danger mb-0'>{office_address}</p>
                                                }

                                            </div>
                                            </div>
                                            <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3"> Office Email:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <input required=""
                                                value={formData.office_email}
                                                    onChange={handleChange}
                                                    class="form-control form-control-sm required mb-2" id="title" placeholder="Enter Office Email" type="text" name="office_email" />
                                                {
                                                    office_email && <p className='text-danger mb-0'>{office_email}</p>
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

export default OfficeVisitEdits;