'use client' 
 //ismile

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import '../../../admin_layout/modal/fa.css'
import Select from 'react-dropdown-select';

const IncomeList = ({ searchParams }) => {
    const [loading, setLoading] = useState(false);
    const [toDate, setToDate] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const [itemName, setItemName] = useState([]);
    const [invoiceId, setInvoiceId] = useState([]);



    const { data: incomeList = [], refetch,
    } = useQuery({
        queryKey: ['incomeList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/income/income_list`)

            const data = await res.json()
            return data
        }
    })


    const [selectedColumns, setSelectedColumns] = React.useState([]);


    const formatString = (str) => {
        const words = str?.split('_');

        const formattedWords = words?.map((word) => {
            const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            return capitalizedWord;
        });

        return formattedWords?.join(' ');
    };

    const category_column_change = (selectedItems) => {
        setSelectedColumns(selectedItems.map((item) => item.value));
        // category_search(); 
    };
    console.log(selectedColumns)
    const columnNames = incomeList && incomeList.length > 0 ? Object.keys(incomeList[0]) : [];
    const filteredColumns = columnNames.filter(column => column !== 'id');

    console.log(searchResults)

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

    const { data: incomeCategory = [], isLoading,
    } = useQuery({
        queryKey: ['incomeCategory'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/income_category/income_category_all`)

            const data = await res.json()
            return data
        }
    })


    const { data: moduleInfo = []
    } = useQuery({
        queryKey: ['moduleInfo'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${userId}`)

            const data = await res.json()
            return data
        }
    })

    const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'income');





    const filteredBtnIconEdit = brandList.filter(btn =>
        btn.method_sort === 3
    );
    const filteredBtnIconCopy = brandList.filter(btn =>
        btn.method_sort === 4
    );



    const filteredBtnIconDelete = brandList.filter(btn =>
        btn.method_sort === 5
    );
    const filteredBtnIconCreate = brandList.filter(btn =>
        btn.method_sort === 1
    );
    const { data: module_settings = []
    } = useQuery({
        queryKey: ['module_settings'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_all`)

            const data = await res.json()
            return data
        }
    })

    console.log(module_settings)
    const Category = module_settings.filter(moduleI => moduleI.table_name === 'income');
    // const columnListSelected = Category[0]?.column_name;
    const columnListSelected = Category[0]?.column_name
    const columnListSelectedSearch = Category[0]?.search
    const columnListSelectedArray = columnListSelected?.split(',').map(item => item.trim());
    const columnListSelectedSerachArray = columnListSelectedSearch?.split(',').map(item => item.trim());
    //  Column
    const columnListSelectedsearchAscDesc = Category[0]?.search_value
    const columnListSelectedSerachArrays = columnListSelectedsearchAscDesc?.split(',').map(item => item.trim());

    const [selectedColumnsSearch, setSelectedColumnsSerach] = useState([]);
    useEffect(() => {
        setSelectedColumnsSerach(columnListSelectedSerachArray)
    }, [])

    function convertSortString(inputString) {
        const match = inputString.match(/(.*)_\((ASC|DESC)\)/);

        if (match) {
            const fieldName = match[1];
            const sortOrder = match[2];
            return `${fieldName} ${sortOrder}`;
        } else {
            return "Invalid input format.";
        }
    }

    const brand_column_changes = (selectedItems) => {
        setSelectedColumnsSerach(selectedItems.map((item) => item.value));
        // brand_search(); 
    };

    const multiSearch = selectedColumnsSearch?.map(convertSortString);

    const decimal_digit = Category[0]?.decimal_digit;
    // console.log(decimal_digit, '-------------------------------------');

    const category_search = () => {
        setLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/income/income_search`, {
            selectedColumns,
            searchQuery,
            multiSearch,
            fromDate,
            toDate
        })
            .then(response => {
                setSearchResults(response.data.results);
                setError(null);
                setLoading(false);
            })
            .catch(error => {
                setError("An error occurred during search.", error);
                setSearchResults([]);
            });
    };
    // const columnListSelectedArray = columnListSelected?.split(',').map(item => item.trim());

    // Paigination start
    const parentUsers = incomeList

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
        const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/income/income_list/${currentPage}/${dataPerPage}`;
        const response = await fetch(url);
        const data = await response.json();
        setPageUsers(data);
    };
    useEffect(() => {
        caregory_list();
    }, [currentPage]);

    const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;

    const handlePrint = async () => {
        // Open a new window for printing
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/income/income_search`, {
            selectedColumns,
            searchQuery,
            multiSearch,
            fromDate,
            toDate
        });
        const searchResults = response.data.results;
        const printWindow = window.open('', '_blank');

        // Start building the HTML content for printing
        let htmlContent = `
            <html>
                <head>
                    <title>Pathshala School & College income Form</title>
                    <style>
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            border: 1px solid black;
                            padding: 8px;
                            text-align: left;
                        }
                        thead {
                            background-color: gray; /* Set background color for table header */
                        }
                        body {
                            text-align: center; /* Center align text within the body */
                        }
                    </style>
                </head>
                <body>
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College income Form</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
    
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">income Copy</h3>
                    <div style="display: flex; justify-content: space-between;">
                        <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                        <p style="margin: 0; padding: 0;">Collected By: পাঠশালা স্কুল এন্ড কলেজ</p>
                        <p style="margin: 0; padding: 0;">Date: </p>
                    </div>
                    <table>
                        <thead>
                            <tr>
        `;

        // Construct table headers based on selected columns
        selectedColumns.forEach(column => {
            if (column !== 'serial') { // Exclude serial column
                htmlContent += `<th>${formatString(column)}</th>`;
            }
        });

        // Continue building HTML content
        htmlContent += `
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Iterate over searchResults and print data for selected columns
        searchResults.forEach(brand => {
            htmlContent += '<tr>';
            selectedColumns.forEach((column, i) => {
                if (column !== 'serial') { // Exclude serial column
                    htmlContent += '<td>';
                    htmlContent += brand[column]; // Default rendering for other columns
                    htmlContent += '</td>';
                }
            });
            htmlContent += '</tr>';
        });

        // Finish building HTML content
        htmlContent += `
                    </tbody>
                </table>
                <footer>
                    <p>a</p>
                </footer>
            </body>
        </html>
        `;

        // Write HTML content to the print window and print it
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
    };
    const income_delete = id => {

        console.log(id)
        const proceed = window.confirm(`Are You Sure delete${id}`)
        if (proceed) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/income/income_delete/${id}`, {
                method: "POST",

            })
                .then(Response => Response.json())
                .then(data => {
                    if (data) {
                        refetch()

                    }
                    console.log(data)
                })
        }
    }

    const [message, setMessage] = useState();
    useEffect(() => {
        if (sessionStorage.getItem("message")) {
            setMessage(sessionStorage.getItem("message"));
            sessionStorage.removeItem("message");
        }
    }, [])

    console.log(searchResults)

    const [showFromDate, setShowFromDate] = useState('');
    const [showToDate, setShowToDate] = useState('');


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
    const buttonStyles = {
        color: '#fff',
        backgroundColor: '#510bc4',
        backgroundImage: 'none',
        borderColor: '#4c0ab8',
    };

    return (
        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>

                    {
                        message &&

                        <div className="alert alert-success font-weight-bold">
                            {message}
                        </div>
                    }
                    <div className='card mb-4'>
                        <div class="body-content bg-light ">

                            <div class=" border-primary shadow-sm border-0">
                                <div class=" card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Income Search</h5>
                                    <div class="card-title font-weight-bold mb-0 card-header-color float-right">

                                        <Link href={`/Admin/income/income_create?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Create Income</Link>
                                    </div>
                                </div>


                                <div class="card-body">
                                    <form class="">
                                        <div class="col-md-10 offset-md-1">

                                            <div class="form-group row student">

                                                <label htmlFor="fromDate" class="col-form-label col-md-3"><strong>From Date:</strong></label>

                                                <div className="col-md-3">


                                                    <input
                                                        type="text"
                                                        readOnly

                                                        value={showFromDate}
                                                        onClick={handleTextInputClick}
                                                        placeholder="dd-mm-yy"
                                                        className="form-control"
                                                        style={{ display: 'inline-block', }}
                                                    />
                                                    <input

                                                        type="date"
                                                        id="dateInput"
                                                        onChange={handleDateChangess}
                                                        style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
                                                    />


                                                </div>

                                                <label htmlFor="toDate" class="col-form-label col-md-3"><strong>To Date:</strong></label>
                                                <div class="col-md-3">
                                                    <input
                                                        type="text"
                                                        readOnly

                                                        value={showToDate}
                                                        onClick={handleTextInputClicks}
                                                        placeholder="dd-mm-yy"
                                                        className="form-control"
                                                        style={{ display: 'inline-block', }}
                                                    />
                                                    <input

                                                        type="date"
                                                        id="dateInputTo"
                                                        onChange={handleDateChangesss}
                                                        style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
                                                    />
                                                    {/* <DatePicker
        id="toDate"
        isClearable
        selected={toDate}
        dateFormat="dd-MM-yyyy" // Set the date format
        placeholderText="dd-mm-yyyy"
        class="form-control form-control-sm  alpha_space student_id" onChange={
            handleDateChanges
        } /> */}
                                                </div>
                                            </div>
                                            <div class="form-group row student">

                                                <label class="col-form-label col-md-3"><strong>Search Properties:</strong></label>

                                                <div className="col-md-9">


                                                    <Select
                                                        name='select'
                                                        labelField='label'
                                                        valueField='value'
                                                        values={

                                                            columnListSelectedSerachArrays?.map(column => ({
                                                                label: formatString(column),
                                                                value: column,
                                                            }))}
                                                        options={
                                                            columnListSelectedSerachArray?.map(column => {
                                                                let label = formatString(column);
                                                                let value = column;
                                                                if (column.endsWith("(ASC)")) {
                                                                    label = "Income Category (asc)";
                                                                    value = "income_category_id_(ASC)";
                                                                } else if (column.endsWith("(DESC)")) {
                                                                    label = "Income Category (desc)";
                                                                    value = "income_category_id_(DESC)";
                                                                }

                                                                return {
                                                                    label: label,
                                                                    value: value,
                                                                };
                                                            })
                                                        }
                                                        // values={

                                                        //     columnListSelectedSerachArray?.map(column => ({
                                                        //         label: formatString(column),
                                                        //         value: column,
                                                        //     }))

                                                        // }
                                                        onChange={brand_column_changes}

                                                        multi

                                                    />






                                                </div>


                                            </div>
                                            <div class="form-group row student">

                                                <label class="col-form-label col-md-3"><strong>Income Category Name:</strong></label>
                                                <div className="col-md-3">
                                                    <select
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero lshift"

                                                    >
                                                        <option value="">Select income Category </option>
                                                        {
                                                            incomeCategory.map((income) =>
                                                                <>

                                                                    <option value={income.id}>{income.income_category_name}</option>
                                                                </>

                                                            )
                                                        }



                                                    </select>
                                                </div>
                                                <label class="col-form-label col-md-3"><strong>Item Name:</strong></label>
                                                <div className="col-md-3">
                                                    <input placeholder='Income Name' class="form-control form-control-sm  alpha_space item_name" type="text" value={itemName}
                                                        onChange={(e) => setItemName(e.target.value)} />
                                                </div>
                                            </div>
                                            <div class="form-group row student">

                                                <label class="col-form-label col-md-3"><strong>Voucher Id</strong></label>
                                                <div className="col-md-3">
                                                    <input class="form-control form-control-sm  alpha_space invoice_id" type="number" value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} />
                                                </div>

                                            </div>
                                            <div class="form-group row student">

                                                <label class="col-form-label font-weight-bold col-md-3">Print Properties:</label>
                                                <div class="col-md-9">
                                                    <div class="input-group ">
                                                        <select name="print_size" class="form-control form-control-sm  trim integer_no_zero print_size" id="print_size">
                                                            <option value="legal">legal </option>
                                                            <option value="A4">A4 </option>
                                                            <option value="A3">A3 </option>
                                                            <option value="">Browser </option>
                                                        </select>
                                                        <select name="print_layout" class="form-control form-control-sm  trim integer_no_zero print_layout" id="print_layout">

                                                            <option value="landscape">Landscape</option>
                                                            <option value="portrait">Portrait</option>
                                                            <option value="">Browser </option>
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
                                            <div class="form-group row student">


                                                <label class="col-form-label col-md-3"><strong>Design:</strong></label>

                                                <div className="col-md-9">


                                                    <Select
                                                        multi
                                                        options={[
                                                            { label: 'Serial', value: 'serial' }, // Serial option
                                                            ...filteredColumns.map(column => ({
                                                                label: formatString(column),
                                                                value: column,
                                                            })),
                                                            { label: 'Action', value: 'action' }, // Action option
                                                        ]}
                                                        values={

                                                            columnListSelectedArray?.map(column => ({
                                                                label: formatString(column),
                                                                value: column,
                                                            }))

                                                        }


                                                        onChange={category_column_change}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <div class="offset-md-2 col-md-6 float-left">
                                                <input type="button" onClick={category_search} name="search" class="btn btn-sm btn-info search_btn mr-2" value="Search" />
                                                <input onClick={handlePrint}
                                                    type="button" name="search" class="btn btn-sm btn-success print_btn mr-2" value="Print" />
                                                <input
                                                    type="button"

                                                    name="search"
                                                    className="btn btn-sm btn-secondary excel_btn mr-2"
                                                    value="Download Excel"
                                                />

                                                <input
                                                    type="button"

                                                    name="search"
                                                    className="btn btn-sm btn-secondary excel_btn mr-2"
                                                    value="Download Docx"
                                                />
                                                <input type="button" name="search" class="btn btn-sm btn-indigo pdf_btn mr-2" style={buttonStyles} value="Download PDF" />
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
                    <div className='card'>
                        <div class=" border-primary  shadow-sm border-0">

                            <div class="card-header   custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 class="card-title card-header-color font-weight-bold mb-0  float-left mt-1">income List</h5>

                                <div class="card-title card-header-color font-weight-bold mb-0  float-right">
                                    <Link href={`/Admin/income/income_create?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Create income</Link>
                                </div>
                            </div>


                            <div class="card-body" >
                                {loading ? <div className='text-center'>

                                    <div className='  text-center text-dark'>

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
                                                    {selectedColumns.map((column, i) => (
                                                        <th key={i}>{formatString(column)}</th>
                                                    ))}
                                                </tr>
                                            </thead>


                                            <tbody>
                                                {searchResults.map((income, i) => (

                                                    <tr key={i}>
                                                        {selectedColumns.map((column, j) => (

                                                            <td key={j}>
                                                                {column === 'serial' ? (i + 1)

                                                                    : column === 'action' ? (
                                                                        // Special handling for the 'status' column
                                                                        <div className="flex items-center ">
                                                                            <Link href={`/Admin/income/income_edit/${income.id}?page_group=${page_group}`}>
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
                                                                            <Link href={`/Admin/income/income_copy/${income.id}?page_group=${page_group}`}>
                                                                                {filteredBtnIconCopy.map((filteredBtnIconEdit => (
                                                                                    <button
                                                                                        key={filteredBtnIconEdit.id}
                                                                                        title='Copy'
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
                                                                                    onClick={() =>
                                                                                        category_delete(income.id)}
                                                                                    style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                    className={filteredBtnIconDelete?.btn}
                                                                                >
                                                                                    <a
                                                                                        dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
                                                                                    ></a>
                                                                                </button>
                                                                            )))}
                                                                        </div>
                                                                    ) : (
                                                                        // Default rendering for other columns
                                                                        typeof income[column] == 'number' ? Number(income[column]).toFixed(decimal_digit) : income[column]
                                                                    )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))



                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                ) :
                                    <>
                                        <table className="table table-bordered table-hover table-striped table-sm">
                                            <thead>
                                                <tr>
                                                    <th>

                                                        Serial
                                                    </th>

                                                    <th>
                                                        income Category Name
                                                    </th>
                                                    <th>
                                                        Amount
                                                    </th>
                                                    <th>
                                                        Voucher Id
                                                    </th>

                                                    <th>
                                                        Discount
                                                    </th>
                                                    <th>
                                                        Short Note
                                                    </th>

                                                    <th>
                                                        income Date
                                                    </th>
                                                    <th>
                                                        Created By
                                                    </th>
                                                    <th>
                                                        Action
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
                                                    pageUsers.map((income, i) => (
                                                        <tr key={income.id}>
                                                            <td>     {((currentPage - 1) * dataPerPage) + (i + 1)}</td>

                                                            <td>{income.income_category}</td>
                                                            <td>
                                                                {income.amount}
                                                            </td>
                                                            <td>
                                                                {income.voucher_id}
                                                            </td>

                                                            <td>
                                                                {income.discount}
                                                            </td>
                                                            <td>
                                                                {income.short_note}
                                                            </td>

                                                            <td>{income.income_date}</td>
                                                            <td>{income.created_by}</td>
                                                            <td>  <div className="flex items-center ">
                                                                <Link href={`/Admin/income/income_edit/${income.id}?page_group=${page_group}`}>
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
                                                                <Link href={`/Admin/income/income_copy/${income.id}?page_group=${page_group}`}>
                                                                    {filteredBtnIconCopy.map((filteredBtnIconEdit => (
                                                                        <button
                                                                            key={filteredBtnIconEdit.id}
                                                                            title='Copy'
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
                                                                        onClick={() => income_delete(income.id)}
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
                                        <div className=" d-flex justify-content-between">
                                            <div>
                                                Total Data: {totalData}
                                            </div>
                                            <div class="pagination float-right pagination-sm border">
                                                {
                                                    currentPage - 3 >= 1 && (
                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/income/income_all?page=${1}`}>‹ First</Link>
                                                    )
                                                }
                                                {
                                                    currentPage > 1 && (
                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/income/income_all?page=${activePage - 1}`}>&lt;</Link>
                                                    )
                                                }
                                                {
                                                    pageNumber.map((page) =>
                                                        <Link
                                                            key={page}
                                                            href={`/Admin/income/income_all?page=${page}`}
                                                            className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                                                        > {page}
                                                        </Link>
                                                    )
                                                }
                                                {
                                                    currentPage < totalPages && (
                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/income/income_all?page=${activePage + 1}`}>&gt;</Link>
                                                    )
                                                }
                                                {
                                                    currentPage + 3 <= totalPages && (
                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/income/income_all?page=${totalPages}`}>Last ›</Link>
                                                    )
                                                }
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
    );
};

export default IncomeList;