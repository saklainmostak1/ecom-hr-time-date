'use client'
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import * as XLSX from "xlsx";
import { Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun, ImageRun, WidthType } from 'docx';

const AttendanceDetail = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [itemName, setItemName] = useState('');
    const [filteredDesignations, setFilteredDesignations] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [month, setMonth] = useState('');
    const [years, setYears] = useState([]);

    const months = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];

    console.log(month)
    console.log(searchQuery)
    const monthLabel = months.find(m => m.value === month)?.label;

    // Construct the final object
    const yearMonth = {
        label: `${monthLabel} ${searchQuery}`,
        value: `${searchQuery}-${month}`
    };

    console.log(yearMonth);


    useEffect(() => {
        const startYear = 2022;
        const currentYear = new Date().getFullYear();
        const yearOptions = [];

        for (let year = startYear; year <= currentYear; year++) {
            yearOptions.push(year);
        }

        setYears(yearOptions);
    }, []);

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
        setSearchResults([])
    };

    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(false);

    const news_search = () => {
        setLoading(true);
        if (itemName === '') {
            alert('select a branch')
            setLoading(false);
            return
        }
        if (searchQuery === '') {
            alert('select a Year')
            setLoading(false);
            return
        }
        if (month === '') {
            alert('select a months')
            setLoading(false);
            return
        }
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_summary_search`, {
            itemName
        })
            .then(response => {
                setSearchResults(response.data);
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

    const buttonStyles = {
        color: '#fff',
        backgroundColor: '#510bc4',
        backgroundImage: 'none',
        borderColor: '#4c0ab8',
    };

    const { data: holidays = [] } = useQuery({
        queryKey: ['holidays'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/yearly_holiday/yearly_holiday_all`)
            const data = await res.json()
            return data
        }
    });

    const { data: leavesDays = [] } = useQuery({
        queryKey: ['leavesDays'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_all`)
            const data = await res.json()
            return data
        }
    });

    const leaveApproveCount = leavesDays.filter(leave => leave.application_status === 2);

    const { data: leavesDaysApproved = [] } = useQuery({
        queryKey: ['leavesDaysApproved'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_approved/leave_approved_all`)
            const data = await res.json()
            return data
        }
    });


    const { data: attendances = [] } = useQuery({
        queryKey: ['attendances'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_all_list`)
            const data = await res.json()
            return data
        }
    });


    console.log(attendances)

    const { data: leaveAllApproved = [] } = useQuery({
        queryKey: ['leaveAllApproved'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_details_list`)
            const data = await res.json()
            return data
        }
    });


    const matchLength = leaveApproveCount.map(emp => {
        const matchCount = leavesDaysApproved.filter(att => att.leave_application_id === emp.id);
        return { user_id: emp.whose_leave, match_length: matchCount };
    });


    console.log(matchLength)


    const [daysInMonth, setDaysInMonth] = useState([]);

    useEffect(() => {
        if (month && searchQuery) {
            const daysInSelectedMonth = new Date(searchQuery, month, 0).getDate();
            const daysArray = Array.from({ length: daysInSelectedMonth }, (_, i) => {
                const day = i + 1;
                return `${searchQuery}-${month}-${day.toString().padStart(2, '0')}`;
            });
            setDaysInMonth(daysArray);
        }
    }, [month, searchQuery]);

    console.log(daysInMonth)

    const filteredAttendances = holidays.filter(att => {
        const startDate = new Date(att.start_date);
        const startMonth = startDate.getMonth() + 1; // Months are zero-based
        const startYear = startDate.getFullYear();
        return startMonth === parseInt(month, 10) && startYear === parseInt(searchQuery, 10);
    });

    console.log(leaveAllApproved)

    const leaveMap = leaveAllApproved.reduce((acc, leave) => {
        if (!acc[leave.whose_leave]) {
            acc[leave.whose_leave] = new Set();
        }
        leave.leave_application_ids.forEach(leaveDate => {
            const dateKey = leaveDate.leave_date.slice(0, 10); // Extract date in YYYY-MM-DD format
            acc[leave.whose_leave].add(dateKey);
        });
        return acc;
    }, {});
    console.log(leaveMap)

    const attendanceLookup = attendances.reduce((acc, item) => {
        const date = item.first_checkin.slice(0, 10); // Format YYYY-MM-DD
        const key = `${item.user_id}-${date}`;
        acc[key] = true; // Mark presence
        return acc;
    }, {});

    console.log(attendanceLookup)



    const { data: absents = [] } = useQuery({
        queryKey: ['absents'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/absent/absent_all`)
            const data = await res.json()
            return data
        }
    });

    const absentLookup = absents.reduce((acc, item) => {
        const date = item.absent_date.slice(0, 10); // Format YYYY-MM-DD
        const key = `${item.user_id}-${date}`;
        acc[key] = true; // Mark presence
        return acc;
    }, {});

    console.log(absentLookup)

    const attendance_details_excel_download = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_summary_search`, {
                itemName,
            });
            const searchResults = response.data;

            // Define the columns including dynamic day columns
            const columns = [
                'Employee ID',
                'Name',
                'Designation',
                ...daysInMonth.map(date => date.slice(8, 10)), // Dynamic day columns
                'Total Present',
                'Total Absent',
                'Total Holiday',
                'Total Leave'
            ];

            // Filter the data
            const filteredColumns = searchResults.map((attendances) => {
                let presentCount = 0;
                let absentCount = 0;
                let holidayCount = 0;
                let leaveCount = 0;

                const filteredData = {
                    'Employee ID': attendances.unique_id,
                    'Name': attendances.full_name,
                    'Designation': attendances.designation_name,
                };

                daysInMonth.forEach(date => {
                    const day = date.slice(0, 10); // Extract date in YYYY-MM-DD format
                    const isHoliday = filteredAttendances.some(holiday => {
                        const holidayDate = new Date(holiday.start_date);
                        return holidayDate.getDate() === parseInt(date.slice(8, 10), 10);
                    });
                    const hasLeave = leaveMap[attendances.user_id] && leaveMap[attendances.user_id].has(day);

                    const presentKey = `${attendances.user_id}-${day}`;
                    const isPresent = attendanceLookup[presentKey];

                    const absentKey = `${attendances.user_id}-${day}`;
                    const isAbsent = absentLookup[absentKey];

                    let cellContent = '';

                    if (isPresent) {
                        cellContent = 'P';
                        presentCount++;
                    } else if (isAbsent) {
                        cellContent = 'A';
                        absentCount++;
                    } else if (hasLeave) {
                        cellContent = 'L';
                        leaveCount++;
                    } else if (isHoliday) {
                        cellContent = 'H';
                        holidayCount++;
                    }

                    filteredData[date.slice(8, 10)] = cellContent;
                });

                filteredData['Total Present'] = presentCount;
                filteredData['Total Absent'] = absentCount;
                filteredData['Total Holiday'] = holidayCount;
                filteredData['Total Leave'] = leaveCount;

                return filteredData;
            });

            // Create worksheet with filtered data
            const worksheet = XLSX.utils.json_to_sheet(filteredColumns);

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
            const columnWidths = columns.map(column => ({ wpx: Math.max(10, column.length * 8) }));
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


    const attendance_details_word_download = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_summary_search`, {
                itemName
            });
            const searchResults = response.data;

            // Define columns
            const columns = ['Employee ID', 'Name', 'Designation', ...daysInMonth.map(date => date.slice(8, 10)), 'Present', 'Absent', 'Holiday', 'Leave'];

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

            // Create data rows
            const dataRows = searchResults.map((attendances, i) => {
                let presentCount = 0;
                let absentCount = 0;
                let holidayCount = 0;
                let leaveCount = 0;

                const dataCells = [
                    new TableCell({ children: [new Paragraph({ text: `${attendances.unique_id}` })], borders: {} }),
                    new TableCell({ children: [new Paragraph({ text: attendances.full_name })], borders: {} }),
                    new TableCell({ children: [new Paragraph({ text: attendances.designation_name })], borders: {} }),
                    ...daysInMonth.map(date => {
                        const day = date.slice(0, 10);
                        const isHoliday = filteredAttendances.some(holiday => {
                            const holidayDate = new Date(holiday.start_date);
                            return holidayDate.getDate() === parseInt(date.slice(8, 10), 10);
                        });
                        const hasLeave = leaveMap[attendances.user_id] && leaveMap[attendances.user_id].has(day);
                        const presentKey = `${attendances.user_id}-${day}`;
                        const isPresent = attendanceLookup[presentKey];
                        const absentKey = `${attendances.user_id}-${day}`;
                        const isAbsent = absentLookup[absentKey];

                        let cellContent = '';
                        let textColor = '';

                        if (isPresent) {
                            cellContent = 'P';
                            presentCount++;
                        } else if (isAbsent) {
                            cellContent = 'A';
                            textColor = 'FF0000'; // Red for Absent
                            absentCount++;
                        } else if (hasLeave) {
                            cellContent = 'L';
                            textColor = '00FF00'; // Green for Leave
                            leaveCount++;
                        } else if (isHoliday) {
                            cellContent = 'H';
                            textColor = '0000FF'; // Blue for Holiday
                            holidayCount++;
                        }

                        return new TableCell({
                            children: [new Paragraph({ text: cellContent, color: textColor })],
                            borders: {},
                        });
                    }),
                    new TableCell({ children: [new Paragraph({ text: `${presentCount}` })], borders: {} }),
                    new TableCell({ children: [new Paragraph({ text: `${absentCount}` })], borders: {} }),
                    new TableCell({ children: [new Paragraph({ text: `${holidayCount}` })], borders: {} }),
                    new TableCell({ children: [new Paragraph({ text: `${leaveCount}` })], borders: {} }),
                ];

                return new TableRow({ children: dataCells });
            });

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


    const attendance_details_print_download = async () => {
        try {
            // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_remarks_list_visit/${id}`);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_summary_search`, {
                itemName
            });

            const searchResults = response.data
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

            console.log(leaveMap)

            const printWindow = window.open('', '_blank');
            printWindow.document.open();

            const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_details_print`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    daysInMonth, searchResults, filteredAttendances, orientation, selectedPrintSize, fontSize, extraColumnValue, leaveMap, absentLookup, attendanceLookup, leaveAllApproved
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

    const attendance_details_pdf_download = async () => {
        try {
            // Fetch search results
            const searchResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_summary_search`, {
                itemName
            });
    
            const searchResults = searchResponse.data;
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
            const pdfResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_details_pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    daysInMonth, searchResults, filteredAttendances, orientation, selectedPrintSize, fontSize, leaveMap, absentLookup, attendanceLookup, leaveAllApproved
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
    

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 p-4">

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
                                                <label className="col-form-label col-md-2 font-weight-bold">Year:</label>
                                                <div className="col-md-4">
                                                    <select
                                                        required
                                                        value={searchQuery}
                                                        // onChange={(e) => setSearchQuery(e.target.value)}
                                                        onChange={(e) => {
                                                            setSearchQuery(e.target.value);
                                                            setSearchResults([]); // Clear search results when year changes
                                                        }}
                                                        name="year"
                                                        className="form-control form-control-sm mb-2"
                                                        id="year"
                                                    >
                                                        <option value="">Select Year</option>
                                                        {years.map(year => (
                                                            <option key={year} value={year}>{year}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group row student">
                                                <label className="col-form-label col-md-2 font-weight-bold">Month:</label>
                                                <div className="col-md-4">
                                                    <select required="" value={month}
                                                        // onChange={(e) => setMonth(e.target.value)} 
                                                        onChange={(e) => {
                                                            setMonth(e.target.value)
                                                            setSearchResults([]); // Clear search results when year changes
                                                        }}

                                                        name="month" className="form-control form-control-sm mb-2" id="month">
                                                        <option value=''>Select Month</option>
                                                        {months.map((month) => (
                                                            <option key={month.value} value={month.value}>{month.label}</option>
                                                        ))}
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

                                            <div className="form-group row">
                                                <div className="offset-md-2 col-md-10 float-left">
                                                    <input
                                                        type="button" name="search" className="btn btn-sm btn-info search_btn mr-2" value="Search" onClick={news_search} />
                                                    <input
                                                        onClick={attendance_details_word_download}
                                                        type="button" name="search"
                                                        className="btn btn-sm btn-secondary excel_btn mr-2"
                                                        value="Download Doc" />
                                                    <input
                                                        onClick={attendance_details_excel_download}
                                                        type='button'
                                                        name="search"
                                                        className="btn btn-sm btn-secondary excel_btn mr-2"
                                                        value="Download Excel" />
                                                    <input
                                                        onClick={attendance_details_pdf_download}
                                                        type="button" name="search" className="btn btn-sm btn-indigo pdf_btn mr-2" style={buttonStyles} value="Download PDF" />
                                                    <input
                                                        onClick={attendance_details_print_download}
                                                        type="button" name="search" className="btn btn-sm btn-success print_btn mr-2" value="Print" />
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
                                                            <th>Designation</th>

                                                            {daysInMonth.map((date) => (
                                                                <th key={date} value={date}>{date.slice(8, 10)}</th>
                                                            ))}
                                                            <th>Present</th>
                                                            <th>Absent</th>
                                                            <th>Holiday</th>
                                                            <th>Leave</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {searchResults.map((attendances, i) => {
                                                            let presentCount = 0;
                                                            let absentCount = 0;
                                                            let holidayCount = 0;
                                                            let leaveCount = 0;

                                                            return (
                                                                <tr key={i}>
                                                                    <td>{attendances.unique_id}</td>
                                                                    <td>{attendances.full_name}</td>
                                                                    <td>{attendances.designation_name}</td>
                                                                    {daysInMonth.map(date => {
                                                                        const day = date.slice(0, 10); // Extract date in YYYY-MM-DD format
                                                                        const isHoliday = filteredAttendances.some(holiday => {
                                                                            const holidayDate = new Date(holiday.start_date);
                                                                            return holidayDate.getDate() === parseInt(date.slice(8, 10), 10);
                                                                        });
                                                                        const hasLeave = leaveMap[attendances.user_id] && leaveMap[attendances.user_id].has(day);

                                                                        const presentKey = `${attendances.user_id}-${day}`;
                                                                        const isPresent = attendanceLookup[presentKey];

                                                                        const absentKey = `${attendances.user_id}-${day}`;
                                                                        const isAbsent = absentLookup[absentKey];

                                                                        let cellContent = '';
                                                                        let cellClass = '';

                                                                        if (isPresent) {
                                                                            cellContent = 'P';
                                                                            cellClass = ''; // Blue color for Present
                                                                            presentCount++;
                                                                        } else if (isAbsent) {
                                                                            cellContent = 'A';
                                                                            cellClass = 'text-danger'; // Red color for Absent
                                                                            absentCount++;
                                                                        } else if (hasLeave) {
                                                                            cellContent = 'L';
                                                                            cellClass = 'text-success '; // Green color for leave
                                                                            leaveCount++;
                                                                        } else if (isHoliday) {
                                                                            cellContent = 'H';
                                                                            cellClass = 'text-primary '; // Blue color for holiday
                                                                            holidayCount++;
                                                                        }

                                                                        return (
                                                                            <td key={date} className={cellClass}>
                                                                                {cellContent}
                                                                            </td>
                                                                        );
                                                                    })}
                                                                    {/* Display total counts */}
                                                                    <td>{presentCount}</td>
                                                                    <td>{absentCount}</td>
                                                                    <td>{holidayCount}</td>
                                                                    <td>{leaveCount}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>

                            </>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceDetail;



{/* {daysInMonth.map(date => {
                                                                    const day = date.slice(8, 10);
                                                                    const isHoliday = filteredAttendances.some(holiday => {
                                                                        const holidayDate = new Date(holiday.start_date);
                                                                        return holidayDate.getDate() === parseInt(day, 10);
                                                                    });
                                                                    return (
                                                                        <td key={date} className='text-primary'>
                                                                            {isHoliday ? 'H' : ''}
                                                                            
                                                                        </td>
                                                                    );
                                                                })} */}
{/* {daysInMonth.map(date => {
                                                                    const day = date.slice(0, 10); // Extract date in YYYY-MM-DD format
                                                                    const isHoliday = filteredAttendances.some(holiday => {
                                                                        const holidayDate = new Date(holiday.start_date);
                                                                        return holidayDate.getDate() === parseInt(date.slice(8, 10), 10);
                                                                    });
                                                                    const hasLeave = leaveMap[attendances.user_id] && leaveMap[attendances.user_id].has(day);
                                                                    return (
                                                                        <td key={date} className='text-danger'>
                                                                            {hasLeave ? 'L' : isHoliday ? 'H' : ''}
                                                                        </td>
                                                                    );
                                                                })} */}
{/* {daysInMonth.map(date => {
                                                                    const day = date.slice(0, 10); // Extract date in YYYY-MM-DD format
                                                                    const isHoliday = filteredAttendances.some(holiday => {
                                                                        const holidayDate = new Date(holiday.start_date);
                                                                        return holidayDate.getDate() === parseInt(date.slice(8, 10), 10);
                                                                    });
                                                                    const hasLeave = leaveMap[attendances.user_id] && leaveMap[attendances.user_id].has(day);

                                                                    let cellContent = '';
                                                                    let cellClass = '';

                                                                    if (hasLeave) {
                                                                        cellContent = 'L';
                                                                        cellClass = 'text-success font-weight-bold'; // Green color for leave
                                                                    } else if (isHoliday) {
                                                                        cellContent = 'H';
                                                                        cellClass = 'text-primary font-weight-bold'; // Blue color for holiday
                                                                    }

                                                                    return (
                                                                        <td key={date} className={cellClass}>
                                                                            {cellContent}
                                                                        </td>
                                                                    );
                                                                })} */}


{/* {daysInMonth.map(date => {
                                                                    const day = date.slice(0, 10); // Extract date in YYYY-MM-DD format
                                                                    const isHoliday = filteredAttendances.some(holiday => {
                                                                        const holidayDate = new Date(holiday.start_date);
                                                                        return holidayDate.getDate() === parseInt(date.slice(8, 10), 10);
                                                                    });
                                                                    const hasLeave = leaveMap[attendances.user_id] && leaveMap[attendances.user_id].has(day);

                                                                    const key = `${attendances.user_id}-${day}`;
                                                                    const isPresent = attendanceLookup[key];

                                                                    let cellContent = '';
                                                                    let cellClass = '';

                                                                    if (isPresent) {
                                                                        cellContent = 'P';
                                                                        cellClass = 'font-weight-bold'; // Blue color for Present
                                                                    } else if (hasLeave) {
                                                                        cellContent = 'L';
                                                                        cellClass = 'text-success font-weight-bold'; // Green color for leave
                                                                    } else if (isHoliday) {
                                                                        cellContent = 'H';
                                                                        cellClass = 'text-primary font-weight-bold'; // Blue color for holiday
                                                                    } else {
                                                                        cellContent = 'A';
                                                                        cellClass = 'text-danger font-weight-bold'; // Grey color for absent
                                                                    }

                                                                    return (
                                                                        <td key={date} className={cellClass}>
                                                                            {cellContent}
                                                                        </td>
                                                                    );
                                                                })} */}