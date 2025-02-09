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

    const category_search = () => {
        setLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/income/income_search`, {
            selectedColumns,
            searchQuery,

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

    const page_group = localStorage.getItem('pageGroup')

    const { data: incomeCategory = [], isLoading,
    } = useQuery({
        queryKey: ['incomeCategory'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/income_category/income_category_all`)

            const data = await res.json()
            return data
        }
    })
    const userId = localStorage.getItem('userId')

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
    const columnListSelected = Category[0]?.column_name;

    const decimal_digit = Category[0]?.decimal_digit;
    console.log(decimal_digit, '-------------------------------------');


    const columnListSelectedArray = columnListSelected?.split(',').map(item => item.trim());

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

    const handlePrint = (selectedColumns) => {
        // Open a new window for printing
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




    return (
        <div class="col-md-12 body-content p-4">


            <div class="col-md-12 body-content bg-light p-4">

                <div class=" border-primary shadow-sm border-0">
                    <div class="bg-dark card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                        <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Category Search</h5>
                        <div class="card-title font-weight-bold mb-0 card-header-color float-right">

                            <Link href={`/Admin/income/income_create?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Create Category</Link>
                        </div>
                    </div>


                    <div class="card-body">
                        <form class="">
                            <div class="col-md-10 offset-md-1">





                                <div class="form-group row student">

                                    <label class="col-form-label col-md-2"><strong>From Date:</strong></label>
                                    <div className="col-md-4">
                                        <input class="form-control form-control-sm  alpha_space student_id" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                                    </div>

                                    <label class="col-form-label col-md-2"><strong>To Date:</strong></label>
                                    <div class="col-md-4">
                                        <input class="form-control form-control-sm  alpha_space student_id" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                                    </div>
                                </div>
                                <div class="form-group row student">

                                    <label class="col-form-label col-md-2"><strong>Spense Category Name:</strong></label>
                                    <div className="col-md-4">
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
                                    <label class="col-form-label col-md-2"><strong>Design:</strong></label>

                                    <div className="col-md-4">


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
                                    <input onClick={() => handlePrint(columnListSelectedArray)} type="button" name="search" class="btn btn-sm btn-success print_btn mr-2" value="Print" />

                                </div>
                            </div>
                        </form>
                        <div class="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
                            <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                        </div>

                    </div>


                </div>
            </div>
            <div class=" border-primary  shadow-sm border-0">

                <div class="card-header  bg-dark custom-card-header py-1  clearfix bg-gradient-primary text-white">
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
                                                                        onClick={() => category_delete(income.id)}
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
                            {/* <table className="table table-bordered table-hover table-striped table-sm">
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

                            </div> */}

                        </>


                    }
                </div>



            </div>
        </div>
    );
};

export default IncomeList;