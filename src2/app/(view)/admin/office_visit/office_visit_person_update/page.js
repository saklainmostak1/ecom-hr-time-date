'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const OfficeVisitPersonUpdate = ({id}) => {


    const [created_by, setcreated_by] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setcreated_by(storedUserId);
        }
    }, []);



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
        person_name: '',
        person_mobile: '',
        person_email: '',
        add_person_date: '',
        modified_by: userId,
      

    });


    const { data: office_visits_persons = [], isLoading, refetch
    } = useQuery({
        queryKey: ['office_visits_persons'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list/${id}`)

            const data = await res.json()
            return data
        }
    })



    
    useEffect(() => {
        if (office_visits_persons && office_visits_persons[0]) {
            const { person_name, person_mobile, person_email, add_person_date } = office_visits_persons[0];
            setFormData({

                person_name, person_mobile, person_email, add_person_date, modified_by: userId
            });
        }
    }, [office_visits_persons, userId]);

    const [page_group, setPage_group] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pageGroup') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('pageGroup');
            setPage_group(storedUserId);
        }
    }, []);




    const [person_name, setPerson_name] = useState([])
    const [person_mobile, setPerson_mobile] = useState([])
    const [person_email, setPerson_email] = useState([])
    const [add_person_date, setAdd_person_date] = useState([])

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



        const person_name = attribute['person_name'];
        if (person_name) {
            setPerson_name(""); // Clear the error message
        }

        const person_mobile = attribute['person_mobile'];
        if (person_mobile) {
            setPerson_mobile(""); // Clear the error message
        }

        const person_email = attribute['person_email'];
        if (person_email) {
            setPerson_email(""); // Clear the error message
        }

        const add_person_date = attribute['add_person_date'];
        if (add_person_date) {
            setAdd_person_date(""); // Clear the error message
        }



        setFormData(attribute)
    };

    const router = useRouter()

    const user_create = (event) => {
        event.preventDefault();

        const schoolShift = {
            ...formData,
            created_by,

        };

        if (!formData.person_name) {
            setPerson_name("Person Name Is Required");
            return
            // Clear the error message
        }
        if (!formData.person_email) {
            setPerson_email("Email Is Required");
            return
            // Clear the error message
        }
        if (!formData.person_mobile) {
            setPerson_mobile("Mobile Is Required");
            return
            // Clear the error message
        }
        if (!formData.add_person_date) {
            setAdd_person_date("Add person date Is Required");
            return
            // Clear the error message
        }


        console.log(schoolShift)
        // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/mobile_allowance/mobile_allowance_create

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_edit/${id}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(schoolShift),
        })
            .then((Response) => {
                refetch()
                Response.json();
                console.log(Response);
                if (Response.ok === true) {
                    if (typeof window !== 'undefined') {

                        sessionStorage.setItem("message", "Data Update successfully!");
                    }
                    router.push(`/Admin/office_visit/office_visit_person/${office_visits_persons[0]?.office_visit_id}`);
                }
            })
            .then((data) => {
                console.log(data);
                refetch()
            })
            .catch((error) => console.error(error));
    };

  

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


    


    const office_visit_delete = id => {

        console.log(id)
        const proceed = window.confirm(`Are You Sure delete`)
        if (proceed) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_remarks_delete/${id}`, {
                method: "POST",

            })
                .then(Response => Response.json())
                .then(data => {
                    refetch()

                    console.log(data)
                })
        }
    }



    return (
        <div class="container-fluid">
        <div class=" row ">
            <div className='col-12 p-4'>
                <div className='card mb-4'>
                    <div class=" border-primary shadow-sm border-0">
                        <div class="bg-gradient-primary card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                            <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Office Visit Person Create</h5>
                            <div class="card-title font-weight-bold mb-0 card-header-color float-right">

                                <Link href={`/Admin/office_visit/office_visit_person/${office_visits_persons[0]?.office_visit_id}`} class="btn btn-sm btn-info">Back To Office Visit Person List</Link>
                            </div>
                        </div>


                        <div class="card-body">
                            <form class="" onSubmit={user_create}>



                                <div class=" row no-gutters">
                                    <div class="col-md-6">
                                        <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3">Person Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                            <input required=""
                                                onChange={handleChange}
                                                value={formData.person_name}
                                                class="form-control form-control-sm required mb-2" id="title" placeholder="Office Visit Person Name" type="text" name="person_name" />
                                            {
                                                person_name && <p className='text-danger'>{person_name}</p>
                                            }

                                        </div>
                                        </div>
                                        <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3">Email Address:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">

                                            <input required=""
                                                onChange={handleChange}
                                                value={formData.person_email}
                                                class="form-control form-control-sm required mb-2" id="title" placeholder="Office Visit Person Email" type="text" name="person_email" />
                                            {
                                                person_email && <p className='text-danger'>{person_email}</p>
                                            }

                                        </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3">Mobile:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                            <input required=""
                                             value={formData.person_mobile}
                                                onChange={handleChange}
                                                class="form-control form-control-sm required mb-2" id="title" placeholder="Office Visit Person Mobile" type="text" name="person_mobile" maxLength={11}/>
                                            {
                                                person_mobile && <p className='text-danger'>{person_mobile}</p>
                                            }

                                        </div>
                                        </div>
                                        <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3">Entry Date:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">

                                            <input
                                                type="text"
                                                readOnly
                                                // defaultValue={formattedDisplayDate}
                                                value={`${displayDate} ${displayTime}`}
                                                onClick={() => document.getElementById(`dateInput-nt`).showPicker()}
                                                placeholder="dd-mm-yyyy"
                                                className="form-control form-control-sm mb-2"
                                                style={{ display: 'inline-block', }}
                                            />
                                            <input
                                                name='add_person_date'
                                                type="datetime-local"
                                                id={`dateInput-nt`}
                                                // onChange={(e) => handleDateSelection(e)}
                                                onChange={(e) => handleDateSelectionss(e)}
                                                style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                            />
                                            {
                                                add_person_date && <p className='text-danger mb-0'>{add_person_date}</p>
                                            }
                                            {
                                                error && <p className='text-danger mb-0'>{error}</p>
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
                            <div class="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
                                <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default OfficeVisitPersonUpdate;