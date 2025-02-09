// 'use client' 
 //ismile
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';
// import dayjs from 'dayjs';
// import Select from 'react-dropdown-select';
// import axios from 'axios';

// const ListLeaveApplication = ({ searchParams }) => {

//     const [toDate, setToDate] = useState('');
//     const [fromDate, setFromDate] = useState('');
//     const [year, setyear] = useState('');
//     const [userGroup, setUserGroup] = useState('');
//     const [status, setStatus] = useState('');
//     const [searchQuery, setSearchQuery] = useState('');
//     const [extraColumn, setExtraColumn] = useState('');
//     const [loading, setLoading] = useState(false);

//     const [created_by, setCreated_by] = useState(() => {
//         if (typeof window !== 'undefined') {
//             return localStorage.getItem('userId') || '';
//         }
//         return '';
//     });

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             const storedUserId = localStorage.getItem('userId');
//             setCreated_by(storedUserId);
//         }
//     }, []);

//     const { data: leave_applications = [], isLoading, refetch
//     } = useQuery({
//         queryKey: ['leave_applications'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_all`)

//             const data = await res.json()
//             return data
//         }
//     })


//     const [selectedColumns, setSelectedColumns] = useState([]);

//     const category_column_change = (selectedItems) => {
//         setSelectedColumns(selectedItems.map((item) => item.value));
//         // expense_search(); 
//     };

//     const columnNames = leave_applications && leave_applications.length > 0 ? Object.keys(leave_applications[0]) : [];
//     const filteredColumns = columnNames.filter(column => column !== 'id');


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
//     const Category = module_settings.filter(moduleI => moduleI.table_name === 'leave_application')
//     const columnListSelected = Category[0]?.column_name
//     const columnListSelectedArray = columnListSelected?.split(',').map(item => item.trim());


//     const formatString = (str) => {
//         const words = str?.split('_');

//         const formattedWords = words?.map((word) => {
//             const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//             return capitalizedWord;
//         });

//         return formattedWords?.join(' ');
//     };


//     const { data: leaveCategory = []
//     } = useQuery({
//         queryKey: ['leaveCategory'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_category/leave_category_list`)

//             const data = await res.json()
//             return data
//         }
//     })


//     const [page_group, setPage_group] = useState(() => {
//         if (typeof window !== 'undefined') {
//             return localStorage.getItem('pageGroup') || '';
//         }
//         return '';
//     });

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             const storedUserId = localStorage.getItem('pageGroup');
//             setPage_group(storedUserId);
//         }
//     }, []);

//     const [userId, setUserId] = useState(() => {
//         if (typeof window !== 'undefined') {
//             return localStorage.getItem('userId') || '';
//         }
//         return '';
//     });

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             const storedUserId = localStorage.getItem('userId');
//             setUserId(storedUserId);
//         }
//     }, []);



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
//     const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'leave_application')

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
//     const filteredBtnIconCreate = brandList.filter(btn =>
//         btn.method_sort === 1
//     );


//     // Paigination start
//     const parentUsers = leave_applications

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
//         const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_all/${currentPage}/${dataPerPage}`;
//         const response = await fetch(url);
//         const data = await response.json();
//         setPageUsers(data);
//     };
//     useEffect(() => {
//         caregory_list();
//     }, [currentPage]);

//     const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;


//     const leave_application_delete = id => {

//         console.log(id)
//         const proceed = window.confirm(`Are You Sure delete${id}`)
//         if (proceed) {
//             fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_delete/${id}`, {
//                 method: "POST",

//             })
//                 .then(Response => Response.json())
//                 .then(data => {
//                     refetch()
//                     caregory_list()
//                     console.log(data)
//                 })
//         }
//     }

//     const [message, setMessage] = useState();
//     useEffect(() => {
//         if (typeof window !== 'undefined') {

//             if (sessionStorage.getItem("message")) {
//                 setMessage(sessionStorage.getItem("message"));
//                 sessionStorage.removeItem("message");
//             }
//         }
//     }, [])


//     const [formData, setFormData] = useState([]);

//     // const approveFunction = (id, start_date, end_date) => {
//     //     console.log(id)
//     //    console.log(start_date)
//     //    console.log(end_date)
//     // }

//     // const approveFunction = (id, start_date, end_date) => {
//     //     const startDate = dayjs(start_date, 'YYYY-MM-DD');
//     //     const endDate = dayjs(end_date, 'YYYY-MM-DD');
//     //     let approvedDates = [];
//     //     let currentDate = startDate;

//     //     while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
//     //         approvedDates.push({
//     //             approved_by: created_by,
//     //             approved_date: currentDate.format('YYYY-MM-DD'),
//     //             leave_application_id: id
//     //         });
//     //         currentDate = currentDate.add(1, 'day');
//     //     }

//     //     setFormData(approvedDates);
//     //     console.log(approvedDates);

//     //     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_approve`, {
//     //         method: 'POST',
//     //         headers: {
//     //             'content-type': 'application/json',
//     //         },
//     //         body: JSON.stringify(approvedDates),
//     //     })
//     //         .then((response) =>
//     //             response.json()

//     //         )
//     //         .then((data) =>
//     //             console.log(data.affectedRows)

//     //         )
//     //     // You can now send the formData to your backend or handle the approval logic here.
//     // }
//     const approveFunction = (id, start_date, end_date) => {
//         const startDate = dayjs(start_date, 'YYYY-MM-DD');
//         const endDate = dayjs(end_date, 'YYYY-MM-DD');
//         let approvedDates = [];
//         let currentDate = startDate;

//         while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
//             approvedDates.push({
//                 approved_by: created_by,
//                 approved_date: currentDate.format('YYYY-MM-DD'),
//                 leave_application_id: id
//             });
//             currentDate = currentDate.add(1, 'day');
//         }

//         setFormData(approvedDates);
//         console.log(approvedDates);

//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_approve`, {
//             method: 'POST',
//             headers: {
//                 'content-type': 'application/json',
//             },
//             body: JSON.stringify(approvedDates),
//         })
//             .then((response) => response.json())
//             .then((data) => {
//                 console.log(data.affectedRows);

//                 // Update application status
//                 return fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_edit_status/${id}`, {
//                     method: 'POST',
//                     headers: {
//                         'content-type': 'application/json',
//                     },
//                     body: JSON.stringify({ application_status: 2 }),
//                 });
//             })
//             .then((response) => response.json())
//             .then((data) => {
//                 console.log('Status update response:', data);
//             })
//             .catch((error) => {
//                 console.error('Error:', error);
//             });
//     };

//     const rejectFunction = (id, start_date, end_date) => {
//         const startDate = dayjs(start_date, 'YYYY-MM-DD');
//         const endDate = dayjs(end_date, 'YYYY-MM-DD');
//         let approvedDates = [];
//         let currentDate = startDate;

//         while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
//             approvedDates.push({
//                 approved_by: created_by,
//                 approved_date: currentDate.format('YYYY-MM-DD'),
//                 leave_application_id: id
//             });
//             currentDate = currentDate.add(1, 'day');
//         }

//         setFormData(approvedDates);
//         console.log(approvedDates);

//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_approve`, {
//             method: 'POST',
//             headers: {
//                 'content-type': 'application/json',
//             },
//             body: JSON.stringify(approvedDates),
//         })
//             .then((response) => response.json())
//             .then((data) => {
//                 console.log(data.affectedRows);

//                 // Update application status
//                 return fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_edit_status/${id}`, {
//                     method: 'POST',
//                     headers: {
//                         'content-type': 'application/json',
//                     },
//                     body: JSON.stringify({ application_status: 1 }),
//                 });
//             })
//             .then((response) => response.json())
//             .then((data) => {
//                 console.log('Status update response:', data);
//             })
//             .catch((error) => {
//                 console.error('Error:', error);
//             });
//     }
//     // const rejectFunction = (id, start_date, end_date) => {
//     //     const startDate = dayjs(start_date, 'YYYY-MM-DD');
//     //     const endDate = dayjs(end_date, 'YYYY-MM-DD');
//     //     let approvedDates = [];
//     //     let currentDate = startDate;

//     //     while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
//     //         approvedDates.push({
//     //             approved_by: created_by,
//     //             approved_date: currentDate.format('YYYY-MM-DD'),
//     //             leave_application_id: id
//     //         });
//     //         currentDate = currentDate.add(1, 'day');
//     //     }

//     //     setFormData(approvedDates);
//     //     console.log(approvedDates);

//     //     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_approve`, {
//     //         method: 'POST',
//     //         headers: {
//     //             'content-type': 'application/json',
//     //         },
//     //         body: JSON.stringify(approvedDates),
//     //     })
//     //         .then((response) =>
//     //             response.json()

//     //         )
//     //         .then((data) =>
//     //             console.log(data.affectedRows)

//     //         )
//     //     // You can now send the formData to your backend or handle the approval logic here.
//     // }

//     console.log(formData)



//     const [showFromDate, setShowFromDate] = useState('');
//     const [showToDate, setShowToDate] = useState('');


//     const handleDateChangess = (event) => {
//         const selectedDate = new Date(event.target.value);
//         const day = String(selectedDate.getDate()).padStart(2, '0');
//         const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
//         const year = String(selectedDate.getFullYear()); // Get last two digits of the year
//         const formattedDate = `${day}-${month}-${year}`;
//         setShowFromDate(formattedDate);
//         setFromDate(selectedDate);
//     };

//     // Open date picker when text input is clicked
//     const handleTextInputClick = () => {
//         document.getElementById('dateInput').showPicker();
//     };

//     const handleDateChangesss = (event) => {
//         const selectedDate = new Date(event.target.value);
//         const day = String(selectedDate.getDate()).padStart(2, '0');
//         const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
//         const year = String(selectedDate.getFullYear()); // Get last two digits of the year
//         const formattedDate = `${day}-${month}-${year}`;
//         setShowToDate(formattedDate);
//         setToDate(selectedDate);
//     };

//     // Open date picker when text input is clicked
//     const handleTextInputClicks = () => {
//         document.getElementById('dateInputTo').showPicker();
//     };

//     const currentYear = new Date().getFullYear();
//     const years = [];
//     for (let year = 2020; year <= currentYear; year++) {
//         years.push(year);
//     }


//     const [searchResults, setSearchResults] = useState([]);
//     const [error, setError] = useState(null);

//     const period_search = () => {
//         setLoading(true);
//         axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_search`, {
//             fromDate, toDate, searchQuery, status, selectedColumns
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


//     const buttonStyles = {
//         color: '#fff',
//         backgroundColor: '#510bc4',
//         backgroundImage: 'none',
//         borderColor: '#4c0ab8',
//     };



//     return (
//         <div className="container-fluid">
//             <div className="row">

//                 {/* <div class="card-body" >
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
//                                     {searchResults.map((period, i) => (
//                                         <tr key={i}>
//                                             {selectedColumns.map((column, j) => (
//                                                 <td key={j} style={['period_name', 'description'].includes(column) ? longTextStyle : {}}>
//                                                     {column === 'serial' ? (
//                                                         // Rendering serial number if the column is 'serial'
//                                                         i + 1
//                                                     ) : column === 'file_path' ? (
//                                                         // Special handling for the 'status' column
//                                                         <>
//                                                             <img
//                                                                 className=" img-thumbnail"
//                                                                 style={{ width: '100px' }}
//                                                                 src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${period.file_path}`}
//                                                                 alt="No Image"
//                                                             />
//                                                         </>
//                                                     )
//                                                         :
//                                                         column === 'status_id' ? (
//                                                             // Special handling for the 'status' column
//                                                             <>
//                                                                 {period.status_id === 1 && <p>Active</p>}
//                                                                 {period.status_id === 2 && <p>Inactive</p>}
//                                                                 {period.status_id === 3 && <p>Pending</p>}
//                                                             </>
//                                                         )

//                                                             : column === 'action' ? (
//                                                                 // Special handling for the 'status' column
//                                                                 <div className="flex items-center ">
//                                                                     <Link href={`/Admin/period/period_edit/${period.id}?page_group=${page_group}`}>
//                                                                         {filteredBtnIconEdit?.map((filteredBtnIconEdit => (
//                                                                             <button
//                                                                                 key={filteredBtnIconEdit.id}
//                                                                                 title='Edit'
//                                                                                 style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
//                                                                                 className={filteredBtnIconEdit?.btn}
//                                                                             >
//                                                                                 <a
//                                                                                     dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
//                                                                                 ></a>
//                                                                             </button>
//                                                                         )))}
//                                                                     </Link>
//                                                                     <Link href={`/Admin/period/period_copy/${period.id}?page_group=${page_group}`}>
//                                                                         {filteredBtnIconCopy.map((filteredBtnIconEdit => (
//                                                                             <button
//                                                                                 key={filteredBtnIconEdit.id}
//                                                                                 title='Copy'
//                                                                                 style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
//                                                                                 className={filteredBtnIconEdit?.btn}
//                                                                             >
//                                                                                 <a
//                                                                                     dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
//                                                                                 ></a>
//                                                                             </button>
//                                                                         )))}
//                                                                     </Link>
//                                                                     {filteredBtnIconDelete.map((filteredBtnIconDelete => (
//                                                                         <button
//                                                                             key={filteredBtnIconDelete.id}
//                                                                             title='Delete'
//                                                                             onClick={() => period_delete_searching(period.id)}
//                                                                             style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
//                                                                             className={filteredBtnIconDelete?.btn}
//                                                                         >
//                                                                             <a
//                                                                                 dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
//                                                                             ></a>
//                                                                         </button>
//                                                                     )))}
//                                                                 </div>
//                                                             ) : (
//                                                                 // Default rendering for other columns
//                                                                 period[column]
//                                                             )}
//                                                 </td>
//                                             ))}
//                                         </tr>
//                                     ))



//                                     }
//                                 </tbody>
//                             </table>
//                         </div>
//                     ) :
//                         <>
//                             <div className=" d-flex justify-content-between mb-2">
//                                 <div>
//                                     Total Data: {totalData}
//                                 </div>
//                                 <div class="pagination float-right pagination-sm border">
//                                     {
//                                         currentPage - 3 >= 1 && (
//                                             <Link className=" text-primary px-2 border-left py-1" href={`/Admin/category/category_all?page=${1}`}>‹ First</Link>
//                                         )
//                                     }
//                                     {
//                                         currentPage > 1 && (
//                                             <Link className=" text-primary px-2 border-left py-1" href={`/Admin/category/category_all?page=${activePage - 1}`}>&lt;</Link>
//                                         )
//                                     }
//                                     {
//                                         pageNumber.map((page) =>
//                                             <Link
//                                                 key={page}
//                                                 href={`/Admin/category/category_all?page=${page}`}
//                                                 className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
//                                             > {page}
//                                             </Link>
//                                         )
//                                     }
//                                     {
//                                         currentPage < totalPages && (
//                                             <Link className=" text-primary px-2 border-left py-1" href={`/Admin/category/category_all?page=${activePage + 1}`}>&gt;</Link>
//                                         )
//                                     }
//                                     {
//                                         currentPage + 3 <= totalPages && (
//                                             <Link className=" text-primary px-2 border-left py-1" href={`/Admin/category/category_all?page=${totalPages}`}>Last ›</Link>
//                                         )
//                                     }
//                                 </div>

//                             </div>
//                             <div className='table-responsive'>


//                                 <table className="table table-bordered">
//                                     <thead className="bg-light">
//                                         <tr>
//                                             {selectedColumns?.map(column => (
//                                                 <th key={column}>{formatString(column)}</th>
//                                             ))}
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {pageUsers.length === 0 ? (
//                                             <tr><td colSpan={selectedColumns?.length}>No data available</td></tr>
//                                         ) : (
//                                             pageUsers?.map((period, index) => (
//                                                 <tr key={period.id}>
//                                                     {selectedColumns?.map(column => (
//                                                         <td key={column} style={['period_name', 'description'].includes(column) ? longTextStyle : {}}>
//                                                             {column === 'serial' ? (
//                                                                 ((currentPage - 1) * dataPerPage) + (index + 1)
//                                                             ) :

//                                                                 column === 'file_path' ? (
//                                                                     // Special handling for the 'status' column
//                                                                     <>
//                                                                         <img
//                                                                             className=" img-thumbnail"
//                                                                             style={{ width: '100px' }}
//                                                                             src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${period.file_path}`}
//                                                                             alt="No Image"
//                                                                         />
//                                                                     </>
//                                                                 ) :
//                                                                     column === 'status_id' ? (
//                                                                         period[column] === 1 ? 'Active' : period[column] === 2 ? 'Inactive' : period[column] === 3 ? 'Pending' : 'Unknown'
//                                                                     )
//                                                                         :
//                                                                         column === 'action' ? (
//                                                                             <div className="flex items-center ">
//                                                                                 <Link href={`/Admin/period/period_edit/${period.id}?page_group=${page_group}`}>
//                                                                                     {filteredBtnIconEdit?.map((filteredBtnIconEdit => (
//                                                                                         <button
//                                                                                             key={filteredBtnIconEdit.id}
//                                                                                             title='Edit'
//                                                                                             style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
//                                                                                             className={filteredBtnIconEdit?.btn}
//                                                                                         >
//                                                                                             <a
//                                                                                                 dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
//                                                                                             ></a>
//                                                                                         </button>
//                                                                                     )))}
//                                                                                 </Link>
//                                                                                 <Link href={`/Admin/period/period_copy/${period.id}?page_group=${page_group}`}>
//                                                                                     {filteredBtnIconCopy.map((filteredBtnIconEdit => (
//                                                                                         <button
//                                                                                             key={filteredBtnIconEdit.id}
//                                                                                             title='Copy'
//                                                                                             style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
//                                                                                             className={filteredBtnIconEdit?.btn}
//                                                                                         >
//                                                                                             <a
//                                                                                                 dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
//                                                                                             ></a>
//                                                                                         </button>
//                                                                                     )))}
//                                                                                 </Link>
//                                                                                 {filteredBtnIconDelete.map((filteredBtnIconDelete => (
//                                                                                     <button
//                                                                                         key={filteredBtnIconDelete.id}
//                                                                                         title='Delete'
//                                                                                         onClick={() => period_delete(period.id)}
//                                                                                         style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
//                                                                                         className={filteredBtnIconDelete?.btn}
//                                                                                     >
//                                                                                         <a
//                                                                                             dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
//                                                                                         ></a>
//                                                                                     </button>
//                                                                                 )))}
//                                                                             </div>
//                                                                         ) :
//                                                                             (
//                                                                                 period[column]
//                                                                             )}
//                                                         </td>
//                                                     ))}
//                                                 </tr>
//                                             ))
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <div className=" d-flex justify-content-between">
//                                 <div>
//                                     Total Data: {totalData}
//                                 </div>
//                                 <div class="pagination float-right pagination-sm border">
//                                     {
//                                         currentPage - 3 >= 1 && (
//                                             <Link className=" text-primary px-2 border-left py-1" href={`/Admin/period/period_all?page=${1}`}>‹ First</Link>
//                                         )
//                                     }
//                                     {
//                                         currentPage > 1 && (
//                                             <Link className=" text-primary px-2 border-left py-1" href={`/Admin/period/period_all?page=${activePage - 1}`}>&lt;</Link>
//                                         )
//                                     }
//                                     {
//                                         pageNumber.map((page) =>
//                                             <Link
//                                                 key={page}
//                                                 href={`/Admin/period/period_all?page=${page}`}
//                                                 className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
//                                             > {page}
//                                             </Link>
//                                         )
//                                     }
//                                     {
//                                         currentPage < totalPages && (
//                                             <Link className=" text-primary px-2 border-left py-1" href={`/Admin/period/period_all?page=${activePage + 1}`}>&gt;</Link>
//                                         )
//                                     }
//                                     {
//                                         currentPage + 3 <= totalPages && (
//                                             <Link className=" text-primary px-2 border-left py-1" href={`/Admin/period/period_all?page=${totalPages}`}>Last ›</Link>
//                                         )
//                                     }
//                                 </div>

//                             </div>
//                         </>


//                     }
//                 </div> */}
//                 <div className='col-12 p-4'>
//                     {
//                         message &&

//                         <div className="alert alert-success font-weight-bold">
//                             {message}
//                         </div>
//                     }
//                     <div className='card mb-4'>
//                         <div class=" body-content bg-light">

//                             <div class=" border-primary shadow-sm border-0">
//                                 <div class=" card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Leave Application Search</h5>
//                                     <div class="card-title font-weight-bold mb-0 card-header-color float-right">

//                                         <Link href={`/Admin/leave_application/leave_application_create?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Create Leave Application</Link>
//                                     </div>
//                                 </div>
//                                 <div class="card-body">
//                                     <form class="">
//                                         <div class="col-md-10 offset-md-1">

//                                             <div class="form-group row student">

//                                                 <label htmlFor="fromDate" class="col-form-label col-md-3"><strong>From Date:</strong></label>

//                                                 <div className="col-md-3">


//                                                     <input
//                                                         type="text"
//                                                         readOnly

//                                                         value={showFromDate}
//                                                         onClick={handleTextInputClick}
//                                                         placeholder="dd-mm-yy"
//                                                         className="form-control"
//                                                         style={{ display: 'inline-block', }}
//                                                     />
//                                                     <input

//                                                         type="date"
//                                                         id="dateInput"
//                                                         onChange={handleDateChangess}
//                                                         style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
//                                                     />

//                                                 </div>

//                                                 <label htmlFor="toDate" class="col-form-label col-md-3"><strong>To Date:</strong></label>
//                                                 <div class="col-md-3">
//                                                     <input
//                                                         type="text"
//                                                         readOnly

//                                                         value={showToDate}
//                                                         onClick={handleTextInputClicks}
//                                                         placeholder="dd-mm-yy"
//                                                         className="form-control"
//                                                         style={{ display: 'inline-block', }}
//                                                     />
//                                                     <input

//                                                         type="date"
//                                                         id="dateInputTo"
//                                                         onChange={handleDateChangesss}
//                                                         style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
//                                                     />

//                                                 </div>
//                                             </div>
//                                             <div class="form-group row student">

//                                                 <label class="col-form-label col-md-3"><strong>User Group:</strong></label>
//                                                 <div className="col-md-3">
//                                                     <select

//                                                         value={userGroup} onChange={(e) => setUserGroup(e.target.value)}
//                                                         name="statusFilter"
//                                                         className="form-control form-control-sm integer_no_zero lshift"

//                                                     >
//                                                         <option value="">Select User Group</option>




//                                                     </select>
//                                                 </div>

//                                                 <label class="col-form-label col-md-3"><strong>Application Status:</strong></label>
//                                                 <div className="col-md-3">
//                                                     <select
//                                                         value={status} onChange={(e) => setStatus(e.target.value)}
//                                                         name="statusFilter"
//                                                         className="form-control form-control-sm integer_no_zero lshift"

//                                                     >
//                                                         <option value="">Select Application Status</option>
//                                                         <option value="0">Pending</option>
//                                                         <option value="1">Rejected</option>
//                                                         <option value="2">Approved</option>



//                                                     </select>
//                                                 </div>

//                                             </div>
//                                             <div class="form-group row student">



//                                                 <label class="col-form-label col-md-3"><strong>Leave Category:</strong></label>
//                                                 <div className="col-md-3">
//                                                     <select

//                                                         value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
//                                                         name="statusFilter"
//                                                         className="form-control form-control-sm integer_no_zero lshift"

//                                                     >
//                                                         <option value="">Select Leave Category</option>
//                                                         {
//                                                             leaveCategory.map(category =>

//                                                                 <>
//                                                                     <option value={category.id}>{category.name}</option>
//                                                                 </>
//                                                             )
//                                                         }



//                                                     </select>
//                                                 </div>
//                                                 <label class="col-form-label col-md-3"><strong>Extra Column:</strong></label>
//                                                 <div className="col-md-3">
//                                                     <input class="form-control form-control-sm  alpha_space invoice_id" type="number" value={extraColumn} onChange={(e) => setExtraColumn(e.target.value)} />
//                                                 </div>





//                                             </div>
//                                             <div class="form-group row student">

//                                                 <label class="col-form-label col-md-3"><strong>Design:</strong></label>

//                                                 <div className="col-md-9">


//                                                     <Select
//                                                         multi
//                                                         options={[
//                                                             { label: 'Serial', value: 'serial' }, // Serial option
//                                                             ...filteredColumns.map(column => ({
//                                                                 label: formatString(column),
//                                                                 value: column,
//                                                             })),
//                                                             { label: 'Action', value: 'action' }, // Action option
//                                                         ]}
//                                                         values={

//                                                             columnListSelectedArray?.map(column => ({
//                                                                 label: formatString(column),
//                                                                 value: column,
//                                                             }))

//                                                         }


//                                                         onChange={category_column_change}
//                                                     />
//                                                 </div>


//                                             </div>
//                                             <div class="form-group row student">

//                                                 <label class="col-form-label font-weight-bold col-md-3">Print Properties:</label>
//                                                 <div class="col-md-9">
//                                                     <div class="input-group ">
//                                                         <select name="print_size" class="form-control form-control-sm  trim integer_no_zero print_size" id="print_size">
//                                                             <option value="legal">legal </option>
//                                                             <option value="A4">A4 </option>
//                                                             <option value="A3">A3 </option>
//                                                             <option value="">Browser </option>
//                                                         </select>
//                                                         <select name="print_layout" class="form-control form-control-sm  trim integer_no_zero print_layout" id="print_layout">

//                                                             <option value="landscape">Landscape</option>
//                                                             <option value="portrait">Portrait</option>
//                                                             <option value="">Browser </option>
//                                                         </select>
//                                                         <select class=" form-control form-control-sm   integer_no_zero student_type font_size">
//                                                             <option value="font-12">Font Standard</option>
//                                                             <option value="font-10">Font Small</option>

//                                                         </select>
//                                                         <select name="zoom_size" class="form-control form-control-sm  trim integer_no_zero zoom_size" id="zoom_size">
//                                                             <option value="120%">Browser Zoom</option>
//                                                             <option value="5%">5% Zoom</option>
//                                                             <option value="10%">10% Zoom</option>
//                                                             <option value="15%">15% Zoom</option>
//                                                             <option value="20%">20% Zoom</option>
//                                                             <option value="25%">25% Zoom</option>
//                                                             <option value="30%">30% Zoom</option>
//                                                             <option value="35%">35% Zoom</option>
//                                                             <option value="40%">40% Zoom</option>
//                                                             <option value="45%">45% Zoom</option>
//                                                             <option value="50%">50% Zoom</option>
//                                                             <option value="55%">55% Zoom</option>
//                                                             <option value="60%">60% Zoom</option>
//                                                             <option value="65%">65% Zoom</option>
//                                                             <option value="70%">70% Zoom</option>
//                                                             <option value="75%">75% Zoom</option>
//                                                             <option value="80%">80% Zoom</option>
//                                                             <option value="85%">85% Zoom</option>
//                                                             <option value="90%">90% Zoom</option>
//                                                             <option value="95%">95% Zoom</option>
//                                                             <option value="100%" selected="">100% Zoom</option>

//                                                         </select>
//                                                     </div>

//                                                 </div>


//                                             </div>

//                                         </div>
//                                         <div class="form-group row">
//                                             <div class="offset-md-2 col-md-12 float-left">
//                                                 <input type="button" name="search" class="btn btn-sm btn-info search_btn mr-2" value="Search"
//                                                     onClick={period_search}
//                                                 />
//                                                 <input
//                                                     type="button" name="search" class="btn btn-sm btn-success print_btn mr-2" value="Print" />
//                                                 <input
//                                                     type="button"

//                                                     name="search"
//                                                     className="btn btn-sm btn-secondary excel_btn mr-2"
//                                                     value="Download Excel"
//                                                 />

//                                                 <input
//                                                     type="button"

//                                                     name="search"
//                                                     className="btn btn-sm btn-secondary excel_btn mr-2"
//                                                     value="Download Docx"
//                                                 />
//                                                 <input type="button" name="search" class="btn btn-sm btn-indigo pdf_btn mr-2" value="Download PDF" style={buttonStyles} />
//                                             </div>
//                                         </div>
//                                     </form>
//                                     <div class="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
//                                         <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>
//                     </div>



//                     <div className='card'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">List Leave Application</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <Link href={`/Admin/leave_application/leave_application_create?page_group`} className="btn btn-sm btn-info">Back Leave Application Create</Link>
//                                     </div>
//                                 </div>



//                                 <div class="card-body">

//                                     <div className='table-responsive'>

//                                         <table className="table  table-bordered table-hover table-striped table-sm">
//                                             <thead>

//                                                 <tr>
//                                                     <th>

//                                                         Serial
//                                                     </th>
//                                                     <th>

//                                                         Applicant Name
//                                                     </th>
//                                                     <th>
//                                                         Leave Reason
//                                                     </th>
//                                                     <th>
//                                                         Date
//                                                         (Start-End)
//                                                     </th>
//                                                     <th>
//                                                         Status
//                                                     </th>
//                                                     <th>
//                                                         Receiver
//                                                     </th>
//                                                     <th>
//                                                         Approved By
//                                                     </th>
//                                                     <th>
//                                                         Created By
//                                                     </th>
//                                                     <th>
//                                                         Created Date
//                                                     </th>
//                                                     <th>
//                                                         Action
//                                                     </th>
//                                                 </tr>

//                                             </thead>

//                                             <tbody>
//                                                 {isLoading ? <div className='text-center'>
//                                                     <div className='  text-center text-dark'
//                                                     >
//                                                         <FontAwesomeIcon style={{
//                                                             height: '33px',
//                                                             width: '33px',
//                                                         }} icon={faSpinner} spin />
//                                                     </div>
//                                                 </div>
//                                                     :


//                                                     pageUsers.map((leave_application, i) => (
//                                                         <tr key={leave_application.id}>
//                                                             <td>    {i + 1}</td>

//                                                             <td>
//                                                                 {leave_application?.whose_leave_name}
//                                                             </td>
//                                                             <td>
//                                                                 {leave_application?.leave_category_name}
//                                                             </td>
//                                                             <td>
//                                                                 {leave_application?.start_date} to  {leave_application?.end_date}
//                                                             </td>
//                                                             <td>
//                                                                 {leave_application?.application_status_name}
//                                                             </td>
//                                                             <td>
//                                                                 {leave_application?.receiver_name}
//                                                             </td>
//                                                             <td>
//                                                                 a
//                                                             </td>
//                                                             <td>
//                                                                 {leave_application?.created_by_name}
//                                                             </td>

//                                                             <td>
//                                                                 {leave_application?.created_date}
//                                                             </td>

//                                                             <td>

//                                                                 <div className="flex items-center ">
//                                                                     <Link href={`/Admin/leave_application/leave_application_edit/${leave_application.id}?page_group=${page_group}`}>
//                                                                         {filteredBtnIconEdit?.map((filteredBtnIconEdit => (
//                                                                             <button
//                                                                                 key={filteredBtnIconEdit.id}
//                                                                                 title='Edit'
//                                                                                 style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
//                                                                                 className={filteredBtnIconEdit?.btn}
//                                                                             >
//                                                                                 <a
//                                                                                     dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
//                                                                                 ></a>
//                                                                             </button>
//                                                                         )))}
//                                                                     </Link>
//                                                                     <Link href={`/Admin/leave_application/leave_application_copy/${leave_application.id}?page_group=${page_group}`}>
//                                                                         {filteredBtnIconCopy.map((filteredBtnIconEdit => (
//                                                                             <button
//                                                                                 key={filteredBtnIconEdit.id}
//                                                                                 title='Copy'
//                                                                                 style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
//                                                                                 className={filteredBtnIconEdit?.btn}
//                                                                             >
//                                                                                 <a
//                                                                                     dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
//                                                                                 ></a>
//                                                                             </button>
//                                                                         )))}
//                                                                     </Link>
//                                                                     {filteredBtnIconDelete.map((filteredBtnIconDelete => (
//                                                                         <button
//                                                                             key={filteredBtnIconDelete.id}
//                                                                             title='Delete'
//                                                                             onClick={() => leave_application_delete(leave_application.id)}
//                                                                             style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
//                                                                             className={filteredBtnIconDelete?.btn}
//                                                                         >
//                                                                             <a
//                                                                                 dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
//                                                                             ></a>
//                                                                         </button>
//                                                                     )))}


//                                                                     <button
//                                                                     className='btn btn-sm btn-success btn-sm accept text-white  ml-2'
//                                                                     style={{marginTop:'5px'}}
//                                                                         onClick={() => approveFunction(leave_application.id, leave_application?.start_date, leave_application?.end_date)}
//                                                                     ><i class="fas fa-check"></i></button>
//                                                                     <button
//                                                                     className='btn btn-secondary btn-sm ccept text-white ml-1'
//                                                                     style={{marginTop:'5px'}}
//                                                                         onClick={() => rejectFunction(leave_application.id, leave_application?.start_date, leave_application?.end_date)}
//                                                                     ><i class="fas fa-ban"></i></button>
//                                                                 </div></td>
//                                                         </tr>
//                                                     )

//                                                     )



//                                                 }
//                                             </tbody>

//                                         </table>
//                                         <div className=" d-flex justify-content-between">
//                                             <div>
//                                                 Total Data: {totalData}
//                                             </div>
//                                             <div class="pagination float-right pagination-sm border">
//                                                 {
//                                                     currentPage - 3 >= 1 && (
//                                                         <Link className=" text-primary px-2 border-left py-1" href={`/Admin/leave_application/leave_application_all?page=${1}`}>‹ First</Link>
//                                                     )
//                                                 }
//                                                 {
//                                                     currentPage > 1 && (
//                                                         <Link className=" text-primary px-2 border-left py-1" href={`/Admin/leave_application/leave_application_all?page=${activePage - 1}`}>&lt;</Link>
//                                                     )
//                                                 }
//                                                 {
//                                                     pageNumber.map((page) =>
//                                                         <Link
//                                                             key={page}
//                                                             href={`/Admin/leave_application/leave_application_all?page=${page}`}
//                                                             className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
//                                                         > {page}
//                                                         </Link>
//                                                     )
//                                                 }
//                                                 {
//                                                     currentPage < totalPages && (
//                                                         <Link className=" text-primary px-2 border-left py-1" href={`/Admin/leave_application/leave_application_all?page=${activePage + 1}`}>&gt;</Link>
//                                                     )
//                                                 }
//                                                 {
//                                                     currentPage + 3 <= totalPages && (
//                                                         <Link className=" text-primary px-2 border-left py-1" href={`/Admin/leave_application/leave_application_all?page=${totalPages}`}>Last ›</Link>
//                                                     )
//                                                 }
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

// export default ListLeaveApplication;


'use client' 
 //ismile
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Select from 'react-dropdown-select';
import axios from 'axios';
import * as XLSX from "xlsx";
import 'jspdf-autotable';
import 'react-datepicker/dist/react-datepicker.css';
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, WidthType } from 'docx';

const ListLeaveApplication = ({ searchParams }) => {

    const [toDate, setToDate] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [year, setyear] = useState('');
    const [userGroup, setUserGroup] = useState('');
    const [status, setStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [extraColumn, setExtraColumn] = useState('');
    const [loading, setLoading] = useState(false);

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

    const { data: leave_applications = [], isLoading, refetch
    } = useQuery({
        queryKey: ['leave_applications'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_all`)

            const data = await res.json()
            return data
        }
    })

    const { data: designations = [],
    } = useQuery({
        queryKey: ['designations'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_list`)

            const data = await res.json()
            return data
        }
    })


    //  Column Start


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
    const Category = module_settings.filter(moduleI => moduleI.table_name === 'leave_application')
    const columnListSelected = Category[0]?.column_name
    const columnListSelectedArray = columnListSelected?.split(',').map(item => item.trim());
    const columnListSelectedSearch = Category[0]?.search
    const columnListSelectedSerachArray = columnListSelectedSearch?.split(',').map(item => item.trim());
    const columnListSelectedsearchAscDesc = Category[0]?.search_value
    const columnListSelectedSerachArrays = columnListSelectedsearchAscDesc?.split(',').map(item => item.trim());

    


    console.log(Category[0]?.column_name)

    console.log(columnListSelectedArray)

    const formatString = (str) => {
        const words = str?.split('_');

        const formattedWords = words?.map((word) => {
            const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            return capitalizedWord;
        });

        return formattedWords?.join(' ');
    };

    const columnNames = leave_applications && leave_applications.length > 0 ? Object.keys(leave_applications[0]) : [];


    console.log('Column Names:', columnNames);


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

    const [selectedColumns, setSelectedColumns] = React.useState([]);

    useEffect(() => {
        setSelectedColumns(columnListSelectedArray)
    }, [])

    useEffect(() => {
        setSelectedColumnsSerach(columnListSelectedSerachArray)
    }, [])
    const category_column_change = (selectedItems) => {
        setSelectedColumns(selectedItems.map((item) => item.value));
        // category_search(); 
    };
    console.log(selectedColumns)
    const filteredColumns = columnNames.filter(column => column !== 'id');





    const matched = columnListSelectedArray?.filter(option => columnNames.includes(option));


    console.log(matched);
    console.log(filteredColumns);


    //     //  Column end

    const { data: leaveCategory = []
    } = useQuery({
        queryKey: ['leaveCategory'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_category/leave_category_list`)

            const data = await res.json()
            return data
        }
    })


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
    const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'leave_application')

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
    const filteredBtnIconCreate = brandList.filter(btn =>
        btn.method_sort === 1
    );


    // Paigination start
    const parentUsers = leave_applications

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
        const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_all/${currentPage}/${dataPerPage}`;
        const response = await fetch(url);
        const data = await response.json();
        setPageUsers(data);
    };
    useEffect(() => {
        caregory_list();
    }, [currentPage]);

    const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;


    const leave_application_delete = id => {

        console.log(id)
        const proceed = window.confirm(`Are You Sure delete${id}`)
        if (proceed) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_delete/${id}`, {
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

    const [message, setMessage] = useState();
    useEffect(() => {
        if (typeof window !== 'undefined') {

            if (sessionStorage.getItem("message")) {
                setMessage(sessionStorage.getItem("message"));
                sessionStorage.removeItem("message");
            }
        }
    }, [])


    const [formData, setFormData] = useState([]);


    const approveFunction = (id, start_date, end_date) => {
        const startDate = dayjs(start_date, 'YYYY-MM-DD');
        const endDate = dayjs(end_date, 'YYYY-MM-DD');
        let approvedDates = [];
        let currentDate = startDate;

        while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
            approvedDates.push({
                approved_by: created_by,
                approved_date: currentDate.format('YYYY-MM-DD'),
                leave_application_id: id
            });
            currentDate = currentDate.add(1, 'day');
        }

        setFormData(approvedDates);
        console.log(approvedDates);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_approve`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(approvedDates),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.affectedRows);

                // Update application status
                return fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_edit_status/${id}`, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({ application_status: 2 }),
                });
            })
            .then((response) => response.json())
            .then((data) => {
                console.log('Status update response:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const rejectFunction = (id, start_date, end_date) => {
        const startDate = dayjs(start_date, 'YYYY-MM-DD');
        const endDate = dayjs(end_date, 'YYYY-MM-DD');
        let approvedDates = [];
        let currentDate = startDate;

        while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
            approvedDates.push({
                approved_by: created_by,
                approved_date: currentDate.format('YYYY-MM-DD'),
                leave_application_id: id
            });
            currentDate = currentDate.add(1, 'day');
        }

        setFormData(approvedDates);
        console.log(approvedDates);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_approve`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(approvedDates),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.affectedRows);

                // Update application status
                return fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_edit_status/${id}`, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({ application_status: 1 }),
                });
            })
            .then((response) => response.json())
            .then((data) => {
                console.log('Status update response:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }


    console.log(formData)



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

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
        years.push(year);
    }


    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);

    const period_search = () => {
        setLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_search`, {
            fromDate, toDate, searchQuery, status, selectedColumns, userGroup, multiSearch
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


    const buttonStyles = {
        color: '#fff',
        backgroundColor: '#510bc4',
        backgroundImage: 'none',
        borderColor: '#4c0ab8',
    };

    console.log(selectedColumns)



    const category_print = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_search`, {
                fromDate, toDate, searchQuery, status, selectedColumns, userGroup, multiSearch
            });
            const searchResults = response.data.results;
            console.log(searchResults)
            // Get the selected zoom size value
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
            const extraColumnValue = parseInt(document.getElementById('extra_column').value);

            // Get the selected print layout (Landscape or Portrait)
            const selectedLayout = document.getElementById('print_layout').value;

            // Determine orientation based on the selected layout
            const orientation = selectedLayout === 'landscape' ? 'landscape' : 'portrait';

            // Get the selected print size (A4, A3, Legal)
            const selectedPrintSize = document.getElementById('print_size').value;

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

            if (isNaN(pageWidth) || isNaN(pageHeight) || pageWidth <= 0 || pageHeight <= 0) {
                console.error("Invalid page dimensions. Please check calculations.");
                return;
            }

            // Create a new window for editing
            const editWindow = window.open('', '_blank');

            editWindow.document.write('<html><head><title>Pathshala School & College Expense Form</title><style> @page { size: ' + selectedPrintSize + ' ' + orientation + '; } @media print { @page { size: ' + selectedPrintSize + ' ' + orientation + '; } } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: left; } thead { background-color: gray; } body { text-align: center; } </style></head><body>');
            editWindow.document.write('<html style="font-size: ' + fontSize + 'px;"><head><title>Pathshala School & College Expense Form</title><style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: left; } thead { background-color: gray; } body { text-align: center; } </style></head><body>');

            editWindow.document.write('<h2 style="margin: 0; padding: 0;">Pathshala School & College Expense Form</h2>');
            editWindow.document.write('<h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>');
            editWindow.document.write('<p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>');
            editWindow.document.write('<p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>');

            editWindow.document.write('<h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Expense Copy</h3>');
            editWindow.document.write('<div style="display: flex; justify-content: space-between;">');
            editWindow.document.write('<p style="margin: 0; padding: 0;">Receipt No: 829</p>');
            editWindow.document.write('<p style="margin: 0; padding: 0;">Collected By: পাঠশালা স্কুল এন্ড কলেজ</p>');
            editWindow.document.write('<p style="margin: 0; padding: 0;">Date: </p>');
            editWindow.document.write('</div>');

            // Render the filtered data in a table for editing
            editWindow.document.write('<table style="font-size: ' + fontSize + 'px;">');
            editWindow.document.write('<thead>');
            editWindow.document.write('<tr>');

            // Render headers for selected columns
            const editableHeaders = []; // Array to store headers for editable columns
            selectedColumns.forEach(column => {
                if (column !== 'action') {
                    // Display 'Status' if the column name is 'status_id'
                    const columnHeader = column === 'status_id' ? 'Status' : formatString(column);
                    editWindow.document.write('<th style="font-size:' + fontSize + 'px;"><h2>' + columnHeader + '</h2></th>');

                    // Push header to editableHeaders if it's an extra column
                    if (column.startsWith('extra')) {
                        editableHeaders.push('<th style="font-size:' + fontSize + 'px;" contenteditable="true"><h2>' + columnHeader + '</h2></th>');
                    }
                }
            });

            // Add Extra Column headers with editable input fields
            for (let i = 1; i <= extraColumnValue; i++) {
                editWindow.document.write(editableHeaders[i - 1] || '<th style="font-size:' + fontSize + 'px;" contenteditable="true">Column ' + i + '</th>');
            }

            editWindow.document.write('</tr></thead>');
            editWindow.document.write('<tbody>');

            // Render rows of data
            const longTextColumns = ['category_name', 'description'];
            searchResults.forEach((category, index) => {
                editWindow.document.write('<tr>');

                // Render cells for selected columns
                selectedColumns.forEach(column => {
                    if (column !== 'action') {

                        const style = longTextColumns.includes(column) ? 'word-wrap: break-word; word-break: break-all;' : '';
                        editWindow.document.write('<td' + (column.startsWith('extra') ? ' contenteditable="true"' : '') + ' style="font-size:' + fontSize + 'px;' + style + '">');

                        if (column === 'file_path') {
                            // Special handling for the 'File Path' column to display images
                            editWindow.document.write(`<img src="${process.env.NEXT_PUBLIC_API_URL}:5003/${category.file_path}" style="max-width: 100px;" alt="Image"/>`);

                        } else if (column === 'serial') {
                            // Rendering serial number if the column is 'serial'
                            editWindow.document.write(index + 1);

                        }
                        else if (column === 'receiver') {
                            // Rendering serial number if the column is 'serial'
                            editWindow.document.write(category.receiver_name);

                        }
                        else if (column === 'whose_leave') {
                            // Rendering serial number if the column is 'serial'
                            editWindow.document.write(category.whose_leave_name);

                        }

                        else if (column === 'created_by') {
                            // Rendering serial number if the column is 'serial'
                            editWindow.document.write(category.created_by_name);
                        }

                        else if (column === 'leave_category') {
                            // Rendering serial number if the column is 'serial'
                            editWindow.document.write(category.leave_category_name);
                        }


                        else if (column === 'application_status') {
                            // Display status based on status_id value
                            let statusText = '';
                            switch (category[column]) {
                                case 1:
                                    statusText = 'Rejected';
                                    break;
                                case 2:
                                    statusText = 'Approved';
                                    break;
                                case 0:
                                    statusText = 'Pending';
                                    break;
                                default:
                                    statusText = 'Unknown';
                            }
                            editWindow.document.write(statusText);
                        } else {
                            // Default rendering for other columns
                            editWindow.document.write(category[column]);
                        }
                        editWindow.document.write('</td>');
                    }
                });

                // Render cells for extra columns
                for (let i = 0; i < extraColumnValue; i++) {
                    editWindow.document.write('<td style="font-size:' + fontSize + 'px;" contenteditable="true"></td>');
                }

                editWindow.document.write('</tr>');
            });

            editWindow.document.write('</tbody></table>');
            editWindow.document.write('</body></html>');
            editWindow.document.close();

            // Print the editing window
            editWindow.print();
        } catch (error) {
            setError("An error occurred during printing.", error);
        }
    };




    const category_excel_download = async () => {


        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_search`, {
                fromDate, toDate, searchQuery, status, selectedColumns, multiSearch
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
                            return 'Rejected';
                        case 2:
                            return 'Approved';
                        case 0:
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
            XLSX.writeFile(workbook, 'category_results.xlsx');
        } catch (error) {
            console.error("An error occurred during printing.", error);
            setError("An error occurred during printing.", error);
        };
    };






    const category_word_download = async () => {

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_search`, {
                fromDate, toDate, searchQuery, status, selectedColumns, multiSearch
            });
            const searchResults = response.data.results;
            if (!selectedColumns || !searchResults || !searchResults.length) {
                console.error('Selected columns or filtered categories are not available.');
                return;
            }

            // Determine if serial column should be included
            const includeSerial = selectedColumns.includes('serial');

            // Create header row
            const headerRow = new TableRow({
                children: selectedColumns
                    .filter(column => column !== 'action' && column !== 'file_path') // Exclude action column
                    .map(column => new TableCell({
                        children: [new Paragraph({ text: formatString(column), bold: true })],
                        borders: {},
                    })),
            });

            // Create data rows
            const dataRows = searchResults.map((color, index) => new TableRow({
                children: selectedColumns
                    .filter(column => column !== 'action' && column !== 'file_path') // Exclude action column
                    .map(column => {
                        let cellData = '';

                        if (column === 'serial' && includeSerial) {
                            // Handle serial column
                            cellData = index + 1;

                        } else if (column === 'status_id') {
                            // Handle status column
                            cellData = color.status_id === 1 ? 'Active' :
                                color.status_id === 2 ? 'Inactive' :
                                    color.status_id === 3 ? 'Pending' : '';
                        } else {
                            // Default rendering for other columns
                            cellData = color[column] || ''; // Handle undefined or null values
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
                    .filter(column => column !== 'action' && column !== 'file_path') // Exclude action column
                    .map(() => 100 / selectedColumns.length),
            });

            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun("category List")
                            ],
                            alignment: 'center',
                        }),
                        table, // Add the table to the document
                    ],
                }],
            });

            const buffer = await Packer.toBuffer(doc);
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'category_list.docx';
            link.click();
        } catch (error) {
            console.error("An error occurred during printing.", error);
            setError("An error occurred during printing.", error);

        }
    };


    const category_PDF_download = async () => {
        // setLoading(true);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_search`, {
            fromDate, toDate, searchQuery, status, selectedColumns, multiSearch
        });

        const searchResults = response.data.results;
        const selectedLayout = document.getElementById('print_layout').value;
        const orientation = selectedLayout === 'landscape' ? 'landscape' : 'portrait';

        const selectedPrintSize = document.getElementById('print_size').value;
        const selectedZoom = document.querySelector('.zoom_size').value;

        // Convert zoom value to a numeric multiplier
        let zoomMultiplier = 100; // Default zoom multiplier
        if (selectedZoom !== '') {
            zoomMultiplier = parseFloat(selectedZoom) / 100;
        }
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

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults, selectedColumns, orientation, selectedPrintSize
                    // Other parameters if needed
                }),

                // If you need to send any data with the request, you can include it here
                // body: JSON.stringify({ /* your data */ }),
            });

            if (!response.ok) {
                throw new Error('Error generating PDF In category');
            }


            // If you want to download the PDF automatically
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'category_pdf.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            setError(error.message);
        } finally {
            // setLoading(false);
        }
    };



    return (
        <div className="container-fluid">
            <div className="row">


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
                                    <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Leave Application Search</h5>
                                    <div class="card-title font-weight-bold mb-0 card-header-color float-right">

                                        <Link href={`/Admin/leave_application/leave_application_create?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Create Leave Application</Link>
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

                                                <label class="col-form-label col-md-3"><strong>User Group:</strong></label>
                                                <div className="col-md-3">
                                                    <select

                                                        value={userGroup} onChange={(e) => setUserGroup(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero lshift"

                                                    >
                                                        <option value="">Select User Group</option>
                                                        {
                                                            designations.map(designation =>
                                                                <>
                                                                    <option value={designation.designation_name}>{designation.designation_name}</option>
                                                                </>
                                                            )
                                                        }



                                                    </select>
                                                </div>

                                                <label class="col-form-label col-md-3"><strong>Application Status:</strong></label>
                                                <div className="col-md-3">
                                                    <select
                                                        value={status} onChange={(e) => setStatus(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero lshift"

                                                    >
                                                        <option value="">Select Application Status</option>
                                                        <option value="0">Pending</option>
                                                        <option value="1">Rejected</option>
                                                        <option value="2">Approved</option>



                                                    </select>
                                                </div>

                                            </div>
                                            <div class="form-group row student">



                                                <label class="col-form-label col-md-3"><strong>Leave Category:</strong></label>
                                                <div className="col-md-3">
                                                    <select

                                                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero lshift"

                                                    >
                                                        <option value="">Select Leave Category</option>
                                                        {
                                                            leaveCategory.map(category =>

                                                                <>
                                                                    <option value={category.id}>{category.name}</option>
                                                                </>
                                                            )
                                                        }



                                                    </select>
                                                </div>
                                                <label class="col-form-label col-md-3"><strong>Extra Column:</strong></label>
                                                <div className="col-md-3">
                                                    <select name="extra_column" className="form-control form-control-sm alpha_space extra_column" id="extra_column" placeholder="Extra Column">
                                                        {(() => {
                                                            const options = [];
                                                            for (let i = 0; i <= 100; i++) {
                                                                options.push(<option key={i} value={i}>{i}</option>);
                                                            }
                                                            return options;
                                                        })()}
                                                    </select>
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
                                            <div class="form-group row student">

                                                <label class="col-form-label font-weight-bold col-md-3">Print/PDF Properties:</label>
                                                <div class="col-md-9">
                                                    <div class="input-group ">
                                                        <select name="print_size" class="form-control form-control-sm  trim integer_no_zero print_size" id="print_size">
                                                            <option value="legal">legal </option>
                                                            <option value="A4">A4 </option>
                                                            <option value="A3">A3 </option>
                                                            <option value="">Browser/Portrait(PDF)</option>
                                                        </select>
                                                        <select name="print_layout" class="form-control form-control-sm  trim integer_no_zero print_layout" id="print_layout">

                                                            <option value="landscape">Landscape</option>
                                                            <option value="portrait">Portrait</option>
                                                            <option value="">Browser/Portrait(PDF)</option>
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

                                        </div>
                                        <div class="form-group row">
                                            <div class="offset-md-2 col-md-12 float-left">
                                                <input type="button" name="search" class="btn btn-sm btn-info search_btn mr-2" value="Search"
                                                    onClick={period_search}
                                                />
                                                <input type="button" onClick={category_print} name="search" class="btn btn-sm btn-success print_btn mr-2" value="Print" />
                                                <input
                                                    type="button"
                                                    onClick={category_excel_download}
                                                    name="search"
                                                    className="btn btn-sm btn-secondary excel_btn mr-2"
                                                    value="Download Excel"
                                                />

                                                <input
                                                    type="button"
                                                    onClick={category_word_download}
                                                    name="search"
                                                    className="btn btn-sm btn-secondary excel_btn mr-2"
                                                    value="Download Docx"
                                                />
                                                <input
                                                    onClick={category_PDF_download}
                                                    type="button" name="search" class="btn btn-sm btn-indigo pdf_btn mr-2" value="Download PDF" style={buttonStyles} />
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
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">List Leave Application</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/leave_application/leave_application_create?page_group`} className="btn btn-sm btn-info">Back Leave Application Create</Link>
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
                                    </div>


                                        :

                                        searchResults.length > 0 ? (
                                            <div class="table-responsive">


                                                <table id='mytable' className="table table-bordered table-hover table-striped table-sm">
                                                    <thead>
                                                        <tr>
                                                            {selectedColumns.map((column, i) => (
                                                                <th key={i}>{formatString(column)}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {searchResults.map((leave_application, i) => (
                                                            <tr key={i}>
                                                                {selectedColumns.map((column, j) => (
                                                                    <td key={j} style={['brand_name', 'description'].includes(column) ? longTextStyle : {}}>
                                                                        {column === 'serial' ? (
                                                                            // Rendering serial number if the column is 'serial'
                                                                            i + 1
                                                                        )
                                                                            :
                                                                            column === 'receiver' ? (
                                                                                // Special handling for the 'status' column
                                                                                <>
                                                                                    {leave_application.receiver_name}
                                                                                </>
                                                                            )
                                                                                :
                                                                                column === 'whose_leave' ? (
                                                                                    // Special handling for the 'status' column
                                                                                    <>
                                                                                        {leave_application.whose_leave_name}
                                                                                    </>
                                                                                )
                                                                                    :
                                                                                    column === 'leave_category' ? (
                                                                                        // Special handling for the 'status' column
                                                                                        <>
                                                                                            {leave_application.leave_category_name}
                                                                                        </>
                                                                                    )
                                                                                        :
                                                                                        column === 'application_status' ? (
                                                                                            // Special handling for the 'status' column
                                                                                            <>
                                                                                                {leave_application[column] === 1 ? 'Rejected' : leave_application[column] === 2 ? 'Approved' : leave_application[column] === 0 ? 'Pending' : 'Unknown'}
                                                                                            </>
                                                                                        )
                                                                                            :


                                                                                            column === 'created_by' ? (
                                                                                                // Special handling for the 'status' column
                                                                                                <>
                                                                                                    {leave_application.created_by_name}
                                                                                                </>
                                                                                            )
                                                                                                :

                                                                                                column === 'action' ? (
                                                                                                    // Special handling for the 'status' column

                                                                                                    <div className="flex items-center ">
                                                                                                        <Link href={`/Admin/leave_application/leave_application_edit/${leave_application.id}?page_group=${page_group}`}>
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
                                                                                                        <Link href={`/Admin/leave_application/leave_application_copy/${leave_application.id}?page_group=${page_group}`}>
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
                                                                                                                onClick={() => leave_application_delete(leave_application.id)}
                                                                                                                style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                                                className={filteredBtnIconDelete?.btn}
                                                                                                            >
                                                                                                                <a
                                                                                                                    dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
                                                                                                                ></a>
                                                                                                            </button>
                                                                                                        )))}


                                                                                                        <button
                                                                                                            className='btn btn-sm btn-success btn-sm accept text-white  ml-2'
                                                                                                            style={{ marginTop: '5px' }}
                                                                                                            onClick={() => approveFunction(leave_application.id, leave_application?.start_date, leave_application?.end_date)}
                                                                                                        ><i class="fas fa-check"></i></button>
                                                                                                        <button
                                                                                                            className='btn btn-secondary btn-sm ccept text-white ml-1'
                                                                                                            style={{ marginTop: '5px' }}
                                                                                                            onClick={() => rejectFunction(leave_application.id, leave_application?.start_date, leave_application?.end_date)}
                                                                                                        ><i class="fas fa-ban"></i></button>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    // Default rendering for other columns
                                                                                                    leave_application[column]
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
                                                                pageUsers?.map((leave_application, index) => (
                                                                    <tr key={leave_application.id}>
                                                                        {selectedColumns?.map(column => (
                                                                            <td key={column} style={['category_name', 'description'].includes(column) ? longTextStyle : {}}>
                                                                                {column === 'serial' ? (
                                                                                    ((currentPage - 1) * dataPerPage) + (index + 1)
                                                                                ) :

                                                                                    column === 'receiver' ? (
                                                                                        // Special handling for the 'status' column
                                                                                        <>
                                                                                            {leave_application.receiver_name}
                                                                                        </>
                                                                                    )
                                                                                        :
                                                                                        column === 'whose_leave' ? (
                                                                                            // Special handling for the 'status' column
                                                                                            <>
                                                                                                {leave_application.whose_leave_name}
                                                                                            </>
                                                                                        )
                                                                                            :
                                                                                            column === 'leave_category' ? (
                                                                                                // Special handling for the 'status' column
                                                                                                <>
                                                                                                    {leave_application.leave_category_name}
                                                                                                </>
                                                                                            )
                                                                                                :
                                                                                                column === 'application_status' ? (
                                                                                                    // Special handling for the 'status' column
                                                                                                    <>
                                                                                                        {leave_application[column] === 1 ? 'Rejected' : leave_application[column] === 2 ? 'Approved' : leave_application[column] === 0 ? 'Pending' : 'Unknown'}
                                                                                                    </>
                                                                                                )
                                                                                                    :


                                                                                                    column === 'created_by' ? (
                                                                                                        // Special handling for the 'status' column
                                                                                                        <>
                                                                                                            {leave_application.created_by_name}
                                                                                                        </>
                                                                                                    )
                                                                                                        :

                                                                                                        column === 'action' ? (


                                                                                                            <div className="flex items-center ">
                                                                                                                <Link href={`/Admin/leave_application/leave_application_edit/${leave_application.id}?page_group=${page_group}`}>
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
                                                                                                                <Link href={`/Admin/leave_application/leave_application_copy/${leave_application.id}?page_group=${page_group}`}>
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
                                                                                                                        onClick={() => leave_application_delete(leave_application.id)}
                                                                                                                        style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                                                        className={filteredBtnIconDelete?.btn}
                                                                                                                    >
                                                                                                                        <a
                                                                                                                            dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
                                                                                                                        ></a>
                                                                                                                    </button>
                                                                                                                )))}


                                                                                                                <button
                                                                                                                    className='btn btn-sm btn-success btn-sm accept text-white  ml-2'
                                                                                                                    style={{ marginTop: '5px' }}
                                                                                                                    onClick={() => approveFunction(leave_application.id, leave_application?.start_date, leave_application?.end_date)}
                                                                                                                ><i class="fas fa-check"></i></button>
                                                                                                                <button
                                                                                                                    className='btn btn-secondary btn-sm ccept text-white ml-1'
                                                                                                                    style={{ marginTop: '5px' }}
                                                                                                                    onClick={() => rejectFunction(leave_application.id, leave_application?.start_date, leave_application?.end_date)}
                                                                                                                ><i class="fas fa-ban"></i></button>
                                                                                                            </div>
                                                                                                        ) :
                                                                                                            (
                                                                                                                leave_application[column]
                                                                                                            )}
                                                                            </td>
                                                                        ))}
                                                                    </tr>
                                                                ))
                                                            )}
                                                        </tbody>
                                                    </table>
                                                    <div className=" d-flex justify-content-between">
                                                        <div>
                                                            Total Data: {totalData}
                                                        </div>
                                                        <div class="pagination float-right pagination-sm border">
                                                            {
                                                                currentPage - 3 >= 1 && (
                                                                    <Link className=" text-primary px-2 border-left py-1" href={`/Admin/leave_application/leave_application_all?page=${1}`}>‹ First</Link>
                                                                )
                                                            }
                                                            {
                                                                currentPage > 1 && (
                                                                    <Link className=" text-primary px-2 border-left py-1" href={`/Admin/leave_application/leave_application_all?page=${activePage - 1}`}>&lt;</Link>
                                                                )
                                                            }
                                                            {
                                                                pageNumber.map((page) =>
                                                                    <Link
                                                                        key={page}
                                                                        href={`/Admin/leave_application/leave_application_all?page=${page}`}
                                                                        className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                                                                    > {page}
                                                                    </Link>
                                                                )
                                                            }
                                                            {
                                                                currentPage < totalPages && (
                                                                    <Link className=" text-primary px-2 border-left py-1" href={`/Admin/leave_application/leave_application_all?page=${activePage + 1}`}>&gt;</Link>
                                                                )
                                                            }
                                                            {
                                                                currentPage + 3 <= totalPages && (
                                                                    <Link className=" text-primary px-2 border-left py-1" href={`/Admin/leave_application/leave_application_all?page=${totalPages}`}>Last ›</Link>
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
    );
};

export default ListLeaveApplication;