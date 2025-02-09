'use client'
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

const EmployeIdCardList = () => {

    const [leaveFor, setLeaveFor] = useState('')
    const [activeTab, setActiveTab] = useState('font_side'); // Track active tab
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const formatDate = (date) => {
        const day = String(date?.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        return `${day}-${month}-${year}`;
    };

    const handleDateChangeFrom = (event) => {
        const selectedDate = new Date(event.target.value);
        const formattedDate = formatDate(selectedDate);
        setFromDate(selectedDate);
    };

    const handleDateChangeTo = (event) => {
        const selectedDate = new Date(event.target.value);
        const formattedDate = formatDate(selectedDate);
        setToDate(selectedDate);
    };

    const handleTextInputClick = () => {
        document.getElementById('dateInputFrom').showPicker();
    };

    const handleTextInputClicks = () => {
        document.getElementById('dateInputTo').showPicker();
    };

    useEffect(() => {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        setFromDate(firstDayOfMonth);
        setToDate(lastDayOfMonth);
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
    const groupedEmployees = filteredEmployees.reduce((groups, employee) => {
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
                                                <label className="col-form-label col-md-2"><strong>Branch Name:</strong></label>
                                                <div className="col-md-4">
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
                                                <label className="col-form-label col-md-2"><strong>Designation:</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        onChange={(e) => {
                                                            setLeaveFor(e.target.value);

                                                        }}
                                                        name="user_id"
                                                        className="form-control form-control-sm trim integer_no_zero whose_leave"
                                                        id="whose_leave"
                                                    // disabled={!selectedBranch}  // Disable if no branch is selected
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

                                            </div>

                                            <div className="form-group row">
                                                <label className="col-form-label col-md-2"><strong>Template Side:</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        // value={employee} onChange={(e) => setEmployee(e.target.value)}
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
                                                            <option value="legal">legal </option>
                                                            <option value="A4">A4 </option>
                                                            <option value="A3">A3 </option>
                                                            <option value="">Browser/Portrait(PDF) </option>
                                                        </select>
                                                        <select name="print_layout" class="form-control form-control-sm  trim integer_no_zero print_layout" id="print_layout">

                                                            <option value="landscape">Landscape</option>
                                                            <option value="portrait">Portrait</option>
                                                            <option value="">Browser/Portrait(PDF) </option>
                                                        </select>
                                                        <select class=" form-control form-control-sm   integer_no_zero student_type font_size">
                                                            <option value="font-12">Font Standard</option>
                                                            <option value="font-10">Font Small</option>

                                                        </select>
                                                        <select name="zoom_size" class="form-control form-control-sm  trim integer_no_zero zoom_size" id="zoom_size">
                                                            <option value="120%">Browser Zoom</option>
                                                            <option value="5%">5% Zoom</option>
                                                            <option value="10%">10% Zoom</option>
                                                            <option value="15%">15% Zoom</option>
                                                            <option value="20%">20% Zoom</option>
                                                            <option value="25%">25% Zoom</option>
                                                            <option value="30%">30% Zoom</option>
                                                            <option value="35%">35% Zoom</option>
                                                            <option value="40%">40% Zoom</option>
                                                            <option value="45%">45% Zoom</option>
                                                            <option value="50%">50% Zoom</option>
                                                            <option value="55%">55% Zoom</option>
                                                            <option value="60%">60% Zoom</option>
                                                            <option value="65%">65% Zoom</option>
                                                            <option value="70%">70% Zoom</option>
                                                            <option value="75%">75% Zoom</option>
                                                            <option value="80%">80% Zoom</option>
                                                            <option value="85%">85% Zoom</option>
                                                            <option value="90%">90% Zoom</option>
                                                            <option value="95%">95% Zoom</option>
                                                            <option value="100%" selected="">100% Zoom</option>

                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row student">
                                                <label htmlFor="fromDate" className="col-form-label col-md-2"><strong>Issue Date:</strong></label>
                                                <div className="col-md-4">
                                                    <input
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
                                                    />
                                                </div>

                                                <label htmlFor="toDate" className="col-form-label col-md-2"><strong>Expire Date:
                                                </strong></label>
                                                <div className="col-md-4">

                                                    <input
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
                                                    />
                                                </div>

                                            </div>

                                        </div>
                                        <div className="form-group row">
                                            <div className="offset-md-2 col-md-8 float-left">
                                                <input type="button" name="search" className="btn btn-sm btn-info" value="Search"
                                                // onClick={loan_search}
                                                />
                                                <input
                                                    // onClick={loan_payment_print}
                                                    type="button" name="print" class="btn btn-sm btn-success print_btn ml-2" value="Print" />
                                                <input
                                                    // onClick={loan_payment_pdf}
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
                                            </div>
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

export default EmployeIdCardList;

// 'use client'
// import { useQuery } from '@tanstack/react-query';
// import React, { useEffect, useState } from 'react';

// const EmployeIdCardList = () => {


//     const [activeTab, setActiveTab] = useState('font_side'); // Track active tab

//     const { data: employee_id_card_setting_list = [] } = useQuery({
//         queryKey: ['employee_id_card_setting_list'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_id_card_setting_list`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     // State to manage the form rows
//     const [rows, setRows] = useState([]);

//     useEffect(() => {
//         setRows(employee_id_card_setting_list)
//     }, [employee_id_card_setting_list])

//     // Handle adding a new row
//     const addRow = () => {
//         setRows([...rows, { display_name: '', column_name: '', sorting: '', status: '' }]);
//     };

//     // Handle deleting a row
//     const deleteRow = (index) => {
//         const newRows = [...rows];
//         newRows.splice(index, 1);
//         setRows(newRows);
//     };


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

//                                         <div className="form-group row">
//                                             <div className="offset-md-2 col-md-8 float-left">
//                                                 <input type="button" name="search" className="btn btn-sm btn-info" value="Search"
//                                                 // onClick={loan_search}
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


//                                     <div
//                                         className="modal fade"
//                                         id="exampleModal"
//                                         tabIndex="-1"
//                                         role="dialog"
//                                         aria-labelledby="exampleModalLabel"
//                                         aria-hidden="true"
//                                     >
//                                         <div className="modal-dialog modal-lg" role="document">
//                                             <div className="modal-content">
//                                                 <div className="modal-header">
//                                                     <h5 className="modal-title" id="exampleModalLabel">
//                                                         Id Card Configuration
//                                                     </h5>

//                                                     <button
//                                                         type="button"
//                                                         className="close"
//                                                         data-dismiss="modal"
//                                                         aria-label="Close"
//                                                     >
//                                                         <span aria-hidden="true">&times;</span>
//                                                     </button>

//                                                 </div>
//                                                 <div className="modal-body">
//                                                     <div className="nav nav-tabs" id="nav-tab" role="tablist">
//                                                         <button
//                                                             className={`nav-link w-20 ${activeTab === 'font_side' ? 'active' : ''}`}
//                                                             onClick={() => setActiveTab('font_side')}
//                                                             type="button"
//                                                             role="tab"
//                                                         >
//                                                             Front Side
//                                                         </button>
//                                                         <button
//                                                             className={`nav-link w-20 ${activeTab === 'back_side' ? 'active' : ''}`}
//                                                             onClick={() => setActiveTab('back_side')}
//                                                             type="button"
//                                                             role="tab"
//                                                         >
//                                                             Back Side
//                                                         </button>

//                                                     </div>
//                                                     {activeTab === 'font_side' && (

//                                                         <>
//                                                             {rows.map((employee, index) => (
//                                                                 <div className="input-group" key={index}>
//                                                                     <div className="input-group-addon">
//                                                                         <p className="col-form-label">Display Name:</p>
//                                                                         <input
//                                                                             required=""
//                                                                             name="display_name"
//                                                                             type="text"
//                                                                             className="display_name form-control form-control-sm text-center form-control-sm width-100"
//                                                                             value={employee.display_name}
//                                                                             onChange={(e) => {
//                                                                                 const updatedRows = [...rows];
//                                                                                 updatedRows[index].display_name = e.target.value;
//                                                                                 setRows(updatedRows);
//                                                                             }}
//                                                                         />
//                                                                     </div>
//                                                                     <div className="input-group-addon">
//                                                                         <p className="col-form-label">Column Name:</p>
//                                                                         <select
//                                                                             required=""
//                                                                             defaultValue={employee.column_name}
//                                                                             name="column_name"
//                                                                             className="form-control form-control-sm width-100 column_name  ml-2"
//                                                                             id="outer_border_style"
//                                                                             onChange={(e) => {
//                                                                                 const updatedRows = [...rows];
//                                                                                 updatedRows[index].column_name = e.target.value;
//                                                                                 setRows(updatedRows);
//                                                                             }}
//                                                                         >
//                                                                             {employee_id_card_setting_list.map((employes, empIndex) => (
//                                                                                 <option key={empIndex} value={employes.column_name}>
//                                                                                     {employes.display_name}
//                                                                                 </option>
//                                                                             ))}
//                                                                         </select>
//                                                                     </div>
//                                                                     <div className="input-group-addon ml-3">
//                                                                         <p className="col-form-label">Sorting:</p>
//                                                                         <select
//                                                                             required=""
//                                                                             name="sorting"
//                                                                             value={employee.sorting}
//                                                                             className="form-control form-control-sm width-100 sorting"
//                                                                             onChange={(e) => {
//                                                                                 const updatedRows = [...rows];
//                                                                                 updatedRows[index].sorting = e.target.value;
//                                                                                 setRows(updatedRows);
//                                                                             }}
//                                                                         >
//                                                                             <option value="">Select</option>
//                                                                             {[...Array(15).keys()].map((num) => (
//                                                                                 <option key={num} value={num + 1}>
//                                                                                     {num + 1}
//                                                                                 </option>
//                                                                             ))}
//                                                                         </select>
//                                                                     </div>
//                                                                     <div className="input-group-addon ml-3">
//                                                                         <p className="col-form-label">Status:</p>
//                                                                         <select
//                                                                             required=""
//                                                                             name="status"
//                                                                             value={employee.status}
//                                                                             className="form-control form-control-sm status"
//                                                                             onChange={(e) => {
//                                                                                 const updatedRows = [...rows];
//                                                                                 updatedRows[index].status = e.target.value;
//                                                                                 setRows(updatedRows);
//                                                                             }}
//                                                                         >
//                                                                             <option value="0">0</option>
//                                                                             <option value="1">1</option>
//                                                                         </select>
//                                                                     </div>
//                                                                     {index === 0 && (
//                                                                         <div className="input-group-btn ml-2">
//                                                                             <p className="col-form-label text-white">Add more</p>
//                                                                             <button className="btn btn-sm btn-info" type="button" onClick={addRow}>
//                                                                                 Add
//                                                                             </button>
//                                                                         </div>
//                                                                     )}
//                                                                     {index !== 0 && (
//                                                                         <div className="input-group-btn ml-3" style={{ marginTop: '37px' }}>
//                                                                             <button
//                                                                                 className="btn btn-danger btn-sm"
//                                                                                 type="button"
//                                                                                 onClick={() => deleteRow(index)}
//                                                                             >
//                                                                                 Delete
//                                                                             </button>
//                                                                         </div>
//                                                                     )}
//                                                                 </div>
//                                                             ))}
//                                                         </>
//                                                     )}
//                                                     {activeTab === 'back_side' && (
//                                                         <div className='mt-5'>

//                                                             <div class="form-group border border-2 d-flex justify-content-start align-items-center">
//                                                                 <label class="mr-3"><b>Upper text 1</b></label>
//                                                                 <textarea class="mr-3 upper-text1  w-50" placeholder="Enter text">If the ID card is lost or destroyed, informed the authorities.</textarea>

//                                                             </div>
//                                                             <div class="form-group border border-2 d-flex justify-content-start align-items-center">
//                                                                 <label class="mr-3"><b>Upper text 2</b></label>
//                                                                 <textarea class="mr-3 upper-text2 w-50" placeholder="Enter text">If the identity card is got, it is requested to deliver it to the following address:					</textarea>

//                                                             </div>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                                 <div className="modal-footer">
//                                                     {/* Optional Close Button in Footer */}
//                                                     <button
//                                                         type="button"
//                                                         className="btn btn-secondary"
//                                                         data-dismiss="modal"
//                                                     >
//                                                         Close
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
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

