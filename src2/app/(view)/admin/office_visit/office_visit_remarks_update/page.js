'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const OfficeVisitRemarksEdit = ({ id }) => {

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
        remarks_date: '',
        remarks: '',
        modified_by: userId

    });


    const { data: office_visits_remarksSingles = [], isLoading, refetch
    } = useQuery({
        queryKey: ['office_visits_remarksSingles'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_remarks_list/${id}`)

            const data = await res.json()
            return data
        }
    })
    console.log(office_visits_remarksSingles)
    console.log(formData)



    useEffect(() => {
        if (office_visits_remarksSingles && office_visits_remarksSingles[0]) {
            const { remarks_date, remarks } = office_visits_remarksSingles[0];
            setFormData({

                remarks_date, remarks, modified_by: userId
            });
        }
    }, [office_visits_remarksSingles, userId]);

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


    const [remarks_date, setRemarks_date] = useState([])
    const [remarks, setRemarks] = useState([])



    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...formData }
        attribute[name] = value

        const remarks_date = attribute['remarks_date'];
        if (remarks_date) {
            setRemarks_date(""); // Clear the error message
        }

        const remarks = attribute['remarks'];
        if (remarks) {
            setRemarks(""); // Clear the error message
        }



        setFormData(attribute)
        // const { name, value } = event.target;
        // setFormData(prevData => ({
        //     ...prevData,
        //     [name]: value
        // }));
    };
    const [displayDatess, setDisplayDatess] = useState(''); // Stores the formatted date as "11-08-2024"
    const [displayTimess, setDisplayTimess] = useState(''); // Stores the formatted time as "11:20 AM/PM"
    const [errorss, setErrorss] = useState(''); // State to manage error messages


    const handleDateSelections = (event) => {
        const inputDate = event.target.value; // Get the date-time input in yyyy-mm-ddTHH:MM format
        const [datePart, timePart] = inputDate.split('T'); // Separate the date and time parts

        const [year, month, day] = datePart.split('-');
        const formattedDisplayDate = `${day}-${month}-${year}`; // Format: 11-08-2024

        const selectedDate = new Date(datePart); // Create a new Date object
        const currentDate = new Date();

        if (selectedDate > currentDate) {
            setErrorss('Date cannot be in the future.');
            return; // Exit the function without updating the state
        } else {
            setErrorss(''); // Clear any previous error
        }

        // Convert time to 12-hour format with AM/PM
        let hours = parseInt(timePart?.split(':')[0], 10);
        const minutes = timePart?.split(':')[1];
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

            console.log(dob)

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


    const router = useRouter()

    const user_create = (event) => {
        event.preventDefault();

        const schoolShift = {
            ...formData,
            created_by,

        };

        if (!formData.remarks) {
            setRemarks("Remarks Must be filled");
            return
            // Clear the error message
        }

        if (!formData.remarks_date) {
            setRemarks_date("Remarks Date must Be filled");
            return
            // Clear the error message
        }

        console.log(schoolShift)
       
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_remarks_edit/${id}`, {
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
                    if (typeof window !== '') {

                        sessionStorage.setItem("message", "Data Updated successfully!");
                    }
                    router.push(`/Admin/office_visit/office_visit_remarks/${office_visits_remarksSingles[0]?.office_visit_id}`);
                }
            })
            .then((data) => {
                console.log(data);
                refetch()
            })
            .catch((error) => console.error(error));
    };


    return (
        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    <div className='card mb-4'>
                        <div class=" border-primary shadow-sm border-0">
                            <div class="bg-gradient-primary card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Remarks Create</h5>
                                <div class="card-title font-weight-bold mb-0 card-header-color float-right">

                                    <Link href={`/Admin/office_visit/office_visit_remarks/${office_visits_remarksSingles[0]?.office_visit_id}`} class="btn btn-sm btn-info">Back To Office Visit Remarks List</Link>
                                </div>
                            </div>


                            <div class="card-body">
                                <form class="" onSubmit={user_create}>
                                    <div class=" row no-gutters">
                                        <div class="col-md-6">
                                            <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3"> Remarks Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <textarea required=""
                                                    value={formData.remarks}
                                                    onChange={handleChange}
                                                    class="form-control form-control-sm required mb-2" id="title" placeholder="Office Visit Remarks Name" type="text" name="remarks" />

                                                {
                                                    remarks && <p className='text-danger'>{remarks}</p>
                                                }

                                            </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3">Remarks Date:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={`${displayDatess} ${displayTimess}`}
                                                    onClick={() => document.getElementById(`dateInput-nt`).showPicker()}
                                                    placeholder="dd-mm-yyyy"
                                                    className="form-control form-control-sm"
                                                    style={{ display: 'inline-block', }}
                                                />
                                                <input
                                                    name='remarks_date'
                                                    type="datetime-local"
                                                    id={`dateInput-nt`}
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

export default OfficeVisitRemarksEdit;