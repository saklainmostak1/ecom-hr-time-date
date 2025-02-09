'use client' 
 //ismile
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const SalaryLists = () => {

    const [created, setCreated] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setCreated(storedUserId);
        }
    }, []);

    const [designation, setDesignation] = useState('');
    const { data: designations = [], } = useQuery({
        queryKey: ['designations'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_list`)
            const data = await res.json()
            return data
        }
    });

    const { data: salaryList = [], } = useQuery({
        queryKey: ['salaryList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_list`)
            const data = await res.json()
            return data
        }
    });
    const [month, setMonth] = useState('');
    const [months, setMonths] = useState([]);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth(); // 0-based index
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const monthOptions = [];
        for (let i = 0; i <= currentMonth; i++) {
            monthOptions.push({
                value: `${currentYear}-${i + 1 < 10 ? `0${i + 1}` : i + 1}`,
                label: `${monthNames[i]} ${currentYear}`
            });
        }

        setMonths(monthOptions);
    }, []);

    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);

    const getTotalDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };


    const salary_search = () => {
        setLoading(true);

        if (month === '') {
            alert('select a month')
            return
        }

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_list_search`, {
            designation, month
        })
            .then(response => {
                const results = response.data.results;
                const monthYear = month.split('-');
                const totalDays = getTotalDaysInMonth(Number(monthYear[0]), Number(monthYear[1]));

                const updatedResults = results.map(result => ({
                    ...result,
                    totalDays
                }));

                setSearchResults(updatedResults);
                setError(null);
                setLoading(false);
                if (results.length === 0) {
                    alert('Nothing found!');
                }
            })
            .catch(error => {
                setError("An error occurred during search.");
                setSearchResults([]);
                // setLoading(false);
            });
    };

    console.log(salaryList)

    const { data: moduleInfo = []
    } = useQuery({
        queryKey: ['moduleInfo'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${created}`)

            const data = await res.json()
            return data
        }
    })

    // console.log(moduleInfo.filter(moduleI => moduleI.controller_name === 'brand'))
    const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'salary')

    //   console.log(filteredModuleInfo);

    console.log(brandList)
    const filteredBtnIconEdit = brandList.filter(btn =>
        btn.method_sort === 3
    );
    const filteredBtnIconCopy = brandList.filter(btn =>
        btn.method_sort === 7
    );



    const filteredBtnIconDelete = brandList.filter(btn =>
        btn.method_sort === 5
    );
    const filteredBtnIconCreate = brandList.filter(btn =>
        btn.method_sort === 1
    );


    const salary_delete = id => {

        console.log(id)
        const proceed = window.confirm(`Are You Sure delete${id}`)
        if (proceed) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_delete/${id}`, {
                method: "POST",

            })
                .then(Response => Response.json())
                .then(data => {
                    salary_search()
                    console.log(data)
                })
        }
    }


    const employee_salary_print = async (id) => {

        console.log(id)

        // setLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_list_search`, {
                designation, month
            });

            const searchResults = response.data.results;
            // console.log(searchResults)
            // const searchResults = response?.data?.results.filter(item => item.user_id === id);

            console.log(searchResults)
            // Create a new window for printing
            const editWindow = window.open('', '_blank');
            editWindow.document.write('<html><head><title>Employee Salary Summary</title><style> table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: left; } thead { background-color: #f2f2f2; } body { text-align: center; } </style></head><body>');
            editWindow.document.write(`
                <h2 style="margin: 0; padding: 0;">Pathshala School & College Salary Summary</h2>
                <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Salary Summary</h3>
            `);

            searchResults.forEach((item, i) => {
                editWindow.document.write(`
                    <div style="display: flex; justify-content: space-between;">
                        <p style="margin: 0; padding: 0;">Receipt No: ${item.receipt}</p>
                        <p style="margin: 0; padding: 0;">Collected By: পাঠশালা স্কুল এন্ড কলেজ</p>
                        <p style="margin: 0; padding: 0;">Date: ${new Date().toLocaleDateString()}</p>
                    </div>
                    <table style="font-size: 12px;">
                        <thead>
                            <tr>
                                <th>Earning</th>
                                <th>Amount</th>
                                <th>Deductions</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Basic & DA</td>
                                <td>${item.paid_amount}</td>
                                <td>Provident Fund</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td>HRA</td>
                                <td>0.00</td>
                                <td>E.S.I</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td>Conveyance</td>
                                <td>0.00</td>
                                <td>Loan</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td>TDA</td>
                                <td>0.00</td>
                                <td>Profession Tax</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td>Previous Due</td>
                                <td>0.00</td>
                                <td>Already Paid Amount</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>TSD/IT</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>Absent 18 Day(s)</td>
                                <td>${item.paid_amount}</td>
                            </tr>
                             <tr>
                                <th>Total Addition</td>
                                <td>${item.paid_amount}</td>
                                <th> Total Deduction </td>
                                <td>${item.paid_amount}</td>
                            </tr>
                             <tr>
                                <td></td>
                                <td></td>
                                <th>Paid Amount</td>
                                <td>${item.paid_amount}</td>
                            </tr>
                        </tbody>
                    </table>
 <h2 style="margin: 0; padding: 0;">Pathshala School & College Salary Summary</h2>
                <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Salary Summary</h3>
 
                     <table style="font-size: 12px;">
                        <thead>
                            <tr>
                                <th>Earning</th>
                                <th>Amount</th>
                                <th>Deductions</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Basic & DA</td>
                                <td>${item.paid_amount}</td>
                                <td>Provident Fund</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td>HRA</td>
                                <td>0.00</td>
                                <td>E.S.I</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td>Conveyance</td>
                                <td>0.00</td>
                                <td>Loan</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td>TDA</td>
                                <td>0.00</td>
                                <td>Profession Tax</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td>Previous Due</td>
                                <td>0.00</td>
                                <td>Already Paid Amount</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>TSD/IT</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>Absent 18 Day(s)</td>
                                <td>${item.paid_amount}</td>
                            </tr>
                             <tr>
                                <th>Total Addition</td>
                                <td>${item.paid_amount}</td>
                                <th> Total Deduction </td>
                                <td>${item.paid_amount}</td>
                            </tr>
                             <tr>
                                <td></td>
                                <td></td>
                                <th>Paid Amount</td>
                                <td>${item.paid_amount}</td>
                            </tr>
                        </tbody>
                    </table>

                `);
            });

            editWindow.document.write('</body></html>');
            editWindow.document.close();

            // Print function for the new window
            const printWindow = () => {
                editWindow.focus();
                editWindow.print();
                editWindow.close();
            };

            // Automatically trigger print after a short delay to ensure content is fully loaded
            setTimeout(() => {
                printWindow();
            }, 1000); // Adjust delay if necessary

        } catch (error) {
            console.error('Error:', error);
            // Handle error appropriately
        } finally {
            setLoading(false);
        }
    };


    const employee_print = async () => {
        // setLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_list_search`, {
                designation, month
            });

            const searchResults = response.data.results;

            // Create a new window for printing
            const editWindow = window.open('', '_blank');
            editWindow.document.write('<html><head><title>Employee Salary Summary</title><style> table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: left; } thead { background-color: #f2f2f2; } body { text-align: center; } </style></head><body>');
            editWindow.document.write(`
                <h2 style="margin: 0; padding: 0;">Pathshala School & College Salary Summary</h2>
                <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Salary Summary</h3>
            `);

            // Render the filtered data in a table for editing
            editWindow.document.write('<table>');

            // Table header
            editWindow.document.write('<thead>');
            editWindow.document.write('<tr>');
            editWindow.document.write('<th>Employee Name</th>');
            editWindow.document.write('<th>Employee ID</th>');
            editWindow.document.write('<th>Degisnation</th>');
            editWindow.document.write('<th>Paid Amount</th>');
            editWindow.document.write('<th>Dues</th>');
            editWindow.document.write('<th>Salary Month	</th>');
            editWindow.document.write('<th>Salary Date</th>');

            editWindow.document.write('</tr>');
            editWindow.document.write('</thead>');

            // Table body
            editWindow.document.write('<tbody>');
            // Render rows of data
            searchResults.forEach((item, i) => {
                editWindow.document.write('<tr>');

                editWindow.document.write(`<td>${item.employee_name}</td>`);
                editWindow.document.write(`<td>${item.user_id}</td>`);
                editWindow.document.write(`<td>${item.designation_name}</td>`);
                editWindow.document.write(`<td>${item.paid_amount}</td>`);
                editWindow.document.write(`<td>${item.due}</td>`);
                editWindow.document.write(`<td>${item.salary_month.slice(0, 10)}</td>`);
                editWindow.document.write(`<td>${item.salary_date.slice(0, 10)}</td>`);

                editWindow.document.write('</tr>');
            });
            editWindow.document.write('</tbody>');

            editWindow.document.write('</table>');
            editWindow.document.write('</body></html>');
            editWindow.document.close();

            // Print function for the new window
            const printWindow = () => {
                editWindow.focus();
                editWindow.print();
                editWindow.close();
            };

            // Automatically trigger print after a short delay to ensure content is fully loaded
            setTimeout(() => {
                printWindow();
            }, 1000); // Adjust delay if necessary

        } catch (error) {
            console.error('Error:', error);
            // Handle error appropriately
        } finally {
            setLoading(false);
        }
    };


    const employee_salary_print_single = async (id) => {

        console.log(id)

        // setLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_list_search`, {
                designation, month
            });

            const searchResult = response.data.results;
            // console.log(searchResults)
            const searchResults = searchResult.filter(item => item.user_id === id);

            console.log(searchResults)
            // Create a new window for printing
            const editWindow = window.open('', '_blank');
            editWindow.document.write('<html><head><title>Employee Salary Summary</title><style> table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: left; } thead { background-color: #f2f2f2; } body { text-align: center; } </style></head><body>');
            editWindow.document.write(`
                <h2 style="margin: 0; padding: 0;">Pathshala School & College Salary Summary</h2>
                <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Salary Summary</h3>
            `);

            searchResults.forEach((item, i) => {
                editWindow.document.write(`
                    <div style="display: flex; justify-content: space-between;">
                        <p style="margin: 0; padding: 0;">Receipt No: ${item.receipt}</p>
                        <p style="margin: 0; padding: 0;">Collected By: পাঠশালা স্কুল এন্ড কলেজ</p>
                        <p style="margin: 0; padding: 0;">Date: ${new Date().toLocaleDateString()}</p>
                    </div>
                    <table style="font-size: 12px;">
                        <thead>
                            <tr>
                                <th>Earning</th>
                                <th>Amount</th>
                                <th>Deductions</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Basic & DA</td>
                                <td>${item.paid_amount}</td>
                                <td>Provident Fund</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td>HRA</td>
                                <td>0.00</td>
                                <td>E.S.I</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td>Conveyance</td>
                                <td>0.00</td>
                                <td>Loan</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td>TDA</td>
                                <td>0.00</td>
                                <td>Profession Tax</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td>Previous Due</td>
                                <td>0.00</td>
                                <td>Already Paid Amount</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>TSD/IT</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>Absent 18 Day(s)</td>
                                <td>${item.paid_amount}</td>
                            </tr>
                            <tr>
                                <th>Total Addition</td>
                                <td>${item.paid_amount}</td>
                                <th> Total Deduction </td>
                                <td>${item.paid_amount}</td>
                            </tr>
                             <tr>
                                <td></td>
                                <td></td>
                                <th>Paid Amount</td>
                                <td>${item.paid_amount}</td>
                            </tr>
                        </tbody>
                    </table>

                   <h2 style="margin: 0; padding: 0;">Pathshala School & College Salary Summary</h2>
                <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Salary Summary</h3>
                     <table style="font-size: 12px;">
                        <thead>
                            <tr>
                                <th>Earning</th>
                                <th>Amount</th>
                                <th>Deductions</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Basic & DA</td>
                                <td>${item.paid_amount}</td>
                                <td>Provident Fund</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td>HRA</td>
                                <td>0.00</td>
                                <td>E.S.I</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td>Conveyance</td>
                                <td>0.00</td>
                                <td>Loan</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td>TDA</td>
                                <td>0.00</td>
                                <td>Profession Tax</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td>Previous Due</td>
                                <td>0.00</td>
                                <td>Already Paid Amount</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>TSD/IT</td>
                                <td>0.00</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>Absent 18 Day(s)</td>
                                <td>${item.paid_amount}</td>
                            </tr>
                             <tr>
                                <th>Total Addition</td>
                                <td>${item.paid_amount}</td>
                                <th> Total Deduction </td>
                                <td>${item.paid_amount}</td>
                            </tr>
                               <tr>
                                <td></td>
                                <td></td>
                                <th>Paid Amount</td>
                                <td>${item.paid_amount}</td>
                            </tr>
                        </tbody>
                    </table>

                `);
            });

            editWindow.document.write('</body></html>');
            editWindow.document.close();

            // Print function for the new window
            const printWindow = () => {
                editWindow.focus();
                editWindow.print();
                editWindow.close();
            };

            // Automatically trigger print after a short delay to ensure content is fully loaded
            setTimeout(() => {
                printWindow();
            }, 1000); // Adjust delay if necessary

        } catch (error) {
            console.error('Error:', error);
            // Handle error appropriately
        } finally {
            setLoading(false);
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
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Salary Search</h5>
                                </div>
                                <div className="card-body">
                                    <form >
                                        <div className="col-md-10 offset-md-1">
                                            <div className="form-group row">
                                                <label className="col-form-label col-md-2"><strong>Designation:</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        value={designation} onChange={(e) => setDesignation(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero"
                                                    >
                                                        <option value="">Select Designation</option>
                                                        {
                                                            designations.map(designation =>
                                                                <option key={designation.id} value={designation.id}>
                                                                    {designation.designation_name}
                                                                </option>
                                                            )
                                                        }
                                                    </select>
                                                </div>

                                                <label className="col-form-label col-md-2"><strong>Month:</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        value={month} onChange={(e) => setMonth(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero"
                                                    >
                                                        <option value="">Select Month</option>
                                                        {months.map((month, index) => (
                                                            <option key={index} value={month.value}>
                                                                {month.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="offset-md-2 col-md-8 float-left">
                                                <input type="button" name="search" className="btn btn-sm btn-info" value="Search"
                                                    onClick={salary_search}
                                                />
                                                <input type="button" name="summary" class="btn btn-sm btn-primary print_summary ml-2" value=" Print Pay Slip" onClick={employee_salary_print} />

                                                <input onClick={employee_print} type="button" name="print" class="btn btn-sm btn-success print_btn ml-2" value="Print Summary" />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='card'>

                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Employee Salary List</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">

                                    </div>
                                </div>
                                <div className="card-body">


                                    <div className='table-responsive'>
                                        {
                                            salaryList.length > 0 &&
                                            <table className="table table-bordered table-hover table-striped table-sm">

                                                {loading ?
                                                    <tr>
                                                        <td colSpan="16" className="text-center">
                                                            <FontAwesomeIcon style={{ height: '33px', width: '33px' }} icon={faSpinner} spin />
                                                        </td>
                                                    </tr>
                                                    :
                                                    searchResults.map((salary, i) => (
                                                        <>
                                                            <thead>
                                                                <tr>
                                                                    <th>
                                                                        {/* <input type="checkbox" name="" id="" /> */}
                                                                    </th>
                                                                    <th>Serial</th>
                                                                    <th>Employee Name</th>
                                                                    <th>Designation</th>
                                                                    <th>Employee ID</th>
                                                                    <th>Paid Amount</th>
                                                                    <th>Dues</th>
                                                                    <th>Salary Month</th>
                                                                    <th>Salary Date</th>
                                                                    <th>Created By & Date</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr key={salary.id}>
                                                                    <td></td>
                                                                    <td>{i + 1}</td>
                                                                    <td>{salary.employee_name}</td>
                                                                    <td>{salary.designation_name}</td>
                                                                    <td>{salary.user_id}</td>
                                                                    <td>{salary.paid_amount}</td>
                                                                    <td>{salary.due}</td>
                                                                    <td>{salary.salary_month.slice(0, 10)}</td>
                                                                    <td>{salary.salary_date.slice(0, 10)}</td>
                                                                    <td>{salary.created_by_name} & {salary.created_date.slice(0, 10)}</td>
                                                                    <td>
                                                                        <div className="flex items-center ">
                                                                            <Link href={`/Admin/salary/salary_edit/${salary.id}?page_group`}>
                                                                                {filteredBtnIconEdit?.map((filteredBtnIconEdit => (
                                                                                    <button
                                                                                        key={filteredBtnIconEdit.id}
                                                                                        title='Edit'
                                                                                        style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                        className={filteredBtnIconEdit?.btn}
                                                                                    >
                                                                                        <a
                                                                                            dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                                        ></a>
                                                                                    </button>
                                                                                )))}
                                                                            </Link>

                                                                            {filteredBtnIconCopy.map((filteredBtnIconEdit => (
                                                                                <button
                                                                                    onClick={() => employee_salary_print_single(salary.user_id)}
                                                                                    key={filteredBtnIconEdit.id}
                                                                                    title='Print'
                                                                                    style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                    className={filteredBtnIconEdit?.btn}
                                                                                >
                                                                                    <a
                                                                                        dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                                    ></a>
                                                                                </button>
                                                                            )))}

                                                                            {filteredBtnIconDelete.map((filteredBtnIconDelete => (
                                                                                <button
                                                                                    key={filteredBtnIconDelete.id}
                                                                                    title='Delete'
                                                                                    onClick={() => salary_delete(salary.id)}
                                                                                    style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                    className={filteredBtnIconDelete?.btn}
                                                                                >
                                                                                    <a
                                                                                        dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
                                                                                    ></a>
                                                                                </button>
                                                                            )))}
                                                                        </div>
                                                                    </td>
                                                                </tr>


                                                            </tbody>
                                                        </>
                                                    ))

                                                }
                                            </table>
                                        }
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

export default SalaryLists;