'use client'
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import * as XLSX from "xlsx";
import { Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun, ImageRun, WidthType } from 'docx';
import Select from 'react-dropdown-select';

const AttendanceSummarys = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [itemName, setItemName] = useState('');
    const [employee, setEmployee] = useState('');
    const [filteredDesignations, setFilteredDesignations] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchResults, setSearchResults] = useState([]);


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
    };

    const handleDesignationChange = (designationId) => {
        setSearchQuery(designationId);

        const filteredEmployees = employees.filter(employee =>
            employee.branch_id === parseFloat(itemName) && employee.designation_id === parseFloat(designationId)
        );
        setFilteredEmployees(filteredEmployees);
    };



    const [error, setError] = useState([])
    const [loading, setLoading] = useState(false)


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
        if (selectedMonths.length === 0) {
            alert('select a months')
            setLoading(false);
            return
        }
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_summary_search`, {
            itemName, transformedData
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

    console.log(searchResults)



    const buttonStyles = {
        color: '#fff',
        backgroundColor: '#510bc4',
        backgroundImage: 'none',
        borderColor: '#4c0ab8',
    };


    const [years, setYears] = useState([]);

    useEffect(() => {
        const startYear = 2022;
        const currentYear = new Date().getFullYear();
        const yearOptions = [];

        for (let year = startYear; year <= currentYear; year++) {
            yearOptions.push(year);
        }

        setYears(yearOptions);
    }, []);


    const [selectedMonths, setSelectedMonths] = useState([]);

    // Array of months
    const months = [
        { label: 'January', value: '01' },
        { label: 'February', value: '02' },
        { label: 'March', value: '03' },
        { label: 'April', value: '04' },
        { label: 'May', value: '05' },
        { label: 'June', value: '06' },
        { label: 'July', value: '07' },
        { label: 'August', value: '08' },
        { label: 'September', value: '09' },
        { label: 'October', value: '10' },
        { label: 'November', value: '11' },
        { label: 'December', value: '12' },
    ];

    // Handle changes in selection
    const handleChange = (selectedOptions) => {
        setSelectedMonths(selectedOptions || []);
    };


    console.log(selectedMonths)
    console.log(searchQuery)

    const transformedData = selectedMonths.map(item => ({
        ...item,
        value: `${searchQuery}-${item.value}`
    }));

    const transformedDatas = months.map(item => ({
        ...item,
        value: `${searchQuery}-${item.value}`
    }));

    console.log(transformedData)
    console.log(transformedDatas)

    const { data: holidays = [] } = useQuery({
        queryKey: ['holidays'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/yearly_holiday/yearly_holiday_all_list`)
            const data = await res.json()
            return data
        }
    });

    const monthValues = transformedData.map(month => month.value);

    const filteredAttendances = holidays.filter(att => {
        const checktimeMonthYear = att.start_date.substring(0, 7);
        return monthValues.includes(checktimeMonthYear);
    });

    console.log(filteredAttendances);
    console.log(monthValues);


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

    const matchLength = leaveApproveCount.map(emp => {
        const matchCount = leavesDaysApproved.filter(att => {
            const approvedMonthYear = att.approved_date.substring(0, 7);
            return att.leave_application_id === emp.id && monthValues.includes(approvedMonthYear);
        }).length;

        return { user_id: emp.whose_leave, match_length: matchCount };
    });

    console.log(matchLength);

    const getTotalDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate(); // returns the last day of the month
    };

    const totalDaysInMonths = transformedData.map(month => {
        const [year, monthIndex] = month.value.split('-').map(Number);
        const totalDays = getTotalDaysInMonth(year, monthIndex);
        return { label: month.label, value: month.value, total_days: totalDays };
    });

    console.log(totalDaysInMonths);

    const sumOfTotalDays = totalDaysInMonths.reduce((acc, month) => acc + month.total_days, 0);
    console.log(sumOfTotalDays)


    const { data: attendances = [] } = useQuery({
        queryKey: ['attendances'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_all_list`)
            const data = await res.json()
            return data
        }
    });


    const filteredAttendance = attendances.filter(att => {
        const checktimeMonthYear = att.first_checkin.substring(0, 7);
        return transformedData.some(month => month.value === checktimeMonthYear);
    });

    console.log(filteredAttendance)
    const groupedByUserAndMonth = {};

    // Group the filtered attendance by user_id and month value
    filteredAttendance.forEach(att => {
        const checktimeMonthYear = att.first_checkin.substring(0, 7);
        const userId = att.user_id;

        if (!groupedByUserAndMonth[userId]) {
            groupedByUserAndMonth[userId] = { match_length_total: 0, match_length: [] };
        }

        // Increment the total count
        groupedByUserAndMonth[userId].match_length_total++;

        // Find or create the month entry
        let monthEntry = groupedByUserAndMonth[userId].match_length.find(month => Object.keys(month)[0] === checktimeMonthYear);
        if (!monthEntry) {
            monthEntry = { [checktimeMonthYear]: 0 };
            groupedByUserAndMonth[userId].match_length.push(monthEntry);
        }

        // Increment the month count
        monthEntry[checktimeMonthYear]++;
    });

    // Convert the grouped data to the desired format
    const result = Object.entries(groupedByUserAndMonth).map(([user_id, { match_length_total, match_length }]) => ({
        user_id: parseInt(user_id, 10),
        match_length_total,
        match_length
    }));

    // Ensure that the length of match_length equals match_length_total
    result.forEach(user => {
        user.match_length_total = user.match_length.reduce((total, monthEntry) => total + Object.values(monthEntry)[0], 0);
    });

    console.log(result);


    const data = attendances.flatMap(id =>
        monthValues.map((month) => {
            // Find the relevant entry for the current user and month
            const monthData = result.find(att => att.user_id === id.user_id);

            // If monthData is found, extract the `match_length` for the current month
            const matchLengthForMonth = monthData?.match_length.find(entry => Object.keys(entry)[0] === month);

            return {
                user_id: id.user_id,
                month: month, // Using the month string directly
                count: matchLengthForMonth ? Object.values(matchLengthForMonth)[0] : 0
            };
        })
    );

    console.log(data);




    const attendance_summary_excel_download = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_summary_search`, {
                itemName, transformedData
            });
            const searchResults = response.data;

            // Define the columns
            const columns = [
                'Employee ID',
                'Name',
                'Designation',
                'Total Working Day',
                'Total Present',
                'Total Absent',
                ...transformedDatas.map(month => month.label)
            ];

            // Filter the data
            const filteredColumns = searchResults.map((attendances, index) => {
                const totalWorkingDay = parseFloat(sumOfTotalDays) - (parseFloat(filteredAttendances.length) + parseFloat(matchLength.find(item => item.user_id === attendances.user_id)?.match_length || 0));
                const totalPresent = result.find(item => item.user_id === attendances.user_id)?.match_length_total || 0;
                const totalAbsent = totalWorkingDay - totalPresent;

                const filteredData = {
                    'Employee ID': attendances.unique_id,
                    'Name': attendances.full_name,
                    'Designation': attendances.designation_name,
                    'Total Working Day': totalWorkingDay,
                    'Total Present': totalPresent,
                    'Total Absent': totalAbsent,
                };

                transformedDatas.forEach((month) => {
                    const match = data.find(d => d.user_id === attendances.user_id && d.month === month.value);
                    filteredData[month.label] = match ? match.count : 0;
                });

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

    const attendance_summary_word_download = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_summary_search`, {
                itemName, transformedData
            });
            const searchResults = response.data;

            // Define columns and headers
            const columns = [
                'Employee ID', 'Name', 'Designation', 'Total Working Day', 'Total Present', 'Total Absent', ...transformedDatas.map(month => month.label)
            ];

            // Create header row with bold text
            const headerRow = new TableRow({
                children: columns.map(column => new TableCell({
                    children: [new Paragraph({
                        text: column,
                        bold: true, // Make header text bold
                        size: 32, // Set font size to make it more prominent
                        color: '000000' // Optional: Set color to black (default)
                    })],
                    borders: {},
                })),
            });

            // Create data rows
            const dataRows = await Promise.all(searchResults.map(async (attendances, index) => {
                const user_id = attendances.user_id;
                const totalWorkingDays = (parseFloat(sumOfTotalDays) - (parseFloat(filteredAttendances.length) + parseFloat(matchLength.find(item => item.user_id === user_id)?.match_length || 0)));
                const totalPresent = result.find(item => item.user_id === user_id)?.match_length_total || 0;
                const totalAbsent = totalWorkingDays - totalPresent;

                const dataCells = [
                    new TableCell({
                        children: [new Paragraph({ text: `${attendances.unique_id}` })],
                        borders: {},
                    }),
                    new TableCell({
                        children: [new Paragraph({ text: attendances.full_name })],
                        borders: {},
                    }),
                    new TableCell({
                        children: [new Paragraph({ text: attendances.designation_name })],
                        borders: {},
                    }),
                    new TableCell({
                        children: [new Paragraph({ text: `${totalWorkingDays}` })],
                        borders: {},
                    }),
                    new TableCell({
                        children: [new Paragraph({ text: `${totalPresent}` })],
                        borders: {},
                    }),
                    new TableCell({
                        children: [new Paragraph({ text: `${totalAbsent}` })],
                        borders: {},
                    }),
                    ...transformedDatas.map(month => {
                        const match = data.find(d =>
                            d.user_id === user_id && d.month === month.value
                        );
                        return new TableCell({
                            children: [new Paragraph({ text: match ? `${match.count}` : '0' })],
                            borders: {},
                        });
                    })
                ];

                return new TableRow({ children: dataCells });
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
                                new TextRun("Attendance Summary")
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
            link.download = 'attendance_summary.docx';
            link.click();
        } catch (error) {
            console.error("An error occurred during printing.", error);
            setError("An error occurred during printing.", error);
        }
    };

    const attendance_summary_print_download = async () => {
        try {
            // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_remarks_list_visit/${id}`);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_summary_search`, {
                itemName, transformedData
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



            const printWindow = window.open('', '_blank');
            printWindow.document.open();

            const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_summary_print`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults, transformedDatas, sumOfTotalDays, filteredAttendances, matchLength, result, orientation, selectedPrintSize, fontSize, extraColumnValue, data
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

    const attendance_summary_pdf_download = async () => {

        // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_summary_search`, {
            itemName, transformedData
        });


        const searchResults = response.data
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
        const selectedFontSize = document.querySelector('.font_size').value;

        // Get the numeric part of the selected font size value
        const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;

        console.log(searchResults)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_summary_pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults, transformedDatas, sumOfTotalDays, filteredAttendances, matchLength, result, orientation, selectedPrintSize, fontSize, data
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
            // setErrorr(error.message);
        } finally {
            // setLoading(false);
        }
    };


    const { data: absents = [] } = useQuery({
        queryKey: ['absents'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/absent/absent_all`)
            const data = await res.json()
            return data
        }
    });


    const filteredAbsents = absents.filter(att => {
        const checktimeMonthYear = att.checktime.substring(0, 7);
        return transformedData.some(month => month.value === checktimeMonthYear);
    });

    console.log(filteredAbsents)
    const groupedByUserAndMonths = {};

    // Group the filtered attendance by user_id and month value
    filteredAbsents.forEach(att => {
        const checktimeMonthYear = att.checktime.substring(0, 7);
        const userId = att.user_id;

        if (!groupedByUserAndMonths[userId]) {
            groupedByUserAndMonths[userId] = { match_length_total: 0, match_length: [] };
        }

        // Increment the total count
        groupedByUserAndMonths[userId].match_length_total++;

        // Find or create the month entry
        let monthEntry = groupedByUserAndMonths[userId].match_length.find(month => Object.keys(month)[0] === checktimeMonthYear);
        if (!monthEntry) {
            monthEntry = { [checktimeMonthYear]: 0 };
            groupedByUserAndMonths[userId].match_length.push(monthEntry);
        }

        // Increment the month count
        monthEntry[checktimeMonthYear]++;
    });

    // Convert the grouped data to the desired format
    const results = Object.entries(groupedByUserAndMonths).map(([user_id, { match_length_total, match_length }]) => ({
        user_id: parseInt(user_id, 10),
        match_length_total,
        match_length
    }));

    // Ensure that the length of match_length equals match_length_total
    results.forEach(user => {
        user.match_length_total = user.match_length.reduce((total, monthEntry) => total + Object.values(monthEntry)[0], 0);
    });

    console.log(results);



    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 p-4">
                    <div className='card mb-4'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Attendance Log</h5>
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
                                                <label className="col-form-label col-md-2 font-weight-bold">Months:</label>
                                                <div className="col-md-4">
                                                    <Select
                                                        multi
                                                        options={[
                                                            ...months
                                                        ]}
                                                        // onChange={handleChange}
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            setSearchResults([]); // Clear search results when year changes
                                                        }}
                                                    />
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
                                                        onClick={news_search}
                                                        type="button" name="search" className="btn btn-sm btn-info search_btn mr-2" value="Search" />
                                                    <input
                                                        onClick={attendance_summary_word_download}
                                                        type="button" name="search"
                                                        className="btn btn-sm btn-secondary excel_btn mr-2"
                                                        value="Download Doc" />
                                                    <input
                                                        type='button'
                                                        onClick={attendance_summary_excel_download}
                                                        name="search"
                                                        className="btn btn-sm btn-secondary excel_btn mr-2"
                                                        value="Download Excel" />
                                                    <input
                                                        onClick={attendance_summary_pdf_download}
                                                        type="button" name="search" class="btn btn-sm btn-indigo pdf_btn mr-2" style={buttonStyles} value="Download PDF" />
                                                    <input
                                                        onClick={attendance_summary_print_download}
                                                        type="button" name="search" class="btn btn-sm btn-success print_btn mr-2" value="Print" />
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


                                                            {transformedDatas.map((month) => (
                                                                <th key={month.value}>{month.label}</th>
                                                            ))}
                                                            <th>Total Working Day</th>
                                                            <th>Total Present</th>
                                                            <th>Total Absent</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {searchResults.map((attendances, i) => (
                                                            <tr key={i}>
                                                                <td>{attendances.unique_id}</td>
                                                                <td>{attendances.full_name}</td>
                                                                <td>{attendances.designation_name}</td>


                                                                {/* <td>{(((parseFloat(sumOfTotalDays) - (parseFloat(filteredAttendances.length) + parseFloat(matchLength.find(item => item.user_id === attendances.user_id)?.match_length || 0)))) - (result.find(item => item.user_id === attendances.user_id)?.match_length_total || 0))}</td> */}


                                                                {transformedDatas.map((month) => {
                                                                    const match = data.find(d =>
                                                                        d.user_id === attendances.user_id &&
                                                                        d.month === month.value
                                                                    );
                                                                    return (
                                                                        <td key={month.value}>
                                                                            {match ? match.count : 0}
                                                                        </td>
                                                                    );
                                                                })}

                                                                <td>{(parseFloat(sumOfTotalDays) - (parseFloat(filteredAttendances.length) + parseFloat(matchLength.find(item => item.user_id === attendances.user_id)?.match_length || 0)))}</td>

                                                                <td>{result.find(item => item.user_id === attendances.user_id)?.match_length_total || 0}</td>
                                                                <td>{results.find(item => item.user_id === attendances.user_id)?.match_length_total || 0}</td>

                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceSummarys;




//   <div className="card-body">
//                                             <div className="table-responsive">
//                                                 <table id='mytable' className="table table-bordered table-hover table-striped table-sm">
//                                                     <thead>
//                                                         <tr>
//                                                             <th>Employee ID</th>
//                                                             <th>Name</th>
//                                                             <th>Designation</th>
//                                                             {/* <th>Total Holiday</th> */}
//                                                             {/* <th>Total Leave</th> */}
//                                                             {/* <th>Total Days</th> */}
//                                                             <th>Total Working Day</th>
//                                                             <th>Total Present</th>
//                                                             <th>Total Absent</th>
//                                                             {transformedDatas.map((month) => (
//                                                                 <th key={month.value}>{month.label}</th>
//                                                             ))}
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody>
//                                                         {searchResults.map((attendances, i) => (
//                                                             <tr key={i}>
//                                                                 <td>{attendances.unique_id}</td>
//                                                                 <td>{attendances.full_name}</td>
//                                                                 <td>{attendances.designation_name}</td>
//                                                                 {/* <td>{filteredAttendances.length}</td> */}
//                                                                 {/* <td>{matchLength.find(item => item.user_id === attendances.user_id)?.match_length || 0}</td> */}
//                                                                 {/* <td>{sumOfTotalDays}</td> */}

//                                                                 <td>{(parseFloat(sumOfTotalDays) - (parseFloat(filteredAttendances.length) + parseFloat(matchLength.find(item => item.user_id === attendances.user_id)?.match_length || 0)))}</td>

//                                                                 <td>{result.find(item => item.user_id === attendances.user_id)?.match_length_total || 0}</td>

//                                                                 <td>{(((parseFloat(sumOfTotalDays) - (parseFloat(filteredAttendances.length) + parseFloat(matchLength.find(item => item.user_id === attendances.user_id)?.match_length || 0)))) - (result.find(item => item.user_id === attendances.user_id)?.match_length_total || 0))}</td>


//                                                                 {transformedDatas.map((month) => {
//                                                                     const match = data.find(d =>
//                                                                         d.user_id === attendances.user_id &&
//                                                                         d.month === month.value
//                                                                     );
//                                                                     return (
//                                                                         <td key={month.value}>
//                                                                             {match ? match.count : 0}
//                                                                         </td>
//                                                                     );
//                                                                 })}


//                                                             </tr>
//                                                         ))}
//                                                     </tbody>
//                                                 </table>
//                                             </div>
//                                         </div>


