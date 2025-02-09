// 'use client' 
 //ismile

// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';
// import jsPDF from 'jspdf';
// import * as XLSX from "xlsx";
// import 'jspdf-autotable';
// import '../../../admin_layout/modal/fa.css'
// import Select from 'react-dropdown-select';
// import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, WidthType } from 'docx';

// const ExpenseList = ({ searchParams }) => {
//     const [loading, setLoading] = useState(false);
//     const [toDate, setToDate] = useState('');
//     const [fromDate, setFromDate] = useState('');
//     const [searchQuery, setSearchQuery] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
//     const [error, setError] = useState(null);




//     const { data: expenseList = [], refetch,
//     } = useQuery({
//         queryKey: ['expenseList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_list`)

//             const data = await res.json()
//             return data
//         }
//     })
//     const [selectedColumns, setSelectedColumns] = React.useState([]);
//     const [searchResultsTotalAmount, setSearchResultsTotalAmount] = React.useState([]);
//     const [totalDiscount, setTotalDiscount] = React.useState([]);

//     const expense_search = () => {
//         setLoading(true);
//         axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_search`, {
//             selectedColumns,
//             searchQuery,

//             fromDate,
//             toDate
//         })
//             .then(response => {
//                 setSearchResults(response.data.results);
//                 const totalAmountSum = response.data.results.reduce((sum, result) => sum + result.amount, 0);
//                 const totalDiscountSum = response.data.results.reduce((sum, result) => sum + result.discount, 0);
//                 setSearchResultsTotalAmount(totalAmountSum);
//                 setTotalDiscount(totalDiscountSum);
//                 setError(null);
//                 setLoading(false);
//             })
//             .catch(error => {
//                 setError("An error occurred during search.", error);
//                 setSearchResults([]);
//             });
//     };
//     console.log(searchResultsTotalAmount)
//     const formatString = (str) => {
//         const words = str?.split('_');

//         const formattedWords = words?.map((word) => {
//             const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//             return capitalizedWord;
//         });

//         return formattedWords?.join(' ');
//     };

//     const category_column_change = (selectedItems) => {
//         setSelectedColumns(selectedItems.map((item) => item.value));
//         // expense_search(); 
//     };
//     console.log(selectedColumns)
//     const columnNames = expenseList && expenseList.length > 0 ? Object.keys(expenseList[0]) : [];
//     const filteredColumns = columnNames.filter(column => column !== 'id');

//     console.log(searchResults)

//     const page_group = localStorage.getItem('pageGroup')

//     const { data: expenseCategory = [], isLoading,
//     } = useQuery({
//         queryKey: ['expenseCategory'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expence_category/expence_category_all`)

//             const data = await res.json()
//             return data
//         }
//     })
//     const userId = localStorage.getItem('userId')

//     const { data: moduleInfo = []
//     } = useQuery({
//         queryKey: ['moduleInfo'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${userId}`)

//             const data = await res.json()
//             return data
//         }
//     })

//     // console.log(moduleInfo.filter(moduleI => moduleI.controller_name === 'brand'))
//     const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'expense')

//     //   console.log(filteredModuleInfo);


//     const filteredBtnIconEdit = brandList.filter(btn =>
//         btn.method_sort === 3
//     );
//     const filteredBtnIconCopy = brandList.filter(btn =>
//         btn.method_sort === 4
//     );



//     const filteredBtnIconDelete = brandList.filter(btn =>
//         btn.method_sort === 5
//     );
//     const filteredBtnIconPrint = brandList.filter(btn =>
//         btn.method_sort === 7
//     );
//     const { data: module_settings = []
//     } = useQuery({
//         queryKey: ['module_settings'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_all`)

//             const data = await res.json()
//             return data
//         }
//     })

//     console.log(module_settings)
//     const Category = module_settings.filter(moduleI => moduleI.table_name === 'expense')
//     const columnListSelected = Category[0]?.column_name
//     const columnListSelectedArray = columnListSelected?.split(',').map(item => item.trim());

//     // Paigination start
//     const parentUsers = expenseList

//     const totalData = parentUsers?.length
//     const dataPerPage = 20

//     const totalPages = Math.ceil(totalData / dataPerPage)

//     let currentPage = 1


//     if (Number(searchParams.page) >= 1) {
//         currentPage = Number(searchParams.page)
//     }


//     let pageNumber = []
//     for (let index = currentPage - 2; index <= currentPage + 2; index++) {
//         if (index < 1) {
//             continue
//         }
//         if (index > totalPages) {
//             break
//         }
//         pageNumber.push(index)
//     }
//     const [pageUsers, setPageUsers] = useState([]);
//     const caregory_list = async () => {
//         const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_list/${currentPage}/${dataPerPage}`;
//         const response = await fetch(url);
//         const data = await response.json();
//         setPageUsers(data);
//     };
//     useEffect(() => {
//         caregory_list();
//     }, [currentPage]);



//     const expense_delete = id => {

//         console.log(id)
//         const proceed = window.confirm(`Are You Sure delete${id}`)
//         if (proceed) {
//             fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_delete/${id}`, {
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
//     }
//     const printSingleData = (id) => {
//         // Fetch data for the specific ID
//         axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_all/${id}`)
//             .then(response => {
//                 const expenseData = response.data;
//                 console.log(expenseData);

//                 const doc = new jsPDF();

//                 // Define table columns
//                 const columns = [[ expenseData.id, expenseData.item_name, expenseData.quantity, expenseData.amount, expenseData.sub_total]];

//                 // Create the table
//                 doc.autoTable({
//                     head: [['Expense Details for ID', 'Name', 'Quantity','Price', 'Amount']],
//                     body: columns,
//                     startY: 10 // Start Y position of the table
//                 });

//                 doc.save(`pdf${id}`);
//             })
//             .catch(error => {
//                 console.error('Error fetching expense data:', error);
//                 // Handle error if needed
//             });
//     };
//     // const printSingleData = (id) => {
//     //             // Fetch data for the specific ID
//     //             axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_all/${id}`)
//     //                 .then(response => {
//     //                     const expenseData = response.data;
//     //                     console.log(expenseData);
//     //                     // Assuming you want to print the data using jspdf
//     //                     const doc = new jsPDF();
//     //                     // Assuming your data has fields like name, amount, etc.
//     //                     doc.text(`Expense Details for ID: ${id}`, 10, 10);
//     //                     doc.text(`Name: ${expenseData.item_name}`, 10, 20);
//     //                     doc.text(`Amount: ${expenseData.amount}`, 10, 30);

//     //                     // Construct HTML content for printing
//     //                     let htmlContent = `
//     //                         <html>
//     //                             <head>
//     //                                 <title>Pathshala School & College Expense Form</title>
//     //                                 <style>
//     //                                     table {
//     //                                         width: 100%;
//     //                                         border-collapse: collapse;
//     //                                     }
//     //                                     th, td {
//     //                                         border: 1px solid black;
//     //                                         padding: 8px;
//     //                                         text-align: left;
//     //                                     }
//     //                                     thead {
//     //                                         background-color: gray; /* Set background color for table header */
//     //                                     }
//     //                                     body {
//     //                                         text-align: center; /* Center align text within the body */
//     //                                     }
//     //                                 </style>
//     //                             </head>
//     //                             <body>
//     //                                 <h2 style="margin: 0; padding: 0;">Pathshala School & College Expense Form</h2>
//     //                                 <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
//     //                                 <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
//     //                                 <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>

//     //                                 <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Expense Copy</h3>
//     //                                 <div style="display: flex; justify-content: space-between;">
//     //                                     <p style="margin: 0; padding: 0;">Receipt No: 829</p>
//     //                                     <p style="margin: 0; padding: 0;">Collected By: পাঠশালা স্কুল এন্ড কলেজ</p>
//     //                                     <p style="margin: 0; padding: 0;">Date: </p>
//     //                                 </div>
//     //                                 <table>
//     //                                     <thead>
//     //                                         <tr>
//     //                                             <th>Iten</th>
//     //                                             <th>Qty</th>
//     //                                             <th>Price</th>
//     //                                             <th>Total</th>
//     //                                             <!-- Add other table headers here if needed -->
//     //                                         </tr>
//     //                                     </thead>
//     //                                     <tbody>
//     //                                         <tr>
//     //                                             <td>${expenseData.item_name}</td>
//     //                                             <td>${expenseData.quantity}</td>
//     //                                             <td>${expenseData.amount}</td>
//     //                                             <td>${expenseData.sub_total}</td>
//     //                                             <!-- Add other table data here if needed -->
//     //                                         </tr>
//     //                                     </tbody>
//     //                                 </table>
//     //                                 <footer>
//     //                                     <p>a</p>
//     //                                 </footer>
//     //                             </body>
//     //                         </html>
//     //                     `;


//     //                     const newWindow = window.open('', '_blank');
//     //                     // Set the content of the new window
//     //                     newWindow.document.write(htmlContent);

//     //                     // Wait for the window to finish loading
//     //                     newWindow.onload = () => {
//     //                         // Create a new jsPDF instance
//     //                         const doc = newWindow.jspdf.jsPDF();

//     //                         // Generate the PDF from HTML content
//     //                         doc.html(newWindow.document.body, {
//     //                             callback: () => {
//     //                                 // Save the PDF
//     //                                 doc.save('expense_details.pdf');

//     //                                 // Close the new window after PDF generation
//     //                                 newWindow.close();
//     //                             }
//     //                         });
//     //                     };
//     //                     // Open a new window with the HTML content


//     //                 })
//     //                 .catch(error => {
//     //                     console.error('Error fetching expense data:', error);
//     //                     // Handle error if needed
//     //                 });
//     //         };








//     return (
//         <div class="col-md-12 body-content p-4">
//             <div class="col-md-12 body-content bg-light p-4">
//              <div class=" border-primary shadow-sm border-0">
//                     <div class="bg-dark card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                         <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Category Search</h5>
//                         <div class="card-title font-weight-bold mb-0 card-header-color float-right">

//                             <Link href={`/Admin/expense/expense_create?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Create Category</Link>
//                         </div>
//                     </div>
//                     <div class="card-body">
//                         <form class="">
//                             <div class="col-md-10 offset-md-1">
//                                 <div class="form-group row student">

//                                     <label class="col-form-label col-md-2"><strong>From Date:</strong></label>
//                                     <div className="col-md-4">
//                                         <input class="form-control form-control-sm  alpha_space student_id" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//                                     </div>

//                                     <label class="col-form-label col-md-2"><strong>To Date:</strong></label>
//                                     <div class="col-md-4">
//                                         <input class="form-control form-control-sm  alpha_space student_id" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
//                                     </div>
//                                 </div>
//                                 <div class="form-group row student">

//                                     <label class="col-form-label col-md-2"><strong>Spense Category Name:</strong></label>
//                                     <div className="col-md-4">
//                                         <select
//                                             value={searchQuery}
//                                             onChange={(e) => setSearchQuery(e.target.value)}
//                                             name="statusFilter"
//                                             className="form-control form-control-sm integer_no_zero lshift"

//                                         >
//                                             <option value="">Select Expense Category </option>
//                                             {
//                                                 expenseCategory.map((expense) =>
//                                                     <>

//                                                         <option value={expense.id}>{expense.expense_category_name}</option>
//                                                     </>

//                                                 )
//                                             }

//                                         </select>
//                                     </div>
//                                     <label class="col-form-label col-md-2"><strong>Design:</strong></label>

//                                     <div className="col-md-4">
//                                         <Select
//                                             multi
//                                             options={[
//                                                 { label: 'Serial', value: 'serial' }, // Serial option
//                                                 ...filteredColumns.map(column => ({
//                                                     label: formatString(column),
//                                                     value: column,
//                                                 })),
//                                                 { label: 'Action', value: 'action' }, // Action option
//                                             ]}
//                                             values={

//                                                 columnListSelectedArray?.map(column => ({
//                                                     label: formatString(column),
//                                                     value: column,
//                                                 }))

//                                             }
//                                             onChange={category_column_change}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                             <div class="form-group row">
//                                 <div class="offset-md-2 col-md-6 float-left">

//                                     <input onClick={expense_search} type="button" name="search" class="btn btn-sm btn-success print_btn mr-2" value="Print" />

//                                 </div>
//                             </div>
//                         </form>
//                         <div class="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
//                             <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div class=" border-primary  shadow-sm border-0">
//                 <div class="card-header  bg-dark custom-card-header py-1  clearfix bg-gradient-primary text-white">
//                     <h5 class="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Expense List</h5>
//                     <div class="card-title card-header-color font-weight-bold mb-0  float-right">
//                         <Link href={`/Admin/expense/expense_create?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Create Expense</Link>
//                     </div>
//                 </div>


//                 <div class="card-body" >
//                     {loading ? <div className='text-center'>
//                         <div className='  text-center text-dark'
//                         >
//                             <FontAwesomeIcon style={{
//                                 height: '33px',
//                                 width: '33px',
//                             }} icon={faSpinner} spin />
//                         </div>
//                     </div> : searchResults.length > 0 ? (
//                         <div class="table-responsive">
//                             <table className="table table-bordered table-hover table-striped table-sm">
//                                 <thead>
//                                     <tr>
//                                         {selectedColumns.map((column, i) => (
//                                             <th key={i}>{formatString(column)}</th>
//                                         ))}
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {searchResults.map((expense, i) => (
//                                         <tr key={i}>
//                                             {selectedColumns.map((column, j) => (
//                                                 <td key={j}>
//                                                     {column === 'serial' ? (
//                                                         // Rendering serial number if the column is 'serial'
//                                                         i + 1
//                                                     )

//                                                         : column === 'action' ? (
//                                                             // Special handling for the 'status' column
//                                                             <div className="flex items-center ">
//                                                                 <Link href={`/Admin/expense/expense_edit/${expense.id}?page_group=${page_group}`}>
//                                                                     {filteredBtnIconEdit?.map((filteredBtnIconEdit => (
//                                                                         <button
//                                                                             key={filteredBtnIconEdit.id}
//                                                                             title='Edit'
//                                                                             style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
//                                                                             className={filteredBtnIconEdit?.btn}
//                                                                         >
//                                                                             <a
//                                                                                 dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
//                                                                             ></a>
//                                                                         </button>
//                                                                     )))}
//                                                                 </Link>

//                                                                     {filteredBtnIconPrint.map((filteredBtnIconEdit => (
//                                                                         <button
//                                                                         onClick={() => printSingleData(expense.id)}
//                                                                             key={filteredBtnIconEdit.id}
//                                                                             title='Copy'
//                                                                             style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
//                                                                             className={filteredBtnIconEdit?.btn}
//                                                                         >
//                                                                             <a
//                                                                                 dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
//                                                                             ></a>
//                                                                         </button>
//                                                                     )))}

//                                                                 {filteredBtnIconDelete.map((filteredBtnIconDelete => (
//                                                                     <button
//                                                                         key={filteredBtnIconDelete.id}
//                                                                         title='Delete'
//                                                                         onClick={() => expense_delete(expense.id)}
//                                                                         style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
//                                                                         className={filteredBtnIconDelete?.btn}
//                                                                     >
//                                                                         <a
//                                                                             dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
//                                                                         ></a>
//                                                                     </button>
//                                                                 )))}
//                                                             </div>
//                                                         ) : (
//                                                             // Default rendering for other columns
//                                                             expense[column]
//                                                         )}
//                                                 </td>
//                                             ))}

//                                         </tr>
//                                     ))
//                                     }
//                                     {/* {selectedColumns.includes('amount') && ( */}
//                                     <tr className=''>
//                                         {selectedColumns.map((column, j) => (
//                                             <td key={j}>
//                                                 {column === 'amount' ? `Total Amount: ${searchResultsTotalAmount}` : ''}
//                                                 {column === 'discount' ? `Total Discount: ${totalDiscount}` : ''}
//                                             </td>

//                                         ))}
//                                     </tr>
//                                 </tbody>
//                             </table>
//                         </div>
//                     ) :
//                         <>

//                         </>
//                     }
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ExpenseList;
'use client' 
 //ismile

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import * as XLSX from "xlsx";
import 'jspdf-autotable';
import '../../../admin_layout/modal/fa.css'
import Select from 'react-dropdown-select';
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, WidthType } from 'docx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ExpenseList = ({ searchParams }) => {
    const [loading, setLoading] = useState(false);
    const [toDate, setToDate] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);

    const { data: supplierList = []
    } = useQuery({
        queryKey: ['supplierList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/supplier/supplier_list`)

            const data = await res.json()
            return data
        }
    })


    const { data: expenseList = [], refetch,
    } = useQuery({
        queryKey: ['expenseList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_list`)

            const data = await res.json()
            return data
        }
    })
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [searchResultsTotalAmount, setSearchResultsTotalAmount] = useState([]);
    const [subTotal, setSubTotal] = useState([]);
    const [previousDue, setPreviousDue] = useState([]);
    const [payableAmount, SetPayableAmount] = useState([]);
    const [dueAmount, setDueAmount] = useState([]);
    const [paidAmount, setPaidAmount] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState([]);
    const [supplierId, setSupplierId] = useState([]);

    const [totalDiscount, setTotalDiscount] = useState([]);
    const [invoiceId, setInvoiceId] = useState([]);
    const [itemName, setItemName] = useState([]);


    console.log(searchResultsTotalAmount)
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
        // expense_search(); 
    }
    useEffect(() => {
        setSelectedColumns(columnListSelectedArray)
    }, [])


    console.log(selectedColumns)

    const columnNames = expenseList && expenseList.length > 0 ? Object.keys(expenseList[0]) : [];
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

    const { data: expenseCategory = [], isLoading,
    } = useQuery({
        queryKey: ['expenseCategory'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expence_category/expence_category_all`)

            const data = await res.json()
            return data
        }
    })
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
    const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'expense')

    //   console.log(filteredModuleInfo);


    const filteredBtnIconEdit = brandList.filter(btn =>
        btn.method_sort === 3
    );
    const filteredBtnIconCopy = brandList.filter(btn =>
        btn.method_sort === 4
    );



    const filteredBtnIconDelete = brandList.filter(btn =>
        btn.method_sort === 5
    );
    const filteredBtnIconPrint = brandList.filter(btn =>
        btn.method_sort === 7
    );
    const filteredBtnIconPdf = brandList.filter(btn =>
        btn.method_sort === 8
    );
    console.log(filteredBtnIconPrint)
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
    const Category = module_settings.filter(moduleI => moduleI.table_name === 'expense')
    // const columnListSelected = Category[0]?.column_name
    // const columnListSelectedArray = columnListSelected?.split(',').map(item => item.trim());

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
    console.log(multiSearch)


    
    const expense_search = () => {
        setLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_search`, {
            selectedColumns,
            searchQuery,
            fromDate,
            toDate,
            invoiceId,
            itemName,
            supplierId,
            multiSearch
        })
            .then(response => {
                if (response.data.results == '') {
                    alert('Nothing found!');
                }
                const sortedResults = response.data.results
                setSearchResults(sortedResults);
                const totalAmountSum = response.data.results.reduce((sum, result) => sum + result.amount, 0);
                setSearchResultsTotalAmount(totalAmountSum);
                const totalDiscountSum = response.data.results.reduce((sum, result) => sum + result.discount, 0);
                setTotalDiscount(totalDiscountSum);
                const sub_total = response.data.results.reduce((sum, result) => sum + result.sub_total, 0);
                setSubTotal(sub_total)
                const previous_due = response.data.results.reduce((sum, result) => sum + result.previous_due, 0);
                setPreviousDue(previous_due)
                const payable_amount = response.data.results.reduce((sum, result) => sum + result.payable_amount, 0);
                SetPayableAmount(payable_amount)
                const due_amount = response.data.results.reduce((sum, result) => sum + result.due_amount, 0);
                setDueAmount(due_amount)
                const paid_amount = response.data.results.reduce((sum, result) => sum + result.paid_amount, 0);
                setPaidAmount(paid_amount)
                const quantity = response.data.results.reduce((sum, result) => sum + result.quantity, 0);
                setTotalQuantity(quantity)
                setError(null);
                setLoading(false);
            })
            .catch(error => {
                setError("An error occurred during search.", error);
                setSearchResults([]);
            });
    };
    // Paigination start
    const parentUsers = expenseList

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
        const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_list/${currentPage}/${dataPerPage}`;
        const response = await fetch(url);
        const data = await response.json();
        setPageUsers(data);
    };
    useEffect(() => {
        caregory_list();
    }, [currentPage]);

    const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;

    const expense_print = async (selectedColumns) => {

        const selectedZoom = document.querySelector('.zoom_size').value;

        // Convert zoom value to a numeric multiplier
        let zoomMultiplier = 100; // Default zoom multiplier
        if (selectedZoom !== '') {
            zoomMultiplier = parseFloat(selectedZoom) / 100;
        }

        // Get the selected font size value
        const selectedFontSize = document.querySelector('.font_size').value;

        // Get the numeric part of the selected font size value
        const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;

        // Get the value of the extra column input field


        // Get the selected print layout (Landscape or Portrait)
        const selectedLayout = document.getElementById('print_layout').value;

        // Determine orientation based on the selected layout
        const orientation = selectedLayout === 'landscape' ? 'landscape' : 'portrait';

        // Get the selected print size (A4, A3, Legal)
        const selectedPrintSize = document.getElementById('print_size').value;
        console.log(zoomMultiplier, 'zoomMultiplier')
        // Set the page dimensions based on the selected print size
        // Set the page dimensions based on the selected print size
        let pageWidth, pageHeight;
        switch (selectedPrintSize) {
            case 'A4':
                pageWidth = 210 * zoomMultiplier;
                pageHeight = 297 * zoomMultiplier;
                break;
            case 'A3':
                pageWidth = 297 * zoomMultiplier;
                pageHeight = 420 * zoomMultiplier;
                break;
            case 'legal':
                pageWidth = 216 * zoomMultiplier; // Width for Legal size
                pageHeight = 356 * zoomMultiplier; // Height for Legal size
                break;
            default:
                // Default to A4 size
                pageWidth = 210 * zoomMultiplier;
                pageHeight = 297 * zoomMultiplier;
                break;
        }


        console.log("Page Width:", pageWidth);
        console.log("Page Height:", pageHeight);
        if (isNaN(pageWidth) || isNaN(pageHeight) || pageWidth <= 0 || pageHeight <= 0) {
            console.error("Invalid page dimensions. Please check calculations.");
            return;
        }


        // Create a new window for editing
        const editWindow = window.open('', '_blank');

        editWindow.document.write('<html ><head><title>Brand List</title><style> @page { size: ' + selectedPrintSize + ' ' + orientation + '; } @media print { @page { size: ' + selectedPrintSize + ' ' + orientation + '; } }</style></head><body>');

        // Open a new window for printing
        // setLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_search`, {
                selectedColumns,
                searchQuery,
                fromDate,
                toDate
            });
            const searchResults = response.data.results;

            const printWindow = window.open('', '_blank');

            // Start building the HTML content for printing
            let htmlContent = `
            <html style="font-size: ${fontSize}px;">
                <head>
                    <title>Pathshala School & College Expense Form</title>
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
                <body >
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Expense Form</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
    
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Expense Copy</h3>
                    <div style="display: flex; justify-content: space-between;">
                        <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                        <p style="margin: 0; padding: 0;">Collected By: পাঠশালা স্কুল এন্ড কলেজ</p>
                        <p style="margin: 0; padding: 0;">Date: </p>
                    </div>
                    <table style="font-size: ${fontSize}px;">
                        <thead>
                            <tr>
        `;

            // Construct table headers based on selected columns
            selectedColumns.forEach(column => {
                if (column !== 'serial' && column !== 'action') { // Exclude serial column
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
                selectedColumns.forEach(column => {
                    if (column !== 'serial' && column !== 'action') { // Exclude serial column
                        htmlContent += '<td>';
                        if (column === 'file_path') {
                            // Special handling for the 'File Path' column to display images
                            htmlContent += `<img src="${process.env.NEXT_PUBLIC_API_URL}:5003/${brand.file_path}" style="max-width: 100px;" alt="Image"/>`;
                            console.log(`${process.env.NEXT_PUBLIC_API_URL}:5003/${brand.file_path}`);
                        } else {
                            htmlContent += brand[column]; // Default rendering for other columns
                        }
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
            editWindow.document.write(htmlContent);
            editWindow.document.close();
            editWindow.print();
        }
        catch (error) {
            setError("An error occurred during printing.", error);
            // setLoading(false);
        }
    };

    const expense_delete = id => {

        console.log(id)
        const proceed = window.confirm(`Are You Sure delete${id}`)
        if (proceed) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_delete/${id}`, {
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
    }


    const expense_word_download = async () => {

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_search`, {
                selectedColumns,
                searchQuery,
                fromDate,
                toDate
            });
            const searchResults = response.data.results;

            if (!selectedColumns || !selectedColumns.length || !searchResults || !searchResults.length) {
                console.error('Selected columns or filtered categories are not available.');
                return;
            }

            const includeSerial = selectedColumns.includes('serial');

            const headerRow = new TableRow({
                children: selectedColumns
                    .filter(column => column !== 'action' && column !== 'file_path')
                    .map(column => new TableCell({
                        children: [new Paragraph({ text: formatString(column), bold: true })],
                        borders: {},
                    })),
            });

            const dataRows = searchResults.map((color, index) => new TableRow({
                children: selectedColumns
                    .filter(column => column !== 'action' && column !== 'file_path')
                    .map(column => {
                        let cellData = '';

                        if (column === 'serial' && includeSerial) {
                            cellData = index + 1;
                        } else if (column === 'status_id') {
                            cellData = getStatusText(color.status_id);
                        } else {
                            cellData = color[column] || '';
                        }

                        return new TableCell({
                            children: [new Paragraph({ text: cellData.toString() })],
                            borders: {},
                        });
                    }),
            }));

            const table = new Table({
                rows: [headerRow, ...dataRows],
                width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                },
                columnWidths: selectedColumns
                    .filter(column => column !== 'action' && column !== 'file_path')
                    .map(() => 100 / selectedColumns.length),
            });

            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun("Color List")
                            ],
                            alignment: 'center',
                        }),
                        table,
                    ],
                }],
            });

            const buffer = await Packer.toBuffer(doc);
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'color_list.docx';
            link.click();
            // setLoading(false);
        } catch (error) {
            console.error("An error occurred during printing.", error);
            setError("An error occurred during printing.", error);

        }
    };

    // Helper function to get status text from status id
    const getStatusText = (statusId) => {
        switch (statusId) {
            case 1:
                return 'Active';
            case 2:
                return 'Inactive';
            case 3:
                return 'Pending';
            default:
                return '';
        }
    };



    const expense_excel_download = async () => {

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_search`, {
                selectedColumns,
                searchQuery,
                fromDate,
                toDate
            });
            const searchResults = response.data.results;
            const totalColumns = selectedColumns.length;

            // Filter the columns to export and add serial column
            const filteredColumns = searchResults.map((category, index) => {
                const filteredData = {
                    'Serial': index + 1 // Serial column
                };
                const getStatusFromId = (statusId) => {
                    switch (statusId) {
                        case 1:
                            return 'Active';
                        case 2:
                            return 'Inactive';
                        case 3:
                            return 'Pending';
                        default:
                            return '';
                    }
                };

                selectedColumns.forEach(column => {
                    if (column !== 'file_path' && category.hasOwnProperty(column)) {
                        if (column === 'status_id') {
                            filteredData['Status'] = getStatusFromId(category[column]);
                        } else {
                            filteredData[formatString(column)] = category[column];
                        }
                    }
                });
                return filteredData;
            });

            // Function to get status based on status_id

            // Create worksheet with filtered data
            const worksheet = XLSX.utils.json_to_sheet(filteredColumns);

            // Calculate width for each column
            const columnWidth = 100 / totalColumns;

            // Set width for each column
            const columnWidths = [];
            for (let i = 0; i < totalColumns; i++) {
                if (selectedColumns[i] !== 'file_path') {
                    columnWidths.push({ wpx: columnWidth * totalColumns }); // Setting width in characters
                }
            }
            worksheet['!cols'] = columnWidths;
            console.log(columnWidths);

            // Create workbook and write to file
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, 'search_results.xlsx');
        } catch (error) {
            console.error("An error occurred during printing.", error);
            setError("An error occurred during printing.", error);

        }
    };


    const buttonStyles = {
        color: '#fff',
        backgroundColor: '#510bc4',
        backgroundImage: 'none',
        borderColor: '#4c0ab8',
    };

    const [errorr, setErrorr] = useState(null);

    const expense_PDF_download = async () => {

        // setLoading(true);

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_search`, {
            selectedColumns,
            searchQuery,
            fromDate,
            toDate
        });
        const searchResults = response.data.results;
        const selectedLayout = document.getElementById('print_layout').value;
        const orientation = selectedLayout === 'landscape' ? 'landscape' : 'portrait';

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults, selectedColumns, orientation
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




    const printSingleData = (id) => {
        // Fetch data for the specific ID
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_all/${id}`)
            .then(response => {
                const expenseData = response.data;
                console.log(expenseData);
                // Assuming you want to print the data using jspdf
                const doc = new jsPDF();
                // Assuming your data has fields like name, amount, etc.
                doc.text(`Expense Details for ID: ${id}`, 10, 10);
                doc.text(`Name: ${expenseData.item_name}`, 10, 20);
                doc.text(`Amount: ${expenseData.amount}`, 10, 30);

                // Construct HTML content for printing
                let htmlContent = `
                    <html>
                        <head>
                            <title>Pathshala School & College Expense Form</title>
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
                            <h2 style="margin: 0; padding: 0;">Pathshala School & College Expense Form</h2>
                            <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                            <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                            <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                
                            <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Expense Copy</h3>
                            <div style="display: flex; justify-content: space-between;">
                                <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                                <p style="margin: 0; padding: 0;">Collected By: পাঠশালা স্কুল এন্ড কলেজ</p>
                                <p style="margin: 0; padding: 0;">Date: </p>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                        <!-- Add other table headers here if needed -->
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>${expenseData.item_name}</td>
                                        <td>${expenseData.quantity}</td>
                                        <td>${expenseData.amount}</td>
                                        <td>${expenseData.sub_total}</td>
                                        <!-- Add other table data here if needed -->
                                    </tr>
                                </tbody>
                            </table>
                            <footer>
                                <p>a</p>
                            </footer>
                        </body>
                    </html>
                `;

                // Open a new window with the HTML content
                const newWindow = window.open('', '_blank');
                if (newWindow != null) {
                    newWindow.document.write(htmlContent);
                    newWindow.document.close(); // Close the document for writing
                    newWindow.print(); // Print the content
                } else {
                    console.error('Failed to open new window for printing.');
                }
            })
            .catch(error => {
                console.error('Error fetching expense data:', error);
                // Handle error if needed
            });
    };

    console.log(searchResults)




    const pdfSingleData = async (id) => {

        console.log(id)
        try {
            // setLoading(true);

            // First request to get the expense data
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_all/${id}`);
            // console.log(response)
            console.log(response.data);
            const searchResults = response.data;


            // Second request to generate the PDF
            const pdfResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_single_pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults,
                    // Other parameters if needed
                }),
            });

            if (!pdfResponse.ok) {
                throw new Error('Error generating PDF In Period');
            }

            // Automatically download the PDF
            const blob = await pdfResponse.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'expense.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            setErrorr(error.message);
        } finally {
            // setLoading(false);
        }
    };



    // Function to handle date change
    const handleDateChange = date => {
        setFromDate(date);
    };
    const handleDateChanges = date => {
        setToDate(date);
    };

    const [message, setMessage] = useState();
    useEffect(() => {
        if (sessionStorage.getItem("message")) {
            setMessage(sessionStorage.getItem("message"));
            sessionStorage.removeItem("message");
        }
    }, [])

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
                        <div class=" body-content bg-light">

                            <div class=" border-primary shadow-sm border-0">
                                <div class=" card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Expense Search</h5>
                                    <div class="card-title font-weight-bold mb-0 card-header-color float-right">

                                        <Link href={`/Admin/expense/expense_create?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Create Expense</Link>
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
                                                                if (column.startsWith("expense_category_id_")) {
                                                                    // Check if it ends with (ASC) or (DESC)
                                                                    if (column.endsWith("(ASC)")) {
                                                                        label = "Expense Category (asc)";
                                                                        value = "expense_category_id_(ASC)";
                                                                    } else if (column.endsWith("(DESC)")) {
                                                                        label = "Expense Category (desc)";
                                                                        value = "expense_category_id_(DESC)";
                                                                    }
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

                                                <label class="col-form-label col-md-3"><strong>Spense Category Name:</strong></label>
                                                <div className="col-md-3">
                                                    <select
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero lshift"

                                                    >
                                                        <option value="">Select Expense Category </option>
                                                        {
                                                            expenseCategory.map((expense) =>
                                                                <>

                                                                    <option value={expense.id}>{expense.expense_category_name}</option>
                                                                </>

                                                            )
                                                        }



                                                    </select>
                                                </div>


                                                <label class="col-form-label col-md-3"><strong>Voucher Id</strong></label>
                                                <div className="col-md-3">
                                                    <input class="form-control form-control-sm  alpha_space invoice_id" type="number" value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} />
                                                </div>



                                            </div>
                                            <div class="form-group row student">

                                                <label class="col-form-label col-md-3"><strong>Item Name:</strong></label>
                                                <div className="col-md-3">
                                                    <input class="form-control form-control-sm  alpha_space item_name" type="text" value={itemName}
                                                        onChange={(e) => setItemName(e.target.value)} />
                                                </div>
                                                <label class="col-form-label col-md-3"><strong>supplier Name:</strong></label>
                                                <div className="col-md-3">

                                                    <select required="" value={supplierId} onChange={(e) => setSupplierId(e.target.value)} name="supplier_id" className="form-control form-control-sm mb-2" id="supplier_id">
                                                        <option value=''>Select Supplier</option>
                                                        {
                                                            supplierList.map((supplier) => (
                                                                <>
                                                                    <option value={supplier.id}>{supplier.name}</option>

                                                                </>

                                                            ))
                                                        }

                                                    </select>
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
                                                <input type="button" onClick={expense_search} name="search" class="btn btn-sm btn-info search_btn mr-2" value="Search" />
                                                <input onClick={() => {
                                                    expense_print(selectedColumns);
                                                    expense_search()
                                                }}
                                                    type="button" name="search" class="btn btn-sm btn-success print_btn mr-2" value="Print" />
                                                <input
                                                    type="button"
                                                    onClick={

                                                        expense_excel_download

                                                    }
                                                    name="search"
                                                    className="btn btn-sm btn-secondary excel_btn mr-2"
                                                    value="Download Excel"
                                                />

                                                <input
                                                    type="button"
                                                    onClick={expense_word_download}
                                                    name="search"
                                                    className="btn btn-sm btn-secondary excel_btn mr-2"
                                                    value="Download Docx"
                                                />
                                                <input type="button" name="search" onClick={expense_PDF_download} class="btn btn-sm btn-indigo pdf_btn mr-2" style={buttonStyles} value="Download PDF" />
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
                    <div className='card mb-4'>
                        <div class=" border-primary  shadow-sm border-0">
                            <div class="card-header  custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 class="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Expense List</h5>
                                <div class="card-title card-header-color font-weight-bold mb-0  float-right">
                                    <Link href={`/Admin/expense/expense_create?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Create Expense</Link>
                                </div>
                            </div>


                            <div class="card-body" >
                                {loading ? <div className='text-center'>
                                    <div className='  text-center text-dark'
                                    >
                                        <FontAwesomeIcon style={{
                                            height: '33px',
                                            width: '33px',
                                        }} icon={faSpinner} spin />
                                    </div>
                                </div> : searchResults?.length > 0 ? (
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
                                                {searchResults.map((expense, i) => (
                                                    <tr key={i}>
                                                        {selectedColumns.map((column, j) => (
                                                            <td key={j}>
                                                                {
                                                                    column === 'serial' ? (
                                                                        // Rendering serial number if the column is 'serial'
                                                                        i + 1
                                                                    )
                                                                        :
                                                                        column === 'file_path' ? (
                                                                            // Special handling for the 'status' column
                                                                            <>
                                                                                <img
                                                                                    className=" img-thumbnail"
                                                                                    style={{ width: '100px' }}
                                                                                    src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${expense.file_path}`}
                                                                                    alt="No Image"
                                                                                />
                                                                            </>
                                                                        )
                                                                            :
                                                                            column === 'expense_date' ? (
                                                                                // Rendering serial number if the column is 'serial'
                                                                                expense.expense_date.slice(0, 10)
                                                                            )
                                                                                :
                                                                                column === 'voucher_id' ? (
                                                                                    // Rendering serial number if the column is 'serial'
                                                                                    expense.voucher_id === 0 ? '' : expense.voucher_id
                                                                                )

                                                                                    : column === 'action' ? (
                                                                                        // Special handling for the 'status' column
                                                                                        <div className="flex items-center ">
                                                                                            <Link href={`/Admin/expense/expense_edit/${expense.id}?page_group=${page_group}`}>
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

                                                                                            {filteredBtnIconPrint.map((filteredBtnIconEdit => (
                                                                                                <button
                                                                                                    onClick={() => printSingleData(expense.id)}
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
                                                                                            {filteredBtnIconPdf.map((filteredBtnIconEdit => (
                                                                                                <button
                                                                                                    onClick={() => pdfSingleData(expense.id)}
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

                                                                                            {filteredBtnIconDelete.map((filteredBtnIconDelete => (
                                                                                                <button
                                                                                                    key={filteredBtnIconDelete.id}
                                                                                                    title='Delete'
                                                                                                    onClick={() => expense_delete(expense.id)}
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
                                                                                        expense[column]
                                                                                    )}
                                                            </td>
                                                        ))}

                                                    </tr>
                                                ))

                                                }

                                                {/* {selectedColumns.includes('amount') && ( */}
                                                <tr className='font-weight-bold'>
                                                    {selectedColumns.map((column, j) => (
                                                        <td key={j}>
                                                            {column === 'quantity' ? `Quantity: ${totalQuantity}` : ''}
                                                            {column === 'amount' ? `Total Amount: ${searchResultsTotalAmount}` : ''}
                                                            {column === 'discount' ? `Total Discount: ${totalDiscount}` : ''}
                                                            {column === 'paid_amount' ? `Paid Amount: ${paidAmount}` : ''}
                                                            {column === 'due_amount' ? `Due Amount: ${dueAmount}` : ''}
                                                            {column === 'payable_amount' ? `Payeable Amount: ${payableAmount}` : ''}
                                                            {column === 'previous_due' ? `Previous Due: ${previousDue}` : ''}
                                                            {column === 'sub_total' ? `Sub Total: ${subTotal}` : ''}
                                                        </td>

                                                    ))}
                                                </tr>
                                                {/* )} */}




                                            </tbody>
                                        </table>
                                    </div>
                                ) :

                                    <>
                                        <div className=" d-flex justify-content-between mb-2">
                                            <div>
                                                Total Data: {totalData}
                                            </div>
                                            <div class="pagination float-right pagination-sm border">
                                                {
                                                    currentPage - 3 >= 1 && (
                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/expense/expense_all?page=${1}`}>‹ First</Link>
                                                    )
                                                }
                                                {
                                                    currentPage > 1 && (
                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/expense/expense_all?page=${activePage - 1}`}>&lt;</Link>
                                                    )
                                                }
                                                {
                                                    pageNumber.map((page) =>
                                                        <Link
                                                            key={page}
                                                            href={`/Admin/expense/expense_all?page=${page}`}
                                                            className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                                                        > {page}
                                                        </Link>
                                                    )
                                                }
                                                {
                                                    currentPage < totalPages && (
                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/expense/expense_all?page=${activePage + 1}`}>&gt;</Link>
                                                    )
                                                }
                                                {
                                                    currentPage + 3 <= totalPages && (
                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/expense/expense_all?page=${totalPages}`}>Last ›</Link>
                                                    )
                                                }
                                            </div>

                                        </div>
                                        <div className='table-responsive'>

                                            <table className="table table-bordered">
                                                <thead className="bg-light">
                                                    <tr>
                                                        {selectedColumns?.map(column => (
                                                            <th key={column}>{formatString(column)}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pageUsers.length === 0 ? (
                                                        <tr><td colSpan={selectedColumns?.length}>No data available</td></tr>
                                                    ) : (
                                                        pageUsers?.map((expense, index) => (
                                                            <tr key={expense.id}>
                                                                {selectedColumns?.map(column => (
                                                                    <td key={column} style={['expense_name', 'description'].includes(column) ? longTextStyle : {}}>
                                                                        {column === 'serial' ?
                                                                            ((currentPage - 1) * dataPerPage) + (index + 1)
                                                                            :

                                                                            column === 'file_path' ? (
                                                                                // Special handling for the 'status' column
                                                                                <>
                                                                                    <img
                                                                                        className=" img-thumbnail"
                                                                                        style={{ width: '100px' }}
                                                                                        src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${expense.file_path}`}
                                                                                        alt="No Image"
                                                                                    />
                                                                                </>
                                                                            ) :
                                                                                column === 'status_id' ? (
                                                                                    expense[column] === 1 ? 'Active' : expense[column] === 2 ? 'Inactive' : expense[column] === 3 ? 'Pending' : 'Unknown'
                                                                                ) :
                                                                                    column === 'voucher_id' ? (
                                                                                        // Rendering serial number if the column is 'serial'
                                                                                        expense.voucher_id === 0 ? '' : expense.voucher_id
                                                                                    )
                                                                                        :
                                                                                        column === 'action' ? (
                                                                                            <div className="flex items-center ">
                                                                                                <Link href={`/Admin/expense/expense_edit/${expense.id}?page_group=${page_group}`}>
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
                                                                                                <Link href={`/Admin/expense/expense_copy/${expense.id}?page_group=${page_group}`}>
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
                                                                                                        onClick={() => expense_delete(expense.id)}
                                                                                                        style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                                        className={filteredBtnIconDelete?.btn}
                                                                                                    >
                                                                                                        <a
                                                                                                            dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
                                                                                                        ></a>
                                                                                                    </button>
                                                                                                )))}
                                                                                            </div>
                                                                                        ) :
                                                                                            (
                                                                                                expense[column]
                                                                                            )}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className=" d-flex justify-content-between">
                                            <div>
                                                Total Data: {totalData}
                                            </div>
                                            <div class="pagination float-right pagination-sm border">
                                                {
                                                    currentPage - 3 >= 1 && (
                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/expense/expense_all?page=${1}`}>‹ First</Link>
                                                    )
                                                }
                                                {
                                                    currentPage > 1 && (
                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/expense/expense_all?page=${activePage - 1}`}>&lt;</Link>
                                                    )
                                                }
                                                {
                                                    pageNumber.map((page) =>
                                                        <Link
                                                            key={page}
                                                            href={`/Admin/expense/expense_all?page=${page}`}
                                                            className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                                                        > {page}
                                                        </Link>
                                                    )
                                                }
                                                {
                                                    currentPage < totalPages && (
                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/expense/expense_all?page=${activePage + 1}`}>&gt;</Link>
                                                    )
                                                }
                                                {
                                                    currentPage + 3 <= totalPages && (
                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/expense/expense_all?page=${totalPages}`}>Last ›</Link>
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

export default ExpenseList;