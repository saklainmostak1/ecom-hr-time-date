'use client'
//ismile
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import * as XLSX from "xlsx";
import { Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun, ImageRun, WidthType } from 'docx';
import { ReactBarcode } from 'react-jsbarcode';
import '../../../admin_layout/modal/fa.css'



const SalesLists = ({ searchParams }) => {


    const [selectedValue, setSelectedValue] = useState('with_name');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const [selectedValues, setSelectedValues] = useState('code39');

    const handleChanges = (event) => {
        setSelectedValues(event.target.value);
    };
    console.log(selectedValues)

    const [toDate, setToDate] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [searchResults, setSearchResults] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errorr, setErrorr] = useState(null)
    const [name, setname] = useState('')
    const [product_id, setProduct_id] = useState('')
    const [unit_id, setUnit_id] = useState('')
    const [invoice, setInvoice] = useState('')
    const [purchase_types, setPurchase_types] = useState('')
    const [mobile, setMobile] = useState('')




    const { data: loanAll = [], isLoading, refetch
    } = useQuery({
        queryKey: ['loanAll'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sales_list`)

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
    const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'sales')

    //   console.log(filteredModuleInfo);


    const filteredBtnIconEdit = brandList.filter(btn =>
        btn.method_sort === 3
    );
    const filteredBtnIconPDF = brandList.filter(btn =>
        btn.method_sort === 6
    );
    const filteredBtnIconInvoice = brandList.filter(btn =>
        btn.method_sort === 13
    );
    const filteredBtnIconPrint = brandList.filter(btn =>
        btn.method_sort === 7
    );
    const filteredBtnIconInvoicePDF = brandList.filter(btn =>
        btn.method_sort === 11
    );
    const filteredBtnIconInvoicePrint = brandList.filter(btn =>
        btn.method_sort === 12
    );



    const filteredBtnIconDelete = brandList.filter(btn =>
        btn.method_sort === 5
    );
    const filteredBtnIconCreate = brandList.filter(btn =>
        btn.method_sort === 1
    );

    // Paigination start
    const parentUsers = loanAll

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
        const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/loan/sale_list_paigination/${currentPage}/${dataPerPage}`;
        const response = await fetch(url);
        const data = await response.json();
        setPageUsers(data);
    };
    useEffect(() => {
        caregory_list();
    }, [currentPage]);

    const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;


    const loan_delete = id => {


        console.log(id);


        // const proceed = window.confirm(`Are You Sure delete${id}`)
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/loan/sales_delete/${id}`, {
            method: "POST",
        })
            .then(response => {
                console.log(response)
                response.json()
                if (response.ok === true) {
                    const procced = window.confirm(`Are You Sure delete`)
                    if (procced)
                        refetch();
                    caregory_list()


                }
                else {
                    alert('Data already running. You cant Delete this item.');
                }
            })
            .then(data => {
                if (data) {

                    console.log(data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the data. Please try again.');
            });
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



    const { data: products = [],
    } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/product_list`)

            const data = await res.json()
            return data
        }
    })


    const { data: supplier = [], } = useQuery({
        queryKey: ['supplier'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/supplier/supplier_list`);
            const data = await res.json();
            // Filter out the brand with id 
            // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return data;
        }
    });




    const { data: unit = [],
    } = useQuery({
        queryKey: ['unit'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/unit/unit_all`)

            const data = await res.json()
            return data
        }
    })


    const loan_search = () => {

        setLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sale_list_search`, {
            toDate, fromDate, product_id, name, mobile, invoice

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




    const loan_pdf_download = async () => {

        // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sale_list_search`, {
            toDate, fromDate, product_id, name, mobile, invoice
        });

        const searchResults = response.data.results

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


        console.log(searchResults)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sale_list_pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults, orientation, fontSize, selectedPrintSize
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
            a.download = 'purchase_pdf.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            setErrorr(error.message);
        } finally {
            // setLoading(false);
        }
    };


    const loan_print = async () => {
        try {
            // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sale_list_search`, {
                toDate, fromDate, product_id, name, mobile, invoice
            });

            const searchResults = response.data.results;

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

            console.log(zoomMultiplier)

            // Get the selected font size value
            const selectedFontSize = document.querySelector('.font_size').value;

            // Get the numeric part of the selected font size value
            const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;
            const extraColumnValue = parseInt(document.getElementById('extra_column').value);

            const printWindow = window.open('', '_blank');
            printWindow.document.open();

            const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sale_list_print`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults, orientation, fontSize, selectedPrintSize, extraColumnValue
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


    const loan_excel_download = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sale_list_search`, {
                toDate, fromDate, product_id, name, mobile, invoice
            });

            const searchResults = response.data.results;



            // Define the columns
            const columns = [
                'SL No.',
                'Full Name',
                'Invoice',
                'Bill Amount',
                'Previous Due',
                'Total Amount',
                'Discount',
                'Paid Amount',
                'Due',
                'Remarks',
                'Sale Date',
                'Created Date',

            ];




            // Filter the data
            const filteredColumns = searchResults.map((category, index) => {
                const filteredData = {
                    'SL No.': index + 1,
                    'Full Name': category.full_name,
                    'Invoice': category.invoice_id,
                    'Bill Amount': category.total_amount,
                    'Previous Due': category.previous_due,
                    'Payable Amount': category.payable_amount,
                    'Discount': category.discount,
                    'Paid Amount': category.paid_amount,
                    'Due': category.due,
                    'Remarks': category.remarks,
                    'Sale Date': category.sale_date.slice(0, 10),
                    'Created Date': category.created_date.slice(0, 10),
                };
                return filteredData;
            });

            // Create worksheet with filtered data
            const worksheet = XLSX.utils.json_to_sheet(filteredColumns);

            // Calculate width for each column
            const columnWidth = 100 / columns.length;

            // Set width for each column
            const columnWidths = columns.map(() => ({ wpx: columnWidth * columns.length }));

            worksheet['!cols'] = columnWidths;
            console.log(columnWidths);

            // Create workbook and write to file
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, 'sale.xlsx');
        } catch (error) {
            console.error("An error occurred during printing.", error);
            setError("An error occurred during printing.", error);
        }
    };


    const loan_word_download = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sale_list_search`, {
                toDate, fromDate, product_id, name, mobile, invoice
            });

            const searchResults = response.data.results;

            // Define columns and headers
            const columns = [
                'SL No.',
                'Full Name',
                'Invoice',
                'Bill Amount',
                'Previous Due',
                'Total Amount',
                'Discount',
                'Paid Amount',
                'Due',
                'Remarks',
                'Sale Date',
                'Created Date',

            ];

            // Create header row
            const headerRow = new TableRow({
                children: columns.map(column => new TableCell({
                    children: [new Paragraph({ text: column, bold: true })],
                    borders: {},
                })),
            });

            // Create data rows
            const dataRows = await Promise.all(searchResults.map(async (category, index) => {



                // Check and handle missing or undefined amount
                const paid_amount = category.paid_amount != null ? `${category.paid_amount}` : ''; // Ensures amount is treated as text and avoids null/undefined
                const previous_due = category.previous_due != null ? `${category.previous_due}` : ''; // Ensures amount is treated as text and avoids null/undefined
                const payable_amount = category.payable_amount != null ? `${category.payable_amount}` : ''; // Ensures amount is treated as text and avoids null/undefined
                const discount = category.discount != null ? `${category.discount}` : ''; // Ensures amount is treated as text and avoids null/undefined
                const total_amount = category.total_amount != null ? `${category.total_amount}` : ''; // Ensures amount is treated as text and avoids null/undefined
                const due = category.due != null ? `${category.due}` : ''; // Ensures amount is treated as text and avoids null/undefined
                const invoice_id = category.invoice_id != null ? `${category.invoice_id}` : ''; // Ensures amount is treated as text and avoids null/undefined

                return new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ text: `${index + 1}` })], // SL No.
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: category.full_name ? `${category.full_name}` : '' })], // Name
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: invoice_id })], // Email
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: total_amount })], // Email
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: previous_due })], // Contact Number
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: payable_amount })], // Contact Number
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: discount })], // Contact Number
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: paid_amount })], // Contact Number
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: due })], // Contact Number
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: category.remarks })], // Contact Number
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: category.sale_date.slice(0, 10) || '' })], // Contact Number
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: category.created_date.slice(0, 10) || '' })], // Contact Number
                            borders: {},
                        }),



                    ],
                });
            }));

            const table = new Table({
                rows: [headerRow, ...dataRows],
                width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                },
                columnWidths: columns.map(() => 100 / columns.length),
            });

            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun("Sale List")
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
            link.download = 'sale.docx';
            link.click();
        } catch (error) {
            console.error("An error occurred during printing.", error);
            setError("An error occurred during printing.", error);
        }
    };




    const sale_print_single = async (id) => {
        try {
            // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
            const singleSale = loanAll.find(loan => loan.id == id)

            const searchResults = singleSale;

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

            console.log(zoomMultiplier)

            // Get the selected font size value
            const selectedFontSize = document.querySelector('.font_size').value;

            // Get the numeric part of the selected font size value
            const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;
            const extraColumnValue = parseInt(document.getElementById('extra_column').value);

            const printWindow = window.open('', '_blank');
            printWindow.document.open();

            const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sale_list_print_single`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults, orientation, fontSize, selectedPrintSize, extraColumnValue
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


    const sale_pdf_download_single = async (id) => {

        // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
        const singleSale = loanAll.find(loan => loan.id == id)

        const searchResults = singleSale;

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


        console.log(searchResults)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sale_list_pdf_single`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults, orientation, fontSize, selectedPrintSize
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
            a.download = 'purchase_pdf.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            setErrorr(error.message);
        } finally {
            // setLoading(false);
        }
    };


    const sale_print_all = async () => {
        if (!fromDate) {
            alert('Enter a from date')
            return
        }
        // if( !toDate){
        //     alert('Enter a date')
        //     return
        // }
        try {
            // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sale_list_search`, {
                toDate, fromDate, product_id, name, mobile, invoice
            });

            const searchResults = response.data.results;

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

            console.log(zoomMultiplier)

            // Get the selected font size value
            const selectedFontSize = document.querySelector('.font_size').value;

            // Get the numeric part of the selected font size value
            const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;
            const extraColumnValue = parseInt(document.getElementById('extra_column').value);

            const printWindow = window.open('', '_blank');
            printWindow.document.open();

            const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sale_list_print_all`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults, orientation, fontSize, selectedPrintSize, extraColumnValue
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




    const sale_invoice_print_single = async (id, selectedFontSize, selectedPrintSize) => {
        try {
            // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
            const singleSale = loanAll.find(loan => loan.id == id)

            const searchResults = singleSale;

            console.log(searchResults);
            console.log(selectedPrintSize, selectedFontSize);


            // const selectedPrintSize = document.getElementById('print_sizes').value;

            // // Get the selected font size value
            // const selectedFontSize = document.querySelector('.font_sizes').value;

            // Get the numeric part of the selected font size value

            const printWindow = window.open('', '_blank');
            printWindow.document.open();
            // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sale_invoice_print_single
            const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sale_invoice_print_single`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults, selectedFontSize, selectedPrintSize,
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

    const sale_print_all_invoice = async () => {
        try {
            // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
            const singleSale = loanAll

            const searchResults = singleSale;

            console.log(searchResults);



            const selectedPrintSize = document.getElementById('print_size').value;

            // Get the selected font size value
            const selectedFontSize = document.querySelector('.font_size').value;

            // Get the numeric part of the selected font size value

            const printWindow = window.open('', '_blank');
            printWindow.document.open();
            // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sale_invoice_print_single
            const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sale_print_all_invoice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults, selectedFontSize, selectedPrintSize,
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


    const sale_invoice_pdf_download_single = async (id, selectedFontSize, selectedPrintSize) => {

        // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
        const singleSale = loanAll.find(loan => loan.id == id)

        const searchResults = singleSale;

        console.log(searchResults);


        // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sale_invoice_pdf_download_single
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sale_invoice_pdf_download_single`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults, selectedPrintSize, selectedFontSize
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
            a.download = 'purchase_pdf.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            setErrorr(error.message);
        } finally {
            // setLoading(false);
        }
    };


    const [printSize, setPrintSize] = useState("A4");
    const [fontSize, setFontSize] = useState("");

    const handlePrintSizeChange = (e) => {
        const selectedPrintSize = e.target.value;
        setPrintSize(selectedPrintSize);

        // Automatically set the font size based on print size
        if (selectedPrintSize === "80mm") {
            setFontSize("12px");
        } else if (selectedPrintSize === "57mm") {
            setFontSize("8px");
        }
    };

    const handleFontSizeChange = (e) => {
        setFontSize(e.target.value);
    };




    const [openDropdownIds, setOpenDropdownIds] = useState(null); // Track which dropdown is open

    // Toggle the dropdown for a specific loan
    const toggleDropdowns = (id) => {
        setOpenDropdownIds((prevId) => (prevId === id ? null : id)); // Toggle the dropdown for the specific ID
    };

    // Close dropdown if the user clicks outside
    const handleClickOutside = (event) => {
        if (!event.target.closest('.dropdown')) {
            setOpenDropdownIds(null); // Close all dropdowns when clicking outside
        }
    };

    // Add event listener for click outside
    useEffect(() => {
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const [openDropdownIdss, setOpenDropdownIdss] = useState(null); // Track which dropdown is open

    // Toggle the dropdown for a specific loan
    const toggleDropdownss = (id) => {
        setOpenDropdownIdss((prevId) => (prevId === id ? null : id)); // Toggle the dropdown for the specific ID
    };

    // Close dropdown if the user clicks outside
    const handleClickOutsidess = (event) => {
        if (!event.target.closest('.dropdownss')) {
            setOpenDropdownIdss(null); // Close all dropdowns when clicking outside
        }
    };

    // Add event listener for click outside
    useEffect(() => {
        window.addEventListener('click', handleClickOutsidess);
        return () => {
            window.removeEventListener('click', handleClickOutsidess);
        };
    }, []);

    const [openDropdownId, setOpenDropdownId] = useState(null); // Track which dropdown is open

    // Toggle the dropdown for a specific loan
    const toggleDropdown = (id) => {
        setOpenDropdownId((prevId) => (prevId === id ? null : id)); // Toggle the dropdown for the specific ID
    };

    // Close dropdown if the user clicks outside
    const handleClickOutsides = (event) => {
        if (!event.target.closest('.dropdowns')) {
            setOpenDropdownId(null); // Close all dropdowns when clicking outside
        }
    };

    // Add event listener for click outside
    useEffect(() => {
        window.addEventListener('click', handleClickOutsides);
        return () => {
            window.removeEventListener('click', handleClickOutsides);
        };
    }, []);



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
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Sale Search</h5>
                                </div>
                                <div className="card-body">
                                    <form >
                                        <div className="col-md-10 offset-md-1">
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
                                            <div className="form-group row">
                                                <label className="col-form-label col-md-2"><strong>Full Name</strong></label>
                                                <div className="col-md-4">
                                                    <input type="text" name="name"
                                                        value={name} onChange={(e) => setname(e.target.value)}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter Full Name'

                                                    />



                                                </div>
                                                <label className="col-form-label col-md-2"><strong>Product Name:</strong></label>
                                                <div className="col-md-4">
                                                    <input type="text" name="product_name"
                                                        value={product_id} onChange={(e) => setProduct_id(e.target.value)}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter Product Name'

                                                    />
                                                    {/* <select
                                                        value={product_id} onChange={(e) => setProduct_id(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero"
                                                    >
                                                        <option value="">Select Product Name</option>
                                                        {
                                                            products.map(sta =>
                                                                <>

                                                                    <option value={sta.id}>{sta.product_name}</option>
                                                                </>

                                                            )
                                                        }

                                                    </select> */}

                                                </div>
                                            </div>

                                            <div className="form-group row">

                                                <label className="col-form-label col-md-2"><strong>Mobile:</strong></label>
                                                <div className="col-md-4">
                                                    <input type="text" name="loan_reason"
                                                        value={mobile} onChange={(e) => setMobile(e.target.value)}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter Mobile'

                                                    />
                                                </div>
                                                <label className="col-form-label col-md-2"><strong>Invoice:</strong></label>
                                                <div className="col-md-4">
                                                    <input type="text" name="loan_reason"
                                                        value={invoice} onChange={(e) => setInvoice(e.target.value)}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter  Invoice'

                                                    />
                                                </div>


                                            </div>
                                            <div className="form-group row">


                                            </div>


                                            <div class="form-group row student d-none">
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

                                                <label class="col-form-label font-weight-bold col-md-2">Print/PDF Properties:</label>
                                                <div class="col-md-10">
                                                    <div class="input-group ">
                                                        <select
                                                            value={printSize}
                                                            onChange={handlePrintSizeChange}
                                                            name="print_size" class="form-control form-control-sm  trim integer_no_zero print_size" id="print_size">
                                                            <option value="A4">A4 </option>
                                                            <option value="legal">legal </option>
                                                            <option value="A3">A3 </option>
                                                            <option value="">Browser/Portrait(PDF) </option>
                                                            <option value="80mm">80 MM</option>
                                                            <option value="57mm">57 MM </option>
                                                        </select>
                                                        <select name="print_layout" class="form-control form-control-sm  trim integer_no_zero print_layout" id="print_layout">

                                                            <option value="portrait">Portrait</option>
                                                            <option value="landscape">Landscape</option>
                                                            <option value="">Browser/Portrait(PDF) </option>
                                                        </select>
                                                        <select
                                                            value={fontSize}
                                                            onChange={handleFontSizeChange}
                                                            class=" form-control form-control-sm   integer_no_zero student_type font_size">
                                                            <option value="font-12">Font Standard</option>
                                                            <option value="font-10">Font Small</option>
                                                            <option value="12px">Font 12 px</option>
                                                            <option value="8px">Font 8 px</option>

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
                                        <div className="form-group row">
                                            <div className="offset-md-2 col-md-8 float-left">
                                                <input type="button" name="search" className="btn btn-sm btn-info" value="Search"
                                                    onClick={loan_search}
                                                />
                                                <input
                                                    onClick={loan_pdf_download}
                                                    type="button" name="summary" class="btn btn-sm btn-secondary print_summary ml-2" value="Download PDF" />
                                                <input
                                                    onClick={loan_excel_download}
                                                    type="button" name="summary" class="btn btn-sm btn-primary print_summary ml-2" value="Download Excel" />
                                                <input
                                                    onClick={loan_word_download}

                                                    type="button" name="summary" class="btn btn-sm btn-danger print_summary ml-2" value="Download Word" />
                                                <input
                                                    onClick={loan_print}
                                                    type="button" name="print" class="btn btn-sm btn-success print_btn ml-2" value="Print" />
                                                <input
                                                    onClick={sale_print_all}
                                                    type="button" name="downlaod" class="btn btn-sm btn-dark downlaod_btn ml-2" value="All Print" />
                                                <input
                                                    onClick={sale_print_all_invoice}
                                                    type="button" name="downlaod" class="ml-2 btn btn-sm btn-dark downlaod_btn" value="Invoice All Print" />
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
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">List Sale</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/sales/sales_create?page_group`} className="btn btn-sm btn-info">Sale Create</Link>
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


                                        <>
                                            <div class="card-body">
                                                <div className='table-responsive'>
                                                    <div className=" d-flex justify-content-between">
                                                        <table className="table  table-bordered table-hover table-striped table-sm">
                                                            <thead>

                                                                <tr>
                                                                    <th>

                                                                        SL No.
                                                                    </th>
                                                                    <th>
                                                                        Name
                                                                    </th>
                                                                    <th>
                                                                        Invoice
                                                                    </th>
                                                                    <th>
                                                                        Bill Amount
                                                                    </th>

                                                                    <th>
                                                                        Previous Due
                                                                    </th>
                                                                    <th>
                                                                        Total Amount
                                                                    </th>
                                                                    <th>
                                                                        Discount
                                                                    </th>
                                                                    <th>
                                                                        Paid Amount
                                                                    </th>
                                                                    <th>
                                                                        Due
                                                                    </th>
                                                                    <th>
                                                                        Remarks
                                                                    </th>
                                                                    <th>
                                                                        Sale Date
                                                                    </th>
                                                                    <th>
                                                                        Sale By/Date
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
                                                                    searchResults.map((loan, i) => (
                                                                        <tr key={loan.id}>
                                                                            <td>    {i + 1}</td>
                                                                            <td>    {loan.full_name}</td>
                                                                            <td>    {loan.invoice_id}</td>
                                                                            <td>     {loan.total_amount}</td>
                                                                            <td>     {loan.previous_due}</td>
                                                                            <td>    {loan.payable_amount}</td>
                                                                            <td>    {loan.discount}</td>
                                                                            <td>    {loan.paid_amount}</td>
                                                                            <td>    {loan.due}</td>
                                                                            <td>    {loan.remarks}</td>
                                                                            <td>    {loan.sale_date.slice(0, 10)}</td>
                                                                            <td>    {loan.created_by} <br /> {loan.created_date.slice(0, 10)}</td>


                                                                            <td>

                                                                                <div className="flex items-center ">
                                                                                    <Link href={`/Admin/sales/sales_edit/${loan.id}?page_group=${page_group}`}>
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

                                                                                    {filteredBtnIconDelete.map((filteredBtnIconDelete => (
                                                                                        <button
                                                                                            key={filteredBtnIconDelete.id}
                                                                                            title='Delete'
                                                                                            onClick={() => loan_delete(loan.id)}
                                                                                            style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                            className={filteredBtnIconDelete?.btn}
                                                                                        >
                                                                                            <a
                                                                                                dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
                                                                                            ></a>
                                                                                        </button>
                                                                                    )))}







                                                                                    {filteredBtnIconInvoice.map((pdf => (
                                                                                        <div className="dropdownss" style={{ position: "relative", display: "inline-block" }} key={loan.id}>
                                                                                            <button
                                                                                                onClick={() => toggleDropdownss(loan.id)} // Use loan.id to toggle the specific dropdown
                                                                                                title="Print Invoice"
                                                                                                style={{ marginTop: '5px', marginLeft: '5px' }}
                                                                                                className='btn btn-sm btn-success'
                                                                                            >
                                                                                                <a
                                                                                                    dangerouslySetInnerHTML={{ __html: pdf?.icon }}
                                                                                                ></a> Invoice <i class="fas fa-angle-down"></i>
                                                                                            </button>

                                                                                            {openDropdownIdss === loan.id && ( // Show dropdown only for the currently open loan.id
                                                                                                <div
                                                                                                    className="dropdown-menu show"
                                                                                                    style={{
                                                                                                        position: "absolute",
                                                                                                        top: "0px",
                                                                                                        left: "-156px",
                                                                                                        padding: '10px', // Adjust to move the dropdown to the left
                                                                                                        width: "100px",
                                                                                                        zIndex: 1000,
                                                                                                        background: "#fff",
                                                                                                        border: "1px solid #ddd",
                                                                                                        borderRadius: "5px",
                                                                                                    }}
                                                                                                >
                                                                                                    {filteredBtnIconPrint.map((pdf => (
                                                                                                        <button
                                                                                                            key={pdf.id}
                                                                                                            onClick={() => sale_print_single(loan.id)}
                                                                                                            title='Print'
                                                                                                            style={{ width: '100%', }}
                                                                                                            className={pdf?.btn}
                                                                                                        >
                                                                                                            Print
                                                                                                        </button>
                                                                                                    )))}
                                                                                                    {filteredBtnIconPDF.map((pdf => (
                                                                                                        <button
                                                                                                            key={pdf.id}
                                                                                                            title='PDF'
                                                                                                            onClick={() => sale_pdf_download_single(loan.id)}
                                                                                                            style={{ width: '100%', marginTop: '10px' }}
                                                                                                            className={pdf?.btn}
                                                                                                        >
                                                                                                            PDF
                                                                                                        </button>
                                                                                                    )))}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    )))}


                                                                                    {/* {filteredBtnIconInvoicePDF.map((pdf => (
                                                                                        <button
                                                                                            key={pdf.id}
                                                                                            title='PDF Invoice'
                                                                                            onClick={() => sale_invoice_pdf_download_single(loan.id)}
                                                                                            style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                            className={pdf?.btn}
                                                                                        >
                                                                                            <a
                                                                                                dangerouslySetInnerHTML={{ __html: pdf?.icon }}
                                                                                            ></a>
                                                                                        </button>
                                                                                    )))}
                                                                                    {filteredBtnIconInvoicePrint.map((pdf => (
                                                                                        <button
                                                                                            key={pdf.id}
                                                                                            onClick={() => sale_invoice_print_single(loan.id)}
                                                                                            title='Print Invoice'
                                                                                            style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                            className={pdf?.btn}
                                                                                        >
                                                                                            <a
                                                                                                dangerouslySetInnerHTML={{ __html: pdf?.icon }}
                                                                                            ></a>
                                                                                        </button>
                                                                                    )))} */}
                                                                                    {filteredBtnIconInvoicePDF.map((pdf) => (
                                                                                        <div className="dropdown" style={{ position: "relative", display: "inline-block" }} key={loan.id}>
                                                                                            <button
                                                                                                onClick={() => toggleDropdowns(loan.id)} // Use loan.id to toggle the specific dropdown
                                                                                                title="Print Invoice"
                                                                                                style={{ marginTop: '5px', marginLeft: '5px' }}
                                                                                                className={pdf?.btn}
                                                                                            >
                                                                                                <a
                                                                                                    dangerouslySetInnerHTML={{ __html: pdf?.icon }}
                                                                                                ></a> POS(57 MM) <i class="fas fa-angle-down"></i>
                                                                                            </button>

                                                                                            {openDropdownIds === loan.id && ( // Show dropdown only for the currently open loan.id
                                                                                                <div
                                                                                                    className="dropdown-menu show"
                                                                                                    style={{
                                                                                                        position: "absolute",
                                                                                                        top: "0px",
                                                                                                        left: "-156px",
                                                                                                        padding: '10px', // Adjust to move the dropdown to the left
                                                                                                        width: "100px",
                                                                                                        zIndex: 1000,
                                                                                                        background: "#fff",
                                                                                                        border: "1px solid #ddd",
                                                                                                        borderRadius: "5px",
                                                                                                    }}
                                                                                                >
                                                                                                    <button
                                                                                                        style={{ width: '100%' }}
                                                                                                        className='btn btn-sm btn-success'
                                                                                                        onClick={() => sale_invoice_print_single(loan.id, '8px', '57mm')}
                                                                                                    >
                                                                                                        Print
                                                                                                    </button>
                                                                                                    <button
                                                                                                        onClick={() => sale_invoice_pdf_download_single(loan.id, '8px', '57mm')}
                                                                                                        className='btn btn-sm btn-info'
                                                                                                        style={{ width: '100%', marginTop: '10px' }}
                                                                                                    >
                                                                                                        PDF
                                                                                                    </button>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    ))}
                                                                                    {/* {filteredBtnIconInvoicePrint.map((pdf => (
                                                                                <button
                                                                                    key={pdf.id}
                                                                                    onClick={() => sale_invoice_print_single(loan.id)}
                                                                                    title='Print Invoice'
                                                                                    style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                    className={pdf?.btn}
                                                                                >
                                                                                    <a
                                                                                        dangerouslySetInnerHTML={{ __html: pdf?.icon }}
                                                                                    ></a>
                                                                                </button>
                                                                            )))}
                                                                            */}
                                                                                    {filteredBtnIconInvoicePrint.map((pdf) => (
                                                                                        <div className='dropdowns' style={{ position: "relative", display: "inline-block" }} key={loan.id}>
                                                                                            <button
                                                                                                onClick={() => toggleDropdown(loan.id)} // Use loan.id to toggle the specific dropdown
                                                                                                title="Print Invoice"
                                                                                                style={{ marginTop: '5px', marginLeft: '5px' }}
                                                                                                className={pdf?.btn}
                                                                                            >
                                                                                                <a
                                                                                                    dangerouslySetInnerHTML={{ __html: pdf?.icon }}
                                                                                                ></a> POS(80 MM) <i class="fas fa-angle-down"></i>
                                                                                            </button>

                                                                                            {openDropdownId === loan.id && ( // Show dropdown only for the currently open loan.id
                                                                                                <div
                                                                                                    className="dropdown-menu show"
                                                                                                    style={{
                                                                                                        position: "absolute",
                                                                                                        top: "0px",
                                                                                                        left: "-156px",
                                                                                                        padding: '10px', // Adjust to move the dropdown to the left
                                                                                                        width: "150px",
                                                                                                        zIndex: 1000,
                                                                                                        background: "#fff",
                                                                                                        border: "1px solid #ddd",
                                                                                                        borderRadius: "5px",
                                                                                                    }}
                                                                                                >
                                                                                                    <button
                                                                                                        style={{ width: '100%' }}
                                                                                                        className='btn btn-sm btn-success'
                                                                                                        onClick={() => sale_invoice_print_single(loan.id, '12px', '80mm')}
                                                                                                    >
                                                                                                        Print
                                                                                                    </button>
                                                                                                    <button
                                                                                                        style={{ width: '100%', marginTop: '10px' }}
                                                                                                        onClick={() => sale_invoice_pdf_download_single(loan.id, '12px', '80mm')}
                                                                                                        className='btn btn-sm btn-info'
                                                                                                    >
                                                                                                        PDF
                                                                                                    </button>

                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    ))}

                                                                                </div></td>
                                                                        </tr>
                                                                    )

                                                                    )



                                                                }
                                                            </tbody>

                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (



                                        <div class="card-body">
                                            <div className='table-responsive'>
                                                <div className=" d-flex justify-content-between">
                                                    <div>
                                                        Total Data: {totalData}
                                                    </div>
                                                    <div class="pagination float-right pagination-sm border">
                                                        {
                                                            currentPage - 3 >= 1 && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/sales/sales_all?page=${1}`}>‹ First</Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage > 1 && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/sales/sales_all?page=${activePage - 1}`}>&lt;</Link>
                                                            )
                                                        }
                                                        {
                                                            pageNumber.map((page) =>
                                                                <Link
                                                                    key={page}
                                                                    href={`/Admin/sales/sales_all?page=${page}`}
                                                                    className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                                                                > {page}
                                                                </Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage < totalPages && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/sales/sales_all?page=${activePage + 1}`}>&gt;</Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage + 3 <= totalPages && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/sales/sales_all?page=${totalPages}`}>Last ›</Link>
                                                            )
                                                        }
                                                    </div>

                                                </div>
                                                <table className="table  table-bordered table-hover table-striped table-sm">
                                                    <thead>

                                                        <tr>
                                                            <th>

                                                                SL No.
                                                            </th>
                                                            <th>
                                                                Name
                                                            </th>
                                                            <th>
                                                                Invoice
                                                            </th>
                                                            <th>
                                                                Bill Amount
                                                            </th>

                                                            <th>
                                                                Previous Due
                                                            </th>
                                                            <th>
                                                                Total Amount
                                                            </th>
                                                            <th>
                                                                Discount
                                                            </th>
                                                            <th>
                                                                Paid Amount
                                                            </th>
                                                            <th>
                                                                Due
                                                            </th>
                                                            <th>
                                                                Remarks
                                                            </th>
                                                            <th>
                                                                Sale Date
                                                            </th>
                                                            <th>
                                                                Sale By/Date
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
                                                            pageUsers.map((loan, i) => (
                                                                <tr key={loan.id}>
                                                                    <td>    {i + 1}</td>
                                                                    <td>    {loan.full_name}</td>
                                                                    <td>    {loan.invoice_id}</td>
                                                                    <td>     {loan.total_amount}</td>
                                                                    <td>     {loan.previous_due}</td>
                                                                    <td>    {loan.payable_amount}</td>
                                                                    <td>    {loan.discount}</td>
                                                                    <td>    {loan.paid_amount}</td>
                                                                    <td>    {loan.due}</td>
                                                                    <td>    {loan.remarks}</td>
                                                                    <td>    {loan.sale_date.slice(0, 10)}</td>
                                                                    <td>    {loan.created_by} <br /> {loan.created_date.slice(0, 10)}</td>

                                                                    <td>

                                                                        <div className="flex items-center ">
                                                                            <Link href={`/Admin/sales/sales_edit/${loan.id}?page_group=${page_group}`}>
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
                                                                            {/* <Link href={`/Admin/loan/loan_copy/${loan.id}?page_group=${page_group}`}>
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
                                                                    </Link> */}
                                                                            {filteredBtnIconDelete.map((filteredBtnIconDelete => (
                                                                                <button
                                                                                    key={filteredBtnIconDelete.id}
                                                                                    title='Delete'
                                                                                    onClick={() => loan_delete(loan.id)}
                                                                                    style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                    className={filteredBtnIconDelete?.btn}
                                                                                >
                                                                                    <a
                                                                                        dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
                                                                                    ></a>
                                                                                </button>
                                                                            )))}
                                                                            {/* {filteredBtnIconPDF.map((pdf => (
                                                                                <button
                                                                                    key={pdf.id}
                                                                                    title='PDF'
                                                                                    onClick={() => sale_pdf_download_single(loan.id)}
                                                                                    style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                    className={pdf?.btn}
                                                                                >
                                                                                    <a
                                                                                        dangerouslySetInnerHTML={{ __html: pdf?.icon }}
                                                                                    ></a>
                                                                                </button>
                                                                            )))}
                                                                            {filteredBtnIconPrint.map((pdf => (
                                                                                <button
                                                                                    key={pdf.id}
                                                                                    onClick={() => sale_print_single(loan.id)}
                                                                                    title='Print'
                                                                                    style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                    className={pdf?.btn}
                                                                                >
                                                                                    <a
                                                                                        dangerouslySetInnerHTML={{ __html: pdf?.icon }}
                                                                                    ></a>
                                                                                </button>
                                                                            )))} */}
                                                                            {/* {filteredBtnIconInvoicePrint.map((pdf => (
                                                                                <button
                                                                                    key={pdf.id}
                                                                                    onClick={() => sale_invoice_print_single(loan.id)}
                                                                                    title='Print Invoice'
                                                                                    style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                    className={pdf?.btn}
                                                                                >
                                                                                    <a
                                                                                        dangerouslySetInnerHTML={{ __html: pdf?.icon }}
                                                                                    ></a>
                                                                                </button>
                                                                            )))}
                                                                            */}
                                                                            {/* <div className="dropdownss" style={{ position: "relative", display: "inline-block" }} key={loan.id}>
                                                                                <button
                                                                                    onClick={() => toggleDropdownss(loan.id)} // Use loan.id to toggle the specific dropdown
                                                                                    title="Print Invoice"
                                                                                    style={{ marginTop: '5px', marginLeft: '5px' }}
                                                                                    className='btn btn-sm btn-success'
                                                                                >
                                                                                    Print/Pdf(Portrait)
                                                                                </button>

                                                                                {openDropdownIdss === loan.id && ( // Show dropdown only for the currently open loan.id
                                                                                    <div
                                                                                        className="dropdown-menu show"
                                                                                        style={{
                                                                                            position: "absolute",
                                                                                            top: "0px",
                                                                                            left: "-156px",
                                                                                            padding: '10px', // Adjust to move the dropdown to the left
                                                                                            width: "100px",
                                                                                            zIndex: 1000,
                                                                                            background: "#fff",
                                                                                            border: "1px solid #ddd",
                                                                                            borderRadius: "5px",
                                                                                        }}
                                                                                    >
                                                                                        {filteredBtnIconPrint.map((pdf => (
                                                                                            <button
                                                                                                key={pdf.id}
                                                                                                onClick={() => sale_print_single(loan.id)}
                                                                                                title='Print'
                                                                                                style={{ width: '100%', }}
                                                                                                className={pdf?.btn}
                                                                                            >
                                                                                                <a
                                                                                                    dangerouslySetInnerHTML={{ __html: pdf?.icon }}
                                                                                                ></a>
                                                                                            </button>
                                                                                        )))}
                                                                                        {filteredBtnIconPDF.map((pdf => (
                                                                                            <button
                                                                                                key={pdf.id}
                                                                                                title='PDF'
                                                                                                onClick={() => sale_pdf_download_single(loan.id)}
                                                                                                style={{ width: '100%', marginTop: '10px' }}
                                                                                                className={pdf?.btn}
                                                                                            >
                                                                                                <a
                                                                                                    dangerouslySetInnerHTML={{ __html: pdf?.icon }}
                                                                                                ></a>
                                                                                            </button>
                                                                                        )))}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            {filteredBtnIconInvoicePDF.map((pdf) => (
                                                                                <div className="dropdown" style={{ position: "relative", display: "inline-block" }} key={loan.id}>
                                                                                    <button
                                                                                        onClick={() => toggleDropdowns(loan.id)} // Use loan.id to toggle the specific dropdown
                                                                                        title="Print Invoice"
                                                                                        style={{ marginTop: '5px', marginLeft: '5px' }}
                                                                                        className={pdf?.btn}
                                                                                    >
                                                                                        {pdf?.icon}
                                                                                    </button>

                                                                                    {openDropdownIds === loan.id && ( // Show dropdown only for the currently open loan.id
                                                                                        <div
                                                                                            className="dropdown-menu show"
                                                                                            style={{
                                                                                                position: "absolute",
                                                                                                top: "0px",
                                                                                                left: "-156px",
                                                                                                padding: '10px', // Adjust to move the dropdown to the left
                                                                                                width: "100px",
                                                                                                zIndex: 1000,
                                                                                                background: "#fff",
                                                                                                border: "1px solid #ddd",
                                                                                                borderRadius: "5px",
                                                                                            }}
                                                                                        >
                                                                                            <button
                                                                                                style={{ width: '100%' }}
                                                                                                className='btn btn-sm btn-success'
                                                                                                onClick={() => sale_invoice_print_single(loan.id, '8px', '57mm')}
                                                                                            >
                                                                                                Print Invoice
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={() => sale_invoice_pdf_download_single(loan.id, '8px', '57mm')}
                                                                                                className='btn btn-sm btn-danger'
                                                                                                style={{ width: '100%', marginTop: '10px' }}
                                                                                            >
                                                                                                Pdf Invoice
                                                                                            </button>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                           
                                                                            {filteredBtnIconInvoicePrint.map((pdf) => (
                                                                                <div className='dropdowns' style={{ position: "relative", display: "inline-block" }} key={loan.id}>
                                                                                    <button
                                                                                        onClick={() => toggleDropdown(loan.id)} // Use loan.id to toggle the specific dropdown
                                                                                        title="Print Invoice"
                                                                                        style={{ marginTop: '5px', marginLeft: '5px' }}
                                                                                        className={pdf?.btn}
                                                                                    >
                                                                                        {pdf?.icon}
                                                                                    </button>

                                                                                    {openDropdownId === loan.id && ( // Show dropdown only for the currently open loan.id
                                                                                        <div
                                                                                            className="dropdown-menu show"
                                                                                            style={{
                                                                                                position: "absolute",
                                                                                                top: "0px",
                                                                                                left: "-156px",
                                                                                                padding: '10px', // Adjust to move the dropdown to the left
                                                                                                width: "150px",
                                                                                                zIndex: 1000,
                                                                                                background: "#fff",
                                                                                                border: "1px solid #ddd",
                                                                                                borderRadius: "5px",
                                                                                            }}
                                                                                        >
                                                                                            <button
                                                                                                style={{ width: '100%' }}
                                                                                                className='btn btn-sm btn-success'
                                                                                                onClick={() => sale_invoice_print_single(loan.id, '12px', '80mm')}
                                                                                            >
                                                                                                Print Invoice
                                                                                            </button>
                                                                                            <button
                                                                                                style={{ width: '100%', marginTop: '10px' }}
                                                                                                onClick={() => sale_invoice_pdf_download_single(loan.id, '12px', '80mm')}
                                                                                                className='btn btn-sm btn-danger'
                                                                                            >
                                                                                                Pdf Invoice
                                                                                            </button>

                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ))} */}

                                                                            {filteredBtnIconInvoice.map((pdf => (
                                                                                <div className="dropdownss" style={{ position: "relative", display: "inline-block" }} key={loan.id}>
                                                                                    <button
                                                                                        onClick={() => toggleDropdownss(loan.id)} // Use loan.id to toggle the specific dropdown
                                                                                        title="Print Invoice"
                                                                                        style={{ marginTop: '5px', marginLeft: '5px' }}
                                                                                        className='btn btn-sm btn-success'
                                                                                    >
                                                                                        <a
                                                                                            dangerouslySetInnerHTML={{ __html: pdf?.icon }}
                                                                                        ></a> Invoice <i class="fas fa-angle-down"></i>
                                                                                    </button>

                                                                                    {openDropdownIdss === loan.id && ( // Show dropdown only for the currently open loan.id
                                                                                        <div
                                                                                            className="dropdown-menu show"
                                                                                            style={{
                                                                                                position: "absolute",
                                                                                                top: "0px",
                                                                                                left: "-156px",
                                                                                                padding: '10px', // Adjust to move the dropdown to the left
                                                                                                width: "100px",
                                                                                                zIndex: 1000,
                                                                                                background: "#fff",
                                                                                                border: "1px solid #ddd",
                                                                                                borderRadius: "5px",
                                                                                            }}
                                                                                        >
                                                                                            {filteredBtnIconPrint.map((pdf => (
                                                                                                <button
                                                                                                    key={pdf.id}
                                                                                                    onClick={() => sale_print_single(loan.id)}
                                                                                                    title='Print'
                                                                                                    style={{ width: '100%', }}
                                                                                                    className={pdf?.btn}
                                                                                                >
                                                                                                    Print
                                                                                                </button>
                                                                                            )))}
                                                                                            {filteredBtnIconPDF.map((pdf => (
                                                                                                <button
                                                                                                    key={pdf.id}
                                                                                                    title='PDF'
                                                                                                    onClick={() => sale_pdf_download_single(loan.id)}
                                                                                                    style={{ width: '100%', marginTop: '10px' }}
                                                                                                    className={pdf?.btn}
                                                                                                >
                                                                                                    PDF
                                                                                                </button>
                                                                                            )))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )))}


                                                                            {/* {filteredBtnIconInvoicePDF.map((pdf => (
                                                                                        <button
                                                                                            key={pdf.id}
                                                                                            title='PDF Invoice'
                                                                                            onClick={() => sale_invoice_pdf_download_single(loan.id)}
                                                                                            style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                            className={pdf?.btn}
                                                                                        >
                                                                                            <a
                                                                                                dangerouslySetInnerHTML={{ __html: pdf?.icon }}
                                                                                            ></a>
                                                                                        </button>
                                                                                    )))}
                                                                                    {filteredBtnIconInvoicePrint.map((pdf => (
                                                                                        <button
                                                                                            key={pdf.id}
                                                                                            onClick={() => sale_invoice_print_single(loan.id)}
                                                                                            title='Print Invoice'
                                                                                            style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                            className={pdf?.btn}
                                                                                        >
                                                                                            <a
                                                                                                dangerouslySetInnerHTML={{ __html: pdf?.icon }}
                                                                                            ></a>
                                                                                        </button>
                                                                                    )))} */}
                                                                            {filteredBtnIconInvoicePDF.map((pdf) => (
                                                                                <div className="dropdown" style={{ position: "relative", display: "inline-block" }} key={loan.id}>
                                                                                    <button
                                                                                        onClick={() => toggleDropdowns(loan.id)} // Use loan.id to toggle the specific dropdown
                                                                                        title="Print Invoice"
                                                                                        style={{ marginTop: '5px', marginLeft: '5px' }}
                                                                                        className={pdf?.btn}
                                                                                    >
                                                                                        <a
                                                                                            dangerouslySetInnerHTML={{ __html: pdf?.icon }}
                                                                                        ></a> POS(57 MM) <i class="fas fa-angle-down"></i>
                                                                                    </button>

                                                                                    {openDropdownIds === loan.id && ( // Show dropdown only for the currently open loan.id
                                                                                        <div
                                                                                            className="dropdown-menu show"
                                                                                            style={{
                                                                                                position: "absolute",
                                                                                                top: "0px",
                                                                                                left: "-156px",
                                                                                                padding: '10px', // Adjust to move the dropdown to the left
                                                                                                width: "100px",
                                                                                                zIndex: 1000,
                                                                                                background: "#fff",
                                                                                                border: "1px solid #ddd",
                                                                                                borderRadius: "5px",
                                                                                            }}
                                                                                        >
                                                                                            <button
                                                                                                style={{ width: '100%' }}
                                                                                                className='btn btn-sm btn-success'
                                                                                                onClick={() => sale_invoice_print_single(loan.id, '8px', '57mm')}
                                                                                            >
                                                                                                Print
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={() => sale_invoice_pdf_download_single(loan.id, '8px', '57mm')}
                                                                                                className='btn btn-sm btn-info'
                                                                                                style={{ width: '100%', marginTop: '10px' }}
                                                                                            >
                                                                                                PDF
                                                                                            </button>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                            {/* {filteredBtnIconInvoicePrint.map((pdf => (
                                                                                <button
                                                                                    key={pdf.id}
                                                                                    onClick={() => sale_invoice_print_single(loan.id)}
                                                                                    title='Print Invoice'
                                                                                    style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                    className={pdf?.btn}
                                                                                >
                                                                                    <a
                                                                                        dangerouslySetInnerHTML={{ __html: pdf?.icon }}
                                                                                    ></a>
                                                                                </button>
                                                                            )))}
                                                                            */}
                                                                            {filteredBtnIconInvoicePrint.map((pdf) => (
                                                                                <div className='dropdowns' style={{ position: "relative", display: "inline-block" }} key={loan.id}>
                                                                                    <button
                                                                                        onClick={() => toggleDropdown(loan.id)} // Use loan.id to toggle the specific dropdown
                                                                                        title="Print Invoice"
                                                                                        style={{ marginTop: '5px', marginLeft: '5px' }}
                                                                                        className={pdf?.btn}
                                                                                    >
                                                                                        <a
                                                                                            dangerouslySetInnerHTML={{ __html: pdf?.icon }}
                                                                                        ></a> POS(80 MM) <i class="fas fa-angle-down"></i>
                                                                                    </button>

                                                                                    {openDropdownId === loan.id && ( // Show dropdown only for the currently open loan.id
                                                                                        <div
                                                                                            className="dropdown-menu show"
                                                                                            style={{
                                                                                                position: "absolute",
                                                                                                top: "0px",
                                                                                                left: "-156px",
                                                                                                padding: '10px', // Adjust to move the dropdown to the left
                                                                                                width: "150px",
                                                                                                zIndex: 1000,
                                                                                                background: "#fff",
                                                                                                border: "1px solid #ddd",
                                                                                                borderRadius: "5px",
                                                                                            }}
                                                                                        >
                                                                                            <button
                                                                                                style={{ width: '100%' }}
                                                                                                className='btn btn-sm btn-success'
                                                                                                onClick={() => sale_invoice_print_single(loan.id, '12px', '80mm')}
                                                                                            >
                                                                                                Print
                                                                                            </button>
                                                                                            <button
                                                                                                style={{ width: '100%', marginTop: '10px' }}
                                                                                                onClick={() => sale_invoice_pdf_download_single(loan.id, '12px', '80mm')}
                                                                                                className='btn btn-sm btn-info'
                                                                                            >
                                                                                                PDF
                                                                                            </button>

                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ))}

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
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/sales/sales_all?page=${1}`}>‹ First</Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage > 1 && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/sales/sales_all?page=${activePage - 1}`}>&lt;</Link>
                                                            )
                                                        }
                                                        {
                                                            pageNumber.map((page) =>
                                                                <Link
                                                                    key={page}
                                                                    href={`/Admin/sales/sales_all?page=${page}`}
                                                                    className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                                                                > {page}
                                                                </Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage < totalPages && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/sales/sales_all?page=${activePage + 1}`}>&gt;</Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage + 3 <= totalPages && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/sales/sales_all?page=${totalPages}`}>Last ›</Link>
                                                            )
                                                        }
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesLists;