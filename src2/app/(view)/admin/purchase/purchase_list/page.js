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



const PurchaseList = ({ searchParams }) => {


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
    const [supplier_id, setSupplier_id] = useState('')
    const [product_id, setProduct_id] = useState('')
    const [unit_id, setUnit_id] = useState('')
    const [invoice, setInvoice] = useState('')
    const [purchase_types, setPurchase_types] = useState('')
    const [item_name, setItem_name] = useState('')



    const { data: loanAll = [], isLoading, refetch
    } = useQuery({
        queryKey: ['loanAll'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase/purchase_list`)

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
    const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'purchase')

    //   console.log(filteredModuleInfo);


    const filteredBtnIconEdit = brandList.filter(btn =>
        btn.method_sort === 3
    );
    const filteredBtnIconPDF = brandList.filter(btn =>
        btn.method_sort === 13
    );
    const filteredBtnIconPrint = brandList.filter(btn =>
        btn.method_sort === 14
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
        const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase/purchase_all_paigination/${currentPage}/${dataPerPage}`;
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
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase/purchase_delete/${id}`, {
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

    const { data: purchase_type = [],
    } = useQuery({
        queryKey: ['purchase_type'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase/purchase_type_list`)

            const data = await res.json()
            return data
        }
    })

    const loan_search = () => {

        setLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase/purchase_search`, {
            toDate, fromDate, supplier_id, product_id, unit_id, item_name, invoice, purchase_types

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
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase/purchase_search`, {
            toDate, fromDate, supplier_id, product_id, unit_id, item_name, invoice, purchase_types
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase/purchase_pdf`, {
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

    console.log(error)
    console.log(errorr)

    const loan_print = async () => {
        try {
            // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase/purchase_search`, {
                toDate, fromDate, supplier_id, product_id, unit_id, item_name, invoice, purchase_types
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

            const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase/purchase_print`, {
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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase/purchase_search`, {
                toDate, fromDate, supplier_id, product_id, unit_id, item_name, invoice, purchase_types
            });

            const searchResults = response.data.results;




            // Define the columns
            const columns = [
                'SL No.',
                'Supplier Name',
                'Invoice',
                'Bill Amount',
                'Previous Due',
                'Total Amount',
                'Discount',
                'Paid Amount',
                'Due',
                'Remarks',
                'Purchase Date',
                'Created Date',

            ];


            // Filter the data
            const filteredColumns = searchResults.map((category, index) => {
                const filteredData = {
                    'SL No.': index + 1,
                    'Supplier Name': category.supplier_name,
                    'Invoice': category.invoice_id,
                    'Bill Amount': category.total_amount,
                    'Previous Due': category.previous_due,
                    'Payable Amount': category.payable_amount,
                    'Discount': category.discount,
                    'Paid Amount': category.paid_amount,
                    'Due': category.due,
                    'remarks': category.remarks,
                    'Purchase Date': category.purchase_date.slice(0, 10),
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
            XLSX.writeFile(workbook, 'Purchase.xlsx');
        } catch (error) {
            console.error("An error occurred during printing.", error);
            setError("An error occurred during printing.", error);
        }
    };


    const loan_word_download = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase/purchase_search`, {
                toDate, fromDate, supplier_id, product_id, unit_id, item_name, invoice, purchase_types
            });

            const searchResults = response.data.results;

            // Define columns and headers
            const columns = [
                'SL No.',
                'Supplier Name',
                'Invoice',
                'Bill Amount',
                'Previous Due',
                'Total Amount',
                'Discount',
                'Paid Amount',
                'Due',
                'Remarks',
                'Purchase Date',
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
                            children: [new Paragraph({ text: category.supplier_name ? `${category.supplier_name}` : '' })], // Name
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: invoice_id})], // Email
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: total_amount})], // Email
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
                            children: [new Paragraph({ text: category.purchase_date.slice(0,10) || '' })], // Contact Number
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: category.created_date.slice(0,10) || '' })], // Contact Number
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
                                new TextRun("Purchase List")
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
            link.download = 'Purchase.docx';
            link.click();
        } catch (error) {
            console.error("An error occurred during printing.", error);
            setError("An error occurred during printing.", error);
        }
    };




    // const barcode_print = async (id) => {
    //     try {
    //         // Find the productDataFind object by ID
    //         const productDataFind = loanAll.find(loan => loan.id == id);
    //         if (!productDataFind) {
    //             console.error('Product data not found');
    //             return;
    //         }

    //         // Prepare barcodes and quantities
    //         let barcodeData = [];

    //         productDataFind.purchase_product.forEach(purchaseItem => {
    //             const matchedProduct = products.find(productItem => productItem.id == purchaseItem.product_id);
    //             if (matchedProduct) {
    //                 for (let i = 0; i < purchaseItem.quantity; i++) {
    //                     barcodeData.push({
    //                         barcode: matchedProduct.formatted_barcode,
    //                         product_name: matchedProduct.product_name // Assuming `name` holds the product name
    //                     });
    //                 }
    //             }
    //         });

    //         // Log barcode data for debugging
    //         console.log('Barcode Data:', barcodeData);

    //         if (barcodeData.length === 0) {
    //             alert('This is non stock no bar code found')
    //             return
    //         }
    //         // Open a new window for printing
    //         const printWindow = window.open('', '_blank');
    //         printWindow.document.open();

    //         // Send barcode data to your backend or rendering function\
    //         // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/barcode_print_single
    //         const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/barcode_print_single`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 barcodes: barcodeData, selectedValues, selectedValue
    //             }),
    //         });

    //         const htmlText = await html.text();

    //         printWindow.document.write(htmlText);
    //         printWindow.document.close(); // Ensure the document is completely loaded before printing
    //         printWindow.focus();
    //     } catch (error) {
    //         console.error('Error generating print view:', error.message);
    //     }
    // };


    // const barcode_pdf_download = async (id) => {

    //     try {

    //         const productDataFind = loanAll.find(loan => loan.id == id);
    //         if (!productDataFind) {
    //             console.error('Product data not found');
    //             return;
    //         }

    //         // Prepare barcodes and quantities
    //         let barcodeData = [];

    //         productDataFind.purchase_product.forEach(purchaseItem => {
    //             const matchedProduct = products.find(productItem => productItem.id == purchaseItem.product_id);
    //             if (matchedProduct) {
    //                 for (let i = 0; i < purchaseItem.quantity; i++) {
    //                     barcodeData.push({
    //                         barcode: matchedProduct.formatted_barcode,
    //                         product_name: matchedProduct.product_name // Assuming `name` holds the product name
    //                     });
    //                 }
    //             }
    //         });

    //         // Log barcode data for debugging
    //         console.log('Barcode Data:', barcodeData);

    //         if (barcodeData.length === 0) {
    //             alert('This is non stock no bar code found')
    //             return
    //         }

    //         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/barcode_pdf_single`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 barcodes: barcodeData
    //             }),

    //             // If you need to send any data with the request, you can include it here
    //             // body: JSON.stringify({ /* your data */ }),
    //         });

    //         if (!response.ok) {
    //             throw new Error('Error generating PDF In Period');
    //         }

    //         // If you want to download the PDF automatically
    //         const blob = await response.blob();
    //         const url = window.URL.createObjectURL(new Blob([blob]));
    //         const a = document.createElement('a');
    //         a.href = url;
    //         a.download = 'barcode_pdf.pdf';
    //         document.body.appendChild(a);
    //         a.click();
    //         a.remove();
    //     } catch (error) {
    //         setErrorr(error.message);
    //     } finally {
    //         // setLoading(false);
    //     }
    // };


    const printRef = useRef();

    const [barcodeDatas, setBarcodeDatas] = useState([])

    console.log(barcodeDatas)

    const barcode_pdf_download = async (id) => {
        const productDataFind = loanAll?.find(loan => loan?.id === id);

        if (!productDataFind) {
            console.error('Product data not found');
            return;
        }

        // Prepare barcodes and quantities
        let barcodeData = [];

        productDataFind?.purchase_product?.forEach(purchaseItem => {
            const matchedProduct = products?.find(productItem => productItem?.id === purchaseItem?.product_id);
            if (matchedProduct) {
                for (let i = 0; i < purchaseItem?.quantity; i++) {
                    barcodeData.push({
                        barcode: matchedProduct?.formatted_barcode,
                        product_name: matchedProduct?.product_name
                    });
                }
            }
        });

        // if (barcodeData.length === 0) {
        //     alert('This is non stock no barcode found');
        //     return;
        // }

        // setBarcodeDatas(barcodeData);

        if (barcodeData?.length > 0) {
            setBarcodeDatas(barcodeData);
        }

        if (barcodeData.length === 0) {
            alert('This is non stock no bar code found')
            return
        }

        // Wait for barcode data to be rendered
        await new Promise(resolve => setTimeout(resolve, 0)); // Small delay to ensure rendering

        const selectedLayout = document.getElementById('print_layout').value;
        const orientation = selectedLayout === 'landscape' ? 'landscape' : 'portrait';
        const selectedPrintSize = document.getElementById('print_size').value;
        const selectedZoom = document.querySelector('.zoom_size').value;
        let zoomMultiplier = parseFloat(selectedZoom || 100) / 100;

        // Set page dimensions based on print size
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
                pageWidth = 216 * zoomMultiplier;
                pageHeight = 356 * zoomMultiplier;
                break;
            default:
                pageWidth = 210 * zoomMultiplier;
                pageHeight = 297 * zoomMultiplier;
                break;
        }

        const selectedFontSize = document.querySelector('.font_size').value;
        const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;

        if (printRef.current) {
            const printContent = printRef.current.innerHTML;

            const htmlContent = `
                <html>
                    <head>
                        <title>Print Barcode</title>
                        <style>
                            @page {
                                size: ${selectedPrintSize} ${orientation};
                            }
                            * { 
                                font-family: 'Nikosh', sans-serif !important;
                            }
                            body {
                                font-family: Arial, sans-serif;
                            }
                            .barcode-container {
                                font-size: ${fontSize}px !important;
                                display: inline-block;
                                border: 1px dashed #E6E6E7;
                            }
                        </style>
                    </head>
                    <body style='width: 21cm; height: 29.7cm'>
                        ${printContent}
                    </body>
                </html>
            `;

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/barcode_pdf_single`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        // htmlContent,
                        selectedValues,
                        selectedValue,
                        barcodes: barcodeData,
                        options: {
                            pageSize: selectedPrintSize,
                            orientation,
                            fontSize,
                            zoomMultiplier,
                        }
                    }),
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'barcode.pdf';
                    link.click();
                } else {
                    alert('Error generating PDF');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to generate PDF');
            }
        } else {
            console.error('Print content is not available');
        }
    };


    // const barcode_pdf_download = async (id) => {


    //     const productDataFind = loanAll?.find(loan => loan?.id == id);

    //     if (!productDataFind) {
    //         console.error('Product data not found');
    //         return;
    //     }

    //     // Prepare barcodes and quantities
    //     let barcodeData = [];

    //     productDataFind?.purchase_product?.forEach(purchaseItem => {
    //         const matchedProduct = products?.find(productItem => productItem?.id == purchaseItem?.product_id);
    //         if (matchedProduct) {
    //             for (let i = 0; i < purchaseItem?.quantity; i++) {
    //                 barcodeData.push({
    //                     barcode: matchedProduct?.formatted_barcode,
    //                     product_name: matchedProduct?.product_name
    //                 });
    //             }
    //         }
    //     });

    //     if (barcodeData?.length > 0) {
    //         setBarcodeDatas(barcodeData);
    //     }

    //     if (barcodeData.length === 0) {
    //         alert('This is non stock no bar code found')
    //         return
    //     }

    //     const selectedLayout = document.getElementById('print_layout').value;
    //     const orientation = selectedLayout === 'landscape' ? 'landscape' : 'portrait';

    //     const selectedPrintSize = document.getElementById('print_size').value;
    //     const selectedZoom = document.querySelector('.zoom_size').value;

    //     // Convert zoom value to a numeric multiplier
    //     let zoomMultiplier = 100; // Default zoom multiplier
    //     if (selectedZoom !== '') {
    //         zoomMultiplier = parseFloat(selectedZoom) / 100;
    //     }

    //     // Set the page dimensions based on the selected print size
    //     let pageWidth, pageHeight;
    //     switch (selectedPrintSize) {
    //         case 'A4':
    //             pageWidth = 210 * zoomMultiplier;
    //             pageHeight = 297 * zoomMultiplier;
    //             break;
    //         case 'A3':
    //             pageWidth = 297 * zoomMultiplier;
    //             pageHeight = 420 * zoomMultiplier;
    //             break;
    //         case 'legal':
    //             pageWidth = 216 * zoomMultiplier; // Width for Legal size
    //             pageHeight = 356 * zoomMultiplier; // Height for Legal size
    //             break;
    //         default:
    //             pageWidth = 210 * zoomMultiplier;
    //             pageHeight = 297 * zoomMultiplier;
    //             break;
    //     }

    //     // Get the selected font size value
    //     const selectedFontSize = document.querySelector('.font_size').value;

    //     // Get the numeric part of the selected font size value
    //     const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;

    //     // Get the content to print (from ref or directly)
    //     const printContent = printRef.current.innerHTML;

    //     // Prepare HTML content dynamically
    //     const htmlContent = `
    //         <html>
    //             <head>
    //                 <title>Print Barcode</title>
    //                 <style>
    //                     @page {
    //                         size: ${selectedPrintSize} ${orientation}; /* This sets the page size and orientation */
    //                     }
    //                     * { 
    //                         font-family: 'Nikosh', sans-serif !important;
    //                     }
    //                     body {
    //                         font-family: Arial, sans-serif;
    //                     }
    //                     .barcode-container {
    //                         font-size: ${`${fontSize}px !important` || '8px'};
    //                         display: inline-block;
    //                         border: 1px dashed #E6E6E7; /* Dashed border */
    //                     }
    //                 </style>
    //             </head>
    //             <body style="width:21cm; height: 29.7cm;">
    //                 ${printContent}
    //             </body>
    //         </html>
    //     `;

    //     // Send the content to the server to generate the PDF
    //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/barcode_pdf`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             htmlContent,
    //             options: {
    //                 pageSize: selectedPrintSize,
    //                 orientation,
    //                 fontSize,
    //                 zoomMultiplier,
    //             }
    //         }),
    //     });

    //     // Trigger download of PDF once the response is received
    //     if (response.ok) {
    //         const blob = await response.blob();
    //         const link = document.createElement('a');
    //         link.href = URL.createObjectURL(blob);
    //         link.download = 'barcode.pdf';
    //         link.click();
    //     } else {
    //         alert('Error generating PDF');
    //     }
    // }





    // const barcode_print = async (id) => {
    //     const productDataFind = loanAll?.find(loan => loan?.id == id);

    //     if (!productDataFind) {
    //         console.error('Product data not found');
    //         return;
    //     }

    //     // Prepare barcodes and quantities
    //     let barcodeData = [];

    //     productDataFind?.purchase_product?.forEach(purchaseItem => {
    //         const matchedProduct = products?.find(productItem => productItem?.id == purchaseItem?.product_id);
    //         if (matchedProduct) {
    //             for (let i = 0; i < purchaseItem?.quantity; i++) {
    //                 barcodeData.push({
    //                     barcode: matchedProduct?.formatted_barcode,
    //                     product_name: matchedProduct?.product_name
    //                 });
    //             }
    //         }
    //     });

    //     if (barcodeData?.length > 0) {
    //         setBarcodeDatas(barcodeData);
    //     }

    //     if (barcodeData.length === 0) {
    //         alert('This is non stock no bar code found')
    //         return
    //     }

    //     const selectedLayout = document.getElementById('print_layout').value;
    //     const orientation = selectedLayout === 'landscape' ? 'landscape' : 'portrait';

    //     const selectedPrintSize = document.getElementById('print_size').value;
    //     const selectedZoom = document.querySelector('.zoom_size').value;

    //     let zoomMultiplier = 100; // Default zoom multiplier
    //     if (selectedZoom !== '') {
    //         zoomMultiplier = parseFloat(selectedZoom) / 100;
    //     }

    //     // Set the page dimensions based on the selected print size
    //     let pageWidth, pageHeight;
    //     switch (selectedPrintSize) {
    //         case 'A4':
    //             pageWidth = 210 * zoomMultiplier;
    //             pageHeight = 297 * zoomMultiplier;
    //             break;
    //         case 'A3':
    //             pageWidth = 297 * zoomMultiplier;
    //             pageHeight = 420 * zoomMultiplier;
    //             break;
    //         case 'legal':
    //             pageWidth = 216 * zoomMultiplier;
    //             pageHeight = 356 * zoomMultiplier;
    //             break;
    //         default:
    //             pageWidth = 210 * zoomMultiplier;
    //             pageHeight = 297 * zoomMultiplier;
    //             break;
    //     }

    //     const selectedFontSize = document.querySelector('.font_size').value;
    //     const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;

    //     const pageSize = selectedPrintSize || 'A4';
    //     const pageOrientation = orientation || 'portrait';

    //     // Open a new tab for printing
    //     const printWindow = window.open('', '_blank');

    //     // Ensure that the printRef is available before proceeding
    //     if (printRef.current) {
    //         const printContent = printRef.current.innerHTML;

    //         printWindow.document.open();
    //         printWindow.document.write(`
    //             <html>
    //                 <head>
    //                     <title>Print Barcode</title>
    //                     <style>
    //                         @page{
    //                             size: ${pageSize} ${pageOrientation};
    //                         }
    //                         * { 
    //                             font-family: 'Nikosh', sans-serif !important;
    //                         }
    //                         body {
    //                             font-family: Arial, sans-serif;
    //                         }

    //                         .barcode-container {
    //                             font-size: ${fontSize}px !important;
    //                             display: inline-block;
    //                             border: 1px dashed #E6E6E7;
    //                         }
    //                     </style>
    //                 </head>
    //                 <body style='width: 21cm; height: 29.7cm'>
    //                     ${printContent}
    //                 </body>
    //             </html>
    //         `);

    //         printWindow.document.close();
    //         printWindow.onload = () => {
    //             printWindow.print();
    //         };
    //     } else {
    //         console.error('Print content is not available');
    //     }
    // };


    // useEffect(() => {
    //     if (barcodeDatas && printRef.current) {
    //         const barcodeElements = printRef.current.querySelectorAll('.barcode-svg');
    //         console.log(barcodeElements)
    //         barcodeElements.forEach((element) => {
    //             JsBarcode(element, barcodeDatas.barcode, {
    //                 format: `${selectedValues}`,
    //                 lineColor: "#000",
    //                 width: 0.6,
    //                 height: 50,
    //                 displayValue: true,
    //                 fontSize: 10,
    //                 margin: 5,

    //             });
    //         });
    //     }
    // }, [barcodeDatas, selectedValues]);


    const barcode_print = async (id) => {
        const productDataFind = loanAll?.find(loan => loan?.id == id);

        if (!productDataFind) {
            console.error('Product data not found');
            return;
        }

        // Prepare barcodes and quantities
        let barcodeData = [];
        productDataFind?.purchase_product?.forEach(purchaseItem => {
            const matchedProduct = products?.find(productItem => productItem?.id == purchaseItem?.product_id);
            if (matchedProduct) {
                for (let i = 0; i < purchaseItem?.quantity; i++) {
                    barcodeData.push({
                        barcode: matchedProduct?.formatted_barcode,
                        product_name: matchedProduct?.product_name
                    });
                }
            }
        });

        if (barcodeData?.length > 0) {
            setBarcodeDatas(barcodeData);
        }

        if (barcodeData.length === 0) {
            alert('This is non-stock, no barcode found');
            return;
        }

        // Delay to ensure useEffect renders barcodes
        setTimeout(() => {
            if (printRef.current) {
                const printContent = printRef.current.innerHTML;

                const selectedLayout = document.getElementById('print_layout').value;
                const orientation = selectedLayout === 'landscape' ? 'landscape' : 'portrait';
                const selectedPrintSize = document.getElementById('print_size').value;
                const selectedZoom = document.querySelector('.zoom_size').value;
                let zoomMultiplier = parseFloat(selectedZoom || '100') / 100;

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
                        pageWidth = 216 * zoomMultiplier;
                        pageHeight = 356 * zoomMultiplier;
                        break;
                    default:
                        pageWidth = 210 * zoomMultiplier;
                        pageHeight = 297 * zoomMultiplier;
                        break;
                }

                const selectedFontSize = document.querySelector('.font_size').value;
                const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;

                const printWindow = window.open('', '_blank');
                printWindow.document.open();
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Print Barcode</title>
                            <style>
                                @page {
                                    size: ${selectedPrintSize || 'A4'} ${orientation};
                                }
                                * { 
                                    font-family: 'Nikosh', sans-serif !important;
                                }
                                body {
                                    font-family: Arial, sans-serif;
                                }
                                .barcode-container {
                                    font-size: ${fontSize}px !important;
                                    display: inline-block;
                                    border: 1px dashed #E6E6E7;
                                }
                            </style>
                        </head>
                        <body style='width: 21cm; height: 29.7cm'>
                            ${printContent}
                        </body>
                    </html>
                `);

                printWindow.document.close();
                printWindow.onload = () => {
                    printWindow.print();
                };
            } else {
                console.error('Print content is not available');
            }
        }, 500); // Adjust the delay as needed
    };

    useEffect(() => {
        if (barcodeDatas && printRef.current) {
            const barcodeElements = printRef.current.querySelectorAll('.barcode-svg');
            barcodeElements.forEach((element, index) => {
                JsBarcode(element, barcodeDatas[index]?.barcode, {
                    format: `${selectedValues}`,
                    lineColor: "#000",
                    width: 0.6,
                    height: 50,
                    displayValue: true,
                    fontSize: 10,
                    margin: 5,
                });
            });
        }
    }, [barcodeDatas, selectedValues]);


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

                    {barcodeDatas && (
                        <div className="card d-none" >
                            <div className="card-body">
                                <div className="your-print-content d-flex flex-wrap" ref={printRef}>
                                    {barcodeDatas?.map((product, index) => (
                                        <div key={index} className="barcode-container text-center" style={{

                                            textAlign: 'center',
                                        }}>
                                            {selectedValue === 'with_name' && (
                                                <p className='name' style={{ marginBottom: '-2px', textAlign: 'center', width: '150px' }}>
                                                    {product.product_name}
                                                </p>
                                            )}
                                            {/* <svg className="barcode-svg" /> */}
                                            <ReactBarcode
                                                className="barcode-svg"
                                                value={product.barcode} options={{
                                                    format: `${selectedValues}`,
                                                    lineColor: "#000",
                                                    width: 0.6,
                                                    height: 50,
                                                    displayValue: true,
                                                    fontSize: 10,
                                                    margin: 5,
                                                }} renderer="svg" />


                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className='card mb-4'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Purchase Search</h5>
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
                                                <label className="col-form-label col-md-2"><strong>Supplier Name:</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        value={supplier_id} onChange={(e) => setSupplier_id(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero"
                                                    >
                                                        <option value="">Select Supplier Name</option>
                                                        {
                                                            supplier.map(sta =>
                                                                <>

                                                                    <option value={sta.id}>{sta.name}</option>
                                                                </>

                                                            )
                                                        }
                                                    </select>


                                                </div>
                                                <label className="col-form-label col-md-2"><strong>Product Name:</strong></label>
                                                <div className="col-md-4">
                                                    <select
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

                                                    </select>

                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-form-label col-md-2"><strong>Unit Name:</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        value={unit_id} onChange={(e) => setUnit_id(e.target.value)}

                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero"
                                                    >
                                                        <option value="">Select Unit</option>
                                                        {
                                                            unit.map(sta =>
                                                                <>

                                                                    <option value={sta.id}>{sta.unit_name}</option>
                                                                </>

                                                            )
                                                        }
                                                    </select>
                                                </div>
                                                <label className="col-form-label col-md-2"><strong>Item Name:</strong></label>
                                                <div className="col-md-4">
                                                    <input type="text" name="loan_reason"
                                                        value={item_name} onChange={(e) => setItem_name(e.target.value)}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter  Item Name'

                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-form-label col-md-2"><strong>Invoice:</strong></label>
                                                <div className="col-md-4">
                                                    <input type="text" name="loan_reason"
                                                        value={invoice} onChange={(e) => setInvoice(e.target.value)}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter  Invoice'

                                                    />
                                                </div>
                                                <label className="col-form-label col-md-2"><strong>Purchase Type:</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        value={purchase_types} onChange={(e) => setPurchase_types(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero"
                                                    >
                                                        <option value="">Select Purchase Type</option>
                                                        {
                                                            purchase_type.map(sta =>
                                                                <>

                                                                    <option value={sta.id}>{sta.name}</option>
                                                                </>

                                                            )
                                                        }
                                                    </select>
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
                                            <div className="form-group row">

                                                <label className="col-form-label col-md-2"><strong>Name:</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        onChange={handleChange} value={selectedValue}
                                                        name="name"
                                                        className="form-control form-control-sm integer_no_zero"
                                                    >

                                                        <option value="with_name">With Name</option>
                                                        <option value="with_out_name">With Out Name</option>

                                                    </select>
                                                </div>
                                                <label className="col-form-label col-md-2"><strong>Barcdoe:</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        onChange={handleChanges} value={selectedValues}
                                                        name="name"
                                                        className="form-control form-control-sm integer_no_zero"
                                                    >
                                                        <option value="code39">CODE39</option>
                                                        <option value="code128">CODE128</option>
                                                        {/* <option value="itf14">ITF</option> */}
                                                        <option value="msi">MSI</option>
                                                        <option value="codabar">Codabar</option>

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
                                                            <option value="font-8">Font Standard</option>
                                                            <option value="font-7">Font Small</option>

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
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">List Purchase</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/purchase/purchase_create?page_group`} className="btn btn-sm btn-info">Purchase Create</Link>
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
                                                                        Supplier Name
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
                                                                        Purchase Date
                                                                    </th>
                                                                    <th>
                                                                        Purchased By/Date
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
                                                                            <td>    {loan.supplier_name}</td>
                                                                            <td>    {loan.invoice_id}</td>
                                                                            <td>     {loan.total_amount}</td>
                                                                            <td>     {loan.previous_due}</td>
                                                                            <td>    {loan.payable_amount}</td>
                                                                            <td>    {loan.discount}</td>
                                                                            <td>    {loan.paid_amount}</td>
                                                                            <td>    {loan.due}</td>
                                                                            <td>    {loan.remarks}</td>
                                                                            <td>    {loan.purchase_date.slice(0, 10)}</td>
                                                                            <td>    {loan.created_by_name} <br /> {loan.created_date.slice(0, 10)}</td>








                                                                            <td>

                                                                                <div className="flex items-center ">
                                                                                    <Link href={`/Admin/purchase/purchase_edit/${loan.id}?page_group=${page_group}`}>
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
                                                                                    {filteredBtnIconPDF.map((pdf => (
                                                                                        <button
                                                                                            key={pdf.id}
                                                                                            title='Barcode PDF'
                                                                                            onClick={() => barcode_pdf_download(loan.id)}
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
                                                                                            onClick={() => barcode_print(loan.id)}
                                                                                            title='Barcode Print'
                                                                                            style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                            className={pdf?.btn}
                                                                                        >
                                                                                            <a
                                                                                                dangerouslySetInnerHTML={{ __html: pdf?.icon }}
                                                                                            ></a>
                                                                                        </button>
                                                                                    )))}
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
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/purchase/purchase_all?page=${1}`}>‹ First</Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage > 1 && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/purchase/purchase_all?page=${activePage - 1}`}>&lt;</Link>
                                                            )
                                                        }
                                                        {
                                                            pageNumber.map((page) =>
                                                                <Link
                                                                    key={page}
                                                                    href={`/Admin/purchase/purchase_all?page=${page}`}
                                                                    className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                                                                > {page}
                                                                </Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage < totalPages && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/purchase/purchase_all?page=${activePage + 1}`}>&gt;</Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage + 3 <= totalPages && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/purchase/purchase_all?page=${totalPages}`}>Last ›</Link>
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
                                                                Supplier Name
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
                                                                Purchase Date
                                                            </th>
                                                            <th>
                                                                Purchased By/Date
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
                                                                    <td>    {loan.supplier_name}</td>
                                                                    <td>    {loan.invoice_id}</td>
                                                                    <td>     {loan.total_amount}</td>
                                                                    <td>     {loan.previous_due}</td>
                                                                    <td>    {loan.payable_amount}</td>
                                                                    <td>    {loan.discount}</td>
                                                                    <td>    {loan.paid_amount}</td>
                                                                    <td>    {loan.due}</td>
                                                                    <td>    {loan.remarks}</td>
                                                                    <td>    {loan.purchase_date.slice(0, 10)}</td>
                                                                    <td>    {loan.created_by_name} <br /> {loan.created_date.slice(0, 10)}</td>


                                                                    <td>

                                                                        <div className="flex items-center ">
                                                                            <Link href={`/Admin/purchase/purchase_edit/${loan.id}?page_group=${page_group}`}>
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
                                                                            {filteredBtnIconPDF.map((pdf => (
                                                                                <button
                                                                                    key={pdf.id}
                                                                                    title='Barcode PDF'
                                                                                    onClick={() => barcode_pdf_download(loan.id)}
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
                                                                                    onClick={() => barcode_print(loan.id)}
                                                                                    title='Barcode Print'
                                                                                    style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                    className={pdf?.btn}
                                                                                >
                                                                                    <a
                                                                                        dangerouslySetInnerHTML={{ __html: pdf?.icon }}
                                                                                    ></a>
                                                                                </button>
                                                                            )))}
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
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/purchase/purchase_all?page=${1}`}>‹ First</Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage > 1 && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/purchase/purchase_all?page=${activePage - 1}`}>&lt;</Link>
                                                            )
                                                        }
                                                        {
                                                            pageNumber.map((page) =>
                                                                <Link
                                                                    key={page}
                                                                    href={`/Admin/purchase/purchase_all?page=${page}`}
                                                                    className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                                                                > {page}
                                                                </Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage < totalPages && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/purchase/purchase_all?page=${activePage + 1}`}>&gt;</Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage + 3 <= totalPages && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/purchase/purchase_all?page=${totalPages}`}>Last ›</Link>
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

export default PurchaseList;