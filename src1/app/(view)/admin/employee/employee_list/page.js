'use client' 
 //ismile
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Select from 'react-dropdown-select';
import { FaMapMarkerAlt } from 'react-icons/fa';
import * as XLSX from "xlsx";
import { Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun, ImageRun, WidthType, Media } from 'docx';

const EmployeeAll = ({ searchParams }) => {


    const { data: employeeList = [], isLoading, refetch
    } = useQuery({
        queryKey: ['employeeList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_all_list`)

            const data = await res.json()
            return data
        }
    })

    console.log(employeeList)





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
    const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'employee')

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
    const filteredBtnIconLiveLocation = brandList.filter(btn =>
        btn.method_sort === 10
    );

    const filteredBtnPromotionCreate = brandList.filter(btn =>
        btn.method_sort === 9
    );

    const employee_delete = id => {

        console.log(id)
        const proceed = window.confirm(`Are You Sure delete${id}`)
        if (proceed) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_delete/${id}`, {
                method: "POST",

            })
                .then(Response => Response.json())
                .then(data => {
                    refetch()
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

    const [showFromDate, setShowFromDate] = useState('');
    const [showToDate, setShowToDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [searchQuery, setSearchQuery] = useState([]);
    const [itemName, setItemName] = useState('');
    const [employee, setEmployee] = useState([]);
    const [filteredDesignations, setFilteredDesignations] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);



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



    // Column

    const [selectedColumns, setSelectedColumns] = useState([]);

    const { data: expenseList = []
    } = useQuery({
        queryKey: ['expenseList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_all_list_settings`)

            const data = await res.json()
            return data
        }
    })
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
    const Category = module_settings.filter(moduleI => moduleI.table_name === 'employee')
    // const columnListSelected = Category[0]?.column_name
    // const columnListSelectedArray = columnListSelected?.split(',').map(item => item.trim());
    const columnListSelected = Category[0]?.column_name
    const columnListSelectedSearch = Category[0]?.search
    const columnListSelectedArray = columnListSelected?.split(',').map(item => item.trim());
    const columnListSelectedSerachArray = columnListSelectedSearch?.split(',').map(item => item.trim());
    const columnListSelectedsearchAscDesc = Category[0]?.search_value
    const columnListSelectedSerachArrays = columnListSelectedsearchAscDesc?.split(',').map(item => item.trim());
    // console.log(Category[0]?.column_name)
    console.log(columnListSelected)

    console.log(columnListSelectedArray)

 

 


    // console.log('Column Names:', columnNames);



    useEffect(() => {
        setSelectedColumns(columnListSelectedArray)
    }, [])


    useEffect(() => {
        setSelectedColumns(columnListSelectedArray)
    }, [])

    const [selectedColumnsSearch, setSelectedColumnsSerach] = useState([]);
    useEffect(() => {
        setSelectedColumnsSerach(columnListSelectedSerachArrays)
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

    const brand_column_change = (selectedItems) => {
        setSelectedColumns(selectedItems.map((item) => item.value));
        // brand_search(); 
    };
    const brand_column_changes = (selectedItems) => {
        setSelectedColumnsSerach(selectedItems.map((item) => item.value));
        // brand_search(); 
    };

    const multiSearch = selectedColumnsSearch?.map(convertSortString);

    const { data: branchAll = [] } = useQuery({
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

    const { data: payrolls = [] } = useQuery({
        queryKey: ['payrolls'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/pay_roll/pay_roll_all`);
            const data = await res.json();
            return data;
        }
    });

    const { data: shifts = [] } = useQuery({
        queryKey: ['shifts'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_all`);
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


    console.log(filteredDesignations)
    console.log(filteredEmployees)

    const [error, setError] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [shift, setShift] = useState([])
    const [payroll, setPayroll] = useState([])
    const [employee_id, setEmployeeId] = useState([])
    console.log(multiSearch)
    const employee_search = () => {
        setLoading(true);
        if (itemName === '') {
            alert('Select A Branch')
            setLoading(false);
            return
        }
        console.log(multiSearch)
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_search`, {
            searchQuery, itemName, employee, shift, payroll, employee_id, fromDate, toDate, multiSearch
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
        const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list_paigination/${currentPage}/${dataPerPage}`;
        const response = await fetch(url);
        const data = await response.json();
        setPageUsers(data);
    };
    useEffect(() => {
        caregory_list();
    }, [currentPage]);

    const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;

    console.log(searchResults)




    const employee_list_pdf_download = async () => {
        try {
            // Fetch search results
            const searchResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_search`, {
                searchQuery, itemName, employee, shift, payroll, employee_id, fromDate, toDate
            });

            const searchResults = searchResponse.data.results;
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
                    pageWidth = 210 * zoomMultiplier;
                    pageHeight = 297 * zoomMultiplier;
                    break;
            }

            const selectedFontSize = document.querySelector('.font_size').value;
            const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;

            console.log(searchResults);

            // Fetch PDF
            const pdfResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list_pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults, selectedColumns, fontSize, orientation, selectedPrintSize
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
            a.download = 'period_pdf.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Error occurred:', error);
        } finally {
            // setLoading(false); // Uncomment if you have a loading state to reset
        }
    };

    const attendance_excel_download = async () => {
        try {
            // Fetch data from the API
            const searchResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_search`, {
                searchQuery, itemName, employee, shift, payroll, employee_id, fromDate, toDate
            });
            const searchResults = searchResponse.data.results;

            // Extract columns from selectedColumns
            const columns = selectedColumns;

            // Filter searchResults to only include the selected columns
            const filteredData = searchResults.map(result => {
                const filteredResult = {};
                columns.forEach(column => {
                    // Special handling for 'join_date' column
                    if (column === 'join_date') {
                        filteredResult[column] = result[column] ? result[column].slice(0, 10) : ''; // Format date
                    } else {
                        filteredResult[column] = result[column] || ''; // Provide default value if column doesn't exist
                    }
                });
                return filteredResult;
            });

            // Create worksheet with filtered data
            const worksheet = XLSX.utils.json_to_sheet(filteredData);

            // Make the header cells bold
            const headerCells = Object.keys(worksheet).filter(cell => cell.match(/^[A-Z]+1$/));
            headerCells.forEach(cell => {
                worksheet[cell].s = {
                    font: {
                        bold: true,
                        sz: 14 // Larger font size for more emphasis
                    }
                };
            });

            // Calculate and set column widths
            const columnWidths = columns.map(column => ({
                wpx: Math.max(10, (column.length + 2) * 10) // Adjusting width for some padding
            }));
            worksheet['!cols'] = columnWidths;

            // Create workbook and write to file
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, 'attendance_results.xlsx');
        } catch (error) {
            console.error("An error occurred during printing.", error);
            setError("An error occurred during printing.", error);
        }
    };

    const fetchImageBuffer = async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image from ${url}`);
        return response.arrayBuffer();
    };

    const employee_word_download = async () => {
        try {
            const searchResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_search`, {
                searchQuery, itemName, employee, shift, payroll, employee_id, fromDate, toDate
            });
            const searchResults = searchResponse.data.results;

            // Define columns
            const columns = selectedColumns;

            // Create header row with bold text
            const headerRow = new TableRow({
                children: columns.map(column => new TableCell({
                    children: [new Paragraph({
                        text: column,
                        bold: true,
                        size: 32,
                        color: '000000'
                    })],
                    borders: {},
                })),
            });

            // Base URL for images
            const baseUrl = 'http://localhost/:5003/';

            // Create data rows
            const dataRows = await Promise.all(searchResults.map(async result => {
                return new TableRow({
                    children: await Promise.all(columns.map(async column => {
                        if (column === 'photo' && result[column]) {
                            // Construct the full image URL
                            const imageUrl = `${baseUrl}${result[column]}`;
                            try {
                                // Fetch and add image
                                const imageBuffer = await fetchImageBuffer(imageUrl);
                                return new TableCell({
                                    children: [new Paragraph({
                                        children: [new ImageRun({
                                            data: imageBuffer,
                                            transformation: {
                                                width: 100, // Set the width of the image
                                                height: 100, // Set the height of the image
                                            },
                                        })],
                                    })],
                                    borders: {},
                                });
                            } catch (error) {
                                // Handle image fetching error
                                console.error(`Failed to fetch image from ${imageUrl}`, error);
                                return new TableCell({
                                    children: [new Paragraph('Image not available')],
                                    borders: {},
                                });
                            }
                        } else if (column === 'join_date' && result[column]) {
                            // Format the join_date
                            const formattedDate = result[column].slice(0, 10); // Extract 'YYYY-MM-DD'
                            return new TableCell({
                                children: [new Paragraph(formattedDate)],
                                borders: {},
                            });
                        } else {
                            // Handle other types of data
                            const cellData = result[column] || '';
                            return new TableCell({
                                children: [new Paragraph(cellData.toString())],
                                borders: {},
                            });
                        }
                    })),
                });
            }));

            // Create table
            const table = new Table({
                rows: [headerRow, ...dataRows],
                width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                },
                columnWidths: columns.map(() => 100 / columns.length),
            });

            // Create the document
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [new TextRun("Attendance Summary")],
                            alignment: 'center',
                        }),
                        table,
                    ],
                }],
            });

            // Generate and download the Word document
            const buffer = await Packer.toBuffer(doc);
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'attendance_summary.docx';
            link.click();
        } catch (error) {
            console.error("An error occurred during printing.", error);
            setError("An error occurred during printing.", error);
        }
    };


    const employee_print_download = async () => {

        try {
            // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_remarks_list_visit/${id}`);
            const searchResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_search`, {
                searchQuery, itemName, employee, shift, payroll, employee_id, fromDate, toDate
            });
            const searchResults = searchResponse.data.results;
            ;

            console.log(searchResults);


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



            // Get the selected font size value
            const selectedFontSize = document.querySelector('.font_size').value;

            // Get the numeric part of the selected font size value
            const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;

            // Get the value of the extra column input field
            const extraColumnValue = parseInt(document.getElementById('extra_column').value);


            console.log(searchResults);



            const printWindow = window.open('', '_blank');
            printWindow.document.open();

            const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list_print`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults, selectedColumns, fontSize, orientation, selectedPrintSize, extraColumnValue
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

    const buttonStyles = {
        color: '#fff',
        backgroundColor: '#510bc4',
        backgroundImage: 'none',
        borderColor: '#4c0ab8',
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
                                    <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Employee Search</h5>
                                    <div class="card-title font-weight-bold mb-0 card-header-color float-right">

                                        <Link href={`/Admin/employee/employee_create?page_group=${page_group}`} class="btn btn-sm btn-info">Create Employee</Link>
                                    </div>
                                </div>

                                <div class="card-body">
                                    <form class="">
                                        <div class="col-md-10 offset-md-1">

                                            <div class="form-group row student">

                                                <label htmlFor="fromDate" class="col-form-label col-md-2"><strong>From Date:</strong></label>

                                                <div className="col-md-4">


                                                    <input
                                                        type="text"
                                                        readOnly

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
                                            <div class="form-group row student">

                                                <label class="col-form-label col-md-2"><strong>Search Properties:</strong></label>

                                                <div className="col-md-10">


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
                                                                if (column.startsWith("shift_id_")) {
                                                                    // Check if it ends with (ASC) or (DESC)
                                                                    if (column.endsWith("(ASC)")) {
                                                                        label = "Shift (asc)";
                                                                        value = "shift_id_(ASC)";
                                                                    } else if (column.endsWith("(DESC)")) {
                                                                        label = "Shift (desc)";
                                                                        value = "shift_id_(DESC)";
                                                                    }
                                                                }
                                                                else if (column.startsWith("designation_id_")) {
                                                                    // Check if it ends with (ASC) or (DESC)
                                                                    if (column.endsWith("(ASC)")) {
                                                                        label = "Designation Name (asc)";
                                                                        value = "designation_id_(ASC)";
                                                                    } else if (column.endsWith("(DESC)")) {
                                                                        label = "Designation Name (desc)";
                                                                        value = "designation_id_(DESC)";
                                                                    }
                                                                }
                                                                else if (column.startsWith("payroll_id_")) {
                                                                    // Check if it ends with (ASC) or (DESC)
                                                                    if (column.endsWith("(ASC)")) {
                                                                        label = "Payroll Name (asc)";
                                                                        value = "payroll_id_(ASC)";
                                                                    } else if (column.endsWith("(DESC)")) {
                                                                        label = "Payroll Name (desc)";
                                                                        value = "payroll_id_(DESC)";
                                                                    }
                                                                }
                                                                else if (column.startsWith("unique_id_")) {
                                                                    // Check if it ends with (ASC) or (DESC)
                                                                    if (column.endsWith("(ASC)")) {
                                                                        label = "Employee Id (asc)";
                                                                        value = "unique_id_(ASC)";
                                                                    } else if (column.endsWith("(DESC)")) {
                                                                        label = "Employee Id (desc)";
                                                                        value = "unique_id_(DESC)";
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
                                            <div class="form-group row student">

                                                <label className="col-form-label col-md-2 font-weight-bold">Pay Roll:</label>
                                                <div className="col-md-4">
                                                    <select required=""
                                                        value={payroll}
                                                        onChange={(e) => setPayroll(e.target.value)}
                                                        name="supplier_id" className="form-control form-control-sm mb-2" id="supplier_id">
                                                        <option value=''>Select Payroll</option>
                                                        {
                                                            payrolls.map(payroll =>
                                                                <>

                                                                    <option value={payroll.id}>{payroll.title}</option>
                                                                </>


                                                            )
                                                        }

                                                    </select>
                                                </div>

                                                <label class="col-form-label col-md-2"><strong>Shift:</strong></label>
                                                <div className="col-md-4">

                                                    <select
                                                        value={shift}
                                                        onChange={(e) => setShift(e.target.value)}
                                                        required="" name="supplier_id" className="form-control form-control-sm mb-2" id="supplier_id">
                                                        <option value=''>Select Shift</option>
                                                        {
                                                            shifts.map(shift =>
                                                                <>

                                                                    <option value={shift.id}>{shift.name}</option>
                                                                </>


                                                            )
                                                        }


                                                    </select>
                                                </div>


                                            </div>
                                            <div class="form-group row student">

                                                <label className="col-form-label col-md-2 font-weight-bold">Employee Name:</label>
                                                <div className="col-md-4">
                                                    <input
                                                        placeholder='Enter Employee Name'
                                                        class="form-control form-control-sm  alpha_space item_name" type="text" value={employee}
                                                        onChange={(e) => setEmployee(e.target.value)} />
                                                </div>

                                                <label class="col-form-label col-md-2"><strong>Employee Id:</strong></label>
                                                <div className="col-md-4">

                                                    <input
                                                        value={employee_id}
                                                        onChange={(e) => setEmployeeId(e.target.value)}
                                                        placeholder='Enter Employee Id'
                                                        class="form-control form-control-sm  alpha_space item_name" type="text" />
                                                </div>


                                            </div>
                                            <div class="form-group row student">

                                                <label class="col-form-label font-weight-bold col-md-2">Print Properties:</label>
                                                <div class="col-md-10">
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

                                                <label class="col-form-label col-md-2"><strong>Extra Column:</strong></label>
                                                <div className="col-md-10">
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


                                                <label class="col-form-label col-md-2"><strong>Design:</strong></label>

                                                <div className="col-md-10">


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
                                                <input
                                                    onClick={employee_search}
                                                    type="button" name="search" class="btn btn-sm btn-info search_btn mr-2" value="Search" />
                                                <input
                                                    onClick={employee_print_download}
                                                    type="button" name="search" class="btn btn-sm btn-success print_btn mr-2" value="Print" />
                                                <input
                                                    type="button"
                                                    onClick={attendance_excel_download}
                                                    name="search"
                                                    className="btn btn-sm btn-secondary excel_btn mr-2"
                                                    value="Download Excel"
                                                />

                                                <input
                                                    type="button"
                                                    onClick={employee_word_download}
                                                    name="search"
                                                    className="btn btn-sm btn-secondary excel_btn mr-2"
                                                    value="Download Doc"
                                                />
                                                <input
                                                    style={buttonStyles}
                                                    onClick={employee_list_pdf_download}
                                                    type="button" name="search" class="btn btn-sm btn-indigo pdf_btn mr-2" value="Download PDF" />
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
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">List Employee</h5>

                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/employee/employee_create?page_group`} className="btn btn-sm btn-info">Employee Create</Link>
                                        {/* <Link href={`/Admin/employee/google_map`} className="btn btn-sm btn-info ml-2"><FaMapMarkerAlt></FaMapMarkerAlt> </Link> */}
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
                                                                            column === 'photo' ? (
                                                                                // Special handling for the 'status' column
                                                                                <>
                                                                                    <img
                                                                                        className=" img-thumbnail"
                                                                                        style={{ width: '100px' }}
                                                                                        src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${expense.photo}`}
                                                                                        alt="No Image"
                                                                                    />
                                                                                </>
                                                                            )
                                                                                :
                                                                                column === 'join_date' ? (
                                                                                    // Rendering serial number if the column is 'serial'
                                                                                    expense.join_date.slice(0, 10)
                                                                                )
                                                                                    :
                                                                                    column === 'action' ? (
                                                                                        // Special handling for the 'status' column
                                                                                        <div className="flex items-center ">
                                                                                            <Link href={`/Admin/employee/employee_edit/${employee.user_id}?page_group=${page_group}`}>
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

                                                                                            <Link href={`/Admin/employee/employee_promotion_create/${employee.user_id}?page_group=${page_group}`}>
                                                                                                {filteredBtnPromotionCreate?.map((filteredBtnIconEdit => (
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

                                                                                            {filteredBtnIconDelete.map((filteredBtnIconDelete => (
                                                                                                <button
                                                                                                    key={filteredBtnIconDelete.user_id}
                                                                                                    title='Delete'
                                                                                                    onClick={() => employee_delete(employee.user_id)}
                                                                                                    style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                                    className={filteredBtnIconDelete?.btn}
                                                                                                >
                                                                                                    <a
                                                                                                        dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
                                                                                                    ></a>
                                                                                                </button>
                                                                                            )))}
                                                                                            {/* <Link href={`/Admin/employee/employee_google_map/${employee.user_id}`} className="btn btn-sm btn-info ml-2 mt-1"><FaMapMarkerAlt></FaMapMarkerAlt> </Link> */}
                                                                                            {/* <Link href={`/Admin/employee/employee_live_location/${employee.user_id}?page_group=${page_group}`}>
                                                                                        {filteredBtnIconLiveLocation.map((filteredBtnIconEdit => (
                                                                                            <button
                                                                                                key={filteredBtnIconEdit.id}
                                                                                                title='Live'
                                                                                                style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                                className={filteredBtnIconEdit?.btn}
                                                                                            >
                                                                                                <a
                                                                                                    dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                                                ></a>
                                                                                            </button>
                                                                                        )))}
                                                                                    </Link> */}
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


                                                </tbody>
                                            </table>
                                        </div>

                                    )

                                        :

                                        <>
                                            <div className=" d-flex justify-content-between mb-2">
                                                <div>
                                                    Total Data: {totalData}
                                                </div>
                                                <div class="pagination float-right pagination-sm border">
                                                    {
                                                        currentPage - 3 >= 1 && (
                                                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/employee/employee_all?page=${1}`}>‹ First</Link>
                                                        )
                                                    }
                                                    {
                                                        currentPage > 1 && (
                                                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/employee/employee_all?page=${activePage - 1}`}>&lt;</Link>
                                                        )
                                                    }
                                                    {
                                                        pageNumber.map((page) =>
                                                            <Link
                                                                key={page}
                                                                href={`/Admin/employee/employee_all?page=${page}`}
                                                                className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                                                            > {page}
                                                            </Link>
                                                        )
                                                    }
                                                    {
                                                        currentPage < totalPages && (
                                                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/employee/employee_all?page=${activePage + 1}`}>&gt;</Link>
                                                        )
                                                    }
                                                    {
                                                        currentPage + 3 <= totalPages && (
                                                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/employee/employee_all?page=${totalPages}`}>Last ›</Link>
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
                                                                        <td key={column} >
                                                                            {column === 'serial' ?
                                                                                ((currentPage - 1) * dataPerPage) + (index + 1)
                                                                                :

                                                                                column === 'photo' ? (
                                                                                    // Special handling for the 'status' column
                                                                                    <>
                                                                                        <img
                                                                                            className=" img-thumbnail"
                                                                                            style={{ width: '100px' }}
                                                                                            src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${expense.photo}`}
                                                                                            alt="No Image"
                                                                                        />
                                                                                    </>
                                                                                )
                                                                                    :

                                                                                    column === 'join_date' ? (
                                                                                        // Rendering serial number if the column is 'serial'
                                                                                        expense.join_date.slice(0, 10)
                                                                                    ) :
                                                                                        column === 'action' ? (


                                                                                            <div className="flex items-center ">
                                                                                                <Link href={`/Admin/employee/employee_edit/${employee.user_id}?page_group=${page_group}`}>
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

                                                                                                <Link href={`/Admin/employee/employee_promotion_create/${employee.user_id}?page_group=${page_group}`}>
                                                                                                    {filteredBtnPromotionCreate?.map((filteredBtnIconEdit => (
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

                                                                                                {filteredBtnIconDelete.map((filteredBtnIconDelete => (
                                                                                                    <button
                                                                                                        key={filteredBtnIconDelete.user_id}
                                                                                                        title='Delete'
                                                                                                        onClick={() => employee_delete(employee.user_id)}
                                                                                                        style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                                        className={filteredBtnIconDelete?.btn}
                                                                                                    >
                                                                                                        <a
                                                                                                            dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
                                                                                                        ></a>
                                                                                                    </button>
                                                                                                )))}
                                                                                                {/* <Link href={`/Admin/employee/employee_google_map/${employee.user_id}`} className="btn btn-sm btn-info ml-2 mt-1"><FaMapMarkerAlt></FaMapMarkerAlt> </Link> */}
                                                                                                {/* <Link href={`/Admin/employee/employee_live_location/${employee.user_id}?page_group=${page_group}`}>
                                                                                    {filteredBtnIconLiveLocation.map((filteredBtnIconEdit => (
                                                                                        <button
                                                                                            key={filteredBtnIconEdit.id}
                                                                                            title='Live'
                                                                                            style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                            className={filteredBtnIconEdit?.btn}
                                                                                        >
                                                                                            <a
                                                                                                dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                                            ></a>
                                                                                        </button>
                                                                                    )))}
                                                                                </Link> */}
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
                                                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/employee/employee_all?page=${1}`}>‹ First</Link>
                                                        )
                                                    }
                                                    {
                                                        currentPage > 1 && (
                                                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/employee/employee_all?page=${activePage - 1}`}>&lt;</Link>
                                                        )
                                                    }
                                                    {
                                                        pageNumber.map((page) =>
                                                            <Link
                                                                key={page}
                                                                href={`/Admin/employee/employee_all?page=${page}`}
                                                                className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                                                            > {page}
                                                            </Link>
                                                        )
                                                    }
                                                    {
                                                        currentPage < totalPages && (
                                                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/employee/employee_all?page=${activePage + 1}`}>&gt;</Link>
                                                        )
                                                    }
                                                    {
                                                        currentPage + 3 <= totalPages && (
                                                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/employee/employee_all?page=${totalPages}`}>Last ›</Link>
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
        </div>
    );
};

export default EmployeeAll;













