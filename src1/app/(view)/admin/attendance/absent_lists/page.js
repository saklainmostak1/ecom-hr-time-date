'use client'
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';


const ListsAbsents = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [itemName, setItemName] = useState('');
    const [employee, setEmployee] = useState('');
    const [filteredDesignations, setFilteredDesignations] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [month, setMonth] = useState('');

    const { data: branchAll = [], isLoading, refetch } = useQuery({
        queryKey: ['branchAll'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`);
            const data = await res.json();
            return data;
        }
    });

    const { data: designations = [] } = useQuery({
        queryKey: ['designations'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_all`);
            const data = await res.json();
            return data;
        }
    });

    const { data: employees = [] } = useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_all_list`);
            const data = await res.json();
            return data;
        }
    });

    const handleBranchChange = (branchId) => {
        setItemName(branchId);
        setSearchQuery('');
        const filteredDesignations = designations.filter(designation =>
            employees.some(employee =>
                employee.branch_id === parseFloat(branchId) && employee.designation_id === designation.id
            )
        );
        setFilteredDesignations(filteredDesignations);

        const filteredEmployees = employees.filter(employee => employee.branch_id === parseFloat(branchId));
        setFilteredEmployees(filteredEmployees);
    };

    const handleDesignationChange = (designationId) => {
        setSearchQuery(designationId);

        const filteredEmployees = employees.filter(employee =>
            employee.branch_id === parseFloat(itemName) && employee.designation_id === parseFloat(designationId)
        );
        setFilteredEmployees(filteredEmployees);
    };

    const getMonthName = (monthNumber) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthNumber - 1];
    };
    const generateMonthOptions = () => {
        const options = [];
        const now = new Date();
        let startYear = 2024; // Start from January 2024
        let startMonth = 1; // January

        for (let year = startYear; year <= now.getFullYear(); year++) {
            let month = startMonth;
            if (year === now.getFullYear()) {
                month = 1; // Start from January for the current year
            }
            for (; month <= 12; month++) {
                if (year === now.getFullYear() && month > now.getMonth() + 1) {
                    break; // Stop if we exceed the current month
                }
                const monthName = getMonthName(month);
                options.push({
                    value: `${year}-${month.toString().padStart(2, '0')}`,
                    label: `${monthName} ${year}`
                });
            }
        }
        return options;
    };

    const monthOptions = generateMonthOptions();
    const [dateDisabled, setDateDisabled] = useState(false)
    const [monthName, setMonthName] = useState([])
    const handleMonthChange = (event) => {
        const selectedMonth = event.target.value;
        const selectedMonthName = event.target.options[event.target.selectedIndex].text;
        setMonthName(selectedMonthName)
        setMonth(selectedMonth);

        if (selectedMonth) {
            setDateDisabled(true);
            setShowFromDate(''); // Clear the display value for From Date
            setShowToDate(''); // Clear the display value for To Date
            setFromDate(''); // Clear the From Date value
            setToDate('');
            // Disable date inputs when a month is selected
        } else {
            setDateDisabled(false); // Enable date inputs when no month is selected
        }
    };
    console.log(monthName)

    const [showFromDate, setShowFromDate] = useState('');
    const [showToDate, setShowToDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [fromDate, setFromDate] = useState('');

    const handleDateChangess = (event) => {
        const selectedDate = new Date(event.target.value);
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const year = String(selectedDate.getFullYear()); // Get last two digits of the year
        const formattedDate = `${day}-${month}-${year}`;
        setShowFromDate(formattedDate);
        setFromDate(selectedDate);
    };

    // Open date picker when text input is clicked
    const handleTextInputClick = () => {
        document.getElementById('dateInput').showPicker();
    };

    const handleDateChangesss = (event) => {
        const selectedDate = new Date(event.target.value);
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const year = String(selectedDate.getFullYear()); // Get last two digits of the year
        const formattedDate = `${day}-${month}-${year}`;
        setShowToDate(formattedDate);
        setToDate(selectedDate);
    };

    // Open date picker when text input is clicked
    const handleTextInputClicks = () => {
        document.getElementById('dateInputTo').showPicker();
    };


    const [error, setError] = useState([])
    const [loading, setLoading] = useState(false)


    const news_search = () => {
        setLoading(true);
        if (itemName === '') {
            alert('select a branch')
            setLoading(false);
            return
        }
        // if (month === '') {
        //     alert('select a  month')
        //     return
        // }
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/absent/absent_list_search`, {
            searchQuery, itemName, employee, month, fromDate, toDate
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

    const [message, setMessage] = useState();
    useEffect(() => {
        if (typeof window !== 'undefined') {

            if (sessionStorage.getItem("message")) {
                setMessage(sessionStorage.getItem("message"));
                sessionStorage.removeItem("message");
            }
        }
    }, [])

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        let hours = date.getUTCHours();
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? String(hours).padStart(2, '0') : '12'; // the hour '0' should be '12'

        return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
    };
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
    const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'attendance')

    //   console.log(filteredModuleInfo);


    const filteredBtnIconDelete = brandList.filter(btn =>
        btn.method_sort === 5
    );
    console.log(filteredBtnIconDelete)
    console.log(brandList)

    const absent_delete = id => {

        console.log(id)
        const proceed = window.confirm(`Are You Sure delete${id}`)
        if (proceed) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/absent/absent_delete/${id}`, {
                method: "POST",

            })
                .then(Response => Response.json())
                .then(data => {
                    // setLoading(false);
                    news_search()
                
                    // setSearchResults([])
                    console.log(data)
                })
        }
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 p-4">
                    {
                        message &&

                        <div className="alert alert-success font-weight-bold">
                            {message}
                        </div>
                    }
                    <div className='card mb-4'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Online Attendance</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/attendance/attendance_create?page_group=`} className="btn btn-sm btn-info">Back To Attendance Create</Link>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <form>
                                        <div className="col-md-10 offset-md-1">
                                            <div className="form-group row student">
                                                <label className="col-form-label col-md-2 font-weight-bold">Branch Name:</label>
                                                <div className="col-md-4">
                                                    <select required="" value={itemName} onChange={(e) => handleBranchChange(e.target.value)} name="branch_id" className="form-control form-control-sm mb-2" id="branch_id">
                                                        <option value=''>Select Branch</option>
                                                        {branchAll.map((branch) => (
                                                            <option key={branch.id} value={branch.id}>{branch.branch_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <label className="col-form-label col-md-2 font-weight-bold">Designation Name:</label>
                                                <div className="col-md-4">
                                                    <select required="" value={searchQuery} onChange={(e) => handleDesignationChange(e.target.value)} name="designation_id" className="form-control form-control-sm mb-2" id="designation_id">
                                                        <option value=''>Select Designation</option>
                                                        {filteredDesignations.map((designation) => (
                                                            <option key={designation.id} value={designation.id}>{designation.designation_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group row student">
                                                <label className="col-form-label col-md-2 font-weight-bold">Employee:</label>
                                                <div className="col-md-4">
                                                    <select required="" value={employee} onChange={(e) => setEmployee(e.target.value)} name="employee_id" className="form-control form-control-sm mb-2" id="employee_id">
                                                        <option value=''>Select Employee</option>
                                                        {filteredEmployees.map((employee) => (
                                                            <option key={employee.id} value={employee.user_id}>{employee.full_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <label className="col-form-label col-md-2 font-weight-bold">Month:</label>
                                                <div className="col-md-4">
                                                    <select required="" value={month} onChange={handleMonthChange} name="month" className="form-control form-control-sm mb-2" id="month">
                                                        <option value=''>Select Month</option>
                                                        {monthOptions.map((option) => (
                                                            <option key={option.value} value={option.value}>{option.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="form-group row student">

                                                <label htmlFor="fromDate" class="col-form-label col-md-2"><strong>From Date:</strong></label>

                                                <div className="col-md-4">


                                                    <input
                                                        type="text"
                                                        readOnly
                                                        disabled={dateDisabled}
                                                        value={showFromDate}
                                                        onClick={handleTextInputClick}
                                                        placeholder="dd-mm-yy"
                                                        className="form-control form-control-sm"
                                                        style={{ display: 'inline-block', }}
                                                    />
                                                    <input

                                                        type="date"
                                                        id="dateInput"
                                                        onChange={handleDateChangess}
                                                        style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
                                                    />


                                                </div>

                                                <label htmlFor="toDate" class="col-form-label col-md-2"><strong>To Date:</strong></label>
                                                <div class="col-md-4">
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        disabled={dateDisabled}
                                                        value={showToDate}
                                                        onClick={handleTextInputClicks}
                                                        placeholder="dd-mm-yy"
                                                        className="form-control form-control-sm"
                                                        style={{ display: 'inline-block', }}
                                                    />
                                                    <input

                                                        type="date"
                                                        id="dateInputTo"
                                                        onChange={handleDateChangesss}
                                                        style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
                                                    />

                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <div className="offset-md-2 col-md-10 float-left">
                                                    <input
                                                        onClick={news_search}
                                                        type="button" name="search" className="btn btn-sm btn-info search_btn mr-2" value="Search" />

                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
                                        <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className='text-center'>
                            <div className='text-center text-dark'>
                                <FontAwesomeIcon style={{ height: '33px', width: '33px' }} icon={faSpinner} spin />
                            </div>
                        </div>
                    ) : (
                        searchResults?.length > 0 ? (
                            <div className='card'>
                                <div className="body-content bg-light">
                                    <div className="border-primary shadow-sm border-0">
                                        <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                            <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Employee Attendance List</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="table-responsive">
                                                <table id='mytable' className="table table-bordered table-hover table-striped table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Employee ID</th>
                                                            <th>Name</th>
                                                            <th>Photo</th>
                                                            <th>Designation</th>
                                                            {
                                                                month ?

                                                                    <th>

                                                                        Month</th>
                                                                    :
                                                                    ''
                                                            }
                                                            <th>Date</th>
                                                            <th> Time</th>
                                                            <th> Action</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {searchResults.map((attendances, i) => (
                                                            <tr key={i}>
                                                                <td>{attendances.unique_id}</td>
                                                                <td>{attendances.full_name}</td>
                                                                <td>
                                                                    <img src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${attendances.photo}`} alt="No image found" className="img-fluid" />
                                                                </td>
                                                                <td>{attendances.designation_name}</td>
                                                                {
                                                                    month ?

                                                                        <td>{monthName ? monthName : ''}</td>
                                                                        :
                                                                        ''
                                                                }
                                                                <td>

                                                                    {
                                                                        attendances?.absent_date?.slice(0, 10)
                                                                    }

                                                                </td>
                                                                <td>
                                                                    {formatDate(attendances.checktime)}
                                                                </td>
                                                                <td>

                                                                    <div className="flex items-center ">

                                                                        {filteredBtnIconDelete.map((filteredBtnIconDelete => (
                                                                            <button
                                                                                key={filteredBtnIconDelete.id}
                                                                                title='Delete'
                                                                                onClick={() => absent_delete(attendances.id)}
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
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListsAbsents;
