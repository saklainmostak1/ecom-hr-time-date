'use client' 
 //ismile
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import * as XLSX from "xlsx";
import ExcelJS from 'exceljs';
import { Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun, ImageRun, WidthType } from 'docx';

const FrontServiceBoxList = ({ searchParams }) => {


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

    const [created_by, setUserId] = useState(() => {
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

    const { data: front_service_box = [], refetch, isLoading
    } = useQuery({
        queryKey: ['front_service_box'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/front_service_box/front_service_box_list`)

            const data = await res.json()
            return data
        }
    })


    const { data: moduleInfo = []
    } = useQuery({
        queryKey: ['moduleInfo'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${created_by}`)

            const data = await res.json()
            return data
        }
    })
    console.log(moduleInfo.filter(moduleI => moduleI.controller_name === 'front_service_box'))
    const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'front_service_box')

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
    const parentUsers = front_service_box;

    const totalData = parentUsers?.length;
    const dataPerPage = 20;

    const totalPages = Math.ceil(totalData / dataPerPage);

    let currentPage = 1;

    if (Number(searchParams.page) >= 1) {
        currentPage = Number(searchParams.page);
    }

    let pageNumber = [];
    for (let index = currentPage - 2; index <= currentPage + 2; index++) {
        if (index < 1) {
            continue;
        }
        if (index > totalPages) {
            break;
        }
        pageNumber.push(index);
    }
    const [pageUsers, setPageUsers] = useState([]);
    const caregory_list = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/front_service_box/front_service_box_list_paigination/${currentPage}/${dataPerPage}`;
        const response = await fetch(url);
        const data = await response.json();
        setPageUsers(data);
    };
    useEffect(() => {
        caregory_list();
    }, [currentPage]);

    const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;


    const front_service_box_delete = id => {

        console.log(id)
        const proceed = window.confirm(`Are You Sure delete${id}`)
        if (proceed) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/front_service_box/front_service_box_delete/${id}`, {
                method: "POST",

            })
                .then(Response => Response.json())
                .then(data => {

                    if (data.affectedRows > 0) {
                        caregory_list()

                    }
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

    const [showFromDate, setShowFromDate] = useState('');
    const [showToDate, setShowToDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [searchResults, setSearchResults] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errorr, setErrorr] = useState(null)
    const [title, seTitle] = useState('')
    const [sort, setSort] = useState('')
    const [status, setStatus] = useState('')

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

    const front_service_box_search = () => {

        setLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/front_service_box/front_service_box_search`, {
            toDate, fromDate, title, sort, status

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

    const [statuss, setStatuss] = useState([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
            .then(res => res.json())
            .then(data => setStatuss(data))
    }, [])




    const front_service_box_pdf_download = async () => {

        // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/front_service_box/front_service_box_search`, {
            toDate, fromDate, title, status, sort
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/front_service_box/front_service_box_list_pdf`, {
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


    const front_service_box_print = async () => {
        try {
            // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/front_service_box/front_service_box_search`, {
                toDate, fromDate, title, status, sort
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

            const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/front_service_box/front_service_box_list_print`, {
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




    const front_service_box_excel_download = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/front_service_box/front_service_box_search`, {
                toDate, fromDate, title, status, sort
            });

            const searchResults = response.data.results;

            // Create a new workbook and add a worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Sheet1');

            // Define the columns
            const columns = [
                { header: 'SL No.', key: 'slNo', width: 10 },
                { header: 'Title', key: 'title', width: 30 },
                { header: 'Sort', key: 'sort', width: 10 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Photo', key: 'photo', width: 20 },
                { header: 'Created By', key: 'createdBy', width: 20 },
                { header: 'Created Date', key: 'createdDate', width: 20 },
            ];
            worksheet.columns = columns;

            // Add data rows
            await Promise.all(
                searchResults.map(async (category, index) => {
                    const row = {
                        slNo: index + 1,
                        title: category.title,
                        sort: category.sort,
                        status: category.status_text,
                        photo: '', // Placeholder for image
                        createdBy: category.created_by,
                        createdDate: category.created_date.slice(0, 10),
                    };

                    const addedRow = worksheet.addRow(row);

                    // Embed the image if it exists
                    if (category.photo) {
                        const photoUrl = `${process.env.NEXT_PUBLIC_API_URL}:5003/${category.photo}`;
                        const imageResponse = await axios.get(photoUrl, { responseType: 'arraybuffer' });
                        const imageBuffer = Buffer.from(imageResponse.data, 'binary');

                        const imageId = workbook.addImage({
                            buffer: imageBuffer,
                            extension: 'png', // Adjust the extension based on your image format
                        });

                        worksheet.addImage(imageId, {
                            tl: { col: 4, row: addedRow.number - 1 }, // Top-left corner position
                            ext: { width: 40, height: 15 }, // Image size
                        });
                    }
                })
            );

            // Generate the Excel file as a Blob
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            // Trigger a download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'front_service_box.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log('File generated and download triggered.');
        } catch (error) {
            console.error("An error occurred during printing.", error);
            setError("An error occurred during printing.", error);
        }
    };



    const front_service_box_word_download = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/front_service_box/front_service_box_search`, {
                toDate, fromDate, title, status, sort
            });

            const searchResults = response.data.results;

            // Define columns and headers
            const columns = [
                'SL No.',
                'Title',
                'Sort',
                'Status',
                'Photo',
                'Created By',
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
                const sort = category.sort != null ? `${category.sort}` : ''; // 
                const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5003/${category.photo ? category.photo : 'No Image Found'}`);
                const imageData = await imageResponse?.blob();
                const imageRun = new ImageRun({
                    data: imageData,
                    transformation: {
                        width: 100,
                        height: 100,
                    }
                });

                // Check and handle missing or undefined amount


                return new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ text: `${index + 1}` })], // SL No.
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: category.title ? `${category.title}` : '' })], // Name
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: sort ? sort : '' })], // Email
                            borders: {},
                        }),


                        new TableCell({
                            children: [new Paragraph({ text: category.status_text })], // Contact Number
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ children: [imageRun] })],
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: category.created_by })], // Contact Number
                            borders: {},
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: category.created_date.slice(0, 10) })], // Contact Number
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




    return (
        <div class="col-md-12 bg-light p-4">
            {message && (
                <div className="alert alert-success font-weight-bold">
                    {message}
                </div>
            )}


            <div className='card mb-4'>
                <div className="body-content bg-light">
                    <div className="border-primary shadow-sm border-0">
                        <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                            <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Front Service Box Search</h5>
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
                                        <label className="col-form-label col-md-2"><strong>Title:</strong></label>
                                        <div className="col-md-4">
                                            <input type="text" name="name"
                                                value={title} onChange={(e) => seTitle(e.target.value)}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter Title'

                                            />



                                        </div>
                                        <label className="col-form-label col-md-2"><strong>Sort:</strong></label>
                                        <div className="col-md-4">
                                            <input type="text" name="product_name"
                                                value={sort} onChange={(e) => setSort(e.target.value)}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter Sort'

                                            />


                                        </div>
                                    </div>

                                    <div className="form-group row">

                                        <label className="col-form-label col-md-2"><strong>Status:</strong></label>
                                        <div className="col-md-4">
                                            <select
                                                value={status} onChange={(e) => setStatus(e.target.value)}
                                                name="statusFilter"
                                                className="form-control form-control-sm integer_no_zero"
                                            >
                                                <option value="">Select Status</option>
                                                {
                                                    statuss.map(status =>

                                                        <>

                                                            <option value={status.id}>{status.status_name}</option>
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

                                    <div class="form-group row student">

                                        <label class="col-form-label font-weight-bold col-md-2">Print/PDF Properties:</label>
                                        <div class="col-md-10">
                                            <div class="input-group ">
                                                <select

                                                    name="print_size" class="form-control form-control-sm  trim integer_no_zero print_size" id="print_size">
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
                                                <select

                                                    class=" form-control form-control-sm   integer_no_zero student_type font_size">
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
                                <div className="form-group row">
                                    <div className="offset-md-2 col-md-8 float-left">
                                        <input type="button" name="search" className="btn btn-sm btn-info" value="Search"
                                            onClick={front_service_box_search}
                                        />
                                        <input
                                            onClick={front_service_box_pdf_download}
                                            type="button" name="summary" class="btn btn-sm btn-secondary print_summary ml-2" value="Download PDF" />
                                        <input
                                            onClick={front_service_box_excel_download}
                                            type="button" name="summary" class="btn btn-sm btn-primary print_summary ml-2" value="Download Excel" />
                                        <input

                                            onClick={front_service_box_word_download}
                                            type="button" name="summary" class="btn btn-sm btn-danger print_summary ml-2" value="Download Word" />
                                        <input
                                            onClick={front_service_box_print}
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
                            <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">List Front Service Box</h5>
                            <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                <Link href={`/Admin/front_service_box/front_service_box_create?page_group=dynamic_website`} className="btn btn-sm btn-info">Front Service Box Create</Link>
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
                                                            <th>SL.</th>
                                                            <th>Title</th>
                                                            <th>Sort</th>
                                                            <th>Status</th>
                                                            <th>Photo</th>
                                                            <th>Links</th>
                                                            <th>Created By</th>
                                                            <th>Created Date</th>
                                                            <th>Action</th>
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
                                                            searchResults.map((front, i) => (
                                                                <tr key={front.id}>
                                                                    <td>{i + 1}</td>
                                                                    <td>{front.title}</td>
                                                                    <td>{front.sort}</td>
                                                                    <td>{front.status_text}</td>
                                                                    <td><img style={{ width: '150px' }} src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${front.photo}`} /></td>

                                                                    <td>
                                                                        <Link className='text-primary ' target="_blank" href={front.link1_url}>{front.link1}</Link> <br />
                                                                        <Link className='text-primary ' target="_blank" href={front.link2_url}>{front.link2}</Link> <br />
                                                                        <Link className='text-primary ' target="_blank" href={front.link3_url}>{front.link3}</Link> <br />
                                                                        <Link className='text-primary ' target="_blank" href={front.link4_url}>{front.link4}</Link> <br />
                                                                        <Link className='text-primary ' target="_blank" href={front.link4_url}>{front.link5}</Link>
                                                                    </td>

                                                                    <td>{front.created_by}</td>
                                                                    <td>{front.created_date.slice(0, 10)}</td>
                                                                    <td>
                                                                        <div className="flex items-center ">
                                                                            <Link href={`/Admin/front_service_box/front_service_box_edit/${front.id}?page_group=${page_group}`}>
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
                                                                                    onClick={() => front_service_box_delete(front.id)}
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
                                                    <th>SL.</th>
                                                    <th>Title</th>
                                                    <th>Sort</th>
                                                    <th>Status</th>
                                                    <th>Photo</th>
                                                    <th>Links</th>
                                                    <th>Created By</th>
                                                    <th>Created Date</th>
                                                    <th>Action</th>
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
                                                    pageUsers.map((front, i) => (
                                                        <>
                                                            <tr>
                                                                <td>{i + 1}</td>
                                                                <td>{front.title}</td>
                                                                <td>{front.sort}</td>
                                                                <td>{front.status_text}</td>
                                                                <td><img style={{ width: '150px' }} src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${front.photo}`} /></td>

                                                                <td>
                                                                    <Link className='text-primary link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover' target="_blank" href={front.link1_url}>{front.link1}</Link> <br />
                                                                    <Link className='text-primary link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover' target="_blank" href={front.link2_url}>{front.link2}</Link> <br />
                                                                    <Link className='text-primary link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover' target="_blank" href={front.link3_url}>{front.link3}</Link> <br />
                                                                    <Link className='text-primary link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover' target="_blank" href={front.link4_url}>{front.link4}</Link> <br />
                                                                    <Link className='text-primary link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover' target="_blank" href={front.link4_url}>{front.link5}</Link>
                                                                </td>

                                                                <td>{front.created_by}</td>
                                                                <td>{front.created_date.slice(0, 10)}</td>
                                                                <td>
                                                                    <div className="flex items-center ">
                                                                        <Link href={`/Admin/front_service_box/front_service_box_edit/${front.id}?page_group=${page_group}`}>
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
                                                                                onClick={() => front_service_box_delete(front.id)}
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
                                                        </>
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

            {/* <div class="card card-default">
                <div class="card-header py-1  clearfix bg-gradient-primary text-white">
                    <h5 class="card-title font-weight-bold mb-0  float-left mt-1">Front Service Box List</h5>
                    <div class="card-title font-weight-bold mb-0  float-right"> <Link href="/Admin/front_service_box/front_service_box_create?page_group=dynamic_website" class="btn btn-sm btn-info">Create Front service box</Link> </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                      
                        <div className=" d-flex justify-content-between">
                            <div>Total Data: {totalData}</div>
                            <div class="pagination float-right pagination-sm border">
                                {currentPage - 3 >= 1 && (
                                    <Link
                                        className=" text-primary px-2 border-left py-1"
                                        href={`/Admin/front_service_box/front_service_box_all?page=${1}`}
                                    >
                                        ‹ First
                                    </Link>
                                )}
                                {currentPage > 1 && (
                                    <Link
                                        className=" text-primary px-2 border-left py-1"
                                        href={`/Admin/front_service_box/front_service_box_all?page=${activePage - 1
                                            }`}
                                    >
                                        &lt;
                                    </Link>
                                )}
                                {pageNumber.map((page) => (
                                    <Link
                                        key={page}
                                        href={`/Admin/front_service_box/front_service_box_all?page=${page}`}
                                        className={` ${page === activePage
                                            ? "font-bold bg-primary px-2 border-left py-1 text-white"
                                            : "text-primary px-2 border-left py-1"
                                            }`}
                                    >
                                        {" "}
                                        {page}
                                    </Link>
                                ))}
                                {currentPage < totalPages && (
                                    <Link
                                        className=" text-primary px-2 border-left py-1"
                                        href={`/Admin/front_service_box/front_service_box_all?page=${activePage + 1
                                            }`}
                                    >
                                        &gt;
                                    </Link>
                                )}
                                {currentPage + 3 <= totalPages && (
                                    <Link
                                        className=" text-primary px-2 border-left py-1"
                                        href={`/Admin/front_service_box/front_service_box_all?page=${totalPages}`}
                                    >
                                        Last ›
                                    </Link>
                                )}
                            </div>
                        </div>
                     
                        <table class="table table-bordered table-hover table-striped table-sm">
                            <thead>
                                <tr>
                                    <th>SL.</th>
                                    <th>Title</th>
                                    <th>Sort</th>
                                    <th>Status</th>
                                    <th>Photo</th>
                                    <th>Links</th>
                                    <th>Created By</th>
                                    <th>Created Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    pageUsers.map((front, i) =>
                                        <>
                                            <tr>
                                                <td>{i + 1}</td>
                                                <td>{front.title}</td>
                                                <td>{front.sort}</td>
                                                <td>{front.status_text}</td>
                                                <td><img style={{ width: '150px' }} src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${front.photo}`} /></td>

                                                <td>
                                                    <Link className='text-primary link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover' target="_blank" href={front.link1_url}>{front.link1}</Link> <br />
                                                    <Link className='text-primary link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover' target="_blank" href={front.link2_url}>{front.link2}</Link> <br />
                                                    <Link className='text-primary link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover' target="_blank" href={front.link3_url}>{front.link3}</Link> <br />
                                                    <Link className='text-primary link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover' target="_blank" href={front.link4_url}>{front.link4}</Link> <br />
                                                    <Link className='text-primary link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover' target="_blank" href={front.link4_url}>{front.link5}</Link>
                                                </td>

                                                <td>{front.created_by}</td>
                                                <td>{front.created_date.slice(0, 10)}</td>
                                                <td>
                                                    <div className="flex items-center ">
                                                        <Link href={`/Admin/front_service_box/front_service_box_edit/${front.id}?page_group=${page_group}`}>
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
                                                                onClick={() => front_service_box_delete(front.id)}
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
                                        </>

                                    )
                                }

                            </tbody>

                        </table>
                      
                        <div className=" d-flex justify-content-between">
                            <div>Total Data: {totalData}</div>
                            <div class="pagination float-right pagination-sm border">
                                {currentPage - 3 >= 1 && (
                                    <Link
                                        className=" text-primary px-2 border-left py-1"
                                        href={`/Admin/front_service_box/front_service_box_all?page=${1}`}
                                    >
                                        ‹ First
                                    </Link>
                                )}
                                {currentPage > 1 && (
                                    <Link
                                        className=" text-primary px-2 border-left py-1"
                                        href={`/Admin/front_service_box/front_service_box_all?page=${activePage - 1
                                            }`}
                                    >
                                        &lt;
                                    </Link>
                                )}
                                {pageNumber.map((page) => (
                                    <Link
                                        key={page}
                                        href={`/Admin/front_service_box/front_service_box_all?page=${page}`}
                                        className={` ${page === activePage
                                            ? "font-bold bg-primary px-2 border-left py-1 text-white"
                                            : "text-primary px-2 border-left py-1"
                                            }`}
                                    >
                                        {" "}
                                        {page}
                                    </Link>
                                ))}
                                {currentPage < totalPages && (
                                    <Link
                                        className=" text-primary px-2 border-left py-1"
                                        href={`/Admin/front_service_box/front_service_box_all?page=${activePage + 1
                                            }`}
                                    >
                                        &gt;
                                    </Link>
                                )}
                                {currentPage + 3 <= totalPages && (
                                    <Link
                                        className=" text-primary px-2 border-left py-1"
                                        href={`/Admin/front_service_box/front_service_box_all?page=${totalPages}`}
                                    >
                                        Last ›
                                    </Link>
                                )}
                            </div>
                        </div>
                      
                    </div>
                </div>

            </div> */}


        </div >


    );
};

export default FrontServiceBoxList;