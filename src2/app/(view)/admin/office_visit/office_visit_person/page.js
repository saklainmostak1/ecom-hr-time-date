'use client' 
 //ismile
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Select from 'react-dropdown-select';
import Link from 'next/link';
import '../../../admin_layout/modal/fa.css'
import Swal from 'sweetalert2';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import jsPDF from 'jspdf';
import * as XLSX from "xlsx";
import 'jspdf-autotable';
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, WidthType } from 'docx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaUpload } from 'react-icons/fa';


const OfficeVisitPerson = ({ id, searchParams }) => {



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
        created_by: created_by,
        user_id: created_by,
        office_visit_id: id

    });


    const { data: office_visits_persons = [], isLoading, refetch
    } = useQuery({
        queryKey: ['office_visits_persons'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_all/${id}`)

            const data = await res.json()
            return data
        }
    })
    console.log(office_visits_persons)

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

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (name === 'person_email') {
            // Validate the email format
            if (!emailRegex.test(value)) {
                setPerson_email("Please enter a valid email in the format abcd@abcd.com");
            } else {
                setPerson_email(""); // Clear the error message if valid
            }
        }

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
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.person_email)) {
            setPerson_email("Please enter a valid email in the format abcd@abcd.com");
            return
        } else if (!formData.person_email) {
            setPerson_email("email Is required"); // Clear the error message if valid
            return
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

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_create`, {
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
                    caregory_list()
                    if (typeof window !== 'undefined') {

                        sessionStorage.setItem("message", "Data saved successfully!");
                    }
                    // router.push('/Admin/transport_allowance/transport_allowance_all');
                }
            })
            .then((data) => {
                console.log(data);
                refetch()
            })
            .catch((error) => console.error(error));
    };

    const { data: moduleInfo = []
    } = useQuery({
        queryKey: ['moduleInfo'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${userId}`)

            const data = await res.json()
            return data
        }
    })

    // console.log(moduleInfo.filter(moduleI => moduleI.controller_name === 'brand'))
    const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'office_visit')
    const filteredBtnIconPerson = brandList.filter(btn =>
        btn.method_sort === 9
    );


    const [message, setMessage] = useState();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const interval = setInterval(() => {
                if (sessionStorage.getItem("message")) {
                    setMessage(sessionStorage.getItem("message"));
                    sessionStorage.removeItem("message");
                    clearInterval(interval); // Clear the interval after loading the message
                }
            }, 100); // 1 second interval

            // Cleanup the interval if the component unmounts before the message is loaded
            return () => clearInterval(interval);
        }
    }, []);


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


    const filteredBtnIconEdit = brandList.filter(btn =>
        btn.method_sort === 3
    );

    const filteredBtnIconDelete = brandList.filter(btn =>
        btn.method_sort === 5
    );


    const filteredBtnIconRemarks = brandList.filter(btn =>
        btn.method_sort === 10
    );


    // Paigination start
    const parentUsers = office_visits_persons[0]?.persons

    const totalData = parentUsers?.length
    const dataPerPage = 20

    const totalPages = Math.ceil(totalData / dataPerPage)

    let currentPage = 1


    if (Number(searchParams.page) >= 1) {
        currentPage = Number(searchParams.page)
    }


    let pageNumber = []
    for (let index = currentPage - 2; index <= currentPage + 2; index++) {
        if (index < 1) {
            continue
        }
        if (index > totalPages) {
            break
        }
        pageNumber.push(index)
    }
    const [pageUsers, setPageUsers] = useState([]);
    const caregory_list = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list/${currentPage}/${dataPerPage}/${id}`;
        const response = await fetch(url);
        const data = await response.json();
        setPageUsers(data);
    };

    // useEffect(() => {
    //     caregory_list();
    // }, [currentPage]);
    useEffect(() => {
        // Create a timer ID for cleanup
        const timerId = setTimeout(() => {
            caregory_list();
        }, 100); // 1000 milliseconds = 1 second

        // Cleanup function to clear the timeout if the component unmounts or currentPage changes
        return () => {
            clearTimeout(timerId);
        };
    }, [currentPage]);

    const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;



    const office_visit_delete = id => {

        console.log(id)
        const proceed = window.confirm(`Are You Sure delete`)
        if (proceed) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_delete/${id}`, {
                method: "POST",

            })
                .then(Response => Response.json())
                .then(data => {
                    refetch()
                    caregory_list()
                    console.log(data)
                })
        }
    }
    console.log(pageUsers)

    const buttonStyles = {
        color: '#fff',
        backgroundColor: '#510bc4',
        backgroundImage: 'none',
        borderColor: '#4c0ab8',
    };


    const expense_excel_download = async () => {
        try {
            // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_search/${id}`, {
                itemName,
                fromDate,
                toDate,
                mobile,
                email
            });

            const searchResults = response.data.results;

            // Ensure searchResults is an array


            // Static columns for Excel export
            const filteredColumns = searchResults.map((category, index) => ({
                'SL No.': index + 1, // Serial column
                'Person Name': category.person_name,
                'Person Mobile': category.person_mobile,
                'Person Email': category.person_email,
                'Add Person Date': category.add_person_date.slice(0, 10),
            }));

            // Create worksheet with filtered data
            const worksheet = XLSX.utils.json_to_sheet(filteredColumns);

            // Set width for each column
            const columnWidths = [
                { wpx: 50 }, // Serial
                { wpx: 150 }, // Person Name
                { wpx: 150 }, // Person Mobile
                { wpx: 200 }, // Person Email
                { wpx: 150 }, // Add Person Date
            ];
            worksheet['!cols'] = columnWidths;

            // Create workbook and write to file
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, 'search_results.xlsx');
        } catch (error) {
            console.error("An error occurred during printing.", error);
            setError("An error occurred during printing.", error);
        }
    };



    const [errorr, setErrorr] = useState([])
    const [mobile, setMobile] = useState([])
    const [email, setEmail] = useState([])
    const [searchResults, setSearchResults] = useState([])

    const person_search = () => {
        // setLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_search/${id}`, {
            itemName,
            fromDate,
            toDate,
            mobile,
            email
        })
            .then(response => {
                setSearchResults(response.data.results);
                setError(null);
                // setLoading(false);
                if (response.data.results == '') {
                    alert('Nothing found!');
                }
            })
            .catch(error => {
                setError("An error occurred during search.", error);
                setSearchResults([]);
            });
    };

    console.log(searchResults)

    const expense_PDF_download = async () => {

        // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_search/${id}`, {
            itemName,
            fromDate,
            toDate,
            mobile,
            email
        });

        const searchResults = response.data.results

        console.log(searchResults)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults
                    // Other parameters if needed
                }),

                // If you need to send any data with the request, you can include it here
                // body: JSON.stringify({ /* your data */ }),
            });

            if (!response.ok) {
                throw new Error('Error generating PDF In Period');
            }


            // If you want to download the PDF automatically
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'period_pdf.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            setErrorr(error.message);
        } finally {
            // setLoading(false);
        }
    };

    const office_visit_person_Print_download = async () => {
        try {
            // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_search/${id}`, {
                itemName,
                fromDate,
                toDate,
                mobile,
                email
            });

            const searchResults = response.data.results;

            console.log(searchResults);

            const printWindow = window.open('', '_blank');
            printWindow.document.open();

            const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_print`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults
                }),
            });

            const htmlText = await html.text();

            printWindow.document.write(htmlText);
            printWindow.document.close(); // Ensure the document is completely loaded before printing
            printWindow.focus();
        } catch (error) {
            console.error('Error generating print view:', error.message);
        }
    };

    const [fromDate, setFromDate] = useState('');
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        return `${day}-${month}-${year}`;
    };
    const handleTextInputClick = () => {
        document.getElementById('dateInputFrom').showPicker();
    };

    const handleDateChangeFrom = (event) => {
        const selectedDate = new Date(event.target.value);
        const formattedDate = formatDate(selectedDate);
        setFromDate(selectedDate);
    };

    const [toDate, setToDate] = useState('');
    const handleTextInputClicks = () => {
        document.getElementById('dateInputTo').showPicker();
    };


    const handleDateChangeTo = (event) => {
        const selectedDate = new Date(event.target.value);
        const formattedDate = formatDate(selectedDate);
        setToDate(selectedDate);
    };

    useEffect(() => {
        const currentDate = new Date();
        setFromDate(currentDate);
        setToDate(currentDate);
    }, []);
    const [itemName, setItemName] = useState([]);
    return (
        // col-md-12
        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    <div className='card mb-4'>
                        <div class=" border-primary shadow-sm border-0">
                            <div class="bg-gradient-primary card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Office Visit Person Create</h5>
                                <div class="card-title font-weight-bold mb-0 card-header-color float-right">

                                    <Link href={`/Admin/office_visit/office_visit_create?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Office Visit Create</Link>
                                </div>
                            </div>

                            <div class="card-body">
                                <form class="" onSubmit={user_create}>

                                    <div class=" row no-gutters">
                                        <div class="col-md-6">
                                            <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3">Person Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">
                                                <input required=""
                                                    onChange={handleChange}
                                                    class="form-control form-control-sm required mb-2" id="title" placeholder="Office Visit Person Name" type="text" name="person_name" />
                                                {
                                                    person_name && <p className='text-danger'>{person_name}</p>
                                                }

                                            </div>
                                            </div>
                                            <div class="form-group row no-gutters"><label class="col-form-label font-weight-bold col-md-3">Email Address:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-8">

                                                <input required=""
                                                    onChange={handleChange}
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
                                                    onChange={handleChange}
                                                    class="form-control form-control-sm required mb-2" id="title" placeholder="Office Visit Person Mobile" type="text" name="person_mobile" maxLength={11} />
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
                                        <div className="offset-md-2 col-md-6 float-left">
                                            <input type="submit" name="create" className="btn btn-success btn-sm mr-2" value="Submit" />

                                        </div>
                                    </div>

                                </form>
                                <div class="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
                                    <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                                </div>

                            </div>
                        </div>


                        {/* </div> */}
                    </div>

                    {
                        message &&

                        <div className="alert alert-success font-weight-bold">
                            {message}
                        </div>
                    }


                    <div className='card'>





                        <div class=" border-primary  shadow-sm border-0">
                            <div class="card-header   custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 class="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Person Info</h5>
                                {/* <div className='float-right'>

                                    <Link href={`/Admin/office_visit/office_visit_remarks/${office_visits_persons[0]?.id}?page_group=${page_group}`}>
                                        {filteredBtnIconRemarks.map((filteredBtnIconEdit => (
                                            <button
                                                key={filteredBtnIconEdit.id}
                                                title='Remarks'
                                                style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                className={filteredBtnIconEdit?.btn}
                                            >
                                                <a
                                                    dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                ></a>
                                            </button>
                                        )))}
                                    </Link>
                                </div> */}
                                <div class="card-title font-weight-bold mb-0 card-header-color float-right">

                                    <Link href={`/Admin/office_visit/office_visit_remarks/${office_visits_persons[0]?.id}?page_group=${page_group}`} class="btn btn-sm btn-info">Office Visit Remarks Create</Link>
                                </div>
                            </div>


                            <div class="card-body" >

                                <form class="">
                                    <div class="">

                                        <div class="form-group row student">

                                            <label htmlFor="fromDate" class="col-form-label col-md-2"><strong>From Date:</strong></label>

                                            <div className="col-md-4">

                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="fromDate"
                                                    value={fromDate ? formatDate(fromDate) : ''}
                                                    onClick={handleTextInputClick}
                                                    readOnly
                                                />
                                                <input
                                                    type="date"
                                                    id="dateInputFrom"
                                                    value={fromDate ? fromDate.toString().split('T')[0] : ''}
                                                    onChange={handleDateChangeFrom}
                                                    style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
                                                />



                                            </div>

                                            <label htmlFor="toDate" class="col-form-label col-md-2"><strong>To Date:</strong></label>
                                            <div class="col-md-4">

                                                <input
                                                    type="text"
                                                    id="toDate"
                                                    className="form-control"
                                                    value={toDate ? formatDate(toDate) : ''}
                                                    onClick={handleTextInputClicks}
                                                    readOnly
                                                />
                                                <input
                                                    type="date"
                                                    id="dateInputTo"
                                                    value={toDate ? toDate.toString().split('T')[0] : ''}
                                                    onChange={handleDateChangeTo}
                                                    style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
                                                />


                                            </div>
                                        </div>

                                        <div class="form-group row student">

                                            <label class="col-form-label col-md-2"><strong>Person Name:</strong></label>
                                            <div className="col-md-4">
                                                <input class="form-control form-control-sm  alpha_space item_name" type="text"
                                                    placeholder='Person Name'
                                                    value={itemName}
                                                    onChange={(e) => setItemName(e.target.value)}

                                                />
                                            </div>
                                            <label class="col-form-label col-md-2"><strong>Email:</strong></label>
                                            <div className="col-md-4">
                                                <input class="form-control form-control-sm  alpha_space item_name" type="text"
                                                    placeholder='Person Email'
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}

                                                />
                                            </div>



                                        </div>

                                        <div class="form-group row student">

                                            <label class="col-form-label col-md-2"><strong>Person Mobile:</strong></label>
                                            <div className="col-md-4">
                                                <input class="form-control form-control-sm  alpha_space item_name" type="text"
                                                    placeholder='Person Mobile'
                                                    value={mobile}
                                                    onChange={(e) => setMobile(e.target.value)}

                                                />
                                            </div>
                                        </div>

                                    </div>
                                    <div class="form-group row">
                                        <div class="offset-md-2 col-md-6 float-left">
                                            <input type="button"

                                                onClick={person_search}

                                                name="search" class="btn btn-sm btn-info search_btn mr-2" value="Search" />
                                            <input
                                                onClick={office_visit_person_Print_download}
                                                type="button" name="search" class="btn btn-sm btn-success print_btn mr-2" value="Print" />
                                            <input
                                                type="button"
                                                name="search"
                                                onClick={expense_excel_download}
                                                className="btn btn-sm btn-secondary excel_btn mr-2"
                                                value="Download Excel"
                                            />
                                            <input type="button" name="search" onClick={expense_PDF_download} class="btn btn-sm btn-indigo pdf_btn mr-2" style={buttonStyles} value="Download PDF" />
                                        </div>
                                    </div>
                                </form>


                                <div className='card mb-4'>
                                    <div class=" border-primary  shadow-sm border-0">
                                        <div class="card-header   custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                            <h5 class="card-title card-header-Period font-weight-bold mb-0  float-left mt-1">Person List</h5>

                                        </div>
                                        <div class="card-body" >
                                            {isLoading ? <div className='text-center'>
                                                <div className='  text-center text-dark'
                                                >
                                                    <FontAwesomeIcon style={{
                                                        height: '33px',
                                                        width: '33px',
                                                    }} icon={faSpinner} spin />
                                                </div>
                                            </div> : searchResults.length > 0 ? (
                                                <div class="table-responsive">
                                                    <table className="table table-bordered table-hover table-striped table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th>

                                                                    Serial
                                                                </th>
                                                                <th>
                                                                    Office Visit Person Name
                                                                </th>
                                                                <th>
                                                                    Office Visit Person Mobile
                                                                </th>
                                                                <th>
                                                                    Office Visit Person Email
                                                                </th>
                                                                <th>
                                                                    Office Visit Person Date
                                                                </th>
                                                                <th>
                                                                    Active
                                                                </th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {searchResults.map((person, i) => (
                                                                <tr key={person.person_id}>
                                                                    <td>    {i + 1}</td>

                                                                    <td>
                                                                        {person?.person_name}
                                                                    </td>
                                                                    <td>
                                                                        {person?.person_mobile}
                                                                    </td>
                                                                    <td>
                                                                        {person?.person_email}
                                                                    </td>
                                                                    <td>
                                                                        {person?.add_person_date.slice(0, 10)}

                                                                    </td>

                                                                    <td>

                                                                        <div className="flex items-center ">


                                                                            <Link href={`/Admin/office_visit/office_visit_person_edit/${person.id}?page_group=${page_group}`}>
                                                                                {filteredBtnIconEdit?.map((filteredBtnIconEdit => (
                                                                                    <button
                                                                                        key={filteredBtnIconEdit.id}
                                                                                        title='Create'
                                                                                        style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                        className={filteredBtnIconEdit?.btn}
                                                                                    >
                                                                                        <a
                                                                                            dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                                        ></a>
                                                                                    </button>
                                                                                )))}
                                                                            </Link>
                                                                            {filteredBtnIconDelete.map((filteredBtnIconDelete => (
                                                                                <button
                                                                                    key={filteredBtnIconDelete.id}
                                                                                    title='Delete'
                                                                                    onClick={() => office_visit_delete(person.id)}
                                                                                    style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                    className={filteredBtnIconDelete?.btn}
                                                                                >
                                                                                    <a
                                                                                        dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
                                                                                    ></a>
                                                                                </button>
                                                                            )))}
                                                                        </div></td>

                                                                </tr>
                                                            ))



                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) :
                                                <>

                                                    <div className='table-responsive'>
                                                        <div className=" d-flex justify-content-between">
                                                            <div>
                                                                Total Data: {totalData}
                                                            </div>
                                                            <div class="pagination float-right pagination-sm border">
                                                                {
                                                                    currentPage - 3 >= 1 && (
                                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/office_visit/office_visit_person/${id}?page=${1}`}>‹ First</Link>
                                                                    )
                                                                }
                                                                {
                                                                    currentPage > 1 && (
                                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/office_visit/office_visit_person/${id}?page=${activePage - 1}`}>&lt;</Link>
                                                                    )
                                                                }
                                                                {
                                                                    pageNumber.map((page) =>
                                                                        <Link
                                                                            key={page}
                                                                            href={`/Admin/office_visit/office_visit_person/${id}?page=${page}`}
                                                                            className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                                                                        > {page}
                                                                        </Link>
                                                                    )
                                                                }
                                                                {
                                                                    currentPage < totalPages && (
                                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/office_visit/office_visit_person/${id}?page=${activePage + 1}`}>&gt;</Link>
                                                                    )
                                                                }
                                                                {
                                                                    currentPage + 3 <= totalPages && (
                                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/office_visit/office_visit_person/${id}?page=${totalPages}`}>Last ›</Link>
                                                                    )
                                                                }
                                                            </div>

                                                        </div>
                                                        <table className="table  table-bordered table-hover table-striped table-sm">
                                                            <thead>

                                                                <tr>
                                                                    <th>

                                                                        Serial
                                                                    </th>
                                                                    <th>
                                                                        Office Visit Person Name
                                                                    </th>
                                                                    <th>
                                                                        Office Visit Person Mobile
                                                                    </th>
                                                                    <th>
                                                                        Office Visit Person Email
                                                                    </th>
                                                                    <th>
                                                                        Office Visit Person Date
                                                                    </th>
                                                                    <th>
                                                                        Active
                                                                    </th>

                                                                </tr>

                                                            </thead>

                                                            <tbody>
                                                                {isLoading ? <div className='text-center'>
                                                                    <div className='  text-center text-dark'
                                                                    >
                                                                        <FontAwesomeIcon style={{
                                                                            height: '33px',
                                                                            width: '33px',
                                                                        }} icon={faSpinner} spin />
                                                                    </div>
                                                                </div>
                                                                    :
                                                                    pageUsers.map((person, i) => (
                                                                        <tr key={person.person_id}>
                                                                            <td>    {i + 1}</td>

                                                                            <td>
                                                                                {person?.person_name}
                                                                            </td>
                                                                            <td>
                                                                                {person?.person_mobile}
                                                                            </td>
                                                                            <td>
                                                                                {person?.person_email}
                                                                            </td>
                                                                            <td>
                                                                                {person?.add_person_date.slice(0, 10)}

                                                                            </td>

                                                                            <td>

                                                                                <div className="flex items-center ">


                                                                                    <Link href={`/Admin/office_visit/office_visit_person_edit/${person.id}?page_group=${page_group}`}>
                                                                                        {filteredBtnIconEdit?.map((filteredBtnIconEdit => (
                                                                                            <button
                                                                                                key={filteredBtnIconEdit.id}
                                                                                                title='Create'
                                                                                                style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                                className={filteredBtnIconEdit?.btn}
                                                                                            >
                                                                                                <a
                                                                                                    dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                                                ></a>
                                                                                            </button>
                                                                                        )))}
                                                                                    </Link>
                                                                                    {filteredBtnIconDelete.map((filteredBtnIconDelete => (
                                                                                        <button
                                                                                            key={filteredBtnIconDelete.id}
                                                                                            title='Delete'
                                                                                            onClick={() => office_visit_delete(person.id)}
                                                                                            style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                            className={filteredBtnIconDelete?.btn}
                                                                                        >
                                                                                            <a
                                                                                                dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
                                                                                            ></a>
                                                                                        </button>
                                                                                    )))}
                                                                                </div></td>

                                                                        </tr>
                                                                    )

                                                                    )



                                                                }
                                                            </tbody>

                                                        </table>
                                                        <div className=" d-flex justify-content-between">
                                                            <div>
                                                                Total Data: {totalData}
                                                            </div>
                                                            <div class="pagination float-right pagination-sm border">
                                                                {
                                                                    currentPage - 3 >= 1 && (
                                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/office_visit/office_visit_person/${id}?page=${1}`}>‹ First</Link>
                                                                    )
                                                                }
                                                                {
                                                                    currentPage > 1 && (
                                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/office_visit/office_visit_person/${id}?page=${activePage - 1}`}>&lt;</Link>
                                                                    )
                                                                }
                                                                {
                                                                    pageNumber.map((page) =>
                                                                        <Link
                                                                            key={page}
                                                                            href={`/Admin/office_visit/office_visit_person/${id}?page=${page}`}
                                                                            className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                                                                        > {page}
                                                                        </Link>
                                                                    )
                                                                }
                                                                {
                                                                    currentPage < totalPages && (
                                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/office_visit/office_visit_person/${id}?page=${activePage + 1}`}>&gt;</Link>
                                                                    )
                                                                }
                                                                {
                                                                    currentPage + 3 <= totalPages && (
                                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/office_visit/office_visit_person/${id}?page=${totalPages}`}>Last ›</Link>
                                                                    )
                                                                }
                                                            </div>

                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>





                            </div>








                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OfficeVisitPerson;



