'use client'
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import './id_card.css'
import { FaEye } from 'react-icons/fa';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { DatePicker } from 'rsuite';

const EmployeIdCardList = () => {

    const [leaveFor, setLeaveFor] = useState('')
    const [activeTab, setActiveTab] = useState('font_side'); // Track active tab
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [fromDates, setFromDates] = useState('');
    const [toDates, setToDates] = useState('');
    const [template, setTemplate] = useState('1');
    const [templateSide, setTemplateSide] = useState('0');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [designation, setDesignation] = useState('');


    console.log(designation)



    const employee_search = () => {
        setLoading(true);

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_search_id_card`, {
            designation
        })
            .then(response => {
                setSearchResults(response.data.results);

                setError(null);
                setLoading(false);
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

    const formatDate = (date) => {
        const day = String(date?.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        return `${day}-${month}-${year}`;
    };

    // const handleDateChangeFrom = (event) => {
    //     const selectedDate = new Date(event.target.value);
    //     console.log(selectedDate)
    //     const formattedDate = formatDate(selectedDate);
    //     setFromDates(formattedDate)
    //     setFromDate(selectedDate);
    // };

    // const handleDateChangeTo = (event) => {
    //     const selectedDate = new Date(event.target.value);
    //     const formattedDate = formatDate(selectedDate);
    //     setToDates(formattedDate)
    //     setToDate(selectedDate);
    // };

    // console.log(toDates)
    // console.log(fromDates)
    // console.log(toDate)
    // console.log(fromDate)

    // const handleTextInputClick = () => {
    //     document.getElementById('dateInputFrom').showPicker();
    // };

    // const handleTextInputClicks = () => {
    //     document.getElementById('dateInputTo').showPicker();
    // };

    const handleChangess = (value) => {
        if (value) {
            // Format the date into MySQL format
            const mysqlFormattedDate = formatToMySQL(value);
            setFromDates(formatDate(value))
            setFromDate(mysqlFormattedDate);
        }
    };

    const handleChangesss = (value) => {
        if (value) {
            // Format the date into MySQL format
            const mysqlFormattedDate = formatToMySQL(value);
            setToDates(formatDate(value))
            setToDate(mysqlFormattedDate);
        }
    };

    const formatToMySQL = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so add 1
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        // Return in MySQL format: yyyy-MM-dd HH:mm
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    

    useEffect(() => {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        setFromDate(firstDayOfMonth);
        setToDate(lastDayOfMonth);
        setFromDates(formatDate(firstDayOfMonth));
        setToDates(formatDate(lastDayOfMonth));
    }, []);


    const [selectedBranch, setSelectedBranch] = useState('');
    const { data: branches = [] } = useQuery({
        queryKey: ['branches'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`);
            const data = await res.json();
            return data;
        }
    });

    const { data: employee_id_card_setting_list = [] } = useQuery({
        queryKey: ['employee_id_card_setting_list'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_id_card_setting_list`);
            const data = await res.json();
            return data;
        }
    });

    const { data: employee_id_card_setting_back_list = [] } = useQuery({
        queryKey: ['employee_id_card_setting_back_list'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_id_card_setting_back_list`);
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
    const groupedEmployees = employeeList.reduce((groups, employee) => {
        const designation = employee.designation_name;
        if (!groups[designation]) {
            groups[designation] = [];
        }
        groups[designation].push(employee);
        return groups;
    }, {});



    // State to manage the form rows
    const [rows, setRows] = useState([]);

    useEffect(() => {
        setRows(employee_id_card_setting_list)
    }, [employee_id_card_setting_list])

    // Handle adding a new row
    const addRow = () => {
        setRows([...rows, { display_name: '', column_name: '', sorting: '', status: '0' }]);
    };

    // Handle deleting a row
    const deleteRow = (index, id) => {


        const newRows = [...rows];
        newRows.splice(index, 1);
        setRows(newRows);

        const proceed = window.confirm(`Are You Sure delete`)
        if (proceed) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_id_card_setting_delete/${id}`, {
                method: "POST",

            })
                .then(Response => {
                    Response.json()
                    console.log(Response)
                })
                .then(data => {
                    console.log(data)

                })

        }


    };
    console.log(rows)



    const [formData, setFormData] = useState({});

    // Update formData whenever employee_id_card_setting_back_list changes
    useEffect(() => {
        const newFormData = employee_id_card_setting_back_list.reduce((acc, curr) => {
            acc[curr.id] = {
                upper_text_1: curr.upper_text_1,
                upper_text_2: curr.upper_text_2,
                move_to_left: curr.move_to_left,
            };
            return acc;
        }, {});
        setFormData(newFormData);
    }, [employee_id_card_setting_back_list]); // Dependency array

    const handleChange = (e, id) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                [name]: value,
            },
        }));
    };

    console.log(formData)

    const employee_create_id_card = (event) => {

        event.preventDefault();

        const uniqueFields = {
            formData, rows

        }
        console.log(uniqueFields)
        // 
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_id_card_all_create`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(uniqueFields),
        })
            .then((Response) =>
                Response.json()
            )
            .then((data) => {
                console.log(data[0])
                if (data[0]?.affectedRows > 0) {
                    if (typeof window !== 'undefined') {

                        sessionStorage.setItem("message", "Data saved successfully!");
                    }
                    // router.push('/Admin/brand/brand_all');
                }
                console.log(data)

            })
            .catch((error) => console.error(error));
    }

    const filteredSettings = employee_id_card_setting_list.filter(
        setting =>
            setting.sorting <= 7 &&
            !["designation_name", "unique_id", "photo"].includes(setting.column_name)
    );
    const filteredSettingss = employee_id_card_setting_list.filter(
        setting =>
            setting.sorting <= 7 &&
            !["designation_name", "full_name", "photo", "join_date"].includes(setting.column_name)
    );

    const filteredSetting = employee_id_card_setting_list.filter(
        setting =>
            setting.sorting <= 7 &&
            ![ "photo","join_date"].includes(setting.column_name)
    );
    // const filteredSetting = employee_id_card_setting_list.filter(setting => setting.sorting <= 7);


    // Extract the single search result
    const searchResult = searchResults[0] || {};
    console.log(searchResult)
    console.log(searchResults)



    const employee_print_id_card_download = async () => {

        try {
            // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_remarks_list_visit/${id}`);
            const searchResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_search_id_card`, {
               designation
            });
            const searchResults = searchResponse.data.results;
            

            console.log(searchResults);


            const selectedLayout = document.getElementById('print_layout').value;
            const orientation = selectedLayout === 'landscape' ? 'landscape' : 'portrait';

            const selectedPrintSize = document.getElementById('print_size').value;
           


            const printWindow = window.open('', '_blank');
            printWindow.document.open();

            const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_id_card_list_print`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    selectedPrintSize, orientation,  filteredSetting, filteredSettingss,   formData, searchResults, filteredSettings,template ,templateSide , employee_id_card_setting_back_list , toDates, fromDates
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

    const employee_pdf_id_card_download = async () => {
        try {
           // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_remarks_list_visit/${id}`);
           const searchResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_search_id_card`, {
            designation
         });
         const searchResults = searchResponse.data.results;
         

         console.log(searchResults);


         const selectedLayout = document.getElementById('print_layout').value;
         const orientation = selectedLayout === 'landscape' ? 'landscape' : 'portrait';

         const selectedPrintSize = document.getElementById('print_size').value;
        



            // Fetch PDF
            const pdfResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_id_card_list_pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    selectedPrintSize, orientation, searchResults, filteredSettings, filteredSettingss, filteredSetting, template, templateSide, employee_id_card_setting_back_list, formData ,toDates, fromDates
                }),
            });

            if (!pdfResponse.ok) {
                throw new Error(`Error generating PDF: ${pdfResponse.statusText}`);
            }

            // Download the PDF
            const blob = await pdfResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'id_card.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Error occurred:', error);
        } finally {
            // setLoading(false); // Uncomment if you have a loading state to reset
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-12 p-4'>

                    <div className='card mb-4'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Employe Loan Search</h5>
                                </div>
                                <div className="card-body">
                                    <form >
                                        <div className="col-md-10 offset-md-1">


                                            <div className="form-group row">

                                                <label className="col-form-label col-md-2"><strong>Designation:</strong></label>
                                                <div className="col-md-4">
                                                    <select

                                                        name="user_id"
                                                        className="form-control form-control-sm trim integer_no_zero whose_leave"
                                                        id="whose_leave"
                                                        value={designation} onChange={(e) => setDesignation(e.target.value)}
                                                    >
                                                        <option value="">Select Designation</option>
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

                                                <label class="control-label font-weight-bold col-md-2">Template:</label>
                                                <div class="col-md-4">
                                                    <div class="input-group input-group-sm mb-3">


                                                        <select value={template} onChange={(e) => setTemplate(e.target.value)} name="login_template" class="form-control form-control-sm custom-select trim integer_no_zero login_template" id="login_template" placeholder="Enter Expense Category">

                                                            <option value="1">Template 1</option>
                                                            <option value="2">Template 2</option>
                                                            <option value="3">Template 3</option>
                                                            <option value="4">Template 4</option>
                                                            <option value="5">Template 5</option>
                                                            <option value="6">Template 6</option>
                                                            <option value="7">Template 7</option>
                                                            <option value="8">Template 8</option>
                                                            <option value="9">Template 9</option>
                                                            <option value="10">Template 10</option>
                                                            <option value="11">Template 11</option>

                                                        </select>


                                                        <div class="input-group-append">
                                                            <label data-toggle="modal"
                                                                data-target="#exampleModal1" class="input-group-text p-0 btn btn-info" >
                                                                <FaEye></FaEye>
                                                            </label>
                                                        </div>
                                                        <div class="modal fade" id="exampleModal1" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                            <div class="modal-dialog" role="document">
                                                                <div class="modal-content">
                                                                    <div class="modal-header">
                                                                        <h5 class="modal-title" id="exampleModalLabel">Template {template}</h5>
                                                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                            <span aria-hidden="true">&times;</span>
                                                                        </button>
                                                                    </div>
                                                                    <div class="modal-body">
                                                                        {
                                                                            template == 1 &&
                                                                            <>

                                                                                {/* id 1 start */}
                                                                                <div className='d-flex'>

                                                                                    <div class="id-card">
                                                                                        <div class="header">
                                                                                            <div>
                                                                                                <img style={{
                                                                                                    height: '25px',
                                                                                                    width: '25px',
                                                                                                    borderRadius: '50%', // Makes the image round
                                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                                            </div>
                                                                                        </div>
                                                                                       
                                                                                 <div class=" img">
                                                                                 <img style={{    height: '84px', width: '84px', clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',marginTop: '-17px',marginLeft:" 1px"
 }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                                </div>
                                                                                <div className='text'>
                                                                                    <p className='rotate-text-left'><small>{searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p className='rotate-text-right'><small>{searchResult?.unique_id || 'ID: No. N/A'}</small></p>
                                                                                </div>

                                                                                        <div class="details">
                                                                                            <table>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Saif</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Father Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Sayful Islam</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mother Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Abida Sultana</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Blood Group </td>
                                                                                                    <td style={{ margin: '3px' }}>: O+</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Class Roll </td>
                                                                                                    <td style={{ margin: '3px' }}>: 1</td>
                                                                                                </tr>
                                                                                               
                                                                                            </table>
                                                                                        </div>

                                                                                        <div class="footer">
                                                                                            <div class="signature">
                                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                                {/* <hr /> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="id-card-container">
                                                                                        <div class="id-card-content">
                                                                                            <p class="id-card-issue-date">Issue Date: {fromDates}</p>
                                                                                            <p class="id-card-expire-date">Expire Date: {toDates}</p>
                                                                                            <p class="id-card-instructions">
                                                                                                <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
                                                                                                <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
                                                                                                    দেওয়ার অনুরোধ করা হলো:</small>
                                                                                            </p>
                                                                                            <div class="id-card-qr-code">
                                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                            </div>
                                                                                            <p class="id-card-school-info">
                                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                    Phone: 01735879633</small>
                                                                                            </p>
                                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                {/* id 1 end */}
                                                                            </>
                                                                        }
                                                                        {
                                                                            template == 2 &&
                                                                            <>
                                                                                {/* id 2 start */}

                                                                                <div className='d-flex'>

                                                                                    <div class="id-cards">
                                                                                        <div class="headers">
                                                                                            <div>
                                                                                                <img style={{
                                                                                                    height: '25px',
                                                                                                    width: '25px',
                                                                                                    borderRadius: '50%', // Makes the image round
                                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                                }} class="logos" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                                            </div>
                                                                                        </div>


                                                                                        <div class="photos" >
                                                                                            <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" />
                                                                                        </div>




                                                                                        <div class="detailss">
                                                                                            <table>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Saif</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Father Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Sayful Islam</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mother Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Abida Sultana</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Blood Group </td>
                                                                                                    <td style={{ margin: '3px' }}>: O+</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Class Roll </td>
                                                                                                    <td style={{ margin: '3px' }}>: 1</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mobile No. </td>
                                                                                                    <td style={{ margin: '3px' }}>: 01716143731</td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </div>


                                                                                        <div class="footers">
                                                                                            <div class="signatures">
                                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                                {/* <hr /> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="id-card-containers">
                                                                                        <div class="id-card-contents">
                                                                                            <p class="id-card-issue-dates">Issue Date: {fromDates}</p>
                                                                                            <p class="id-card-expire-dates">Expire Date: {toDates}</p>
                                                                                            <p class="id-card-instructionss">
                                                                                                {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                                            </p>
                                                                                            <div class="id-card-qr-codes">
                                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                            </div>
                                                                                            <p class="id-card-school-infos">
                                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                    Phone: 01735879633</small>
                                                                                            </p>
                                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* id 2 end */}

                                                                            </>
                                                                        }

                                                                        {
                                                                            template == 3 && <>

                                                                                {/* id 3 start */}

                                                                                <div className='d-flex'>

                                                                                    <div class="id-card1">
                                                                                        <div class="header1">
                                                                                            <div>
                                                                                                <img style={{
                                                                                                    height: '25px',
                                                                                                    width: '25px',
                                                                                                    borderRadius: '50%', // Makes the image round
                                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            justifyContent: 'space-between',
                                                                                        }}>

                                                                                            <p style={{ marginTop: '30px', marginLeft: '-20px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '12px' }} className='rotate-text1'>
                                                                                                <small>Designation:</small>
                                                                                            </p>


                                                                                            <div class="photo1" style={{ marginRight: '10px' }}>
                                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                                            </div>


                                                                                            <p className='rotate-text1' style={{ marginTop: '30px', marginRight: '-20px', fontSize: '12px', background: '#192653', padding: '2px 5px', color: 'white' }}>
                                                                                                <small> ID:No.023</small>
                                                                                            </p>
                                                                                        </div>


                                                                                        <div class="details13">
                                                                                            <table>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Saif</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Father Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Sayful Islam</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mother Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Abida Sultana</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Blood Group </td>
                                                                                                    <td style={{ margin: '3px' }}>: O+</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Class Roll </td>
                                                                                                    <td style={{ margin: '3px' }}>: 1</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mobile No. </td>
                                                                                                    <td style={{ margin: '3px' }}>: 01716143731</td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </div>

                                                                                        <div class="footer1">
                                                                                            <div class="signature1">
                                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                                {/* <hr /> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="id-card-container1">
                                                                                        <div class="id-card-content1">
                                                                                            <p class="id-card-issue-date1">Issue Date: {fromDates}</p>
                                                                                            <p class="id-card-expire-date1">Expire Date: {toDates}</p>
                                                                                            <p class="id-card-instructions1">
                                                                                                {/* <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
                                                                                                <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
                                                                                                    দেওয়ার অনুরোধ করা হলো:</small> */}
                                                                                                     <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
                                                                                                <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
                                                                                                    দেওয়ার অনুরোধ করা হলো:</small>
                                                                                            </p>
                                                                                            <div class="id-card-qr-code1">
                                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                            </div>
                                                                                            <p class="id-card-school-info1">
                                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                    Phone: 01735879633</small>
                                                                                            </p>
                                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* id 3 end */}
                                                                            </>
                                                                        }


                                                                        {
                                                                            template == 4 && <>
                                                                                {/* id 4 start */}

                                                                                <div className='d-flex'>

                                                                                    <div class="id-card12">
                                                                                        <div class="header12">
                                                                                            <div>
                                                                                                <img style={{
                                                                                                    height: '25px',
                                                                                                    width: '25px',
                                                                                                    borderRadius: '50%', // Makes the image round
                                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            justifyContent: 'space-between',
                                                                                        }}>

                                                                                            <p style={{ marginTop: '50px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className=''>
                                                                                                <small> Designation:</small>
                                                                                            </p>


                                                                                            <div class="photo12" style={{ marginRight: '10px' }}>
                                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                                            </div>


                                                                                            <p className='' style={{ marginTop: '50px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                                                                                                <small>ID:No.023</small>
                                                                                            </p>
                                                                                        </div>


                                                                                        <div class="details124">
                                                                                            <table>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Saif</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Father Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Sayful Islam</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mother Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Abida Sultana</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Blood Group </td>
                                                                                                    <td style={{ margin: '3px' }}>: O+</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Class Roll </td>
                                                                                                    <td style={{ margin: '3px' }}>: 1</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mobile No. </td>
                                                                                                    <td style={{ margin: '3px' }}>: 01716143731</td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </div>

                                                                                        <div class="footer12">
                                                                                            <div class="signature12">
                                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                                {/* <hr /> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="id-card-container12">
                                                                                        <div class="id-card-content12">
                                                                                            <p class="id-card-issue-date12">Issue Date: {fromDates}</p>
                                                                                            <p class="id-card-expire-date12">Expire Date: {toDates}</p>
                                                                                            <p class="id-card-instructions12">
                                                                                            <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
                                                                                                <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
                                                                                                    দেওয়ার অনুরোধ করা হলো:</small>
                                                                                            </p>
                                                                                            <div class="id-card-qr-code12">
                                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                            </div>
                                                                                            <p class="id-card-school-info12">
                                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                    Phone: 01735879633</small>
                                                                                            </p>
                                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* id 4 end */}
                                                                            </>
                                                                        }


                                                                        {
                                                                            template == 5 && <>


                                                                                {/* id 5 start */}

                                                                                <div className='d-flex'>

                                                                                    <div class="id-card5">
                                                                                        <div class="header5">
                                                                                            <div>
                                                                                                <img style={{
                                                                                                    height: '25px',
                                                                                                    width: '25px',
                                                                                                    borderRadius: '50%', // Makes the image round
                                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '13px' }}>IDENTITY CARD</h6>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            justifyContent: 'space-between',
                                                                                        }}>

                                                                                            <p style={{ marginTop: '70px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className=''>
                                                                                                <small> Designation:</small>
                                                                                            </p>


                                                                                            <div class="photo5" style={{ marginRight: '10px' }}>
                                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                                            </div>


                                                                                            <p className='' style={{ marginTop: '70px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                                                                                                <small>ID:No.023</small>
                                                                                            </p>
                                                                                        </div>


                                                                                        <div class="details55">
                                                                                            <table>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Saif</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Father Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Sayful Islam</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mother Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Abida Sultana</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Blood Group </td>
                                                                                                    <td style={{ margin: '3px' }}>: O+</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Class Roll </td>
                                                                                                    <td style={{ margin: '3px' }}>: 1</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mobile No. </td>
                                                                                                    <td style={{ margin: '3px' }}>: 01716143731</td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </div>

                                                                                        <div class="footer5">
                                                                                            <div class="signature5">
                                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                                {/* <hr /> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="id-card-container5">
                                                                                        <div class="id-card-content5">
                                                                                            <p class="id-card-issue-date5">Issue Date: {fromDates}</p>
                                                                                            <p class="id-card-expire-date5">Expire Date: {toDates}</p>
                                                                                            <p class="id-card-instructions5">
                                                                                            <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
                                                                                                <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
                                                                                                    দেওয়ার অনুরোধ করা হলো:</small>
                                                                                            </p>
                                                                                            <div class="id-card-qr-code5">
                                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                            </div>
                                                                                            <p class="id-card-school-info5">
                                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                    Phone: 01735879633</small>
                                                                                            </p>
                                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* id 5 end */}
                                                                            </>
                                                                        }

                                                                        {
                                                                            template == 6 && <>


                                                                                {/* id 6 start */}

                                                                                <div className='d-flex'>

                                                                                    <div class="id-card6">
                                                                                        <div class="header6">
                                                                                            <div>
                                                                                                <img style={{
                                                                                                    height: '25px',
                                                                                                    width: '25px',
                                                                                                    borderRadius: '50%', // Makes the image round
                                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            justifyContent: 'space-between',
                                                                                        }}>

                                                                                            <p style={{ marginTop: '30px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className='rotate-text6'>
                                                                                                <small> Designation:</small>
                                                                                            </p>


                                                                                            <div class="photo6" style={{ marginRight: '10px' }}>
                                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                                            </div>


                                                                                            <p className='rotate-text6' style={{ marginTop: '30px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                                                                                                <small>ID:No.023</small>
                                                                                            </p>
                                                                                        </div>


                                                                                        <div class="details66">
                                                                                            <table>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Saif</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Father Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Sayful Islam</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mother Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Abida Sultana</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Blood Group </td>
                                                                                                    <td style={{ margin: '3px' }}>: O+</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Class Roll </td>
                                                                                                    <td style={{ margin: '3px' }}>: 1</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mobile No. </td>
                                                                                                    <td style={{ margin: '3px' }}>: 01716143731</td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </div>

                                                                                        <div class="footer6">
                                                                                            <div class="signature6">
                                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                                {/* <hr /> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="id-card-container6">
                                                                                        <div class="id-card-content6">
                                                                                            <p class="id-card-issue-date6">Issue Date: {fromDates}</p>
                                                                                            <p class="id-card-expire-date6">Expire Date: {toDates}</p>
                                                                                            <p class="id-card-instructions6">
                                                                                            <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
                                                                                                <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
                                                                                                    দেওয়ার অনুরোধ করা হলো:</small>
                                                                                            </p>
                                                                                            <div class="id-card-qr-code6">
                                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                            </div>
                                                                                            <p class="id-card-school-info6">
                                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                    Phone: 01735879633</small>
                                                                                            </p>
                                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* id 6 end */}
                                                                            </>
                                                                        }
                                                                        {
                                                                            template == 7 && <>

                                                                                {/* id 7 start */}

                                                                                <div className='d-flex'>

                                                                                    <div class="id-card7">
                                                                                        <div class="header7">
                                                                                            <div>
                                                                                                <img style={{
                                                                                                    height: '25px',
                                                                                                    width: '25px',
                                                                                                    borderRadius: '50%', // Makes the image round
                                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            justifyContent: 'space-between',
                                                                                        }}>

                                                                                            <p style={{ marginTop: '30px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className='rotate-text6'>
                                                                                                <small> Designation:</small>
                                                                                            </p>


                                                                                            <div class="photo7" style={{ marginRight: '10px' }}>
                                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                                            </div>


                                                                                            <p className='rotate-text7' style={{ marginTop: '30px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                                                                                                <small>ID:No.023</small>
                                                                                            </p>
                                                                                        </div>


                                                                                        <div class="details77">
                                                                                            <table>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Saif</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Father Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Sayful Islam</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mother Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Abida Sultana</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Blood Group </td>
                                                                                                    <td style={{ margin: '3px' }}>: O+</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Class Roll </td>
                                                                                                    <td style={{ margin: '3px' }}>: 1</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mobile No. </td>
                                                                                                    <td style={{ margin: '3px' }}>: 01716143731</td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </div>

                                                                                        <div class="footer7">
                                                                                            <div class="signature7">
                                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                                {/* <hr /> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="id-card-container7">
                                                                                        <div class="id-card-content7">
                                                                                            <p class="id-card-issue-date7">Issue Date: {fromDates}</p>
                                                                                            <p class="id-card-expire-date7">Expire Date: {toDates}</p>
                                                                                            <p class="id-card-instructions7">
                                                                                            <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
                                                                                                <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
                                                                                                    দেওয়ার অনুরোধ করা হলো:</small>
                                                                                            </p>
                                                                                            <div class="id-card-qr-code7">
                                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                            </div>
                                                                                            <p class="id-card-school-info7">
                                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                    Phone: 01735879633</small>
                                                                                            </p>
                                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* id 7 end */}
                                                                            </>
                                                                        }

                                                                        {
                                                                            template == 8 && <>


                                                                                {/* id 8 start */}

                                                                                <div className='d-flex'>

                                                                                    <div class="id-card8">
                                                                                        <div class="header8">
                                                                                            <div>
                                                                                                <img style={{
                                                                                                    height: '25px',
                                                                                                    width: '25px',
                                                                                                    borderRadius: '50%', // Makes the image round
                                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            justifyContent: 'space-between',
                                                                                        }}>

                                                                                            <p style={{ marginTop: '-50px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className=''>
                                                                                                <small> Designation:</small>
                                                                                            </p>


                                                                                            <div class="photo8" style={{    height: '77px',width: '77px',marginTop: '9px',marginLeft: '-6px',clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' }}>
                                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                                            </div>


                                                                                            <p className='' style={{ marginTop: '-50px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                                                                                                <small>ID:No.023</small>
                                                                                            </p>
                                                                                        </div>


                                                                                        <div class="details88">
                                                                                            <table>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Saif</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Father Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Sayful Islam</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mother Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Abida Sultana</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Blood Group </td>
                                                                                                    <td style={{ margin: '3px' }}>: O+</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Class Roll </td>
                                                                                                    <td style={{ margin: '3px' }}>: 1</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mobile No. </td>
                                                                                                    <td style={{ margin: '3px' }}>: 01716143731</td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </div>

                                                                                        <div class="footer8">
                                                                                            <div class="signature8">
                                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                                {/* <hr /> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="id-card-container8">
                                                                                        <div class="id-card-content8">
                                                                                            <p class="id-card-issue-date8">Issue Date: {fromDates}</p>
                                                                                            <p class="id-card-expire-date8">Expire Date: {toDates}</p>
                                                                                            <p class="id-card-instructions8">
                                                                                            <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
                                                                                                <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
                                                                                                    দেওয়ার অনুরোধ করা হলো:</small>
                                                                                            </p>
                                                                                            <div class="id-card-qr-code8">
                                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                            </div>
                                                                                            <p class="id-card-school-info8">
                                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                    Phone: 01735879633</small>
                                                                                            </p>
                                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* id 8 end */}
                                                                            </>
                                                                        }


                                                                        {
                                                                            template == 9 && <>

                                                                                {/* id 9 start */}

                                                                                <div class="id-card9">

                                                                                    <div class="header9">
                                                                                        <div>
                                                                                            <h6 style={{ textAlign: 'left', marginLeft: '-14px', fontSize: '12px', marginTop: '-11px' }}>IDENTITY CARD</h6>

                                                                                        </div>
                                                                                        <div className='header_text' style={{ display: 'flex' }}>
                                                                                            <img style={{
                                                                                                height: '35px',
                                                                                                width: '35px',
                                                                                                borderRadius: '50%', // Makes the image round
                                                                                                objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                            }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                            </div>

                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="profile-section9">
                                                                                        <div class="profile-image9">
                                                                                            <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Profile Picture" />
                                                                                        </div>
                                                                                        <div class="details9">
                                                                                            <div className='teacher_information'>
                                                                                                <h3>Akhi Sardar</h3>
                                                                                                <p>English Teacher</p>
                                                                                            </div>
                                                                                            <div class="info9">
                                                                                                <table>
                                                                                                    <tr>
                                                                                                        <td >Blood Group </td>
                                                                                                        <td>: O+</td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td >Join Date </td>
                                                                                                        <td >: 1</td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td >Mobile No. </td>
                                                                                                        <td >: 01716143731</td>
                                                                                                    </tr>

                                                                                                </table>

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>



                                                                                </div>


                                                                                <div class="id-card-container9">
                                                                                    <div class="id-card-content9">
                                                                                        <p class="id-card-issue-date9">Issue Date: {fromDates}</p>
                                                                                        <p class="id-card-expire-date9">Expire Date: {toDates}</p>
                                                                                        <p class="id-card-instructions9">
                                                                                        <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
                                                                                                <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
                                                                                                    দেওয়ার অনুরোধ করা হলো:</small>
                                                                                        </p>
                                                                                        <div class="id-card-qr-code9">
                                                                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                        </div>
                                                                                        <p class="id-card-school-info9">
                                                                                            <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                            <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                Phone: 01735879633</small>
                                                                                        </p>
                                                                                        {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                    </div>
                                                                                </div>
                                                                                {/* id 9 end */}
                                                                            </>
                                                                        }

                                                                        {
                                                                            template == 10 && <>

                                                                                {/* id 10 start */}

                                                                                <div className='d-flex'>

                                                                                    <div class="id-card10">
                                                                                        <div class="header10">
                                                                                            <div>
                                                                                                <img style={{
                                                                                                    height: '25px',
                                                                                                    width: '25px',
                                                                                                    borderRadius: '50%', // Makes the image round
                                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            justifyContent: 'space-between',
                                                                                        }}>

                                                                                            {/* <p style={{ marginTop: '30px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className='rotate-text6'>
                <small> Designation:</small>
            </p> */}


                                                                                            <div class="photo10" style={{ marginRight: '10px' }}>
                                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                                            </div>


                                                                                            {/* <p className='rotate-text10' style={{ marginTop: '30px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                <small>ID:No.023</small>
            </p> */}
                                                                                        </div>


                                                                                        <div class="details101">
                                                                                            <table>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Saif</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Father Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Sayful Islam</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mother Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Abida Sultana</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Blood Group </td>
                                                                                                    <td style={{ margin: '3px' }}>: O+</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Class Roll </td>
                                                                                                    <td style={{ margin: '3px' }}>: 1</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mobile No. </td>
                                                                                                    <td style={{ margin: '3px' }}>: 01716143731</td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </div>

                                                                                        <div class="footer10">
                                                                                            <div class="signature10">
                                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                                {/* <hr /> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="id-card-container10">
                                                                                        <div class="id-card-content10">
                                                                                            <p class="id-card-issue-date10">Issue Date: {fromDates}</p>
                                                                                            <p class="id-card-expire-date10">Expire Date: {toDates}</p>
                                                                                            <p class="id-card-instructions10">
                                                                                            <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
                                                                                                <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
                                                                                                    দেওয়ার অনুরোধ করা হলো:</small>
                                                                                            </p>
                                                                                            <div class="id-card-qr-code10">
                                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                            </div>
                                                                                            <p class="id-card-school-info10">
                                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                    Phone: 01735879633</small>
                                                                                            </p>
                                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* id 10 end */}
                                                                            </>
                                                                        }

                                                                        {
                                                                            template == 11 && <>


                                                                                {/* id 11 start */}

                                                                                <div class="id-card11">

                                                                                    <div class="header11">
                                                                                        <div>
                                                                                            <h6 style={{ textAlign: 'left', marginLeft: '-14px', fontSize: '12px', marginTop: '-11px' }}>IDENTITY CARD</h6>

                                                                                        </div>
                                                                                        <div className='header_text11' style={{ display: 'flex' }}>
                                                                                            <img style={{
                                                                                                height: '35px',
                                                                                                width: '35px',
                                                                                                borderRadius: '50%', // Makes the image round
                                                                                                objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                            }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                            </div>

                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="profile-section11">
                                                                                        <div class="profile-image11">
                                                                                            <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Profile Picture" />
                                                                                        </div>
                                                                                        <div class="details11">
                                                                                            <div className='teacher_information11'>
                                                                                                <h3>Akhi Sardar</h3>
                                                                                                <p>English Teacher</p>
                                                                                            </div>
                                                                                            <div class="info11">
                                                                                                <table>
                                                                                                    <tr>
                                                                                                        <td >Blood Group </td>
                                                                                                        <td>: O+</td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td >Join Date </td>
                                                                                                        <td >: 1</td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td >Mobile No. </td>
                                                                                                        <td >: 01716143731</td>
                                                                                                    </tr>

                                                                                                </table>

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>



                                                                                </div>
                                                                                <div class="id-card-container11">
                                                                                    <div class="id-card-content11">
                                                                                        <p class="id-card-issue-date11">Issue Date: {fromDates}</p>
                                                                                        <p class="id-card-expire-date11">Expire Date: {toDates}</p>
                                                                                        <p class="id-card-instructions11">
                                                                                        <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
                                                                                                <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
                                                                                                    দেওয়ার অনুরোধ করা হলো:</small>
                                                                                        </p>
                                                                                        <div class="id-card-qr-code11">
                                                                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                        </div>
                                                                                        <p class="id-card-school-info11">
                                                                                            <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                            <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                Phone: 01735879633</small>
                                                                                        </p>
                                                                                        {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                    </div>
                                                                                </div>
                                                                                {/* id 11 end */}
                                                                            </>
                                                                        }

                                                                    </div>
                                                                    <div class="modal-footer">
                                                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>

                                            <div className="form-group row">
                                                <label className="col-form-label col-md-2"><strong>Template Side:</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        value={templateSide} onChange={(e) => setTemplateSide(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero"
                                                    >
                                                        <option value="0">Both Side</option>
                                                        <option value="1">Front Side</option>
                                                        <option value="2">Back Side</option>

                                                    </select>
                                                </div>

                                            </div>

                                            <div class="form-group row student">

                                                <label class="col-form-label font-weight-bold col-md-2">Print/PDF Properties:</label>
                                                <div class="col-md-10">
                                                    <div class="input-group ">
                                                        <select name="print_size" class="form-control form-control-sm  trim integer_no_zero print_size" id="print_size">
                                                            
                                                            <option value="A4">A4 </option>
                                                            
                                                        </select>
                                                        <select name="print_layout" class="form-control form-control-sm  trim integer_no_zero print_layout" id="print_layout">

                                                            <option value="landscape">Landscape</option>
                                                            <option value="portrait">Portrait</option>
                                                         
                                                        </select>
                                                   
                                                      
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row student">
                                                <label htmlFor="fromDate" className="col-form-label col-md-2"><strong>Issue Date:</strong></label>
                                                <div className="col-md-4">
                                                    {/* <input
                                                        className="form-control form-control-sm"
                                                        type="text"
                                                        placeholder='dd-mm-yyyy'
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
                                                    /> */}
                                                     <DatePicker

style={{ width: '700px' }}
format="dd-MM-yyyy"
showMeridiem
onChange={handleChangess}
/>
                                                </div>

                                                <label htmlFor="toDate" className="col-form-label col-md-2"><strong>Expire Date:
                                                </strong></label>
                                                <div className="col-md-4">

                                                    {/* <input
                                                        type="text"
                                                        placeholder='dd-mm-yyyy'
                                                        id="toDate"
                                                        className="form-control form-control-sm"
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
                                                    /> */}
                                                     <DatePicker
                                                    
                                                                                                            style={{ width: '700px' }}
                                                                                                            format="dd-MM-yyyy"
                                                                                                            showMeridiem
                                                                                                            onChange={handleChangesss}
                                                                                                        />
                                                </div>

                                            </div>

                                        </div>
                                        <div className="form-group row">
                                            <div className="offset-md-2 col-md-8 float-left">
                                                <input type="button" name="search" className="btn btn-sm btn-info" value="Search"
                                                onClick={employee_search}
                                                />
                                                <input
                                                    onClick={employee_print_id_card_download}
                                                    type="button" name="print" class="btn btn-sm btn-success print_btn ml-2" value="Print" />
                                                <input
                                                    onClick={employee_pdf_id_card_download}
                                                    type="button" name="summary" class="btn btn-sm btn-secondary print_summary ml-2" value="Download PDF" />

                                                <input
                                                    type="button"
                                                    name="summary"
                                                    className="btn btn-sm btn-danger print_summary ml-2"
                                                    value="Design & Config"
                                                    data-toggle="modal"
                                                    data-target="#exampleModal"
                                                />

                                            </div>
                                        </div>

                                    </form>


                                    <div
                                        className="modal fade"
                                        id="exampleModal"
                                        tabIndex="-1"
                                        role="dialog"
                                        aria-labelledby="exampleModalLabel"
                                        aria-hidden="true"
                                    >
                                        <div className="modal-dialog modal-lg" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="exampleModalLabel">
                                                        Id Card Configuration
                                                    </h5>

                                                    <button
                                                        type="button"
                                                        className="close"
                                                        data-dismiss="modal"
                                                        aria-label="Close"
                                                    >
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>

                                                </div>
                                                <div className="modal-body">
                                                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                        <button
                                                            className={`nav-link w-20 ${activeTab === 'font_side' ? 'active' : ''}`}
                                                            onClick={() => setActiveTab('font_side')}
                                                            type="button"
                                                            role="tab"
                                                        >
                                                            Front Side
                                                        </button>
                                                        <button
                                                            className={`nav-link w-20 ${activeTab === 'back_side' ? 'active' : ''}`}
                                                            onClick={() => setActiveTab('back_side')}
                                                            type="button"
                                                            role="tab"
                                                        >
                                                            Back Side
                                                        </button>

                                                    </div>
                                                    <form action="" onSubmit={employee_create_id_card}>

                                                        {activeTab === 'font_side' && (

                                                            <>
                                                                {rows.map((employee, index) => (
                                                                    <div className="input-group" key={index}>
                                                                        <div className="input-group-addon">
                                                                            <p className="col-form-label">Display Name:</p>
                                                                            <input
                                                                                required=""
                                                                                name="display_name"
                                                                                type="text"
                                                                                className="display_name form-control form-control-sm text-center form-control-sm width-100"
                                                                                value={employee.display_name}
                                                                                onChange={(e) => {
                                                                                    const updatedRows = [...rows];
                                                                                    updatedRows[index].display_name = e.target.value;
                                                                                    setRows(updatedRows);
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <div className="input-group-addon">
                                                                            <p className="col-form-label">Column Name:</p>
                                                                            <select
                                                                                required=""
                                                                                defaultValue={employee.column_name}
                                                                                name="column_name"
                                                                                className="form-control form-control-sm width-100 column_name  ml-2"
                                                                                id="outer_border_style"
                                                                                onChange={(e) => {
                                                                                    const updatedRows = [...rows];
                                                                                    updatedRows[index].column_name = e.target.value;
                                                                                    setRows(updatedRows);
                                                                                }}
                                                                            >
                                                                                {employee_id_card_setting_list.map((employes, empIndex) => (
                                                                                    <option key={empIndex} value={employes.column_name}>
                                                                                        {employes.display_name}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                        <div className="input-group-addon ml-3">
                                                                            <p className="col-form-label">Sorting:</p>
                                                                            <select
                                                                                required=""
                                                                                name="sorting"
                                                                                value={employee.sorting}
                                                                                className="form-control form-control-sm width-100 sorting"
                                                                                onChange={(e) => {
                                                                                    const updatedRows = [...rows];
                                                                                    updatedRows[index].sorting = e.target.value;
                                                                                    setRows(updatedRows);
                                                                                }}
                                                                            >
                                                                                <option value="">Select</option>
                                                                                {[...Array(15).keys()].map((num) => (
                                                                                    <option key={num} value={num + 1}>
                                                                                        {num + 1}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                        <div className="input-group-addon ml-3">
                                                                            <p className="col-form-label">Status:</p>
                                                                            <select
                                                                                required=""
                                                                                name="status"
                                                                                value={employee.status}
                                                                                className="form-control form-control-sm status"
                                                                                onChange={(e) => {
                                                                                    const updatedRows = [...rows];
                                                                                    updatedRows[index].status = e.target.value;
                                                                                    setRows(updatedRows);
                                                                                }}
                                                                            >
                                                                                <option value="0">0</option>
                                                                                <option value="1">1</option>
                                                                            </select>
                                                                        </div>
                                                                        {index === 0 && (
                                                                            <div className="input-group-btn ml-2">
                                                                                <p className="col-form-label text-white">Add more</p>
                                                                                <button className="btn btn-sm btn-info" type="button" onClick={addRow}>
                                                                                    Add
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                        {index !== 0 && (
                                                                            <div className="input-group-btn ml-3" style={{ marginTop: '37px' }}>
                                                                                <button
                                                                                    className="btn btn-danger btn-sm"
                                                                                    type="button"
                                                                                    onClick={() => deleteRow(index, employee.id)}
                                                                                >
                                                                                    Delete
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </>
                                                        )}
                                                        {activeTab === 'back_side' && (
                                                            <div className="mt-5">
                                                                {employee_id_card_setting_back_list.map((employe_settings) => (
                                                                    <div key={employe_settings.id}>
                                                                        <div className="form-group border border-2 d-flex justify-content-start align-items-center">
                                                                            <label className="mr-3"><b>Upper text 1</b></label>
                                                                            <textarea
                                                                                className="mr-3 upper-text1 w-50"
                                                                                placeholder="Enter text"
                                                                                name="upper_text_1"
                                                                                value={formData[employe_settings.id]?.upper_text_1 || ''}
                                                                                onChange={(e) => handleChange(e, employe_settings.id)}
                                                                            />
                                                                        </div>

                                                                        <div className="form-group border border-2 d-flex justify-content-start align-items-center">
                                                                            <label className="mr-3"><b>Upper text 2</b></label>
                                                                            <textarea
                                                                                className="mr-3 upper-text2 w-50"
                                                                                placeholder="Enter text"
                                                                                name="upper_text_2"
                                                                                value={formData[employe_settings.id]?.upper_text_2 || ''}
                                                                                onChange={(e) => handleChange(e, employe_settings.id)}
                                                                            />
                                                                        </div>

                                                                        <div className="form-group border border-2 d-flex justify-content-start align-items-center">
                                                                            <label className="mr-3"><b>Move to Left (px)</b></label>
                                                                            <select
                                                                                name="move_to_left"
                                                                                className="form-control form-control-sm w-50 move_to_left"
                                                                                value={formData[employe_settings.id]?.move_to_left || '-15'}
                                                                                onChange={(e) => handleChange(e, employe_settings.id)}
                                                                            >
                                                                                <option value="-8">8</option>
                                                                                <option value="-9">9</option>
                                                                                <option value="-10">10</option>
                                                                                <option value="-11">11</option>
                                                                                <option value="-12">12</option>
                                                                                <option value="-13">13</option>
                                                                                <option value="-14">14</option>
                                                                                <option value="-15">15</option>
                                                                                <option value="-16">16</option>
                                                                                <option value="-17">17</option>
                                                                                <option value="-18">18</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                        )}
                                                        <div class="row no-gutters">
                                                            <div class="mt-4">
                                                                <input

                                                                    type="submit" name="create" class="btn btn-sm btn-success" value="Submit" />
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="modal-footer">
                                                    {/* Optional Close Button in Footer */}
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        data-dismiss="modal"
                                                    >
                                                        Close
                                                    </button>
                                                </div>
                                               <div class="modal-body">
                                                                        {
                                                                            template == 1 &&
                                                                            <>

                                                                                {/* id 1 start */}
                                                                                <div className='d-flex'>

                                                                                    <div class="id-card">
                                                                                        <div class="header">
                                                                                            <div>
                                                                                                <img style={{
                                                                                                    height: '25px',
                                                                                                    width: '25px',
                                                                                                    borderRadius: '50%', // Makes the image round
                                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                                            </div>
                                                                                        </div>
                                                                                       
                                                                                 <div class="img">
                                                                                 <img style={{    height: '84px', width: '84px', clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',marginTop: '-17px',marginLeft:" 1px"
 }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                                </div>
                                                                                <div className='text'>
                                                                                    <p className='rotate-text-left'><small>{searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p className='rotate-text-right'><small>{searchResult?.unique_id || 'ID: No. N/A'}</small></p>
                                                                                </div>

                                                                                        <div class="details">
                                                                                            <table>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Saif</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Father Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Sayful Islam</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mother Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Abida Sultana</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Blood Group </td>
                                                                                                    <td style={{ margin: '3px' }}>: O+</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Class Roll </td>
                                                                                                    <td style={{ margin: '3px' }}>: 1</td>
                                                                                                </tr>
                                                                                               
                                                                                            </table>
                                                                                        </div>

                                                                                        <div class="footer">
                                                                                            <div class="signature">
                                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                                {/* <hr /> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="id-card-container">
                                                                                        <div class="id-card-content">
                                                                                            <p class="id-card-issue-date">Issue Date: {fromDates}</p>
                                                                                            <p class="id-card-expire-date">Expire Date: {toDates}</p>
                                                                                            <p class="id-card-instructions">
                                                                                                {
                                                                                                    employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                        <>

                                                                                                            <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                            <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                        </>

                                                                                                    )
                                                                                                }
                                                                                            </p>
                                                                                            <div class="id-card-qr-code">
                                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                            </div>
                                                                                            <p class="id-card-school-info">
                                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                    Phone: 01735879633</small>
                                                                                            </p>
                                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                {/* id 1 end */}
                                                                            </>
                                                                        }
                                                                        {
                                                                            template == 2 &&
                                                                            <>
                                                                                {/* id 2 start */}

                                                                                <div className='d-flex'>

                                                                                    <div class="id-cards">
                                                                                        <div class="headers">
                                                                                            <div>
                                                                                                <img style={{
                                                                                                    height: '25px',
                                                                                                    width: '25px',
                                                                                                    borderRadius: '50%', // Makes the image round
                                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                                }} class="logos" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                                            </div>
                                                                                        </div>


                                                                                        <div class="photos" >
                                                                                            <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" />
                                                                                        </div>




                                                                                        <div class="detailss">
                                                                                            <table>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Saif</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Father Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Sayful Islam</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mother Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Abida Sultana</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Blood Group </td>
                                                                                                    <td style={{ margin: '3px' }}>: O+</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Class Roll </td>
                                                                                                    <td style={{ margin: '3px' }}>: 1</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mobile No. </td>
                                                                                                    <td style={{ margin: '3px' }}>: 01716143731</td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </div>


                                                                                        <div class="footers">
                                                                                            <div class="signatures">
                                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                                {/* <hr /> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="id-card-containers">
                                                                                        <div class="id-card-contents">
                                                                                            <p class="id-card-issue-dates">Issue Date: {fromDates}</p>
                                                                                            <p class="id-card-expire-dates">Expire Date: {toDates}</p>
                                                                                            <p class="id-card-instructionss">
                                                                                                {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                                            </p>
                                                                                            <div class="id-card-qr-codes">
                                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                            </div>
                                                                                            <p class="id-card-school-infos">
                                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                    Phone: 01735879633</small>
                                                                                            </p>
                                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* id 2 end */}

                                                                            </>
                                                                        }

                                                                        {
                                                                            template == 3 && <>

                                                                                {/* id 3 start */}

                                                                                <div className='d-flex'>

                                                                                    <div class="id-card1">
                                                                                        <div class="header1">
                                                                                            <div>
                                                                                                <img style={{
                                                                                                    height: '25px',
                                                                                                    width: '25px',
                                                                                                    borderRadius: '50%', // Makes the image round
                                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            justifyContent: 'space-between',
                                                                                        }}>

                                                                                            <p style={{ marginTop: '30px', marginLeft: '-20px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '12px' }} className='rotate-text1'>
                                                                                                <small>Designation:</small>
                                                                                            </p>


                                                                                            <div class="photo1" style={{ marginRight: '10px' }}>
                                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                                            </div>


                                                                                            <p className='rotate-text1' style={{ marginTop: '30px', marginRight: '-20px', fontSize: '12px', background: '#192653', padding: '2px 5px', color: 'white' }}>
                                                                                                <small> ID:No.023</small>
                                                                                            </p>
                                                                                        </div>


                                                                                        <div class="details13">
                                                                                            <table>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Saif</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Father Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Sayful Islam</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mother Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Abida Sultana</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Blood Group </td>
                                                                                                    <td style={{ margin: '3px' }}>: O+</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Class Roll </td>
                                                                                                    <td style={{ margin: '3px' }}>: 1</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mobile No. </td>
                                                                                                    <td style={{ margin: '3px' }}>: 01716143731</td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </div>

                                                                                        <div class="footer1">
                                                                                            <div class="signature1">
                                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                                {/* <hr /> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="id-card-container1">
                                                                                        <div class="id-card-content1">
                                                                                            <p class="id-card-issue-date1">Issue Date: {fromDates}</p>
                                                                                            <p class="id-card-expire-date1">Expire Date: {toDates}</p>
                                                                                            <p class="id-card-instructions1">
                                                                                                {/* <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
                                                                                                <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
                                                                                                    দেওয়ার অনুরোধ করা হলো:</small> */}
                                                                                                     {
                                                                                                    employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                        <>

                                                                                                            <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                            <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                        </>

                                                                                                    )
                                                                                                }
                                                                                            </p>
                                                                                            <div class="id-card-qr-code1">
                                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                            </div>
                                                                                            <p class="id-card-school-info1">
                                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                    Phone: 01735879633</small>
                                                                                            </p>
                                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* id 3 end */}
                                                                            </>
                                                                        }


                                                                        {
                                                                            template == 4 && <>
                                                                                {/* id 4 start */}

                                                                                <div className='d-flex'>

                                                                                    <div class="id-card12">
                                                                                        <div class="header12">
                                                                                            <div>
                                                                                                <img style={{
                                                                                                    height: '25px',
                                                                                                    width: '25px',
                                                                                                    borderRadius: '50%', // Makes the image round
                                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            justifyContent: 'space-between',
                                                                                        }}>

                                                                                            <p style={{ marginTop: '50px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className=''>
                                                                                                <small> Designation:</small>
                                                                                            </p>


                                                                                            <div class="photo12" style={{ marginRight: '10px' }}>
                                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                                            </div>


                                                                                            <p className='' style={{ marginTop: '50px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                                                                                                <small>ID:No.023</small>
                                                                                            </p>
                                                                                        </div>


                                                                                        <div class="details124">
                                                                                            <table>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Saif</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Father Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Sayful Islam</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mother Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Abida Sultana</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Blood Group </td>
                                                                                                    <td style={{ margin: '3px' }}>: O+</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Class Roll </td>
                                                                                                    <td style={{ margin: '3px' }}>: 1</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mobile No. </td>
                                                                                                    <td style={{ margin: '3px' }}>: 01716143731</td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </div>

                                                                                        <div class="footer12">
                                                                                            <div class="signature12">
                                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                                {/* <hr /> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="id-card-container12">
                                                                                        <div class="id-card-content12">
                                                                                            <p class="id-card-issue-date12">Issue Date: {fromDates}</p>
                                                                                            <p class="id-card-expire-date12">Expire Date: {toDates}</p>
                                                                                            <p class="id-card-instructions12">
                                                                                            {
                                                                                                    employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                        <>

                                                                                                            <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                            <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                        </>

                                                                                                    )
                                                                                                }
                                                                                            </p>
                                                                                            <div class="id-card-qr-code12">
                                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                            </div>
                                                                                            <p class="id-card-school-info12">
                                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                    Phone: 01735879633</small>
                                                                                            </p>
                                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* id 4 end */}
                                                                            </>
                                                                        }


                                                                        {
                                                                            template == 5 && <>


                                                                                {/* id 5 start */}

                                                                                <div className='d-flex'>

                                                                                    <div class="id-card5">
                                                                                        <div class="header5">
                                                                                            <div>
                                                                                                <img style={{
                                                                                                    height: '25px',
                                                                                                    width: '25px',
                                                                                                    borderRadius: '50%', // Makes the image round
                                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '13px' }}>IDENTITY CARD</h6>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            justifyContent: 'space-between',
                                                                                        }}>

                                                                                            <p style={{ marginTop: '70px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className=''>
                                                                                                <small> Designation:</small>
                                                                                            </p>


                                                                                            <div class="photo5" style={{ marginRight: '10px' }}>
                                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                                            </div>


                                                                                            <p className='' style={{ marginTop: '70px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                                                                                                <small>ID:No.023</small>
                                                                                            </p>
                                                                                        </div>


                                                                                        <div class="details55">
                                                                                            <table>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Saif</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Father Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Sayful Islam</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mother Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Abida Sultana</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Blood Group </td>
                                                                                                    <td style={{ margin: '3px' }}>: O+</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Class Roll </td>
                                                                                                    <td style={{ margin: '3px' }}>: 1</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mobile No. </td>
                                                                                                    <td style={{ margin: '3px' }}>: 01716143731</td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </div>

                                                                                        <div class="footer5">
                                                                                            <div class="signature5">
                                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                                {/* <hr /> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="id-card-container5">
                                                                                        <div class="id-card-content5">
                                                                                            <p class="id-card-issue-date5">Issue Date: {fromDates}</p>
                                                                                            <p class="id-card-expire-date5">Expire Date: {toDates}</p>
                                                                                            <p class="id-card-instructions5">
                                                                                            {
                                                                                                    employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                        <>

                                                                                                            <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                            <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                        </>

                                                                                                    )
                                                                                                }
                                                                                            </p>
                                                                                            <div class="id-card-qr-code5">
                                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                            </div>
                                                                                            <p class="id-card-school-info5">
                                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                    Phone: 01735879633</small>
                                                                                            </p>
                                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* id 5 end */}
                                                                            </>
                                                                        }

                                                                        {
                                                                            template == 6 && <>


                                                                                {/* id 6 start */}

                                                                                <div className='d-flex'>

                                                                                    <div class="id-card6">
                                                                                        <div class="header6">
                                                                                            <div>
                                                                                                <img style={{
                                                                                                    height: '25px',
                                                                                                    width: '25px',
                                                                                                    borderRadius: '50%', // Makes the image round
                                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            justifyContent: 'space-between',
                                                                                        }}>

                                                                                            <p style={{ marginTop: '30px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className='rotate-text6'>
                                                                                                <small> Designation:</small>
                                                                                            </p>


                                                                                            <div class="photo6" style={{ marginRight: '10px' }}>
                                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                                            </div>


                                                                                            <p className='rotate-text6' style={{ marginTop: '30px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                                                                                                <small>ID:No.023</small>
                                                                                            </p>
                                                                                        </div>


                                                                                        <div class="details66">
                                                                                            <table>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Saif</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Father Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Sayful Islam</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mother Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Abida Sultana</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Blood Group </td>
                                                                                                    <td style={{ margin: '3px' }}>: O+</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Class Roll </td>
                                                                                                    <td style={{ margin: '3px' }}>: 1</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mobile No. </td>
                                                                                                    <td style={{ margin: '3px' }}>: 01716143731</td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </div>

                                                                                        <div class="footer6">
                                                                                            <div class="signature6">
                                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                                {/* <hr /> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="id-card-container6">
                                                                                        <div class="id-card-content6">
                                                                                            <p class="id-card-issue-date6">Issue Date: {fromDates}</p>
                                                                                            <p class="id-card-expire-date6">Expire Date: {toDates}</p>
                                                                                            <p class="id-card-instructions6">
                                                                                            {
                                                                                                    employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                        <>

                                                                                                            <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                            <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                        </>

                                                                                                    )
                                                                                                }
                                                                                            </p>
                                                                                            <div class="id-card-qr-code6">
                                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                            </div>
                                                                                            <p class="id-card-school-info6">
                                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                    Phone: 01735879633</small>
                                                                                            </p>
                                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* id 6 end */}
                                                                            </>
                                                                        }
                                                                        {
                                                                            template == 7 && <>

                                                                                {/* id 7 start */}

                                                                                <div className='d-flex'>

                                                                                    <div class="id-card7">
                                                                                        <div class="header7">
                                                                                            <div>
                                                                                                <img style={{
                                                                                                    height: '25px',
                                                                                                    width: '25px',
                                                                                                    borderRadius: '50%', // Makes the image round
                                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            justifyContent: 'space-between',
                                                                                        }}>

                                                                                            <p style={{ marginTop: '30px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className='rotate-text6'>
                                                                                                <small> Designation:</small>
                                                                                            </p>


                                                                                            <div class="photo7" style={{ marginRight: '10px' }}>
                                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                                            </div>


                                                                                            <p className='rotate-text7' style={{ marginTop: '30px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                                                                                                <small>ID:No.023</small>
                                                                                            </p>
                                                                                        </div>


                                                                                        <div class="details77">
                                                                                            <table>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Saif</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Father Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Sayful Islam</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mother Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Abida Sultana</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Blood Group </td>
                                                                                                    <td style={{ margin: '3px' }}>: O+</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Class Roll </td>
                                                                                                    <td style={{ margin: '3px' }}>: 1</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mobile No. </td>
                                                                                                    <td style={{ margin: '3px' }}>: 01716143731</td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </div>

                                                                                        <div class="footer7">
                                                                                            <div class="signature7">
                                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                                {/* <hr /> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="id-card-container7">
                                                                                        <div class="id-card-content7">
                                                                                            <p class="id-card-issue-date7">Issue Date: {fromDates}</p>
                                                                                            <p class="id-card-expire-date7">Expire Date: {toDates}</p>
                                                                                            <p class="id-card-instructions7">
                                                                                            {
                                                                                                    employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                        <>

                                                                                                            <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                            <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                        </>

                                                                                                    )
                                                                                                }
                                                                                            </p>
                                                                                            <div class="id-card-qr-code7">
                                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                            </div>
                                                                                            <p class="id-card-school-info7">
                                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                    Phone: 01735879633</small>
                                                                                            </p>
                                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* id 7 end */}
                                                                            </>
                                                                        }

                                                                        {
                                                                            template == 8 && <>


                                                                                {/* id 8 start */}

                                                                                <div className='d-flex'>

                                                                                    <div class="id-card8">
                                                                                        <div class="header8">
                                                                                            <div>
                                                                                                <img style={{
                                                                                                    height: '25px',
                                                                                                    width: '25px',
                                                                                                    borderRadius: '50%', // Makes the image round
                                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            justifyContent: 'space-between',
                                                                                        }}>

                                                                                            <p style={{ marginTop: '-50px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className=''>
                                                                                                <small> Designation:</small>
                                                                                            </p>


                                                                                            <div class="photo8" style={{    height: '77px',width: '77px',marginTop: '9px',marginLeft: '-6px',clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' }}>
                                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                                            </div>


                                                                                            <p className='' style={{ marginTop: '-50px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                                                                                                <small>ID:No.023</small>
                                                                                            </p>
                                                                                        </div>


                                                                                        <div class="details88">
                                                                                            <table>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Saif</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Father Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Sayful Islam</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mother Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Abida Sultana</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Blood Group </td>
                                                                                                    <td style={{ margin: '3px' }}>: O+</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Class Roll </td>
                                                                                                    <td style={{ margin: '3px' }}>: 1</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mobile No. </td>
                                                                                                    <td style={{ margin: '3px' }}>: 01716143731</td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </div>

                                                                                        <div class="footer8">
                                                                                            <div class="signature8">
                                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                                {/* <hr /> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="id-card-container8">
                                                                                        <div class="id-card-content8">
                                                                                            <p class="id-card-issue-date8">Issue Date: {fromDates}</p>
                                                                                            <p class="id-card-expire-date8">Expire Date: {toDates}</p>
                                                                                            <p class="id-card-instructions8">
                                                                                            {
                                                                                                    employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                        <>

                                                                                                            <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                            <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                        </>

                                                                                                    )
                                                                                                }
                                                                                            </p>
                                                                                            <div class="id-card-qr-code8">
                                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                            </div>
                                                                                            <p class="id-card-school-info8">
                                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                    Phone: 01735879633</small>
                                                                                            </p>
                                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* id 8 end */}
                                                                            </>
                                                                        }


                                                                        {
                                                                            template == 9 && <>

                                                                                {/* id 9 start */}

                                                                                <div class="id-card9">

                                                                                    <div class="header9">
                                                                                        <div>
                                                                                            <h6 style={{ textAlign: 'left', marginLeft: '-14px', fontSize: '12px', marginTop: '-11px' }}>IDENTITY CARD</h6>

                                                                                        </div>
                                                                                        <div className='header_text' style={{ display: 'flex' }}>
                                                                                            <img style={{
                                                                                                height: '35px',
                                                                                                width: '35px',
                                                                                                borderRadius: '50%', // Makes the image round
                                                                                                objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                            }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                            </div>

                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="profile-section9">
                                                                                        <div class="profile-image9">
                                                                                            <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Profile Picture" />
                                                                                        </div>
                                                                                        <div class="details9">
                                                                                            <div className='teacher_information'>
                                                                                                <h3>Akhi Sardar</h3>
                                                                                                <p>English Teacher</p>
                                                                                            </div>
                                                                                            <div class="info9">
                                                                                                <table>
                                                                                                    <tr>
                                                                                                        <td >Blood Group </td>
                                                                                                        <td>: O+</td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td >Join Date </td>
                                                                                                        <td >: 1</td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td >Mobile No. </td>
                                                                                                        <td >: 01716143731</td>
                                                                                                    </tr>

                                                                                                </table>

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>



                                                                                </div>


                                                                                <div class="id-card-container9">
                                                                                    <div class="id-card-content9">
                                                                                        <p class="id-card-issue-date9">Issue Date: {fromDates}</p>
                                                                                        <p class="id-card-expire-date9">Expire Date: {toDates}</p>
                                                                                        <p class="id-card-instructions9">
                                                                                        {
                                                                                                    employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                        <>

                                                                                                            <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                            <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                        </>

                                                                                                    )
                                                                                                }
                                                                                        </p>
                                                                                        <div class="id-card-qr-code9">
                                                                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                        </div>
                                                                                        <p class="id-card-school-info9">
                                                                                            <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                            <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                Phone: 01735879633</small>
                                                                                        </p>
                                                                                        {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                    </div>
                                                                                </div>
                                                                                {/* id 9 end */}
                                                                            </>
                                                                        }

                                                                        {
                                                                            template == 10 && <>

                                                                                {/* id 10 start */}

                                                                                <div className='d-flex'>

                                                                                    <div class="id-card10">
                                                                                        <div class="header10">
                                                                                            <div>
                                                                                                <img style={{
                                                                                                    height: '25px',
                                                                                                    width: '25px',
                                                                                                    borderRadius: '50%', // Makes the image round
                                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            justifyContent: 'space-between',
                                                                                        }}>

                                                                                            {/* <p style={{ marginTop: '30px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className='rotate-text6'>
                <small> Designation:</small>
            </p> */}


                                                                                            <div class="photo10" style={{ marginRight: '10px' }}>
                                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                                            </div>


                                                                                            {/* <p className='rotate-text10' style={{ marginTop: '30px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                <small>ID:No.023</small>
            </p> */}
                                                                                        </div>


                                                                                        <div class="details101">
                                                                                            <table>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Saif</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Father Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Sayful Islam</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mother Name </td>
                                                                                                    <td style={{ margin: '3px' }}>: Abida Sultana</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Blood Group </td>
                                                                                                    <td style={{ margin: '3px' }}>: O+</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Class Roll </td>
                                                                                                    <td style={{ margin: '3px' }}>: 1</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style={{ margin: '3px' }}>Mobile No. </td>
                                                                                                    <td style={{ margin: '3px' }}>: 01716143731</td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </div>

                                                                                        <div class="footer10">
                                                                                            <div class="signature10">
                                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                                {/* <hr /> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="id-card-container10">
                                                                                        <div class="id-card-content10">
                                                                                            <p class="id-card-issue-date10">Issue Date: {fromDates}</p>
                                                                                            <p class="id-card-expire-date10">Expire Date: {toDates}</p>
                                                                                            <p class="id-card-instructions10">
                                                                                            {
                                                                                                    employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                        <>

                                                                                                            <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                            <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                        </>

                                                                                                    )
                                                                                                }
                                                                                            </p>
                                                                                            <div class="id-card-qr-code10">
                                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                            </div>
                                                                                            <p class="id-card-school-info10">
                                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                    Phone: 01735879633</small>
                                                                                            </p>
                                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* id 10 end */}
                                                                            </>
                                                                        }

                                                                        {
                                                                            template == 11 && <>


                                                                                {/* id 11 start */}

                                                                                <div class="id-card11">

                                                                                    <div class="header11">
                                                                                        <div>
                                                                                            <h6 style={{ textAlign: 'left', marginLeft: '-14px', fontSize: '12px', marginTop: '-11px' }}>IDENTITY CARD</h6>

                                                                                        </div>
                                                                                        <div className='header_text11' style={{ display: 'flex' }}>
                                                                                            <img style={{
                                                                                                height: '35px',
                                                                                                width: '35px',
                                                                                                borderRadius: '50%', // Makes the image round
                                                                                                objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                            }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                            <div>
                                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                                
                                                                                            </div>

                                                                                        </div>
                                                                                    </div>

                                                                                    <div class="profile-section11">
                                                                                        <div class="profile-image11">
                                                                                            <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Profile Picture" />
                                                                                        </div>
                                                                                        <div class="details11">
                                                                                            <div className='teacher_information11'>
                                                                                                <h3>Akhi Sardar</h3>
                                                                                                <p>English Teacher</p>
                                                                                            </div>
                                                                                            <div class="info11">
                                                                                                <table>
                                                                                                    <tr>
                                                                                                        <td >Blood Group </td>
                                                                                                        <td>: O+</td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td >Join Date </td>
                                                                                                        <td >: 1</td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td >Mobile No. </td>
                                                                                                        <td >: 01716143731</td>
                                                                                                    </tr>

                                                                                                </table>

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>



                                                                                </div>
                                                                                <div class="id-card-container11">
                                                                                    <div class="id-card-content11">
                                                                                        <p class="id-card-issue-date11">Issue Date: {fromDates}</p>
                                                                                        <p class="id-card-expire-date11">Expire Date: {toDates}</p>
                                                                                        <p class="id-card-instructions11">
                                                                                        {
                                                                                                    employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                        <>

                                                                                                            <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                            <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                        </>

                                                                                                    )
                                                                                                }
                                                                                        </p>
                                                                                        <div class="id-card-qr-code11">
                                                                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                        </div>
                                                                                        <p class="id-card-school-info11">
                                                                                            <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                            <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                                Phone: 01735879633</small>
                                                                                        </p>
                                                                                        {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                    </div>
                                                                                </div>
                                                                                {/* id 11 end */}
                                                                            </>
                                                                        }

                                                                    </div>
                                               

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div   className='card-body'>
                                        {loading ? <div className='text-center'>
                                            <div className='  text-center text-dark'
                                            >
                                                <FontAwesomeIcon style={{
                                                    height: '33px',
                                                    width: '33px',
                                                }} icon={faSpinner} spin />
                                            </div>
                                        </div> : searchResults?.length > 0 ? (
                                            <div  class="container">
                                                {/* style={{ height:'177mm !important', width:'210mm !important'	}} */}
                                            <div  className=''> 
                                            {/* style={{ height:'177mm ', width:'210mm '	}} */}

                                                {searchResults.map((searchResult, i) => (
                                                    <div key={i}  className="col-4 mb-3"  style={{float:'left',  width:'56.88mm'}}>
                                                        {/* style={{float:'left', height:'178mm', width:'56.88mm',overflow:'hidden'}} */}
                                                        {/* className="col-6 mb-4" */}
                                                        {
                                                            template == 1 && <>


                                                                {
                                                                    templateSide == 0 &&
                                                                    <>


                                                                        {/* id 1 start */}
                                                                        <div className=''>


                                                                            <div class="id-card">
                                                                                <div class="header">
                                                                                    <div>
                                                                                        <img style={{
                                                                                            height: '25px',
                                                                                            width: '25px',
                                                                                            borderRadius: '50%', // Makes the image round
                                                                                            objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                        }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                        
                                                                                        <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                                    </div>
                                                                                </div>



                                                                                <div class=" imgs">
                                                                                    <img style={{    height: '84px', width: '84px', clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',marginTop: '-7px',marginLeft:" -1px"
 }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                                </div>
                                                                                <div className='text'>
                                                                                    <p className='rotate-text-left'><small>{searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p className='rotate-text-right'><small>{searchResult?.unique_id || 'ID: No. N/A'}</small></p>
                                                                                </div>
                                                                                <div class="details">
                                                                                    <table>
                                                                                        <tbody>
                                                                                            {filteredSettings.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>


                                                                                    </table>
                                                                                </div>

                                                                                <div class="footer">
                                                                                    <div class="signature">
                                                                                        <p style={{ marginBottom: '80px' }}></p>
                                                                                        {/* <hr /> */}
                                                                                    </div>
                                                                                </div>
                                                                            </div>



                                                                            <div class="id-card-container">
                                                                                <div class="id-card-content">
                                                                                    <p class="id-card-issue-date">Issue Date: {fromDates}</p>
                                                                                    <p class="id-card-expire-date">Expire Date: {toDates}</p>
                                                                                    <p class="id-card-instructions">
                                                                                        {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                                    </p>
                                                                                    <div class="id-card-qr-code">
                                                                                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                    </div>
                                                                                    <p class="id-card-school-info">
                                                                                        <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                        <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                            Phone: 01735879633</small>
                                                                                    </p>
                                                                                    {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                        {/* id 1 end */}
                                                                    </>
                                                                }
                                                                {
                                                                    templateSide == 1 && <>

<div class="id-card ">
                                                                                <div class="header">
                                                                                    <div>
                                                                                        <img style={{
                                                                                            height: '25px',
                                                                                            width: '25px',
                                                                                            borderRadius: '50%', // Makes the image round
                                                                                            objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                        }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                        
                                                                                        <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                                    </div>
                                                                                </div>



                                                                                <div class=" imgs">
                                                                                    <img style={{    height: '84px', width: '84px', clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',marginTop: '-7px',marginLeft:" -1px"
 }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                                </div>
                                                                                <div className='text'>
                                                                                    <p className='rotate-text-left'><small>{searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p className='rotate-text-right'><small>{searchResult?.unique_id || 'ID: No. N/A'}</small></p>
                                                                                </div>
                                                                                <div class="details">
                                                                                    <table>
                                                                                        <tbody>
                                                                                            {filteredSettings.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>


                                                                                    </table>
                                                                                </div>

                                                                                <div class="footer">
                                                                                    <div class="signature">
                                                                                        <p style={{ marginBottom: '80px' }}></p>
                                                                                        {/* <hr /> */}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                    </>
                                                                }
                                                                {
                                                                    templateSide == 2 && <>

<div class="id-card-container">
                                                                                <div class="id-card-content">
                                                                                    <p class="id-card-issue-date">Issue Date: {fromDates}</p>
                                                                                    <p class="id-card-expire-date">Expire Date: {toDates}</p>
                                                                                    <p class="id-card-instructions">
                                                                                        {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                                    </p>
                                                                                    <div class="id-card-qr-code">
                                                                                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                                    </div>
                                                                                    <p class="id-card-school-info">
                                                                                        <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                        <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                            Phone: 01735879633</small>
                                                                                    </p>
                                                                                    {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                                </div>
                                                                            </div>
                                                                    </>
                                                                }
                                                            </>

                                                        }


                                                {
                                                    template == 2 &&
                                                    <>
                                                        {/* id 2 start */}
                                                        {
                                                            templateSide == 0 && <>

                                                                <div className=''>

                                                                    <div class="id-cards">
                                                                        <div class="headers">
                                                                            <div>
                                                                                <img style={{
                                                                                    height: '25px',
                                                                                    width: '25px',
                                                                                    borderRadius: '50%', // Makes the image round
                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                }} class="logos" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>


                                                                        <div class="photos" >
                                                                            <img src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                        </div>




                                                                        <div class="detailss">
                                                                            <table>
                                                                            <tbody>
                                                                                            {filteredSetting.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>


                                                                        <div class="footers">
                                                                            <div class="signatures">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                {/* <hr /> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-containers">
                                                                        <div class="id-card-contents">
                                                                            <p class="id-card-issue-dates">Issue Date: {fromDates}</p>
                                                                            <p class="id-card-expire-dates">Expire Date: {toDates}</p>
                                                                            <p class="id-card-instructionss">
                                                                            {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                            </p>
                                                                            <div class="id-card-qr-codes">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-infos">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                        {
                                                            templateSide == 1 && <>
                                                              <div class="id-cards">
                                                                        <div class="headers">
                                                                            <div>
                                                                                <img style={{
                                                                                    height: '25px',
                                                                                    width: '25px',
                                                                                    borderRadius: '50%', // Makes the image round
                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                }} class="logos" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>


                                                                        <div class="photos" >
                                                                            <img src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                        </div>




                                                                        <div class="detailss">
                                                                            <table>
                                                                            <tbody>
                                                                                            {filteredSetting.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>


                                                                        <div class="footers">
                                                                            <div class="signatures">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                {/* <hr /> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                            </>
                                                        }
                                                        {
                                                            templateSide == 2 && <>
                                                                <div class="id-card-containers">
                                                                        <div class="id-card-contents">
                                                                            <p class="id-card-issue-dates">Issue Date: {fromDates}</p>
                                                                            <p class="id-card-expire-dates">Expire Date: {toDates}</p>
                                                                            <p class="id-card-instructionss">
                                                                            {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                            </p>
                                                                            <div class="id-card-qr-codes">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-infos">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                        </div>
                                                                    </div>
                                                            </>
                                                        }

                                                        {/* id 2 end */}

                                                    </>
                                                }

                                                {
                                                    template == 3 && <>

                                                        {/* id 3 start */}
                                                        {
                                                            templateSide == 0 && <>

                                                                <div className=''>

                                                                    <div class="id-card1">
                                                                        <div class="header1">
                                                                            <div>
                                                                                <img style={{
                                                                                    height: '25px',
                                                                                    width: '25px',
                                                                                    borderRadius: '50%', // Makes the image round
                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                       
                                                                        <div class="imgs">
                                                                                    <img style={{ height: '90px', width: '90px', borderRadius:'50px', marginTop:'-8px', marginLeft:'-7px' }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                                </div>
                                                                                <div className='text'>
                                                                                    <p className='rotate-text-left'><small>{searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p className='rotate-text-right'><small>{searchResult?.unique_id || 'ID: No. N/A'}</small></p>
                                                                                </div>
                                                                       
                                                                        <div class="details1">
                                                                            <table>
                                                                            <tbody>
                                                                                            {filteredSettings.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer1">
                                                                            <div class="signature1">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                {/* <hr /> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container1">
                                                                        <div class="id-card-content1">
                                                                            <p class="id-card-issue-date1">Issue Date: {fromDates}</p>
                                                                            <p class="id-card-expire-date1">Expire Date: {toDates}</p>
                                                                            <p class="id-card-instructions1">
                                                                            {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                            </p>
                                                                            <div class="id-card-qr-code1">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info1">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                        {
                                                            templateSide == 1 && <>
                                                                <div class="id-card1">
                                                                        <div class="header1">
                                                                            <div>
                                                                                <img style={{
                                                                                    height: '25px',
                                                                                    width: '25px',
                                                                                    borderRadius: '50%', // Makes the image round
                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                       
                                                                        <div class="imgs">
                                                                                    <img style={{ height: '90px', width: '90px', borderRadius:'50px', marginTop:'-8px', marginLeft:'-7px' }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                                </div>
                                                                                <div className='text'>
                                                                                    <p className='rotate-text-left'><small>{searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p className='rotate-text-right'><small>{searchResult?.unique_id || 'ID: No. N/A'}</small></p>
                                                                                </div>
                                                                       
                                                                        <div class="details1">
                                                                            <table>
                                                                            <tbody>
                                                                                            {filteredSettings.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer1">
                                                                            <div class="signature1">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                {/* <hr /> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                            </>
                                                        }
                                                        {
                                                            templateSide == 2 && <>
                                                                 <div class="id-card-container1">
                                                                        <div class="id-card-content1">
                                                                            <p class="id-card-issue-date1">Issue Date: {fromDates}</p>
                                                                            <p class="id-card-expire-date1">Expire Date: {toDates}</p>
                                                                            <p class="id-card-instructions1">
                                                                            {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                            </p>
                                                                            <div class="id-card-qr-code1">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info1">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                        </div>
                                                                    </div>
                                                            </>
                                                        }

                                                        {/* id 3 end */}
                                                    </>
                                                }


                                                {
                                                    template == 4 && <>
                                                        {/* id 4 start */}
                                                        {
                                                            templateSide == 0 && <>


                                                                <div className=''>

                                                                    <div class="id-card12">
                                                                        <div class="header12">
                                                                            <div>
                                                                                <img style={{
                                                                                    height: '25px',
                                                                                    width: '25px',
                                                                                    borderRadius: '50%', // Makes the image round
                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        {/* <div style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'space-between',
                                                                        }}>

                                                                            <p style={{ marginTop: '50px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className=''>
                                                                                <small> Designation:</small>
                                                                            </p>


                                                                            <div class="photo12" style={{ marginRight: '10px' }}>
                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                            </div>


                                                                            <p className='' style={{ marginTop: '50px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                                                                                <small>ID:No.023</small>
                                                                            </p>
                                                                        </div> */}

<div class="imgs">
                                                                                    <img style={{ height: '90px', width: '90px', borderRadius:'50px', marginTop:'-15px', marginLeft:'-6px' }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                                </div>
                                                                                <div className='text'>
                                                                                    <p className='rotate-text-left1'><small>{searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p className='rotate-text-right1'><small>{searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details12">
                                                                            <table>
                                                                            <tbody>
                                                                                            {filteredSettings.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer12">
                                                                            <div class="signature12">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                {/* <hr /> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container12">
                                                                        <div class="id-card-content12">
                                                                            <p class="id-card-issue-date12">Issue Date: {fromDates}</p>
                                                                            <p class="id-card-expire-date12">Expire Date: {toDates}</p>
                                                                            <p class="id-card-instructions12">
                                                                            {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                            </p>
                                                                            <div class="id-card-qr-code12">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info12">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                        {
                                                            templateSide == 1 && <>
                                                                <div class="id-card12">
                                                                        <div class="header12">
                                                                            <div>
                                                                                <img style={{
                                                                                    height: '25px',
                                                                                    width: '25px',
                                                                                    borderRadius: '50%', // Makes the image round
                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        {/* <div style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'space-between',
                                                                        }}>

                                                                            <p style={{ marginTop: '50px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className=''>
                                                                                <small> Designation:</small>
                                                                            </p>


                                                                            <div class="photo12" style={{ marginRight: '10px' }}>
                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                            </div>


                                                                            <p className='' style={{ marginTop: '50px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                                                                                <small>ID:No.023</small>
                                                                            </p>
                                                                        </div> */}

<div class="imgs">
                                                                                    <img style={{ height: '90px', width: '90px', borderRadius:'50px', marginTop:'-15px', marginLeft:'-6px' }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                                </div>
                                                                                <div className='text'>
                                                                                    <p className='rotate-text-left1'><small>{searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p className='rotate-text-right1'><small>{searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details12">
                                                                            <table>
                                                                            <tbody>
                                                                                            {filteredSettings.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer12">
                                                                            <div class="signature12">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                {/* <hr /> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                            </>
                                                        }
                                                        {
                                                            templateSide == 2 && <>

<div class="id-card-container12">
                                                                        <div class="id-card-content12">
                                                                            <p class="id-card-issue-date12">Issue Date: {fromDates}</p>
                                                                            <p class="id-card-expire-date12">Expire Date: {toDates}</p>
                                                                            <p class="id-card-instructions12">
                                                                            {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                            </p>
                                                                            <div class="id-card-qr-code12">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info12">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                        </div>
                                                                    </div>
                                                            </>
                                                        }

                                                        {/* id 4 end */}
                                                    </>
                                                }


                                                {
                                                    template == 5 && <>


                                                        {/* id 5 start */}
                                                        {
                                                            templateSide == 0 && <>
                                                                <div className=''>

                                                                    <div class="id-card5">
                                                                        <div class="header5">
                                                                            <div>
                                                                                <img style={{
                                                                                    height: '25px',
                                                                                    width: '25px',
                                                                                    borderRadius: '50%', // Makes the image round
                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '13px' }}>IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        {/* <div style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'space-between',
                                                                        }}>

                                                                            <p style={{ marginTop: '70px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className=''>
                                                                                <small> Designation:</small>
                                                                            </p>


                                                                            <div class="photo5" style={{ marginRight: '10px' }}>
                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                            </div>


                                                                            <p className='' style={{ marginTop: '70px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                                                                                <small>ID:No.023</small>
                                                                            </p>
                                                                        </div> */}
<div class="imgs">
                                                                                    <img style={{ height: '96px', width: '96px', borderRadius:'50px', marginTop:'-21px', marginLeft:'-9px' }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                                </div>
                                                                                <div className='text'>
                                                                                    <p className='rotate-text-left2'><small>{searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p className='rotate-text-right2'><small>{searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details5">
                                                                            <table>
                                                                            <tbody>
                                                                                            {filteredSettings.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer5">
                                                                            <div class="signature5">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                {/* <hr /> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container5">
                                                                        <div class="id-card-content5">
                                                                            <p class="id-card-issue-date5">Issue Date: {fromDates}</p>
                                                                            <p class="id-card-expire-date5">Expire Date: {toDates}</p>
                                                                            <p class="id-card-instructions5">
                                                                            {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                            </p>
                                                                            <div class="id-card-qr-code5">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info5">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                        {
                                                            templateSide == 1 && <>
                                                              
                                                              <div class="id-card5">
                                                                        <div class="header5">
                                                                            <div>
                                                                                <img style={{
                                                                                    height: '25px',
                                                                                    width: '25px',
                                                                                    borderRadius: '50%', // Makes the image round
                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '13px' }}>IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        {/* <div style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'space-between',
                                                                        }}>

                                                                            <p style={{ marginTop: '70px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className=''>
                                                                                <small> Designation:</small>
                                                                            </p>


                                                                            <div class="photo5" style={{ marginRight: '10px' }}>
                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                            </div>


                                                                            <p className='' style={{ marginTop: '70px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                                                                                <small>ID:No.023</small>
                                                                            </p>
                                                                        </div> */}
<div class="imgs">
                                                                                    <img style={{ height: '96px', width: '96px', borderRadius:'50px', marginTop:'-21px', marginLeft:'-9px' }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                                </div>
                                                                                <div className='text'>
                                                                                    <p className='rotate-text-left2'><small>{searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p className='rotate-text-right2'><small>{searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details5">
                                                                            <table>
                                                                            <tbody>
                                                                                            {filteredSettings.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer5">
                                                                            <div class="signature5">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                {/* <hr /> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                            </>
                                                        }
                                                        {
                                                            templateSide == 2 && <>
                                                                <div class="id-card-container5">
                                                                        <div class="id-card-content5">
                                                                            <p class="id-card-issue-date5">Issue Date: {fromDates}</p>
                                                                            <p class="id-card-expire-date5">Expire Date: {toDates}</p>
                                                                            <p class="id-card-instructions5">
                                                                            {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                            </p>
                                                                            <div class="id-card-qr-code5">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info5">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                        </div>
                                                                    </div>
                                                            </>
                                                        }


                                                        {/* id 5 end */}
                                                    </>
                                                }

                                                {
                                                    template == 6 && <>


                                                        {/* id 6 start */}


                                                        {
                                                            templateSide == 0 && <>
                                                                <div className=''>

                                                                    <div class="id-card6">
                                                                        <div class="header6">
                                                                            <div>
                                                                                <img style={{
                                                                                    height: '25px',
                                                                                    width: '25px',
                                                                                    borderRadius: '50%', // Makes the image round
                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        {/* <div style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'space-between',
                                                                        }}>

                                                                            <p style={{ marginTop: '30px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className='rotate-text6'>
                                                                                <small> Designation:</small>
                                                                            </p>


                                                                            <div class="photo6" style={{ marginRight: '10px' }}>
                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                            </div>


                                                                            <p className='rotate-text6' style={{ marginTop: '30px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                                                                                <small>ID:No.023</small>
                                                                            </p>
                                                                        </div> */}
                                                                        <div class="imgs">
                                                                                    <img style={{ height: '90px', width: '90px', borderRadius:'50px', marginTop:'-7px', marginLeft:'-5.5px' }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                                </div>
                                                                                <div className='text'>
                                                                                    <p className='rotate-text-left'><small>{searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p className='rotate-text-right'><small>{searchResult?.unique_id || 'ID: No. N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details6">
                                                                            <table>
                                                                            <tbody>
                                                                                            {filteredSettings.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer6">
                                                                            <div class="signature6">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                {/* <hr /> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container6">
                                                                        <div class="id-card-content6">
                                                                            <p class="id-card-issue-date6">Issue Date: {fromDates}</p>
                                                                            <p class="id-card-expire-date6">Expire Date: {toDates}</p>
                                                                            <p class="id-card-instructions6">
                                                                            {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                            </p>
                                                                            <div class="id-card-qr-code6">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info6">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                        {
                                                            templateSide == 1 && <>
                                                              <div class="id-card6">
                                                                        <div class="header6">
                                                                            <div>
                                                                                <img style={{
                                                                                    height: '25px',
                                                                                    width: '25px',
                                                                                    borderRadius: '50%', // Makes the image round
                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        {/* <div style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'space-between',
                                                                        }}>

                                                                            <p style={{ marginTop: '30px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className='rotate-text6'>
                                                                                <small> Designation:</small>
                                                                            </p>


                                                                            <div class="photo6" style={{ marginRight: '10px' }}>
                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                            </div>


                                                                            <p className='rotate-text6' style={{ marginTop: '30px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                                                                                <small>ID:No.023</small>
                                                                            </p>
                                                                        </div> */}
                                                                        <div class="imgs">
                                                                                    <img style={{ height: '90px', width: '90px', borderRadius:'50px', marginTop:'-7px', marginLeft:'-5.5px' }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                                </div>
                                                                                <div className='text'>
                                                                                    <p className='rotate-text-left'><small>{searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p className='rotate-text-right'><small>{searchResult?.unique_id || 'ID: No. N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details6">
                                                                            <table>
                                                                            <tbody>
                                                                                            {filteredSettings.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer6">
                                                                            <div class="signature6">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                {/* <hr /> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                            </>
                                                        }
                                                        {
                                                            templateSide == 2 && <>
                                                                 <div class="id-card-container6">
                                                                        <div class="id-card-content6">
                                                                            <p class="id-card-issue-date6">Issue Date: {fromDates}</p>
                                                                            <p class="id-card-expire-date6">Expire Date: {toDates}</p>
                                                                            <p class="id-card-instructions6">
                                                                            {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                            </p>
                                                                            <div class="id-card-qr-code6">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info6">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                        </div>
                                                                    </div>
                                                            </>
                                                        }
                                                        {/* id 6 end */}
                                                    </>
                                                }
                                                {
                                                    template == 7 && <>

                                                        {/* id 7 start */}
                                                        {
                                                            templateSide == 0 && <>
                                                                <div className=''>

                                                                    <div class="id-card7">
                                                                        <div class="header7">
                                                                            <div>
                                                                                <img style={{
                                                                                    height: '25px',
                                                                                    width: '25px',
                                                                                    borderRadius: '50%', // Makes the image round
                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        {/* <div style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'space-between',
                                                                        }}>

                                                                            <p style={{ marginTop: '30px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className='rotate-text6'>
                                                                                <small> Designation:</small>
                                                                            </p>


                                                                            <div class="photo7" style={{ marginRight: '10px' }}>
                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                            </div>


                                                                            <p className='rotate-text7' style={{ marginTop: '30px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                                                                                <small>ID:No.023</small>
                                                                            </p>
                                                                        </div> */}
   <div class="imgs">
                                                                                    <img style={{ height: '90px', width: '90px', borderRadius:'50px', marginTop:'2px', marginLeft:'-3px' }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                                </div>
                                                                                <div className='text'>
                                                                                    <p className='rotate-text-left'><small>{searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p className='rotate-text-right'><small>{searchResult?.unique_id || 'ID: No. N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details7">
                                                                            <table>
                                                                            <tbody>
                                                                                            {filteredSettings.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer7">
                                                                            <div class="signature7">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                {/* <hr /> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container7">
                                                                        <div class="id-card-content7">
                                                                            <p class="id-card-issue-date7">Issue Date: {fromDates}</p>
                                                                            <p class="id-card-expire-date7">Expire Date: {toDates}</p>
                                                                            <p class="id-card-instructions7">
                                                                            {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                            </p>
                                                                            <div class="id-card-qr-code7">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info7">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                        {
                                                            templateSide == 1 && <>
                                                                <div class="id-card7">
                                                                        <div class="header7">
                                                                            <div>
                                                                                <img style={{
                                                                                    height: '25px',
                                                                                    width: '25px',
                                                                                    borderRadius: '50%', // Makes the image round
                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        {/* <div style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'space-between',
                                                                        }}>

                                                                            <p style={{ marginTop: '30px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className='rotate-text6'>
                                                                                <small> Designation:</small>
                                                                            </p>


                                                                            <div class="photo7" style={{ marginRight: '10px' }}>
                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                            </div>


                                                                            <p className='rotate-text7' style={{ marginTop: '30px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                                                                                <small>ID:No.023</small>
                                                                            </p>
                                                                        </div> */}
   <div class="imgs">
                                                                                    <img style={{ height: '90px', width: '90px', borderRadius:'50px', marginTop:'2px', marginLeft:'-3px' }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                                </div>
                                                                                <div className='text'>
                                                                                    <p className='rotate-text-left'><small>{searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p className='rotate-text-right'><small>{searchResult?.unique_id || 'ID: No. N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details7">
                                                                            <table>
                                                                            <tbody>
                                                                                            {filteredSettings.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer7">
                                                                            <div class="signature7">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                {/* <hr /> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                            </>
                                                        }
                                                        {
                                                            templateSide == 2 && <>
                                                                <div class="id-card-container7">
                                                                        <div class="id-card-content7">
                                                                            <p class="id-card-issue-date7">Issue Date: {fromDates}</p>
                                                                            <p class="id-card-expire-date7">Expire Date: {toDates}</p>
                                                                            <p class="id-card-instructions7">
                                                                            {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                            </p>
                                                                            <div class="id-card-qr-code7">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info7">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                        </div>
                                                                    </div>
                                                            </>
                                                        }


                                                        {/* id 7 end */}
                                                    </>
                                                }

                                                {
                                                    template == 8 && <>


                                                        {/* id 8 start */}
                                                        {
                                                            templateSide == 0 && <>
                                                                <div className=''>

                                                                    <div class="id-card8">
                                                                        <div class="header8">
                                                                            <div>
                                                                                <img style={{
                                                                                    height: '25px',
                                                                                    width: '25px',
                                                                                    borderRadius: '50%', // Makes the image round
                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        {/* <div style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'space-between',
                                                                        }}>

                                                                            <p style={{ marginTop: '-50px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className=''>
                                                                                <small> Designation:</small>
                                                                            </p>


                                                                            <div class="photo8 rotate-img8" style={{ marginRight: '10px' }}>
                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                            </div>


                                                                            <p className='' style={{ marginTop: '-50px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                                                                                <small>ID:No.023</small>
                                                                            </p>
                                                                        </div> */}
                                                                        
 <div class="imgs">
                                                                                    <img style={{    height: '77px',width: '77px',marginTop: '10px',marginLeft: '0px',clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                                </div>
                                                                                <div className='text'>
                                                                                    <p className='rotate-text-left8'><small>{searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p className='rotate-text-right8'><small>{searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details8">
                                                                            <table>
                                                                            <tbody>
                                                                                            {filteredSettings.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer8">
                                                                            <div class="signature8">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                {/* <hr /> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container8">
                                                                        <div class="id-card-content8">
                                                                            <p class="id-card-issue-date8">Issue Date: {fromDates}</p>
                                                                            <p class="id-card-expire-date8">Expire Date: {toDates}</p>
                                                                            <p class="id-card-instructions8">
                                                                            {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                            </p>
                                                                            <div class="id-card-qr-code8">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info8">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                        {
                                                            templateSide == 1 && <>
                                                                <div class="id-card8">
                                                                        <div class="header8">
                                                                            <div>
                                                                                <img style={{
                                                                                    height: '25px',
                                                                                    width: '25px',
                                                                                    borderRadius: '50%', // Makes the image round
                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        {/* <div style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'space-between',
                                                                        }}>

                                                                            <p style={{ marginTop: '-50px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className=''>
                                                                                <small> Designation:</small>
                                                                            </p>


                                                                            <div class="photo8 rotate-img8" style={{ marginRight: '10px' }}>
                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                            </div>


                                                                            <p className='' style={{ marginTop: '-50px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
                                                                                <small>ID:No.023</small>
                                                                            </p>
                                                                        </div> */}
                                                                        
 <div class="imgs">
                                                                                    <img style={{    height: '77px',width: '77px',marginTop: '10px',marginLeft: '0px',clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                                </div>
                                                                                <div className='text'>
                                                                                    <p className='rotate-text-left8'><small>{searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p className='rotate-text-right8'><small>{searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details8">
                                                                            <table>
                                                                            <tbody>
                                                                                            {filteredSettings.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer8">
                                                                            <div class="signature8">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                {/* <hr /> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                            </>
                                                        }
                                                        {
                                                            templateSide == 2 && <>
                                                                <div class="id-card-container8">
                                                                        <div class="id-card-content8">
                                                                            <p class="id-card-issue-date8">Issue Date: {fromDates}</p>
                                                                            <p class="id-card-expire-date8">Expire Date: {toDates}</p>
                                                                            <p class="id-card-instructions8">
                                                                            {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                            </p>
                                                                            <div class="id-card-qr-code8">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info8">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                        </div>
                                                                    </div>
                                                            </>
                                                        }


                                                        {/* id 8 end */}
                                                    </>
                                                }


                                                {
                                                    template == 9 && <>

                                                        {/* id 9 start */}
                                                        {
                                                            templateSide == 0 && <>

                                                                <div class="id-card9">

                                                                    <div class="header9">
                                                                        <div>
                                                                            <h6 style={{ textAlign: 'left', marginLeft: '-14px', fontSize: '12px', marginTop: '-11px' }}>IDENTITY CARD</h6>

                                                                        </div>
                                                                        <div className='header_text' style={{ display: 'flex' }}>
                                                                            <img style={{
                                                                                height: '35px',
                                                                                width: '35px',
                                                                                borderRadius: '50%', // Makes the image round
                                                                                objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                            }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                            </div>

                                                                        </div>
                                                                    </div>

                                                                    <div class="profile-section9">
                                                                        <div class="profile-image9">
                                                                            <img  src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                        </div>
                                                                        <div class="details9">
                                                                            <div className='teacher_information'>
                                                                                <h3>{searchResult?.full_name || 'N/A'}</h3>
                                                                                <p>{searchResult?.designation_name || 'N/A'}</p>
                                                                            </div>
                                                                            <div class="info9">
                                                                                <table>
                                                                                    {/* <tr>
                                                                                        <td >Blood Group </td>
                                                                                        <td>: O+</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td >Join Date </td>
                                                                                        <td >: 1</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td >Mobile No. </td>
                                                                                        <td >: 01716143731</td>
                                                                                    </tr> */}

<tbody>
                                                                                            {filteredSettingss.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>

                                                                                </table>

                                                                            </div>
                                                                        </div>
                                                                    </div>



                                                                </div>


                                                                <div class="id-card-container9">
                                                                    <div class="id-card-content9">
                                                                        <p class="id-card-issue-date9">Issue Date: {fromDates}</p>
                                                                        <p class="id-card-expire-date9">Expire Date: {toDates}</p>
                                                                        <p class="id-card-instructions9">
                                                                        {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                        </p>
                                                                        <div class="id-card-qr-code9">
                                                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                        </div>
                                                                        <p class="id-card-school-info9">
                                                                            <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                            <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                Phone: 01735879633</small>
                                                                        </p>
                                                                        {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                        {
                                                            templateSide == 1 && <>

                                                                <div class="id-card9">

                                                                    <div class="header9">
                                                                        <div>
                                                                            <h6 style={{ textAlign: 'left', marginLeft: '-14px', fontSize: '12px', marginTop: '-11px' }}>IDENTITY CARD</h6>

                                                                        </div>
                                                                        <div className='header_text' style={{ display: 'flex' }}>
                                                                            <img style={{
                                                                                height: '35px',
                                                                                width: '35px',
                                                                                borderRadius: '50%', // Makes the image round
                                                                                objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                            }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                            </div>

                                                                        </div>
                                                                    </div>

                                                                    <div class="profile-section9">
                                                                    <div class="profile-image9">
                                                                            <img  src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                        </div>
                                                                        <div class="details9">
                                                                            <div className='teacher_information'>
                                                                                <h3>{searchResult?.full_name || 'N/A'}</h3>
                                                                                <p>{searchResult?.designation_name || 'N/A'}r</p>
                                                                            </div>
                                                                            <div class="info9">
                                                                                <table>
                                                                                    {/* <tr>
                                                                                        <td >Blood Group </td>
                                                                                        <td>: O+</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td >Join Date </td>
                                                                                        <td >: 1</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td >Mobile No. </td>
                                                                                        <td >: 01716143731</td>
                                                                                    </tr> */}
 <tbody>
                                                                                            {filteredSettingss.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>
                                                                                </table>

                                                                            </div>
                                                                        </div>
                                                                    </div>



                                                                </div>
                                                            </>
                                                        }
                                                        {
                                                            templateSide == 2 && <>
                                                                <div class="id-card-container9">
                                                                    <div class="id-card-content9">
                                                                        <p class="id-card-issue-date9">Issue Date: {fromDates}</p>
                                                                        <p class="id-card-expire-date9">Expire Date: {toDates}</p>
                                                                        <p class="id-card-instructions9">
                                                                        {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                        </p>
                                                                        <div class="id-card-qr-code9">
                                                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                        </div>
                                                                        <p class="id-card-school-info9">
                                                                            <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                            <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                Phone: 01735879633</small>
                                                                        </p>
                                                                        {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                        {/* id 9 end */}
                                                    </>
                                                }

                                                {
                                                    template == 10 && <>

                                                        {/* id 10 start */}
                                                        {
                                                            templateSide == 0 && <>

                                                                <div className=''>

                                                                    <div class="id-card10">
                                                                        <div class="header10">
                                                                            <div>
                                                                                <img style={{
                                                                                    height: '25px',
                                                                                    width: '25px',
                                                                                    borderRadius: '50%', // Makes the image round
                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        {/* <div style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'space-between',
                                                                        }}>

                 


                                                                            <div class="photo10" style={{ marginRight: '10px' }}>
                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                            </div>


                                                                        </div> */}

<div class="imgs">
                                                                                    <img style={{ height: '75px', width: '75px', borderRadius:'50px', marginTop:'0px', marginLeft:'4px' }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                                </div>
                                                                        <div class="details10">
                                                                            <table>
                                                                            <tbody>
                                                                                            {filteredSetting.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer10">
                                                                            <div class="signature10">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                {/* <hr /> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container10">
                                                                        <div class="id-card-content10">
                                                                            <p class="id-card-issue-date10">Issue Date: {fromDates}</p>
                                                                            <p class="id-card-expire-date10">Expire Date: {toDates}</p>
                                                                            <p class="id-card-instructions10">
                                                                            {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                            </p>
                                                                            <div class="id-card-qr-code10">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info10">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                        {
                                                            templateSide == 1 && <>
                                                              <div class="id-card10">
                                                                        <div class="header10">
                                                                            <div>
                                                                                <img style={{
                                                                                    height: '25px',
                                                                                    width: '25px',
                                                                                    borderRadius: '50%', // Makes the image round
                                                                                    objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                                }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        {/* <div style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'space-between',
                                                                        }}>

                 


                                                                            <div class="photo10" style={{ marginRight: '10px' }}>
                                                                                <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
                                                                            </div>


                                                                        </div> */}

<div class="imgs">
                                                                                    <img style={{ height: '75px', width: '75px', borderRadius:'50px', marginTop:'0px', marginLeft:'4px' }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                                </div>
                                                                        <div class="details10">
                                                                            <table>
                                                                            <tbody>
                                                                                            {filteredSetting.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer10">
                                                                            <div class="signature10">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                                {/* <hr /> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                            </>
                                                        }
                                                        {
                                                            templateSide == 2 && <>
                                                             <div class="id-card-container10">
                                                                        <div class="id-card-content10">
                                                                            <p class="id-card-issue-date10">Issue Date: {fromDates}</p>
                                                                            <p class="id-card-expire-date10">Expire Date: {toDates}</p>
                                                                            <p class="id-card-instructions10">
                                                                            {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                            </p>
                                                                            <div class="id-card-qr-code10">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info10">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                            {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                        </div>
                                                                    </div>

                                                            </>
                                                        }
                                                        {/* id 10 end */}
                                                    </>
                                                }

                                                {
                                                    template == 11 && <>


                                                        {/* id 11 start */}

                                                        {
                                                            templateSide == 0 && <>

                                                                <div class="id-card11">

                                                                    <div class="header11">
                                                                        <div>
                                                                            <h6 style={{ textAlign: 'left', marginLeft: '-14px', fontSize: '12px', marginTop: '-11px' }}>IDENTITY CARD</h6>

                                                                        </div>
                                                                        <div className='header_text11' style={{ display: 'flex' }}>
                                                                            <img style={{
                                                                                height: '35px',
                                                                                width: '35px',
                                                                                borderRadius: '50%', // Makes the image round
                                                                                objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                            }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                            </div>

                                                                        </div>
                                                                    </div>

                                                                    <div class="profile-section11">
                                                                        <div class="profile-image11">
                                                                            <img  src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} alt="Profile Picture" />
                                                                        </div>
                                                                        <div class="details11">
                                                                            <div className='teacher_information11'>
                                                                                <h3>{searchResult?.full_name || 'N/A'}</h3>
                                                                                <p>{searchResult?.designation_name || 'N/A'}</p>
                                                                            </div>
                                                                            <div class="info11">
                                                                                <table>
                                                                                    {/* <tr>
                                                                                        <td >Blood Group </td>
                                                                                        <td>: O+</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td >Join Date </td>
                                                                                        <td >: 1</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td >Mobile No. </td>
                                                                                        <td >: 01716143731</td>
                                                                                    </tr> */}
                                                                                     <tbody>
                                                                                            {filteredSettingss.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>

                                                                                </table>

                                                                            </div>
                                                                        </div>
                                                                    </div>



                                                                </div>
                                                                <div class="id-card-container11">
                                                                    <div class="id-card-content11">
                                                                        <p class="id-card-issue-date11">Issue Date: {fromDates}</p>
                                                                        <p class="id-card-expire-date11">Expire Date: {toDates}</p>
                                                                        <p class="id-card-instructions11">
                                                                        {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                        </p>
                                                                        <div class="id-card-qr-code11">
                                                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                        </div>
                                                                        <p class="id-card-school-info11">
                                                                            <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                            <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                Phone: 01735879633</small>
                                                                        </p>
                                                                        {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                        {
                                                            templateSide == 1 && <>

                                                                <div class="id-card11">

                                                                    <div class="header11">
                                                                        <div>
                                                                            <h6 style={{ textAlign: 'left', marginLeft: '-14px', fontSize: '12px', marginTop: '-11px' }}>IDENTITY CARD</h6>

                                                                        </div>
                                                                        <div className='header_text11' style={{ display: 'flex' }}>
                                                                            <img style={{
                                                                                height: '35px',
                                                                                width: '35px',
                                                                                borderRadius: '50%', // Makes the image round
                                                                                objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
                                                                            }} class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                            </div>

                                                                        </div>
                                                                    </div>

                                                                    <div class="profile-section11">
                                                                    <div class="profile-image11">
                                                                            <img  src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} alt="Profile Picture" />
                                                                        </div>
                                                                        <div class="details11">
                                                                        <div className='teacher_information11'>
                                                                                <h3>{searchResult?.full_name || 'N/A'}</h3>
                                                                                <p>{searchResult?.designation_name || 'N/A'}</p>
                                                                            </div>
                                                                            <div class="info11">
                                                                                <table>
                                                                                <tbody>
                                                                                            {filteredSettingss.map(setting => {
                                                                                                // Safely access the value from searchResult
                                                                                                let value = searchResult?.[setting.column_name] ?? "N/A";

                                                                                                // Slice value if column_name is 'join_date'
                                                                                                if (setting.column_name === "join_date" && value !== "N/A") {
                                                                                                    value = value.slice(0, 10);
                                                                                                }

                                                                                                return (
                                                                                                    <tr key={setting.id}>
                                                                                                        {/* Column name with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}>
                                                                                                            {setting.display_name || ""}
                                                                                                        </td>
                                                                                                        {/* Value with 50% width */}
                                                                                                        <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                        </tbody>

                                                                                </table>

                                                                            </div>
                                                                        </div>
                                                                    </div>



                                                                </div>

                                                            </>
                                                        }
                                                        {
                                                            templateSide == 2 && <>

                                                                <div class="id-card-container11">
                                                                    <div class="id-card-content11">
                                                                        <p class="id-card-issue-date11">Issue Date: {fromDates}</p>
                                                                        <p class="id-card-expire-date11">Expire Date: {toDates}</p>
                                                                        <p class="id-card-instructions11">
                                                                        {
                                                                                            employee_id_card_setting_back_list.map((employe_settings) =>
                                                                                                <>

                                                                                                    <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
                                                                                                    <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

                                                                                                </>

                                                                                            )
                                                                                        }
                                                                        </p>
                                                                        <div class="id-card-qr-code11">
                                                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                        </div>
                                                                        <p class="id-card-school-info11">
                                                                            <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                            <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                Phone: 01735879633</small>
                                                                        </p>
                                                                        {/* <p class="id-card-principal-signature">Principal Signature</p> */}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }


                                                        {/* id 11 end */}
                                                    </>
                                                }

                                                    </div>
                                                ))

                                                }


                                            </div>
                                            </div>

                                        )

                                            :

                                            ''


                                        }
                                    </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeIdCardList;


// 'use client'
// import { useQuery } from '@tanstack/react-query';
// import React, { useEffect, useState } from 'react';
// import './id_card.css'
// import { FaEye } from 'react-icons/fa';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';

// const EmployeIdCardList = () => {

//     const [leaveFor, setLeaveFor] = useState('')
//     const [activeTab, setActiveTab] = useState('font_side'); // Track active tab
//     const [fromDate, setFromDate] = useState('');
//     const [toDate, setToDate] = useState('');
//     const [template, setTemplate] = useState('1');
//     const [templateSide, setTemplateSide] = useState('0');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [searchResults, setSearchResults] = useState([]);
//     const [designation, setDesignation] = useState('');


//     console.log(designation)



//     const employee_search = () => {
//         setLoading(true);

//         axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_search_id_card`, {
//             designation
//         })
//             .then(response => {
//                 setSearchResults(response.data.results);

//                 setError(null);
//                 setLoading(false);
//                 if (response.data.results == '') {
//                     alert('Nothing found!');
//                 }

//             })
//             .catch(error => {
//                 setError("An error occurred during search.", error);
//                 setSearchResults([]);
//             });
//     };

//     console.log(searchResults)

//     const formatDate = (date) => {
//         const day = String(date?.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = String(date.getFullYear());
//         return `${day}-${month}-${year}`;
//     };

//     const handleDateChangeFrom = (event) => {
//         const selectedDate = new Date(event.target.value);
//         const formattedDate = formatDate(selectedDate);
//         setFromDate(selectedDate);
//     };

//     const handleDateChangeTo = (event) => {
//         const selectedDate = new Date(event.target.value);
//         const formattedDate = formatDate(selectedDate);
//         setToDate(selectedDate);
//     };

//     const handleTextInputClick = () => {
//         document.getElementById('dateInputFrom').showPicker();
//     };

//     const handleTextInputClicks = () => {
//         document.getElementById('dateInputTo').showPicker();
//     };

//     useEffect(() => {
//         const currentDate = new Date();
//         const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//         const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

//         setFromDate(firstDayOfMonth);
//         setToDate(lastDayOfMonth);
//     }, []);


//     const [selectedBranch, setSelectedBranch] = useState('');
//     const { data: branches = [] } = useQuery({
//         queryKey: ['branches'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const { data: employee_id_card_setting_list = [] } = useQuery({
//         queryKey: ['employee_id_card_setting_list'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_id_card_setting_list`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const { data: employee_id_card_setting_back_list = [] } = useQuery({
//         queryKey: ['employee_id_card_setting_back_list'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_id_card_setting_back_list`);
//             const data = await res.json();
//             return data;
//         }
//     });


//     const { data: employeeList = [], isLoading } = useQuery({
//         queryKey: ['employeeList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_all_list`);
//             const data = await res.json();
//             return data;
//         }
//     });
//     const [filteredEmployees, setFilteredEmployees] = useState([]);

//     // Filter employees based on selected branch
//     useEffect(() => {
//         if (selectedBranch) {
//             const employeesInBranch = employeeList.filter(employee => employee.branch_id === parseFloat(selectedBranch));
//             setFilteredEmployees(employeesInBranch);
//         } else {
//             setFilteredEmployees([]);
//         }
//     }, [selectedBranch, employeeList]);

//     // Group employees by their designation
//     const groupedEmployees = employeeList.reduce((groups, employee) => {
//         const designation = employee.designation_name;
//         if (!groups[designation]) {
//             groups[designation] = [];
//         }
//         groups[designation].push(employee);
//         return groups;
//     }, {});



//     // State to manage the form rows
//     const [rows, setRows] = useState([]);

//     useEffect(() => {
//         setRows(employee_id_card_setting_list)
//     }, [employee_id_card_setting_list])

//     // Handle adding a new row
//     const addRow = () => {
//         setRows([...rows, { display_name: '', column_name: '', sorting: '', status: '0' }]);
//     };

//     // Handle deleting a row
//     const deleteRow = (index, id) => {


//         const newRows = [...rows];
//         newRows.splice(index, 1);
//         setRows(newRows);

//         const proceed = window.confirm(`Are You Sure delete`)
//         if (proceed) {
//             fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_id_card_setting_delete/${id}`, {
//                 method: "POST",

//             })
//                 .then(Response => {
//                     Response.json()
//                     console.log(Response)
//                 })
//                 .then(data => {
//                     console.log(data)

//                 })

//         }


//     };
//     console.log(rows)



//     const [formData, setFormData] = useState({});

//     // Update formData whenever employee_id_card_setting_back_list changes
//     useEffect(() => {
//         const newFormData = employee_id_card_setting_back_list.reduce((acc, curr) => {
//             acc[curr.id] = {
//                 upper_text_1: curr.upper_text_1,
//                 upper_text_2: curr.upper_text_2,
//                 move_to_left: curr.move_to_left,
//             };
//             return acc;
//         }, {});
//         setFormData(newFormData);
//     }, [employee_id_card_setting_back_list]); // Dependency array

//     const handleChange = (e, id) => {
//         const { name, value } = e.target;
//         setFormData((prevState) => ({
//             ...prevState,
//             [id]: {
//                 ...prevState[id],
//                 [name]: value,
//             },
//         }));
//     };

//     console.log(formData)

//     const employee_create_id_card = (event) => {

//         event.preventDefault();

//         const uniqueFields = {
//             formData, rows

//         }
//         console.log(uniqueFields)
//         // 
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_id_card_all_create`, {
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
//                 console.log(data[0])
//                 if (data[0]?.affectedRows > 0) {
//                     if (typeof window !== 'undefined') {

//                         sessionStorage.setItem("message", "Data saved successfully!");
//                     }
//                     // router.push('/Admin/brand/brand_all');
//                 }
//                 console.log(data)

//             })
//             .catch((error) => console.error(error));
//     }
//     // const filteredSettings = employee_id_card_setting_list.filter(setting => setting.sorting <= 7);
//     const filteredSettings = employee_id_card_setting_list.filter(
//         setting =>
//             setting.sorting <= 7 &&
//             !["designation_name", "unique_id", "photo"].includes(setting.column_name)
//     );

//     // Extract the single search result
//     const searchResult = searchResults[0] || {};
//     console.log(searchResult)
//     console.log(searchResults)
//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className='col-12 p-4'>

//                     <div className='card mb-4'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Employe Loan Search</h5>
//                                 </div>
//                                 <div className="card-body">
//                                     <form >
//                                         <div className="col-md-10 offset-md-1">


//                                             <div className="form-group row">

//                                                 <label className="col-form-label col-md-2"><strong>Designation:</strong></label>
//                                                 <div className="col-md-4">
//                                                     <select

//                                                         name="user_id"
//                                                         className="form-control form-control-sm trim integer_no_zero whose_leave"
//                                                         id="whose_leave"
//                                                         value={designation} onChange={(e) => setDesignation(e.target.value)}
//                                                     >
//                                                         <option value="">Select Designation</option>
//                                                         {Object.keys(groupedEmployees).map(designation => (
//                                                             <optgroup key={designation} label={designation}>
//                                                                 {groupedEmployees[designation].map(employee => (
//                                                                     <option key={employee.user_id} value={employee.user_id}>
//                                                                         {employee.full_name}
//                                                                     </option>
//                                                                 ))}
//                                                             </optgroup>
//                                                         ))}
//                                                     </select>




//                                                 </div>

//                                                 <label class="control-label font-weight-bold col-md-2">Template:</label>
//                                                 <div class="col-md-4">
//                                                     <div class="input-group input-group-sm mb-3">


//                                                         <select value={template} onChange={(e) => setTemplate(e.target.value)} name="login_template" class="form-control form-control-sm custom-select trim integer_no_zero login_template" id="login_template" placeholder="Enter Expense Category">

//                                                             <option value="1">Template 1</option>
//                                                             <option value="2">Template 2</option>
//                                                             <option value="3">Template 3</option>
//                                                             <option value="4">Template 4</option>
//                                                             <option value="5">Template 5</option>
//                                                             <option value="6">Template 6</option>
//                                                             <option value="7">Template 7</option>
//                                                             <option value="8">Template 8</option>
//                                                             <option value="9">Template 9</option>
//                                                             <option value="10">Template 10</option>
//                                                             <option value="11">Template 11</option>

//                                                         </select>


//                                                         <div class="input-group-append">
//                                                             <label data-toggle="modal"
//                                                                 data-target="#exampleModal1" class="input-group-text p-0 btn btn-info" >
//                                                                 <FaEye></FaEye>
//                                                             </label>
//                                                         </div>
//                                                         <div class="modal fade" id="exampleModal1" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
//                                                             <div class="modal-dialog" role="document">
//                                                                 <div class="modal-content">
//                                                                     <div class="modal-header">
//                                                                         <h5 class="modal-title" id="exampleModalLabel">Template {template}</h5>
//                                                                         <button type="button" class="close" data-dismiss="modal" aria-label="Close">
//                                                                             <span aria-hidden="true">&times;</span>
//                                                                         </button>
//                                                                     </div>
//                                                                     <div class="modal-body">
//                                                                         {
//                                                                             template == 1 &&
//                                                                             <>

//                                                                                 {/* id 1 start */}
//                                                                                 <div className='d-flex'>

//                                                                                     <div class="id-card">
//                                                                                         <div class="header">
//                                                                                             <div>
//                                                                                                 <img style={{
//                                                                                                     height: '25px',
//                                                                                                     width: '25px',
//                                                                                                     borderRadius: '50%', // Makes the image round
//                                                                                                     objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
//                                                                                                 }} class="logo" src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="School Logo" />
//                                                                                             </div>
//                                                                                             <div>
//                                                                                                 <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
//                                                                                                 
//                                                                                                 <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
//                                                                                             </div>
//                                                                                         </div>
//                                                                                         <div style={{
//                                                                                             display: 'flex',
//                                                                                             alignItems: 'center',
//                                                                                             justifyContent: 'space-between',
//                                                                                         }}>

//                                                                                             <p style={{ marginTop: '30px', marginLeft: '-20px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '12px' }} className='rotate-text'>
//                                                                                                 <small>Designation:</small>
//                                                                                             </p>


//                                                                                             <div class="photo rotate-img" style={{ marginRight: '10px', marginTop: '-22px', marginLeft: '5px' }}>
//                                                                                                 <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
//                                                                                             </div>


//                                                                                             <p className='rotate-text' style={{ marginTop: '30px', marginRight: '-20px', fontSize: '12px', background: '#192653', padding: '2px 5px', color: 'white' }}>
//                                                                                                 <small>ID:No.023</small>
//                                                                                             </p>
//                                                                                         </div>


//                                                                                         <div class="details">
//                                                                                             <table>
//                                                                                                 {/* <tbody>
//                                                                                                     {filteredSettings.map(setting => {
//                                                                                                         const value = searchResult[setting.column_name] ?? "N/A"; // Get value from searchResult
//                                                                                                         return (
//                                                                                                             <tr key={setting.id}>
//                                                                                                                 <td style={{ margin: '3px' }}>{setting.display_name || ''}</td>
//                                                                                                                 <td style={{ margin: '3px' }}>: {value || ''}</td>
//                                                                                                             </tr>
//                                                                                                         );
//                                                                                                     })}
//                                                                                                 </tbody> */}
//                                                                                                 <tbody>
//                                                                                                     {filteredSettings.map(setting => {
//                                                                                                         // Safely access the value from searchResult
//                                                                                                         const value = searchResult?.[setting.column_name] ?? "N/A";
//                                                                                                         return (
//                                                                                                             <tr key={setting.id}>
//                                                                                                                 <td style={{ margin: '3px' }}>{setting.display_name || ''}</td>
//                                                                                                                 <td style={{ margin: '3px' }}>: {value}</td>
//                                                                                                             </tr>
//                                                                                                         );
//                                                                                                     })}
//                                                                                                 </tbody>
//                                                                                                 {/* <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Saif</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Father Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Sayful Islam</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Mother Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Abida Sultana</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Blood Group </td>
//                                                                                                     <td style={{ margin: '3px' }}>: O+</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Class Roll </td>
//                                                                                                     <td style={{ margin: '3px' }}>: 1</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Mobile No. </td>
//                                                                                                     <td style={{ margin: '3px' }}>: 01716143731</td>
//                                                                                                 </tr> */}
//                                                                                             </table>
//                                                                                         </div>

//                                                                                         <div class="footer">
//                                                                                             <div class="signature">
//                                                                                                 <p style={{ marginBottom: '80px' }}></p>
//                                                                                                 {/* <hr /> */}
//                                                                                             </div>
//                                                                                         </div>
//                                                                                     </div>

//                                                                                     <div class="id-card-container">
//                                                                                         <div class="id-card-content">
//                                                                                             <p class="id-card-issue-date">Issue Date: {fromDates}</p>
//                                                                                             <p class="id-card-expire-date">Expire Date: {toDates}</p>
//                                                                                             <p class="id-card-instructions">
//                                                                                                 {
//                                                                                                     employee_id_card_setting_back_list.map((employe_settings) =>
//                                                                                                         <>

//                                                                                                             <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
//                                                                                                             <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

//                                                                                                         </>

//                                                                                                     )
//                                                                                                 }
//                                                                                             </p>
//                                                                                             <div class="id-card-qr-code">
//                                                                                                 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
//                                                                                             </div>
//                                                                                             <p class="id-card-school-info">
//                                                                                                 <strong>Abdul Malek Master Kindergarten and High School</strong><br />
//                                                                                                 <small> Address: Beraider Chala, Sreepur, Gazipur<br />
//                                                                                                     Phone: 01735879633</small>
//                                                                                             </p>
//                                                                                             {/* <p class="id-card-principal-signature">Principal Signature</p> */}
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </div>
//                                                                                 {/* id 1 end */}
//                                                                             </>
//                                                                         }
//                                                                         {
//                                                                             template == 2 &&
//                                                                             <>
//                                                                                 {/* id 2 start */}

//                                                                                 <div className='d-flex'>

//                                                                                     <div class="id-cards">
//                                                                                         <div class="headers">
//                                                                                             <div>
//                                                                                                 <img style={{
//                                                                                                     height: '25px',
//                                                                                                     width: '25px',
//                                                                                                     borderRadius: '50%', // Makes the image round
//                                                                                                     objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
//                                                                                                 }} class="logos" src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="School Logo" />
//                                                                                             </div>
//                                                                                             <div>
//                                                                                                 <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
//                                                                                                 
//                                                                                                 <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
//                                                                                             </div>
//                                                                                         </div>


//                                                                                         <div class="photos" >
//                                                                                             <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" />
//                                                                                         </div>




//                                                                                         <div class="detailss">
//                                                                                             <table>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Saif</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Father Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Sayful Islam</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Mother Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Abida Sultana</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Blood Group </td>
//                                                                                                     <td style={{ margin: '3px' }}>: O+</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Class Roll </td>
//                                                                                                     <td style={{ margin: '3px' }}>: 1</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Mobile No. </td>
//                                                                                                     <td style={{ margin: '3px' }}>: 01716143731</td>
//                                                                                                 </tr>
//                                                                                             </table>
//                                                                                         </div>


//                                                                                         <div class="footers">
//                                                                                             <div class="signatures">
//                                                                                                 <p style={{ marginBottom: '80px' }}></p>
//                                                                                                 {/* <hr /> */}
//                                                                                             </div>
//                                                                                         </div>
//                                                                                     </div>

//                                                                                     <div class="id-card-containers">
//                                                                                         <div class="id-card-contents">
//                                                                                             <p class="id-card-issue-dates">Issue Date: {fromDates}</p>
//                                                                                             <p class="id-card-expire-dates">Expire Date: {toDates}</p>
//                                                                                             <p class="id-card-instructionss">
//                                                                                                 <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
//                                                                                                 <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
//                                                                                                     দেওয়ার অনুরোধ করা হলো:</small>
//                                                                                             </p>
//                                                                                             <div class="id-card-qr-codes">
//                                                                                                 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
//                                                                                             </div>
//                                                                                             <p class="id-card-school-infos">
//                                                                                                 <strong>Abdul Malek Master Kindergarten and High School</strong><br />
//                                                                                                 <small> Address: Beraider Chala, Sreepur, Gazipur<br />
//                                                                                                     Phone: 01735879633</small>
//                                                                                             </p>
//                                                                                             {/* <p class="id-card-principal-signature">Principal Signature</p> */}
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </div>

//                                                                                 {/* id 2 end */}

//                                                                             </>
//                                                                         }

//                                                                         {
//                                                                             template == 3 && <>

//                                                                                 {/* id 3 start */}

//                                                                                 <div className='d-flex'>

//                                                                                     <div class="id-card1">
//                                                                                         <div class="header1">
//                                                                                             <div>
//                                                                                                 <img style={{
//                                                                                                     height: '25px',
//                                                                                                     width: '25px',
//                                                                                                     borderRadius: '50%', // Makes the image round
//                                                                                                     objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
//                                                                                                 }} class="logo" src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="School Logo" />
//                                                                                             </div>
//                                                                                             <div>
//                                                                                                 <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
//                                                                                                 
//                                                                                                 <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
//                                                                                             </div>
//                                                                                         </div>
//                                                                                         <div style={{
//                                                                                             display: 'flex',
//                                                                                             alignItems: 'center',
//                                                                                             justifyContent: 'space-between',
//                                                                                         }}>

//                                                                                             <p style={{ marginTop: '30px', marginLeft: '-20px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '12px' }} className='rotate-text1'>
//                                                                                                 <small>Designation:</small>
//                                                                                             </p>


//                                                                                             <div class="photo1" style={{ marginRight: '10px' }}>
//                                                                                                 <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
//                                                                                             </div>


//                                                                                             <p className='rotate-text1' style={{ marginTop: '30px', marginRight: '-20px', fontSize: '12px', background: '#192653', padding: '2px 5px', color: 'white' }}>
//                                                                                                 <small> ID:No.023</small>
//                                                                                             </p>
//                                                                                         </div>


//                                                                                         <div class="details1">
//                                                                                             <table>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Saif</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Father Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Sayful Islam</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Mother Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Abida Sultana</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Blood Group </td>
//                                                                                                     <td style={{ margin: '3px' }}>: O+</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Class Roll </td>
//                                                                                                     <td style={{ margin: '3px' }}>: 1</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Mobile No. </td>
//                                                                                                     <td style={{ margin: '3px' }}>: 01716143731</td>
//                                                                                                 </tr>
//                                                                                             </table>
//                                                                                         </div>

//                                                                                         <div class="footer1">
//                                                                                             <div class="signature1">
//                                                                                                 <p style={{ marginBottom: '80px' }}></p>
//                                                                                                 {/* <hr /> */}
//                                                                                             </div>
//                                                                                         </div>
//                                                                                     </div>

//                                                                                     <div class="id-card-container1">
//                                                                                         <div class="id-card-content1">
//                                                                                             <p class="id-card-issue-date1">Issue Date: {fromDates}</p>
//                                                                                             <p class="id-card-expire-date1">Expire Date: {toDates}</p>
//                                                                                             <p class="id-card-instructions1">
//                                                                                                 <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
//                                                                                                 <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
//                                                                                                     দেওয়ার অনুরোধ করা হলো:</small>
//                                                                                             </p>
//                                                                                             <div class="id-card-qr-code1">
//                                                                                                 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
//                                                                                             </div>
//                                                                                             <p class="id-card-school-info1">
//                                                                                                 <strong>Abdul Malek Master Kindergarten and High School</strong><br />
//                                                                                                 <small> Address: Beraider Chala, Sreepur, Gazipur<br />
//                                                                                                     Phone: 01735879633</small>
//                                                                                             </p>
//                                                                                             {/* <p class="id-card-principal-signature">Principal Signature</p> */}
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </div>

//                                                                                 {/* id 3 end */}
//                                                                             </>
//                                                                         }


//                                                                         {
//                                                                             template == 4 && <>
//                                                                                 {/* id 4 start */}

//                                                                                 <div className='d-flex'>

//                                                                                     <div class="id-card12">
//                                                                                         <div class="header12">
//                                                                                             <div>
//                                                                                                 <img style={{
//                                                                                                     height: '25px',
//                                                                                                     width: '25px',
//                                                                                                     borderRadius: '50%', // Makes the image round
//                                                                                                     objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
//                                                                                                 }} class="logo" src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="School Logo" />
//                                                                                             </div>
//                                                                                             <div>
//                                                                                                 <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
//                                                                                                 
//                                                                                                 <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
//                                                                                             </div>
//                                                                                         </div>
//                                                                                         <div style={{
//                                                                                             display: 'flex',
//                                                                                             alignItems: 'center',
//                                                                                             justifyContent: 'space-between',
//                                                                                         }}>

//                                                                                             <p style={{ marginTop: '50px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className=''>
//                                                                                                 <small> Designation:</small>
//                                                                                             </p>


//                                                                                             <div class="photo12" style={{ marginRight: '10px' }}>
//                                                                                                 <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
//                                                                                             </div>


//                                                                                             <p className='' style={{ marginTop: '50px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
//                                                                                                 <small>ID:No.023</small>
//                                                                                             </p>
//                                                                                         </div>


//                                                                                         <div class="details12">
//                                                                                             <table>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Saif</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Father Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Sayful Islam</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Mother Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Abida Sultana</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Blood Group </td>
//                                                                                                     <td style={{ margin: '3px' }}>: O+</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Class Roll </td>
//                                                                                                     <td style={{ margin: '3px' }}>: 1</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Mobile No. </td>
//                                                                                                     <td style={{ margin: '3px' }}>: 01716143731</td>
//                                                                                                 </tr>
//                                                                                             </table>
//                                                                                         </div>

//                                                                                         <div class="footer12">
//                                                                                             <div class="signature12">
//                                                                                                 <p style={{ marginBottom: '80px' }}></p>
//                                                                                                 {/* <hr /> */}
//                                                                                             </div>
//                                                                                         </div>
//                                                                                     </div>

//                                                                                     <div class="id-card-container12">
//                                                                                         <div class="id-card-content12">
//                                                                                             <p class="id-card-issue-date12">Issue Date: {fromDates}</p>
//                                                                                             <p class="id-card-expire-date12">Expire Date: {toDates}</p>
//                                                                                             <p class="id-card-instructions12">
//                                                                                                 <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
//                                                                                                 <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
//                                                                                                     দেওয়ার অনুরোধ করা হলো:</small>
//                                                                                             </p>
//                                                                                             <div class="id-card-qr-code12">
//                                                                                                 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
//                                                                                             </div>
//                                                                                             <p class="id-card-school-info12">
//                                                                                                 <strong>Abdul Malek Master Kindergarten and High School</strong><br />
//                                                                                                 <small> Address: Beraider Chala, Sreepur, Gazipur<br />
//                                                                                                     Phone: 01735879633</small>
//                                                                                             </p>
//                                                                                             {/* <p class="id-card-principal-signature">Principal Signature</p> */}
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </div>

//                                                                                 {/* id 4 end */}
//                                                                             </>
//                                                                         }


//                                                                         {
//                                                                             template == 5 && <>


//                                                                                 {/* id 5 start */}

//                                                                                 <div className='d-flex'>

//                                                                                     <div class="id-card5">
//                                                                                         <div class="header5">
//                                                                                             <div>
//                                                                                                 <img style={{
//                                                                                                     height: '25px',
//                                                                                                     width: '25px',
//                                                                                                     borderRadius: '50%', // Makes the image round
//                                                                                                     objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
//                                                                                                 }} class="logo" src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="School Logo" />
//                                                                                             </div>
//                                                                                             <div>
//                                                                                                 <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
//                                                                                                 
//                                                                                                 <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
//                                                                                             </div>
//                                                                                         </div>
//                                                                                         <div style={{
//                                                                                             display: 'flex',
//                                                                                             alignItems: 'center',
//                                                                                             justifyContent: 'space-between',
//                                                                                         }}>

//                                                                                             <p style={{ marginTop: '70px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className=''>
//                                                                                                 <small> Designation:</small>
//                                                                                             </p>


//                                                                                             <div class="photo5" style={{ marginRight: '10px' }}>
//                                                                                                 <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
//                                                                                             </div>


//                                                                                             <p className='' style={{ marginTop: '70px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
//                                                                                                 <small>ID:No.023</small>
//                                                                                             </p>
//                                                                                         </div>


//                                                                                         <div class="details5">
//                                                                                             <table>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Saif</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Father Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Sayful Islam</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Mother Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Abida Sultana</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Blood Group </td>
//                                                                                                     <td style={{ margin: '3px' }}>: O+</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Class Roll </td>
//                                                                                                     <td style={{ margin: '3px' }}>: 1</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Mobile No. </td>
//                                                                                                     <td style={{ margin: '3px' }}>: 01716143731</td>
//                                                                                                 </tr>
//                                                                                             </table>
//                                                                                         </div>

//                                                                                         <div class="footer5">
//                                                                                             <div class="signature5">
//                                                                                                 <p style={{ marginBottom: '80px' }}></p>
//                                                                                                 {/* <hr /> */}
//                                                                                             </div>
//                                                                                         </div>
//                                                                                     </div>

//                                                                                     <div class="id-card-container5">
//                                                                                         <div class="id-card-content5">
//                                                                                             <p class="id-card-issue-date5">Issue Date: {fromDates}</p>
//                                                                                             <p class="id-card-expire-date5">Expire Date: {toDates}</p>
//                                                                                             <p class="id-card-instructions5">
//                                                                                                 <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
//                                                                                                 <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
//                                                                                                     দেওয়ার অনুরোধ করা হলো:</small>
//                                                                                             </p>
//                                                                                             <div class="id-card-qr-code5">
//                                                                                                 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
//                                                                                             </div>
//                                                                                             <p class="id-card-school-info5">
//                                                                                                 <strong>Abdul Malek Master Kindergarten and High School</strong><br />
//                                                                                                 <small> Address: Beraider Chala, Sreepur, Gazipur<br />
//                                                                                                     Phone: 01735879633</small>
//                                                                                             </p>
//                                                                                             {/* <p class="id-card-principal-signature">Principal Signature</p> */}
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </div>

//                                                                                 {/* id 5 end */}
//                                                                             </>
//                                                                         }

//                                                                         {
//                                                                             template == 6 && <>


//                                                                                 {/* id 6 start */}

//                                                                                 <div className='d-flex'>

//                                                                                     <div class="id-card6">
//                                                                                         <div class="header6">
//                                                                                             <div>
//                                                                                                 <img style={{
//                                                                                                     height: '25px',
//                                                                                                     width: '25px',
//                                                                                                     borderRadius: '50%', // Makes the image round
//                                                                                                     objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
//                                                                                                 }} class="logo" src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="School Logo" />
//                                                                                             </div>
//                                                                                             <div>
//                                                                                                 <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
//                                                                                                 
//                                                                                                 <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
//                                                                                             </div>
//                                                                                         </div>
//                                                                                         <div style={{
//                                                                                             display: 'flex',
//                                                                                             alignItems: 'center',
//                                                                                             justifyContent: 'space-between',
//                                                                                         }}>

//                                                                                             <p style={{ marginTop: '30px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className='rotate-text6'>
//                                                                                                 <small> Designation:</small>
//                                                                                             </p>


//                                                                                             <div class="photo6" style={{ marginRight: '10px' }}>
//                                                                                                 <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
//                                                                                             </div>


//                                                                                             <p className='rotate-text6' style={{ marginTop: '30px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
//                                                                                                 <small>ID:No.023</small>
//                                                                                             </p>
//                                                                                         </div>


//                                                                                         <div class="details6">
//                                                                                             <table>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Saif</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Father Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Sayful Islam</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Mother Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Abida Sultana</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Blood Group </td>
//                                                                                                     <td style={{ margin: '3px' }}>: O+</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Class Roll </td>
//                                                                                                     <td style={{ margin: '3px' }}>: 1</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Mobile No. </td>
//                                                                                                     <td style={{ margin: '3px' }}>: 01716143731</td>
//                                                                                                 </tr>
//                                                                                             </table>
//                                                                                         </div>

//                                                                                         <div class="footer6">
//                                                                                             <div class="signature6">
//                                                                                                 <p style={{ marginBottom: '80px' }}></p>
//                                                                                                 {/* <hr /> */}
//                                                                                             </div>
//                                                                                         </div>
//                                                                                     </div>

//                                                                                     <div class="id-card-container6">
//                                                                                         <div class="id-card-content6">
//                                                                                             <p class="id-card-issue-date6">Issue Date: {fromDates}</p>
//                                                                                             <p class="id-card-expire-date6">Expire Date: {toDates}</p>
//                                                                                             <p class="id-card-instructions6">
//                                                                                                 <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
//                                                                                                 <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
//                                                                                                     দেওয়ার অনুরোধ করা হলো:</small>
//                                                                                             </p>
//                                                                                             <div class="id-card-qr-code6">
//                                                                                                 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
//                                                                                             </div>
//                                                                                             <p class="id-card-school-info6">
//                                                                                                 <strong>Abdul Malek Master Kindergarten and High School</strong><br />
//                                                                                                 <small> Address: Beraider Chala, Sreepur, Gazipur<br />
//                                                                                                     Phone: 01735879633</small>
//                                                                                             </p>
//                                                                                             {/* <p class="id-card-principal-signature">Principal Signature</p> */}
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </div>

//                                                                                 {/* id 6 end */}
//                                                                             </>
//                                                                         }
//                                                                         {
//                                                                             template == 7 && <>

//                                                                                 {/* id 7 start */}

//                                                                                 <div className='d-flex'>

//                                                                                     <div class="id-card7">
//                                                                                         <div class="header7">
//                                                                                             <div>
//                                                                                                 <img style={{
//                                                                                                     height: '25px',
//                                                                                                     width: '25px',
//                                                                                                     borderRadius: '50%', // Makes the image round
//                                                                                                     objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
//                                                                                                 }} class="logo" src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="School Logo" />
//                                                                                             </div>
//                                                                                             <div>
//                                                                                                 <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
//                                                                                                 
//                                                                                                 <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
//                                                                                             </div>
//                                                                                         </div>
//                                                                                         <div style={{
//                                                                                             display: 'flex',
//                                                                                             alignItems: 'center',
//                                                                                             justifyContent: 'space-between',
//                                                                                         }}>

//                                                                                             <p style={{ marginTop: '30px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className='rotate-text6'>
//                                                                                                 <small> Designation:</small>
//                                                                                             </p>


//                                                                                             <div class="photo7" style={{ marginRight: '10px' }}>
//                                                                                                 <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
//                                                                                             </div>


//                                                                                             <p className='rotate-text7' style={{ marginTop: '30px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
//                                                                                                 <small>ID:No.023</small>
//                                                                                             </p>
//                                                                                         </div>


//                                                                                         <div class="details7">
//                                                                                             <table>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Saif</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Father Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Sayful Islam</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Mother Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Abida Sultana</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Blood Group </td>
//                                                                                                     <td style={{ margin: '3px' }}>: O+</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Class Roll </td>
//                                                                                                     <td style={{ margin: '3px' }}>: 1</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Mobile No. </td>
//                                                                                                     <td style={{ margin: '3px' }}>: 01716143731</td>
//                                                                                                 </tr>
//                                                                                             </table>
//                                                                                         </div>

//                                                                                         <div class="footer7">
//                                                                                             <div class="signature7">
//                                                                                                 <p style={{ marginBottom: '80px' }}></p>
//                                                                                                 {/* <hr /> */}
//                                                                                             </div>
//                                                                                         </div>
//                                                                                     </div>

//                                                                                     <div class="id-card-container7">
//                                                                                         <div class="id-card-content7">
//                                                                                             <p class="id-card-issue-date7">Issue Date: {fromDates}</p>
//                                                                                             <p class="id-card-expire-date7">Expire Date: {toDates}</p>
//                                                                                             <p class="id-card-instructions7">
//                                                                                                 <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
//                                                                                                 <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
//                                                                                                     দেওয়ার অনুরোধ করা হলো:</small>
//                                                                                             </p>
//                                                                                             <div class="id-card-qr-code7">
//                                                                                                 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
//                                                                                             </div>
//                                                                                             <p class="id-card-school-info7">
//                                                                                                 <strong>Abdul Malek Master Kindergarten and High School</strong><br />
//                                                                                                 <small> Address: Beraider Chala, Sreepur, Gazipur<br />
//                                                                                                     Phone: 01735879633</small>
//                                                                                             </p>
//                                                                                             {/* <p class="id-card-principal-signature">Principal Signature</p> */}
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </div>

//                                                                                 {/* id 7 end */}
//                                                                             </>
//                                                                         }

//                                                                         {
//                                                                             template == 8 && <>


//                                                                                 {/* id 8 start */}

//                                                                                 <div className='d-flex'>

//                                                                                     <div class="id-card8">
//                                                                                         <div class="header8">
//                                                                                             <div>
//                                                                                                 <img style={{
//                                                                                                     height: '25px',
//                                                                                                     width: '25px',
//                                                                                                     borderRadius: '50%', // Makes the image round
//                                                                                                     objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
//                                                                                                 }} class="logo" src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="School Logo" />
//                                                                                             </div>
//                                                                                             <div>
//                                                                                                 <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
//                                                                                                 
//                                                                                                 <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
//                                                                                             </div>
//                                                                                         </div>
//                                                                                         <div style={{
//                                                                                             display: 'flex',
//                                                                                             alignItems: 'center',
//                                                                                             justifyContent: 'space-between',
//                                                                                         }}>

//                                                                                             <p style={{ marginTop: '-50px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className=''>
//                                                                                                 <small> Designation:</small>
//                                                                                             </p>


//                                                                                             <div class="photo8 rotate-img8" style={{ marginRight: '10px' }}>
//                                                                                                 <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
//                                                                                             </div>


//                                                                                             <p className='' style={{ marginTop: '-50px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
//                                                                                                 <small>ID:No.023</small>
//                                                                                             </p>
//                                                                                         </div>


//                                                                                         <div class="details8">
//                                                                                             <table>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Saif</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Father Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Sayful Islam</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Mother Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Abida Sultana</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Blood Group </td>
//                                                                                                     <td style={{ margin: '3px' }}>: O+</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Class Roll </td>
//                                                                                                     <td style={{ margin: '3px' }}>: 1</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Mobile No. </td>
//                                                                                                     <td style={{ margin: '3px' }}>: 01716143731</td>
//                                                                                                 </tr>
//                                                                                             </table>
//                                                                                         </div>

//                                                                                         <div class="footer8">
//                                                                                             <div class="signature8">
//                                                                                                 <p style={{ marginBottom: '80px' }}></p>
//                                                                                                 {/* <hr /> */}
//                                                                                             </div>
//                                                                                         </div>
//                                                                                     </div>

//                                                                                     <div class="id-card-container8">
//                                                                                         <div class="id-card-content8">
//                                                                                             <p class="id-card-issue-date8">Issue Date: {fromDates}</p>
//                                                                                             <p class="id-card-expire-date8">Expire Date: {toDates}</p>
//                                                                                             <p class="id-card-instructions8">
//                                                                                                 <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
//                                                                                                 <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
//                                                                                                     দেওয়ার অনুরোধ করা হলো:</small>
//                                                                                             </p>
//                                                                                             <div class="id-card-qr-code8">
//                                                                                                 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
//                                                                                             </div>
//                                                                                             <p class="id-card-school-info8">
//                                                                                                 <strong>Abdul Malek Master Kindergarten and High School</strong><br />
//                                                                                                 <small> Address: Beraider Chala, Sreepur, Gazipur<br />
//                                                                                                     Phone: 01735879633</small>
//                                                                                             </p>
//                                                                                             {/* <p class="id-card-principal-signature">Principal Signature</p> */}
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </div>

//                                                                                 {/* id 8 end */}
//                                                                             </>
//                                                                         }


//                                                                         {
//                                                                             template == 9 && <>

//                                                                                 {/* id 9 start */}

//                                                                                 <div class="id-card9">

//                                                                                     <div class="header9">
//                                                                                         <div>
//                                                                                             <h6 style={{ textAlign: 'left', marginLeft: '-14px', fontSize: '12px', marginTop: '-11px' }}>IDENTITY CARD</h6>

//                                                                                         </div>
//                                                                                         <div className='header_text' style={{ display: 'flex' }}>
//                                                                                             <img style={{
//                                                                                                 height: '35px',
//                                                                                                 width: '35px',
//                                                                                                 borderRadius: '50%', // Makes the image round
//                                                                                                 objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
//                                                                                             }} class="logo" src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="School Logo" />
//                                                                                             <div>
//                                                                                                 <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
//                                                                                                 
//                                                                                             </div>

//                                                                                         </div>
//                                                                                     </div>

//                                                                                     <div class="profile-section9">
//                                                                                         <div class="profile-image9">
//                                                                                             <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Profile Picture" />
//                                                                                         </div>
//                                                                                         <div class="details9">
//                                                                                             <div className='teacher_information'>
//                                                                                                 <h3>Akhi Sardar</h3>
//                                                                                                 <p>English Teacher</p>
//                                                                                             </div>
//                                                                                             <div class="info9">
//                                                                                                 <table>
//                                                                                                     <tr>
//                                                                                                         <td >Blood Group </td>
//                                                                                                         <td>: O+</td>
//                                                                                                     </tr>
//                                                                                                     <tr>
//                                                                                                         <td >Join Date </td>
//                                                                                                         <td >: 1</td>
//                                                                                                     </tr>
//                                                                                                     <tr>
//                                                                                                         <td >Mobile No. </td>
//                                                                                                         <td >: 01716143731</td>
//                                                                                                     </tr>

//                                                                                                 </table>

//                                                                                             </div>
//                                                                                         </div>
//                                                                                     </div>



//                                                                                 </div>


//                                                                                 <div class="id-card-container9">
//                                                                                     <div class="id-card-content9">
//                                                                                         <p class="id-card-issue-date9">Issue Date: {fromDates}</p>
//                                                                                         <p class="id-card-expire-date9">Expire Date: {toDates}</p>
//                                                                                         <p class="id-card-instructions9">
//                                                                                             <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
//                                                                                             <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
//                                                                                                 দেওয়ার অনুরোধ করা হলো:</small>
//                                                                                         </p>
//                                                                                         <div class="id-card-qr-code9">
//                                                                                             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
//                                                                                         </div>
//                                                                                         <p class="id-card-school-info9">
//                                                                                             <strong>Abdul Malek Master Kindergarten and High School</strong><br />
//                                                                                             <small> Address: Beraider Chala, Sreepur, Gazipur<br />
//                                                                                                 Phone: 01735879633</small>
//                                                                                         </p>
//                                                                                         {/* <p class="id-card-principal-signature">Principal Signature</p> */}
//                                                                                     </div>
//                                                                                 </div>
//                                                                                 {/* id 9 end */}
//                                                                             </>
//                                                                         }

//                                                                         {
//                                                                             template == 10 && <>

//                                                                                 {/* id 10 start */}

//                                                                                 <div className='d-flex'>

//                                                                                     <div class="id-card10">
//                                                                                         <div class="header10">
//                                                                                             <div>
//                                                                                                 <img style={{
//                                                                                                     height: '25px',
//                                                                                                     width: '25px',
//                                                                                                     borderRadius: '50%', // Makes the image round
//                                                                                                     objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
//                                                                                                 }} class="logo" src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="School Logo" />
//                                                                                             </div>
//                                                                                             <div>
//                                                                                                 <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
//                                                                                                 
//                                                                                                 <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
//                                                                                             </div>
//                                                                                         </div>
//                                                                                         <div style={{
//                                                                                             display: 'flex',
//                                                                                             alignItems: 'center',
//                                                                                             justifyContent: 'space-between',
//                                                                                         }}>

//                                                                                             {/* <p style={{ marginTop: '30px', marginLeft: '-15px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '8px' }} className='rotate-text6'>
//                 <small> Designation:</small>
//             </p> */}


//                                                                                             <div class="photo10" style={{ marginRight: '10px' }}>
//                                                                                                 <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
//                                                                                             </div>


//                                                                                             {/* <p className='rotate-text10' style={{ marginTop: '30px', fontSize: '8px', background: '#192653', padding: '2px 5px', color: 'white', marginRight: '-15px' }}>
//                 <small>ID:No.023</small>
//             </p> */}
//                                                                                         </div>


//                                                                                         <div class="details10">
//                                                                                             <table>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Saif</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Father Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Sayful Islam</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Mother Name </td>
//                                                                                                     <td style={{ margin: '3px' }}>: Abida Sultana</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Blood Group </td>
//                                                                                                     <td style={{ margin: '3px' }}>: O+</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Class Roll </td>
//                                                                                                     <td style={{ margin: '3px' }}>: 1</td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td style={{ margin: '3px' }}>Mobile No. </td>
//                                                                                                     <td style={{ margin: '3px' }}>: 01716143731</td>
//                                                                                                 </tr>
//                                                                                             </table>
//                                                                                         </div>

//                                                                                         <div class="footer10">
//                                                                                             <div class="signature10">
//                                                                                                 <p style={{ marginBottom: '80px' }}></p>
//                                                                                                 {/* <hr /> */}
//                                                                                             </div>
//                                                                                         </div>
//                                                                                     </div>

//                                                                                     <div class="id-card-container10">
//                                                                                         <div class="id-card-content10">
//                                                                                             <p class="id-card-issue-date10">Issue Date: {fromDates}</p>
//                                                                                             <p class="id-card-expire-date10">Expire Date: {toDates}</p>
//                                                                                             <p class="id-card-instructions10">
//                                                                                                 <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
//                                                                                                 <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
//                                                                                                     দেওয়ার অনুরোধ করা হলো:</small>
//                                                                                             </p>
//                                                                                             <div class="id-card-qr-code10">
//                                                                                                 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
//                                                                                             </div>
//                                                                                             <p class="id-card-school-info10">
//                                                                                                 <strong>Abdul Malek Master Kindergarten and High School</strong><br />
//                                                                                                 <small> Address: Beraider Chala, Sreepur, Gazipur<br />
//                                                                                                     Phone: 01735879633</small>
//                                                                                             </p>
//                                                                                             {/* <p class="id-card-principal-signature">Principal Signature</p> */}
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </div>

//                                                                                 {/* id 10 end */}
//                                                                             </>
//                                                                         }

//                                                                         {
//                                                                             template == 11 && <>


//                                                                                 {/* id 11 start */}

//                                                                                 <div class="id-card11">

//                                                                                     <div class="header11">
//                                                                                         <div>
//                                                                                             <h6 style={{ textAlign: 'left', marginLeft: '-14px', fontSize: '12px', marginTop: '-11px' }}>IDENTITY CARD</h6>

//                                                                                         </div>
//                                                                                         <div className='header_text11' style={{ display: 'flex' }}>
//                                                                                             <img style={{
//                                                                                                 height: '35px',
//                                                                                                 width: '35px',
//                                                                                                 borderRadius: '50%', // Makes the image round
//                                                                                                 objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
//                                                                                             }} class="logo" src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="School Logo" />
//                                                                                             <div>
//                                                                                                 <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
//                                                                                                 
//                                                                                             </div>

//                                                                                         </div>
//                                                                                     </div>

//                                                                                     <div class="profile-section11">
//                                                                                         <div class="profile-image11">
//                                                                                             <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Profile Picture" />
//                                                                                         </div>
//                                                                                         <div class="details11">
//                                                                                             <div className='teacher_information11'>
//                                                                                                 <h3>Akhi Sardar</h3>
//                                                                                                 <p>English Teacher</p>
//                                                                                             </div>
//                                                                                             <div class="info11">
//                                                                                                 <table>
//                                                                                                     <tr>
//                                                                                                         <td >Blood Group </td>
//                                                                                                         <td>: O+</td>
//                                                                                                     </tr>
//                                                                                                     <tr>
//                                                                                                         <td >Join Date </td>
//                                                                                                         <td >: 1</td>
//                                                                                                     </tr>
//                                                                                                     <tr>
//                                                                                                         <td >Mobile No. </td>
//                                                                                                         <td >: 01716143731</td>
//                                                                                                     </tr>

//                                                                                                 </table>

//                                                                                             </div>
//                                                                                         </div>
//                                                                                     </div>



//                                                                                 </div>
//                                                                                 <div class="id-card-container11">
//                                                                                     <div class="id-card-content11">
//                                                                                         <p class="id-card-issue-date11">Issue Date: {fromDates}</p>
//                                                                                         <p class="id-card-expire-date11">Expire Date: {toDates}</p>
//                                                                                         <p class="id-card-instructions11">
//                                                                                             <strong>হারিয়ে গেলে বা নষ্ট হলে কর্তৃপক্ষকে অবহিত করতে হবে</strong><br />
//                                                                                             <small>পরিচয় পত্রটি পাওয়া গেলে নিচের ঠিকানার পৈতে<br />
//                                                                                                 দেওয়ার অনুরোধ করা হলো:</small>
//                                                                                         </p>
//                                                                                         <div class="id-card-qr-code11">
//                                                                                             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
//                                                                                         </div>
//                                                                                         <p class="id-card-school-info11">
//                                                                                             <strong>Abdul Malek Master Kindergarten and High School</strong><br />
//                                                                                             <small> Address: Beraider Chala, Sreepur, Gazipur<br />
//                                                                                                 Phone: 01735879633</small>
//                                                                                         </p>

//                                                                                     </div>
//                                                                                 </div>

//                                                                             </>
//                                                                         }

//                                                                     </div>
//                                                                     <div class="modal-footer">
//                                                                         <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>

//                                                 </div>

//                                             </div>

//                                             <div className="form-group row">
//                                                 <label className="col-form-label col-md-2"><strong>Template Side:</strong></label>
//                                                 <div className="col-md-4">
//                                                     <select
//                                                         value={templateSide} onChange={(e) => setTemplateSide(e.target.value)}
//                                                         name="statusFilter"
//                                                         className="form-control form-control-sm integer_no_zero"
//                                                     >
//                                                         <option value="0">Both Side</option>
//                                                         <option value="1">Front Side</option>
//                                                         <option value="2">Back Side</option>

//                                                     </select>
//                                                 </div>

//                                             </div>


//                                         </div>
//                                         <div className="form-group row">
//                                             <div className="offset-md-2 col-md-8 float-left">
//                                                 <input type="button" name="search" className="btn btn-sm btn-info" value="Search"
//                                                     onClick={employee_search}
//                                                 />
//                                                 <input
//                                                     // onClick={loan_payment_print}
//                                                     type="button" name="print" class="btn btn-sm btn-success print_btn ml-2" value="Print" />
//                                                 <input
//                                                     // onClick={loan_payment_pdf}
//                                                     type="button" name="summary" class="btn btn-sm btn-secondary print_summary ml-2" value="Download PDF" />

//                                                 <input
//                                                     type="button"
//                                                     name="summary"
//                                                     className="btn btn-sm btn-danger print_summary ml-2"
//                                                     value="Design & Config"
//                                                     data-toggle="modal"
//                                                     data-target="#exampleModal"
//                                                 />

//                                             </div>
//                                         </div>

//                                     </form>



//                                     <div class="card-body" >
//                                         {loading ? <div className='text-center'>
//                                             <div className='  text-center text-dark'
//                                             >
//                                                 <FontAwesomeIcon style={{
//                                                     height: '33px',
//                                                     width: '33px',
//                                                 }} icon={faSpinner} spin />
//                                             </div>
//                                         </div> : searchResults?.length > 0 ? (
//                                             <div class="table-responsive">

//                                                 {searchResults.map((searchResult, i) => (
//                                                     <>
//                                                         {
//                                                             template == 1 && <>


//                                                                 {
//                                                                     templateSide == 0 &&
//                                                                     <>


//                                                                         {/* id 1 start */}
//                                                                         <div className='d-flex'>


//                                                                             <div class="id-card">
//                                                                                 <div class="header">
//                                                                                     <div>
//                                                                                         <img style={{
//                                                                                             height: '25px',
//                                                                                             width: '25px',
//                                                                                             borderRadius: '50%', // Makes the image round
//                                                                                             objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
//                                                                                         }} class="logo" src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="School Logo" />
//                                                                                     </div>
//                                                                                     <div>
//                                                                                         <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
//                                                                                         
//                                                                                         <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
//                                                                                     </div>
//                                                                                 </div>



//                                                                                 <div class="rotate-img imgs">
//                                                                                     <img style={{ height: '55px', width: '55px' }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5002/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
//                                                                                 </div>
//                                                                                 <div className='text'>
//                                                                                     <p className='rotate-text-left'><small>{searchResult?.designation_name || 'N/A'}</small></p>
//                                                                                     <p className='rotate-text-right'><small>{searchResult?.unique_id || 'ID: No. N/A'}</small></p>
//                                                                                 </div>
//                                                                                 <div class="details">
//                                                                                     <table>
//                                                                                         <tbody>
//                                                                                             {filteredSettings.map(setting => {
//                                                                                                 // Safely access the value from searchResult
//                                                                                                 let value = searchResult?.[setting.column_name] ?? "N/A";

//                                                                                                 // Slice value if column_name is 'join_date'
//                                                                                                 if (setting.column_name === "join_date" && value !== "N/A") {
//                                                                                                     value = value.slice(0, 10);
//                                                                                                 }

//                                                                                                 return (
//                                                                                                     <tr key={setting.id}>
//                                                                                                         {/* Column name with 50% width */}
//                                                                                                         <td style={{ width: "50%", margin: "3px" }}>
//                                                                                                             {setting.display_name || ""}
//                                                                                                         </td>
//                                                                                                         {/* Value with 50% width */}
//                                                                                                         <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
//                                                                                                     </tr>
//                                                                                                 );
//                                                                                             })}
//                                                                                         </tbody>


//                                                                                     </table>
//                                                                                 </div>

//                                                                                 <div class="footer">
//                                                                                     <div class="signature">
//                                                                                         <p style={{ marginBottom: '80px' }}></p>
//                                                                                         {/* <hr /> */}
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </div>



//                                                                             <div class="id-card-container">
//                                                                                 <div class="id-card-content">
//                                                                                     <p class="id-card-issue-date">Issue Date: {fromDates}</p>
//                                                                                     <p class="id-card-expire-date">Expire Date: {toDates}</p>
//                                                                                     <p class="id-card-instructions">
//                                                                                         {
//                                                                                             employee_id_card_setting_back_list.map((employe_settings) =>
//                                                                                                 <>

//                                                                                                     <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
//                                                                                                     <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

//                                                                                                 </>

//                                                                                             )
//                                                                                         }
//                                                                                     </p>
//                                                                                     <div class="id-card-qr-code">
//                                                                                         <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
//                                                                                     </div>
//                                                                                     <p class="id-card-school-info">
//                                                                                         <strong>Abdul Malek Master Kindergarten and High School</strong><br />
//                                                                                         <small> Address: Beraider Chala, Sreepur, Gazipur<br />
//                                                                                             Phone: 01735879633</small>
//                                                                                     </p>
//                                                                                     {/* <p class="id-card-principal-signature">Principal Signature</p> */}
//                                                                                 </div>
//                                                                             </div>

//                                                                         </div>
//                                                                         {/* id 1 end */}
//                                                                     </>
//                                                                 }
//                                                                 {
//                                                                     templateSide == 1 && <>

//                                                                         <div class="id-card">
//                                                                             <div class="header">
//                                                                                 <div>
//                                                                                     <img style={{
//                                                                                         height: '25px',
//                                                                                         width: '25px',
//                                                                                         borderRadius: '50%', // Makes the image round
//                                                                                         objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
//                                                                                     }} class="logo" src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="School Logo" />
//                                                                                 </div>
//                                                                                 <div>
//                                                                                     <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
//                                                                                     
//                                                                                     <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
//                                                                                 </div>
//                                                                             </div>
//                                                                             <div class="rotate-img imgs">
//                                                                                 <img style={{ height: '55px', width: '55px' }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5002/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
//                                                                             </div>
//                                                                             <div className='text'>
//                                                                                 <p className='rotate-text-left'><small>{searchResult?.designation_name || 'N/A'}</small></p>
//                                                                                 <p className='rotate-text-right'><small>{searchResult?.unique_id || 'ID: No. N/A'}</small></p>
//                                                                             </div>


//                                                                             <div class="details">
//                                                                                 <table>
//                                                                                     <tbody>
//                                                                                         {filteredSettings.map(setting => {
//                                                                                             // Safely access the value from searchResult
//                                                                                             let value = searchResult?.[setting.column_name] ?? "N/A";

//                                                                                             // Slice value if column_name is 'join_date'
//                                                                                             if (setting.column_name === "join_date" && value !== "N/A") {
//                                                                                                 value = value.slice(0, 10);
//                                                                                             }

//                                                                                             return (
//                                                                                                 <tr key={setting.id}>
//                                                                                                     {/* Column name with 50% width */}
//                                                                                                     <td style={{ width: "50%", margin: "3px" }}>
//                                                                                                         {setting.display_name || ""}
//                                                                                                     </td>
//                                                                                                     {/* Value with 50% width */}
//                                                                                                     <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
//                                                                                                 </tr>
//                                                                                             );
//                                                                                         })}
//                                                                                     </tbody>


//                                                                                 </table>
//                                                                             </div>

//                                                                             <div class="footer">
//                                                                                 <div class="signature">
//                                                                                     <p style={{ marginBottom: '80px' }}></p>
//                                                                                     {/* <hr /> */}
//                                                                                 </div>
//                                                                             </div>
//                                                                         </div>
//                                                                     </>
//                                                                 }
//                                                                 {
//                                                                     templateSide == 2 && <>

//                                                                         <div class="id-card-container">
//                                                                             <div class="id-card-content">
//                                                                                 <p class="id-card-issue-date">Issue Date: {fromDates}</p>
//                                                                                 <p class="id-card-expire-date">Expire Date: {toDates}</p>
//                                                                                 <p class="id-card-instructions">
//                                                                                     {
//                                                                                         employee_id_card_setting_back_list.map((employe_settings) =>
//                                                                                             <>

//                                                                                                 <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
//                                                                                                 <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

//                                                                                             </>

//                                                                                         )
//                                                                                     }
//                                                                                 </p>
//                                                                                 <div class="id-card-qr-code">
//                                                                                     <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
//                                                                                 </div>
//                                                                                 <p class="id-card-school-info">
//                                                                                     <strong>Abdul Malek Master Kindergarten and High School</strong><br />
//                                                                                     <small> Address: Beraider Chala, Sreepur, Gazipur<br />
//                                                                                         Phone: 01735879633</small>
//                                                                                 </p>
//                                                                                 {/* <p class="id-card-principal-signature">Principal Signature</p> */}
//                                                                             </div>
//                                                                         </div>
//                                                                     </>
//                                                                 }
//                                                             </>

//                                                         }

//                                                     </>
//                                                 ))

//                                                 }


//                                             </div>

//                                         )

//                                             :

//                                             ''


//                                         }
//                                     </div>


                                 
//                                 </div>
//                             </div>

//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EmployeIdCardList;






// {
//     template == 1 && <>


//         {
//             templateSide == 0 &&
//             <>


//                 {/* id 1 start */}
//                 <div className='d-flex'>


//                     <div class="id-card">
//                         <div class="header">
//                             <div>
//                                 <img style={{
//                                     height: '25px',
//                                     width: '25px',
//                                     borderRadius: '50%', // Makes the image round
//                                     objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
//                                 }} class="logo" src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="School Logo" />
//                             </div>
//                             <div>
//                                 <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
//                                 
//                                 <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
//                             </div>
//                         </div>



//                         <div class="rotate-img imgs">
//                             <img style={{ height: '55px', width: '55px' }} src={searchResult?.photo ? `${process.env.NEXT_PUBLIC_API_URL}:5002/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
//                         </div>
//                         <div className='text'>
//                             <p className='rotate-text-left'><small>{searchResult?.designation_name || 'N/A'}</small></p>
//                             <p className='rotate-text-right'><small>{searchResult?.unique_id || 'ID: No. N/A'}</small></p>
//                         </div>
//                         <div class="details">
//                             <table>
//                                 <tbody>
//                                     {filteredSettings.map(setting => {
//                                         // Safely access the value from searchResult
//                                         let value = searchResult?.[setting.column_name] ?? "N/A";

//                                         // Slice value if column_name is 'join_date'
//                                         if (setting.column_name === "join_date" && value !== "N/A") {
//                                             value = value.slice(0, 10);
//                                         }

//                                         return (
//                                             <tr key={setting.id}>
//                                                 {/* Column name with 50% width */}
//                                                 <td style={{ width: "50%", margin: "3px" }}>
//                                                     {setting.display_name || ""}
//                                                 </td>
//                                                 {/* Value with 50% width */}
//                                                 <td style={{ width: "50%", margin: "3px" }}> : {value}</td>
//                                             </tr>
//                                         );
//                                     })}
//                                 </tbody>


//                             </table>
//                         </div>

//                         <div class="footer">
//                             <div class="signature">
//                                 <p style={{ marginBottom: '80px' }}></p>
//                                 {/* <hr /> */}
//                             </div>
//                         </div>
//                     </div>



//                     <div class="id-card-container">
//                         <div class="id-card-content">
//                             <p class="id-card-issue-date">Issue Date: {fromDates}</p>
//                             <p class="id-card-expire-date">Expire Date: {toDates}</p>
//                             <p class="id-card-instructions">
//                                 {
//                                     employee_id_card_setting_back_list.map((employe_settings) =>
//                                         <>

//                                             <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
//                                             <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

//                                         </>

//                                     )
//                                 }
//                             </p>
//                             <div class="id-card-qr-code">
//                                 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
//                             </div>
//                             <p class="id-card-school-info">
//                                 <strong>Abdul Malek Master Kindergarten and High School</strong><br />
//                                 <small> Address: Beraider Chala, Sreepur, Gazipur<br />
//                                     Phone: 01735879633</small>
//                             </p>
//                             {/* <p class="id-card-principal-signature">Principal Signature</p> */}
//                         </div>
//                     </div>

//                 </div>
//                 {/* id 1 end */}
//             </>
//         }
//         {
//             templateSide == 1 && <>

//                 <div class="id-card">
//                     <div class="header">
//                         <div>
//                             <img style={{
//                                 height: '25px',
//                                 width: '25px',
//                                 borderRadius: '50%', // Makes the image round
//                                 objectFit: 'cover'   // Ensures the image fits perfectly inside the circle
//                             }} class="logo" src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="School Logo" />
//                         </div>
//                         <div>
//                             <p style={{ fontWeight: 'bold' }}>Abdul Malek Master Kindergarten<br />and High School</p>
//                             
//                             <h6 style={{ textAlign: 'left', marginLeft: '14px', fontSize: '10px', marginTop: '5px' }}>IDENTITY CARD</h6>
//                         </div>
//                     </div>
//                     <div style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'space-between',
//                     }}>

//                         <p style={{ marginTop: '30px', marginLeft: '-20px', background: '#192653', padding: '2px 5px', color: 'white', fontSize: '12px' }} className='rotate-text'>
//                             <small>Designation:</small>
//                         </p>


//                         <div class="photo rotate-img" style={{ marginRight: '10px', marginTop: '-22px', marginLeft: '5px' }}>
//                             <img src="https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg" alt="Student Photo" />
//                         </div>


//                         <p className='rotate-text' style={{ marginTop: '30px', marginRight: '-20px', fontSize: '12px', background: '#192653', padding: '2px 5px', color: 'white' }}>
//                             <small>ID:No.023</small>
//                         </p>
//                     </div>


//                     <div class="details">
//                         <table>
//                             <tr>
//                                 <td style={{ margin: '3px' }}>Name </td>
//                                 <td style={{ margin: '3px' }}>: Saif</td>
//                             </tr>
//                             <tr>
//                                 <td style={{ margin: '3px' }}>Father Name </td>
//                                 <td style={{ margin: '3px' }}>: Sayful Islam</td>
//                             </tr>
//                             <tr>
//                                 <td style={{ margin: '3px' }}>Mother Name </td>
//                                 <td style={{ margin: '3px' }}>: Abida Sultana</td>
//                             </tr>
//                             <tr>
//                                 <td style={{ margin: '3px' }}>Blood Group </td>
//                                 <td style={{ margin: '3px' }}>: O+</td>
//                             </tr>
//                             <tr>
//                                 <td style={{ margin: '3px' }}>Class Roll </td>
//                                 <td style={{ margin: '3px' }}>: 1</td>
//                             </tr>
//                             <tr>
//                                 <td style={{ margin: '3px' }}>Mobile No. </td>
//                                 <td style={{ margin: '3px' }}>: 01716143731</td>
//                             </tr>
//                         </table>
//                     </div>

//                     <div class="footer">
//                         <div class="signature">
//                             <p style={{ marginBottom: '80px' }}></p>
//                             {/* <hr /> */}
//                         </div>
//                     </div>
//                 </div>
//             </>
//         }
//         {
//             templateSide == 2 && <>

//                 <div class="id-card-container">
//                     <div class="id-card-content">
//                         <p class="id-card-issue-date">Issue Date: {fromDates}</p>
//                         <p class="id-card-expire-date">Expire Date: {toDates}</p>
//                         <p class="id-card-instructions">
//                             {
//                                 employee_id_card_setting_back_list.map((employe_settings) =>
//                                     <>

//                                         <strong onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_1 || ''}</strong><br />
//                                         <small onChange={(e) => handleChange(e, employe_settings.id)}>{formData[employe_settings.id]?.upper_text_2 || ''}</small>

//                                     </>

//                                 )
//                             }
//                         </p>
//                         <div class="id-card-qr-code">
//                             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
//                         </div>
//                         <p class="id-card-school-info">
//                             <strong>Abdul Malek Master Kindergarten and High School</strong><br />
//                             <small> Address: Beraider Chala, Sreepur, Gazipur<br />
//                                 Phone: 01735879633</small>
//                         </p>
//                         {/* <p class="id-card-principal-signature">Principal Signature</p> */}
//                     </div>
//                 </div>
//             </>
//         }
//     </>

// }

