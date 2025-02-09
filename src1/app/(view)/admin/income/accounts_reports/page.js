'use client'
//ismile
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AccountReports = () => {
    const [results, setResults] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [incomeSearch, setIncomeSearch] = useState([]);
    const [loading, setLoading] = useState(false);
    const [yearName, setYearName] = useState('');
    const [years, setYears] = useState([]);
    const [type, setType] = useState('daily');
    const [formattedRows, setFormattedRows] = useState([]); // New state for formatted rows
    const [error, setError] = useState(null);


    useEffect(() => {
        const startYear = 2023;
        const currentYear = new Date().getFullYear();
        const yearOptions = [];
        for (let year = startYear; year <= currentYear; year++) {
            yearOptions.push(year);
        }
        setYears(yearOptions);
    }, []);

    const expense_search = async () => {
        setLoading(true);
        if (!yearName) {
            alert('Select Year');
            setLoading(false);
            return;
        }

        try {
            const expenseResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/expense_amount_account_report`, {
                yearName,
                type,
            });

            const incomeResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/income_amount_account_report`, {
                yearName,
                type,
            });

            const combinedResults = expenseResponse.data.results;
            const combinedResultsIncome = incomeResponse.data.results;

            setSearchResults(combinedResults);
            setIncomeSearch(combinedResultsIncome);
            formatTableRows(combinedResults, combinedResultsIncome, type); // Call to format rows
        } catch (error) {
            setError("An error occurred during search.");
            setSearchResults([]);
        } finally {
            setLoading(false); // Ensure loading is turned off
        }
    };



    console.log(yearName)
    console.log(searchResults)
    const formatTableRows = (expenses, incomes, type) => {
        const combinedData = {};

        const year = parseFloat(yearName); // Assuming yearName is defined somewhere in your code
        const currentYear = new Date().getFullYear(); // Get the current year
        const currentDate = new Date(); // Get the current date
        const startDate = new Date(year, 0, 1); // January 1st of the specified year
        const endDate = new Date(year, 11, 31); // December 31st of the specified year

        // Define a function to ensure category keys exist and initialize them
        const initializeCategories = () => {
            return {
                incomeCategories: Object.fromEntries(incomes.map(category => [category.income_category, 0.00])),
                expenseCategories: Object.fromEntries(expenses.map(category => [category.expense_category, 0.00]))
            };
        };

        // Initialize the data structure based on the time type
        if (type === 'daily') {
            if (year === currentYear) {
                for (let day = new Date(year, 0, 1); day <= currentDate; day.setDate(day.getDate() + 1)) {
                    const dateKey = `${day.getDate().toString().padStart(2, '0')}-${(day.getMonth() + 1).toString().padStart(2, '0')}-${year}`;
                    combinedData[dateKey] = {
                        income: 0,
                        totalExpense: 0,
                        totalPurchase: 0,
                        totalSale: 0,
                        salaryExpense: 0,
                        ...initializeCategories()
                    };
                }
            } else {
                for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
                    const dateKey = `${day.getDate().toString().padStart(2, '0')}-${(day.getMonth() + 1).toString().padStart(2, '0')}-${year}`;
                    combinedData[dateKey] = {
                        income: 0,
                        totalExpense: 0,
                        totalPurchase: 0,
                        totalSale: 0,
                        salaryExpense: 0,
                        ...initializeCategories()
                    };
                }
            }
        } else if (type === 'monthly') {
            const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            allMonths.forEach((month, index) => {
                const monthKey = `${month}-${year}`;
                if (year === currentYear && index > currentDate.getMonth()) {
                    return;
                }
                combinedData[monthKey] = {
                    income: 0,
                    totalSale: 0,
                    totalExpense: 0,
                    totalPurchase: 0,
                    salaryExpense: 0,
                    ...initializeCategories()
                };
            });
        }

        // Process expenses
        expenses.forEach(expense => {
            const { created_date, sub_total_expense, expense_category, sub_total_salary, sub_total_purchase } = expense;
            const expenseDate = new Date(created_date);
            const dateKey = type === 'daily'
                ? `${expenseDate.getDate().toString().padStart(2, '0')}-${(expenseDate.getMonth() + 1).toString().padStart(2, '0')}-${expenseDate.getFullYear()}`
                : `${expenseDate.toLocaleString('default', { month: 'short' })}-${expenseDate.getFullYear()}`;

            if (!combinedData[dateKey]) {
                combinedData[dateKey] = {
                    income: 0,
                    totalExpense: 0,
                    totalPurchase: 0,
                    totalSale: 0,
                    salaryExpense: 0,
                    ...initializeCategories()
                };
            }

            combinedData[dateKey].totalExpense += sub_total_expense;
            // if (expense_category === "Salary") {
            //     combinedData[dateKey].salaryExpense += sub_total_expense;
            // }
            if (expense_category === "Purchase") {
                combinedData[dateKey].totalPurchase += sub_total_expense;
            }

            if (!combinedData[dateKey].expenseCategories[expense_category]) {
                combinedData[dateKey].expenseCategories[expense_category] = 0;
            }
            combinedData[dateKey].expenseCategories[expense_category] += sub_total_expense;
        });

        // Process incomes
        incomes.forEach(income => {
            const { created_date, sub_total_income, income_category } = income;
            const incomeDate = new Date(created_date);
            const dateKey = type === 'daily'
                ? `${incomeDate.getDate().toString().padStart(2, '0')}-${(incomeDate.getMonth() + 1).toString().padStart(2, '0')}-${incomeDate.getFullYear()}`
                : `${incomeDate.toLocaleString('default', { month: 'short' })}-${incomeDate.getFullYear()}`;

            if (!combinedData[dateKey]) {
                combinedData[dateKey] = {
                    income: 0,
                    totalExpense: 0,
                    totalPurchase: 0,
                    totalSale: 0,
                    salaryExpense: 0,
                    ...initializeCategories()
                };
            }

            combinedData[dateKey].income += sub_total_income;
            if (income_category === "Sale") {
                combinedData[dateKey].totalSale += sub_total_income;
            }

            if (!combinedData[dateKey].incomeCategories[income_category]) {
                combinedData[dateKey].incomeCategories[income_category] = 0;
            }
            combinedData[dateKey].incomeCategories[income_category] += sub_total_income;
        });

        // Create headers for income and expense categories
        // const incomeCategoriesHeaders = Object.keys(incomes.reduce((acc, { income_category }) => {
        //     acc[income_category] = true;
        //     return acc;
        // }, {}));

        // const expenseCategoriesHeaders = Object.keys(expenses.reduce((acc, { expense_category }) => {
        //     acc[expense_category] = true;
        //     return acc;
        // }, {}));
        const incomeCategoriesHeaders = Object.keys(incomes.reduce((acc, { income_category }) => {
            if (income_category !== 'Sale') {
                acc[income_category] = true;
            }
            return acc;
        }, {}));

        const expenseCategoriesHeaders = Object.keys(expenses.reduce((acc, { expense_category }) => {
            if (expense_category !== 'Purchase') {
                acc[expense_category] = true;
            }
            return acc;
        }, {}));


        const headers = [
            'SL.', 'Date', 'Opening Balance', ...incomeCategoriesHeaders, 'Total Sale', 'Total Income', ...expenseCategoriesHeaders, 'Total Purchase', 'Total Expense', 'Total Balance'
        ];

        // Format table rows
        let previousBalance = 0;
        const tableRows = Object.keys(combinedData).sort((a, b) => {
            if (type === 'daily') {
                const [dayA, monthA, yearA] = a.split('-').map(Number);
                const [dayB, monthB, yearB] = b.split('-').map(Number);
                return yearA - yearB || monthA - monthB || dayA - dayB;
            } else {
                const [monthA, yearA] = a.split('-');
                const [monthB, yearB] = b.split('-');
                const monthIndexA = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthA);
                const monthIndexB = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthB);
                return yearA - yearB || monthIndexA - monthIndexB;
            }
        }).map((date, index) => {
            const data = combinedData[date];
            const total = data.income - (data.totalExpense + data.salaryExpense);
            const openingBalance = previousBalance;
            const closingBalance = openingBalance + total;
            previousBalance = closingBalance;

            const incomeCategoryValues = incomeCategoriesHeaders.map(category => data.incomeCategories[category].toFixed(2));
            const expenseCategoryValues = expenseCategoriesHeaders.map(category => data.expenseCategories[category].toFixed(2));

            return (
                <tr key={date}>
                    <td>{index + 1}</td>
                    <td>{date}</td> {/* Display formatted date or month */}
                    <td>{openingBalance.toFixed(2)}</td> {/* Opening balance */}
                    {incomeCategoryValues.map((value, i) => <td key={i}>{value}</td>)}
                    <td>{data.totalSale.toFixed(2)}</td>
                    <td>{data.income.toFixed(2)}</td>
                    {expenseCategoryValues.map((value, i) => <td key={i}>{value}</td>)}
                    <td>{data.totalPurchase.toFixed(2)}</td>
                    <td>{data.totalExpense.toFixed(2)}</td>
                    {/* <td>{data.salaryExpense.toFixed(2)}</td> */}
                    <td>{total.toFixed(2)}</td> {/* Total income - total expenses */}
                </tr>
            );
        });

        setFormattedRows(tableRows);
        setResults(headers)


    };

    // const formatTableRows = (expenses, incomes, type) => {
    //     const combinedData = {};
    //     const year = parseFloat(yearName); // Assuming yearName is defined somewhere in your code
    //     const currentYear = new Date().getFullYear(); // Get the current year
    //     const currentDate = new Date(); // Get the current date
    //     const startDate = new Date(year, 0, 1); // January 1st of the specified year
    //     const endDate = new Date(year, 11, 31); // December 31st of the specified year

    //     if (type === 'daily') {
    //         // Check if the specified year is the current year
    //         if (year === currentYear) {
    //             // Initialize daily data from January 1st to the current date
    //             for (let day = new Date(year, 0, 1); day <= currentDate; day.setDate(day.getDate() + 1)) {
    //                 const dateKey = `${day.getDate().toString().padStart(2, '0')}-${(day.getMonth() + 1).toString().padStart(2, '0')}-${year}`; // DD-MM-YYYY
    //                 combinedData[dateKey] = {
    //                     income: 0,
    //                     totalExpense: 0,
    //                     salaryExpense: 0,
    //                 };
    //             }
    //         } else {
    //             // If the specified year is not the current year, load all days of that year
    //             for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
    //                 const dateKey = `${day.getDate().toString().padStart(2, '0')}-${(day.getMonth() + 1).toString().padStart(2, '0')}-${year}`; // DD-MM-YYYY
    //                 combinedData[dateKey] = {
    //                     income: 0,
    //                     totalExpense: 0,
    //                     salaryExpense: 0,
    //                 };
    //             }
    //         }
    //     } else if (type === 'monthly') {
    //         const allMonths = [
    //             'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    //             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    //         ];

    //         // Initialize combinedData with all months and zeros for monthly
    //         allMonths.forEach((month, index) => {
    //             const monthKey = `${month}-${year}`; // Format Mon-YYYY
    //             if (year === currentYear && index > currentDate.getMonth()) {
    //                 // If the year is the current year, skip months after the current month
    //                 return;
    //             }
    //             combinedData[monthKey] = {
    //                 income: 0,
    //                 totalExpense: 0,
    //                 salaryExpense: 0,
    //             };
    //         });
    //     }

    //     // Process expenses
    //     expenses.forEach(expense => {
    //         const { created_date, sub_total_expense, expense_category } = expense;
    //         const expenseDate = new Date(created_date);

    //         let dateKey;
    //         if (type === 'daily') {
    //             dateKey = `${expenseDate.getDate().toString().padStart(2, '0')}-${(expenseDate.getMonth() + 1).toString().padStart(2, '0')}-${expenseDate.getFullYear()}`; // DD-MM-YYYY
    //         } else {
    //             dateKey = `${expenseDate.toLocaleString('default', { month: 'short' })}-${expenseDate.getFullYear()}`; // Mon-YYYY
    //         }

    //         if (!combinedData[dateKey]) {
    //             combinedData[dateKey] = {
    //                 income: 0,
    //                 totalExpense: 0,
    //                 salaryExpense: 0,
    //             };
    //         }
    //         if (expense_category === "Salary") {
    //             combinedData[dateKey].salaryExpense += sub_total_expense;
    //         } else {
    //             combinedData[dateKey].totalExpense += sub_total_expense;
    //         }
    //     });

    //     // Process incomes
    //     incomes.forEach(income => {
    //         const { created_date, sub_total_income } = income;
    //         const incomeDate = new Date(created_date);

    //         let dateKey;
    //         if (type === 'daily') {
    //             dateKey = `${incomeDate.getDate().toString().padStart(2, '0')}-${(incomeDate.getMonth() + 1).toString().padStart(2, '0')}-${incomeDate.getFullYear()}`; // DD-MM-YYYY
    //         } else {
    //             dateKey = `${incomeDate.toLocaleString('default', { month: 'short' })}-${incomeDate.getFullYear()}`; // Mon-YYYY
    //         }

    //         if (!combinedData[dateKey]) {
    //             combinedData[dateKey] = {
    //                 income: 0,
    //                 totalExpense: 0,
    //                 salaryExpense: 0,
    //             };
    //         }
    //         combinedData[dateKey].income += sub_total_income;
    //     });

    //     // Create formatted rows with opening balance calculation
    //     let previousBalance = 0; // Track the previous balance (starting with 0)

    //     const tableRows = Object.keys(combinedData).sort((a, b) => {
    //         if (type === 'daily') {
    //             const [dayA, monthA, yearA] = a.split('-').map(Number);
    //             const [dayB, monthB, yearB] = b.split('-').map(Number);
    //             return yearA - yearB || monthA - monthB || dayA - dayB; // Sort by year, month, then day
    //         } else { // Monthly
    //             const [monthA, yearA] = a.split('-');
    //             const [monthB, yearB] = b.split('-');
    //             const monthIndexA = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthA);
    //             const monthIndexB = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthB);
    //             return yearA - yearB || monthIndexA - monthIndexB; // Sort by year and month index
    //         }
    //     }).map((date, index) => {
    //         const data = combinedData[date];
    //         const total = data.income - (data.totalExpense + data.salaryExpense);
    //         const openingBalance = previousBalance; // Set opening balance as previous closing balance
    //         const closingBalance = openingBalance + total; // Calculate the new closing balance

    //         // Update previous balance to current closing balance for the next iteration
    //         previousBalance = closingBalance;

    //         return (
    //             <tr key={date}>
    //                 <td>{index + 1}</td>
    //                 <td>{date}</td> {/* Display formatted date or month */}
    //                 <td>{openingBalance.toFixed(2)}</td> {/* Opening balance */}
    //                 <td>{data.income.toFixed(2)}</td>
    //                 <td>{data.totalExpense.toFixed(2)}</td>
    //                 <td>{data.salaryExpense.toFixed(2)}</td>
    //                 <td>{total.toFixed(2)}</td> {/* Total income - total expenses */}
    //             </tr>
    //         );
    //     });

    //     setFormattedRows(tableRows); // Update formatted rows state
    // };





    const accounts_report_print = async () => {


        try {
            const expenseResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/expense_amount_account_report`, {
                yearName,
                type,
            });

            const incomeResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/income_amount_account_report`, {
                yearName,
                type,
            });

            const combinedResults = expenseResponse.data.results;
            const combinedResultsIncome = incomeResponse.data.results;
            // const extraColumnValue = parseInt(document.getElementById('extra_column').value);
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
            // const extraColumnValue = parseInt(document.getElementById('extra_column').value);


            console.log(searchResults);

            const printWindow = window.open('', '_blank');
            printWindow.document.open();

            const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/accounts_report_print`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orientation, selectedPrintSize, fontSize, expenses: combinedResults, incomes: combinedResultsIncome, type, yearName

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



    const accounts_report_pdf = async () => {

        const expenseResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/expense_amount_account_report`, {
            yearName,
            type,
        });

        const incomeResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/income_amount_account_report`, {
            yearName,
            type,
        });

        const combinedResults = expenseResponse.data.results;
        const combinedResultsIncome = incomeResponse.data.results;

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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/accounts_report_pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orientation, selectedPrintSize, fontSize, expenses: combinedResults, incomes: combinedResultsIncome, type, yearName
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
            a.download = 'attendance_pdf.pdf';
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
                    <div className='card mb-4'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Search</h5>
                                </div>
                                <div className="card-body">
                                    <form>
                                        <div className="col-md-10 offset-md-1">
                                            <div className="form-group row student">
                                                <label className="col-form-label col-md-2 font-weight-bold">Year:</label>
                                                <div className="col-md-4">
                                                    <select
                                                        required
                                                        value={yearName}
                                                        onChange={(e) => setYearName(e.target.value)}
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
                                                <label className="col-form-label col-md-2 font-weight-bold">Type:</label>
                                                <div className="col-md-4">
                                                    <select name="type"
                                                        value={type}
                                                        onChange={(e) => setType(e.target.value)}
                                                        className="form-control form-control-sm type">
                                                        {/* <option value="">Select Option</option> */}
                                                        <option value="daily">Daily</option>
                                                        <option value="monthly">Monthly</option>
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
                                                        type="button"
                                                        name="search"
                                                        className="btn btn-sm btn-info search_btn mr-2"
                                                        value="Search"
                                                        onClick={expense_search}
                                                    />
                                                    <input
                                                        type="button"
                                                        name="print"
                                                        className="btn btn-sm btn-success print_btn mr-2"
                                                        value="Print"
                                                        onClick={accounts_report_print}
                                                    />
                                                    <input
                                                        type="button"
                                                        name="download_pdf"
                                                        className="btn btn-sm btn-secondary excel_btn mr-2"
                                                        value="Download PDF"
                                                        onClick={accounts_report_pdf}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="">
                        {loading ? (
                            <div className='text-center'>
                                <FontAwesomeIcon style={{ height: '33px', width: '33px' }} icon={faSpinner} spin />
                            </div>
                        ) : (
                            (searchResults.length > 0 || incomeSearch.length > 0) ? (
                                <div className='card mb-4'>
                                    <div className="body-content bg-light">
                                        <div className="border-primary shadow-sm border-0">
                                            <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                                <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Account Report</h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="table-responsive">
                                                    <table className="table table-bordered table-hover table-striped table-sm">

                                                        <thead>
                                                            {/* <tr>
                                                                {results.map((header, index) => (
                                                                    <th key={index}>{header}</th>
                                                                ))}
                                                            </tr> */}
                                                            <tr>
                                                                {results.map((header, index) => (
                                                                    <th key={index}>
                                                                        {header.charAt(0).toUpperCase() + header.slice(1)}
                                                                    </th>
                                                                ))}
                                                            </tr>

                                                        </thead>

                                                        <tbody>
                                                            {formattedRows.length > 0 ? formattedRows : (
                                                                <tr>
                                                                    <td colSpan="7">No data available</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className='alert alert-danger'>No records found</div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountReports;





// 'use client'
// //ismile
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';

// const AccountReports = () => {
//     const [searchResults, setSearchResults] = useState([]);
//     const [results, setResults] = useState([]);
//     const [incomeSearch, setIncomeSearch] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [yearName, setYearName] = useState('');
//     const [years, setYears] = useState([]);
//     const [type, setType] = useState('daily');
//     const [formattedRows, setFormattedRows] = useState([]); // New state for formatted rows
//     const [error, setError] = useState(null);
//     console.log(results)

//     useEffect(() => {
//         const startYear = 2023;
//         const currentYear = new Date().getFullYear();
//         const yearOptions = [];
//         for (let year = startYear; year <= currentYear; year++) {
//             yearOptions.push(year);
//         }
//         setYears(yearOptions);
//     }, []);

//     const expense_search = async () => {
//         setLoading(true);
//         if (!yearName) {
//             alert('Select Year');
//             setLoading(false);
//             return;
//         }

//         try {
//             const expenseResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/expense_amount_account_report`, {
//                 yearName,
//                 type,
//             });

//             const incomeResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/income_amount_account_report`, {
//                 yearName,
//                 type,
//             });

//             const combinedResults = expenseResponse.data.results;
//             const combinedResultsIncome = incomeResponse.data.results;

//             setSearchResults(combinedResults);
//             setIncomeSearch(combinedResultsIncome);
//             formatTableRows(combinedResults, combinedResultsIncome, type); // Call to format rows
//         } catch (error) {
//             setError("An error occurred during search.");
//             setSearchResults([]);
//         } finally {
//             setLoading(false); // Ensure loading is turned off
//         }
//     };

//     console.log(incomeSearch)
//     console.log(searchResults)
//     const formatTableRows = (expenses, incomes, type) => {
//         const combinedData = {};

//         const year = parseFloat(yearName); // Assuming yearName is defined somewhere in your code
//         const currentYear = new Date().getFullYear(); // Get the current year
//         const currentDate = new Date(); // Get the current date
//         const startDate = new Date(year, 0, 1); // January 1st of the specified year
//         const endDate = new Date(year, 11, 31); // December 31st of the specified year

//         // Define a function to ensure category keys exist and initialize them
//         const initializeCategories = () => {
//             return {
//                 incomeCategories: Object.fromEntries(incomes.map(category => [category.income_category, 0.00])),
//                 expenseCategories: Object.fromEntries(expenses.map(category => [category.expense_category, 0.00]))
//             };
//         };

//         // Initialize the data structure based on the time type
//         if (type === 'daily') {
//             if (year === currentYear) {
//                 for (let day = new Date(year, 0, 1); day <= currentDate; day.setDate(day.getDate() + 1)) {
//                     const dateKey = `${day.getDate().toString().padStart(2, '0')}-${(day.getMonth() + 1).toString().padStart(2, '0')}-${year}`;
//                     combinedData[dateKey] = {
//                         income: 0,
//                         totalExpense: 0,
//                         totalPurchase: 0,
//                         totalSale: 0,
//                         salaryExpense: 0,
//                         ...initializeCategories()
//                     };
//                 }
//             } else {
//                 for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
//                     const dateKey = `${day.getDate().toString().padStart(2, '0')}-${(day.getMonth() + 1).toString().padStart(2, '0')}-${year}`;
//                     combinedData[dateKey] = {
//                         income: 0,
//                         totalExpense: 0,
//                         totalPurchase: 0,
//                         totalSale: 0,
//                         salaryExpense: 0,
//                         ...initializeCategories()
//                     };
//                 }
//             }
//         } else if (type === 'monthly') {
//             const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//             allMonths.forEach((month, index) => {
//                 const monthKey = `${month}-${year}`;
//                 if (year === currentYear && index > currentDate.getMonth()) {
//                     return;
//                 }
//                 combinedData[monthKey] = {
//                     income: 0,
//                     totalSale: 0,
//                     totalExpense: 0,
//                     totalPurchase: 0,
//                     salaryExpense: 0,
//                     ...initializeCategories()
//                 };
//             });
//         }

//         // Process expenses
//         expenses.forEach(expense => {
//             const { created_date, sub_total_expense, expense_category, sub_total_salary, sub_total_purchase } = expense;
//             const expenseDate = new Date(created_date);
//             const dateKey = type === 'daily'
//                 ? `${expenseDate.getDate().toString().padStart(2, '0')}-${(expenseDate.getMonth() + 1).toString().padStart(2, '0')}-${expenseDate.getFullYear()}`
//                 : `${expenseDate.toLocaleString('default', { month: 'short' })}-${expenseDate.getFullYear()}`;

//             if (!combinedData[dateKey]) {
//                 combinedData[dateKey] = {
//                     income: 0,
//                     totalExpense: 0,
//                     totalPurchase: 0,
//                     totalSale: 0,
//                     salaryExpense: 0,
//                     ...initializeCategories()
//                 };
//             }

//             combinedData[dateKey].totalExpense += sub_total_expense;
//             if (expense_category === "Salary") {
//                 combinedData[dateKey].salaryExpense += sub_total_expense;
//             }
//             if (expense_category === "Purchase") {
//                 combinedData[dateKey].totalPurchase += sub_total_expense;
//             }

//             if (!combinedData[dateKey].expenseCategories[expense_category]) {
//                 combinedData[dateKey].expenseCategories[expense_category] = 0;
//             }
//             combinedData[dateKey].expenseCategories[expense_category] += sub_total_expense;
//         });

//         // Process incomes
//         incomes.forEach(income => {
//             const { created_date, sub_total_income, income_category } = income;
//             const incomeDate = new Date(created_date);
//             const dateKey = type === 'daily'
//                 ? `${incomeDate.getDate().toString().padStart(2, '0')}-${(incomeDate.getMonth() + 1).toString().padStart(2, '0')}-${incomeDate.getFullYear()}`
//                 : `${incomeDate.toLocaleString('default', { month: 'short' })}-${incomeDate.getFullYear()}`;

//             if (!combinedData[dateKey]) {
//                 combinedData[dateKey] = {
//                     income: 0,
//                     totalExpense: 0,
//                     totalPurchase: 0,
//                     totalSale: 0,
//                     salaryExpense: 0,
//                     ...initializeCategories()
//                 };
//             }

//             combinedData[dateKey].income += sub_total_income;
//             if (income_category === "Sale") {
//                 combinedData[dateKey].totalSale += sub_total_income;
//             }

//             if (!combinedData[dateKey].incomeCategories[income_category]) {
//                 combinedData[dateKey].incomeCategories[income_category] = 0;
//             }
//             combinedData[dateKey].incomeCategories[income_category] += sub_total_income;
//         });

//         // Create headers for income and expense categories
//         const incomeCategoriesHeaders = Object.keys(incomes.reduce((acc, { income_category }) => {
//             acc[income_category] = true;
//             return acc;
//         }, {}));

//         const expenseCategoriesHeaders = Object.keys(expenses.reduce((acc, { expense_category }) => {
//             acc[expense_category] = true;
//             return acc;
//         }, {}));

//         const headers = [
//            'SL.', 'Date', 'Opening Balance', ...incomeCategoriesHeaders, 'Total Sale', 'Total Income', ...expenseCategoriesHeaders, 'Total Purchase', 'Total Expense', 'Salary Expense', 'Total Balance'
//         ];

//         // Format table rows
//         let previousBalance = 0;
//         const tableRows = Object.keys(combinedData).sort((a, b) => {
//             if (type === 'daily') {
//                 const [dayA, monthA, yearA] = a.split('-').map(Number);
//                 const [dayB, monthB, yearB] = b.split('-').map(Number);
//                 return yearA - yearB || monthA - monthB || dayA - dayB;
//             } else {
//                 const [monthA, yearA] = a.split('-');
//                 const [monthB, yearB] = b.split('-');
//                 const monthIndexA = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthA);
//                 const monthIndexB = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthB);
//                 return yearA - yearB || monthIndexA - monthIndexB;
//             }
//         }).map((date, index) => {
//             const data = combinedData[date];
//             const total = data.income - (data.totalExpense + data.salaryExpense);
//             const openingBalance = previousBalance;
//             const closingBalance = openingBalance + total;
//             previousBalance = closingBalance;

//             const incomeCategoryValues = incomeCategoriesHeaders.map(category => data.incomeCategories[category].toFixed(2));
//             const expenseCategoryValues = expenseCategoriesHeaders.map(category => data.expenseCategories[category].toFixed(2));

//             return (
//                 <tr key={date}>
//                     <td>{index + 1}</td>
//                     <td>{date}</td> {/* Display formatted date or month */}
//                     <td>{openingBalance.toFixed(2)}</td> {/* Opening balance */}
//                     {incomeCategoryValues.map((value, i) => <td key={i}>{value}</td>)}
//                     <td>{data.totalSale.toFixed(2)}</td>
//                     <td>{data.income.toFixed(2)}</td>
//                     {expenseCategoryValues.map((value, i) => <td key={i}>{value}</td>)}
//                     <td>{data.totalPurchase.toFixed(2)}</td>
//                     <td>{data.totalExpense.toFixed(2)}</td>
//                     <td>{data.salaryExpense.toFixed(2)}</td>
//                     <td>{total.toFixed(2)}</td> {/* Total income - total expenses */}
//                 </tr>
//             );
//         });

//         setFormattedRows(tableRows);
//         setResults(headers)

//         return (
//             <table>
//                 <thead>
//                     <tr>
//                         {headers.map((header, index) => (
//                             <th key={index}>{header}</th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {tableRows}
//                 </tbody>
//             </table>
//         );
//     };


//     // const formatTableRows = (expenses, incomes, type) => {
//     //     const combinedData = {};

//     //     const year = parseFloat(yearName); // Assuming yearName is defined somewhere in your code
//     //     const currentYear = new Date().getFullYear(); // Get the current year
//     //     const currentDate = new Date(); // Get the current date
//     //     const startDate = new Date(year, 0, 1); // January 1st of the specified year
//     //     const endDate = new Date(year, 11, 31); // December 31st of the specified year

//     //     if (type === 'daily') {
//     //         if (year === currentYear) {
//     //             for (let day = new Date(year, 0, 1); day <= currentDate; day.setDate(day.getDate() + 1)) {
//     //                 const dateKey = `${day.getDate().toString().padStart(2, '0')}-${(day.getMonth() + 1).toString().padStart(2, '0')}-${year}`;
//     //                 combinedData[dateKey] = {
//     //                     income: 0,
//     //                     totalExpense: 0,
//     //                     totalPurchase: 0,
//     //                     totalSale: 0,
//     //                     salaryExpense: 0,
//     //                     incomeCategories: Object.fromEntries(incomes.map(category => [category.income_category, 0.00])),
//     //                     expenseCategories: Object.fromEntries(expenses.map(category => [category.expense_category, 0.00]))
//     //                 };
//     //             }
//     //         } else {
//     //             for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
//     //                 const dateKey = `${day.getDate().toString().padStart(2, '0')}-${(day.getMonth() + 1).toString().padStart(2, '0')}-${year}`;
//     //                 combinedData[dateKey] = {
//     //                     income: 0,
//     //                     totalExpense: 0,
//     //                     totalSale: 0,
//     //                     totalPurchase: 0,
//     //                     salaryExpense: 0,
//     //                     incomeCategories: Object.fromEntries(incomes.map(category => [category.income_category, 0.00])),
//     //                     expenseCategories: Object.fromEntries(expenses.map(category => [category.expense_category, 0.00]))
//     //                 };
//     //             }
//     //         }
//     //     } else if (type === 'monthly') {
//     //         const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     //         allMonths.forEach((month, index) => {
//     //             const monthKey = `${month}-${year}`;
//     //             if (year === currentYear && index > currentDate.getMonth()) {
//     //                 return;
//     //             }
//     //             combinedData[monthKey] = {
//     //                 income: 0,
//     //                 totalSale: 0,
//     //                 totalExpense: 0,
//     //                 totalPurchase: 0,
//     //                 salaryExpense: 0,
//     //                 incomeCategories: Object.fromEntries(incomes.map(category => [category.income_category, 0.00])),
//     //                 expenseCategories: Object.fromEntries(expenses.map(category => [category.expense_category, 0.00]))
//     //             };
//     //         });
//     //     }



//     //     // Process expenses
//     //     expenses.forEach(expense => {
//     //         const { created_date, sub_total_expense, expense_category, sub_total_salary, sub_total_purchase } = expense;
//     //         const expenseDate = new Date(created_date);
//     //         const dateKey = type === 'daily'
//     //             ? `${expenseDate.getDate().toString().padStart(2, '0')}-${(expenseDate.getMonth() + 1).toString().padStart(2, '0')}-${expenseDate.getFullYear()}`
//     //             : `${expenseDate.toLocaleString('default', { month: 'short' })}-${expenseDate.getFullYear()}`;

//     //         if (!combinedData[dateKey]) {
//     //             combinedData[dateKey] = {
//     //                 income: 0,
//     //                 totalExpense: 0,
//     //                 totalPurchase: 0,
//     //                 salaryExpense: 0,
//     //                 incomeCategories: Object.fromEntries(incomes.map(category => [category.income_category, 0.00])),
//     //                 expenseCategories: Object.fromEntries(expenses.map(category => [category.expense_category, 0.00]))
//     //             };
//     //         }

//     //         combinedData[dateKey].totalExpense += sub_total_expense;
//     //         if (expense_category === "Salary") {
//     //             combinedData[dateKey].salaryExpense += sub_total_expense;
//     //         }
//     //         if (expense_category === "Purchase") {
//     //             combinedData[dateKey].totalPurchase += sub_total_expense;
//     //         }

//     //         if (!combinedData[dateKey].expenseCategories[expense_category]) {
//     //             combinedData[dateKey].expenseCategories[expense_category] = 0;
//     //         }
//     //         combinedData[dateKey].expenseCategories[expense_category] += sub_total_expense;
//     //     });

//     //     // Process incomes
//     //     incomes.forEach(income => {
//     //         const { created_date, sub_total_income, income_category } = income;
//     //         const incomeDate = new Date(created_date);
//     //         const dateKey = type === 'daily'
//     //             ? `${incomeDate.getDate().toString().padStart(2, '0')}-${(incomeDate.getMonth() + 1).toString().padStart(2, '0')}-${incomeDate.getFullYear()}`
//     //             : `${incomeDate.toLocaleString('default', { month: 'short' })}-${incomeDate.getFullYear()}`;

//     //         if (!combinedData[dateKey]) {
//     //             combinedData[dateKey] = {
//     //                 income: 0,
//     //                 totalExpense: 0,
//     //                 totalPurchase: 0,
//     //                 totalSale: 0,
//     //                 salaryExpense: 0,
//     //                 incomeCategories: Object.fromEntries(incomes.map(category => [category.income_category, 0.00])),
//     //                 expenseCategories: Object.fromEntries(expenses.map(category => [category.expense_category, 0.00]))
//     //             };
//     //         }

//     //         combinedData[dateKey].income += sub_total_income;
//     //         if (income_category === "Sale") {
//     //             combinedData[dateKey].totalSale += sub_total_income;
//     //         }
//     //         if (!combinedData[dateKey].incomeCategories[income_category]) {
//     //             combinedData[dateKey].incomeCategories[income_category] = 0;
//     //         }
//     //         combinedData[dateKey].incomeCategories[income_category] += sub_total_income;
//     //     });

//     //     // Create formatted rows with opening balance calculation
//     //     let previousBalance = 0;
//     //     const tableRows = Object.keys(combinedData).sort((a, b) => {
//     //         if (type === 'daily') {
//     //             const [dayA, monthA, yearA] = a.split('-').map(Number);
//     //             const [dayB, monthB, yearB] = b.split('-').map(Number);
//     //             return yearA - yearB || monthA - monthB || dayA - dayB;
//     //         } else {
//     //             const [monthA, yearA] = a.split('-');
//     //             const [monthB, yearB] = b.split('-');
//     //             const monthIndexA = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthA);
//     //             const monthIndexB = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthB);
//     //             return yearA - yearB || monthIndexA - monthIndexB;
//     //         }
//     //     }).map((date, index) => {
//     //         const data = combinedData[date];
//     //         console.log(data)
//     //         const total = data.income - (data.totalExpense + data.salaryExpense);
//     //         const openingBalance = previousBalance;
//     //         const closingBalance = openingBalance + total;
//     //         previousBalance = closingBalance;



//     //         return (

//     //             <tr key={date}>
//     //                 <td>{index + 1}</td>
//     //                 <td>{date}</td> {/* Display formatted date or month */}
//     //                 <td>{openingBalance.toFixed(2)}</td> {/* Opening balance */}
//     //                 <th>
//     //                     {Object.entries(data.incomeCategories)
//     //                         .filter(([income_category]) => income_category !== 'Sales') // Exclude "Salary"
//     //                         .map(([income_category, amount]) => (
//     //                             <div key={income_category}>{income_category}:{amount.toFixed(2)}</div>
//     //                         ))}
//     //                 </th>

//     //                 <td>{data.totalSale.toFixed(2)}</td>
//     //                 <td>{data.income.toFixed(2)}</td>
//     //                 <th>
//     //                     {Object.entries(data.expenseCategories)
//     //                         .filter(([expense_category]) => expense_category !== 'Salary' && expense_category !== 'Purchase') // Exclude "Salary"
//     //                         .map(([expense_category, amount]) => (
//     //                             <div key={expense_category}>{expense_category}: {amount.toFixed(2)}</div>
//     //                         ))}
//     //                 </th>
//     //                 <td>{data.totalPurchase.toFixed(2)}</td>
//     //                 <td>{data.totalExpense.toFixed(2)}</td>
//     //                 <td>{data.salaryExpense.toFixed(2)}</td>
//     //                 <td>{total.toFixed(2)}</td> {/* Total income - total expenses */}



//     //             </tr>
//     //         );
//     //     });

//     //     setFormattedRows(tableRows);
//     // };

//     // const formatTableRows = (expenses, incomes, type) => {
//     //     const combinedData = {};

//     //     const year = parseFloat(yearName); // Assuming yearName is defined somewhere in your code
//     //     const currentYear = new Date().getFullYear(); // Get the current year
//     //     const currentDate = new Date(); // Get the current date
//     //     const startDate = new Date(year, 0, 1); // January 1st of the specified year
//     //     const endDate = new Date(year, 11, 31); // December 31st of the specified year

//     //     // Define a function to ensure category keys exist and initialize them
//     //     const initializeCategories = () => {
//     //         return {
//     //             incomeCategories: Object.fromEntries(incomes.map(category => [category.income_category, 0.00])),
//     //             expenseCategories: Object.fromEntries(expenses.map(category => [category.expense_category, 0.00]))
//     //         };
//     //     };

//     //     // Initialize the data structure based on the time type
//     //     if (type === 'daily') {
//     //         if (year === currentYear) {
//     //             for (let day = new Date(year, 0, 1); day <= currentDate; day.setDate(day.getDate() + 1)) {
//     //                 const dateKey = `${day.getDate().toString().padStart(2, '0')}-${(day.getMonth() + 1).toString().padStart(2, '0')}-${year}`;
//     //                 combinedData[dateKey] = {
//     //                     income: 0,
//     //                     totalExpense: 0,
//     //                     totalPurchase: 0,
//     //                     totalSale: 0,
//     //                     salaryExpense: 0,
//     //                     ...initializeCategories()
//     //                 };
//     //             }
//     //         } else {
//     //             for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
//     //                 const dateKey = `${day.getDate().toString().padStart(2, '0')}-${(day.getMonth() + 1).toString().padStart(2, '0')}-${year}`;
//     //                 combinedData[dateKey] = {
//     //                     income: 0,
//     //                     totalExpense: 0,
//     //                     totalPurchase: 0,
//     //                     totalSale: 0,
//     //                     salaryExpense: 0,
//     //                     ...initializeCategories()
//     //                 };
//     //             }
//     //         }
//     //     } else if (type === 'monthly') {
//     //         const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     //         allMonths.forEach((month, index) => {
//     //             const monthKey = `${month}-${year}`;
//     //             if (year === currentYear && index > currentDate.getMonth()) {
//     //                 return;
//     //             }
//     //             combinedData[monthKey] = {
//     //                 income: 0,
//     //                 totalSale: 0,
//     //                 totalExpense: 0,
//     //                 totalPurchase: 0,
//     //                 salaryExpense: 0,
//     //                 ...initializeCategories()
//     //             };
//     //         });
//     //     }

//     //     // Process expenses
//     //     expenses.forEach(expense => {
//     //         const { created_date, sub_total_expense, expense_category, sub_total_salary, sub_total_purchase } = expense;
//     //         const expenseDate = new Date(created_date);
//     //         const dateKey = type === 'daily'
//     //             ? `${expenseDate.getDate().toString().padStart(2, '0')}-${(expenseDate.getMonth() + 1).toString().padStart(2, '0')}-${expenseDate.getFullYear()}`
//     //             : `${expenseDate.toLocaleString('default', { month: 'short' })}-${expenseDate.getFullYear()}`;

//     //         if (!combinedData[dateKey]) {
//     //             combinedData[dateKey] = {
//     //                 income: 0,
//     //                 totalExpense: 0,
//     //                 totalPurchase: 0,
//     //                 totalSale: 0,
//     //                 salaryExpense: 0,
//     //                 ...initializeCategories()
//     //             };
//     //         }

//     //         combinedData[dateKey].totalExpense += sub_total_expense;
//     //         if (expense_category === "Salary") {
//     //             combinedData[dateKey].salaryExpense += sub_total_expense;
//     //         }
//     //         if (expense_category === "Purchase") {
//     //             combinedData[dateKey].totalPurchase += sub_total_expense;
//     //         }

//     //         if (!combinedData[dateKey].expenseCategories[expense_category]) {
//     //             combinedData[dateKey].expenseCategories[expense_category] = 0;
//     //         }
//     //         combinedData[dateKey].expenseCategories[expense_category] += sub_total_expense;
//     //     });

//     //     // Process incomes
//     //     incomes.forEach(income => {
//     //         const { created_date, sub_total_income, income_category } = income;
//     //         const incomeDate = new Date(created_date);
//     //         const dateKey = type === 'daily'
//     //             ? `${incomeDate.getDate().toString().padStart(2, '0')}-${(incomeDate.getMonth() + 1).toString().padStart(2, '0')}-${incomeDate.getFullYear()}`
//     //             : `${incomeDate.toLocaleString('default', { month: 'short' })}-${incomeDate.getFullYear()}`;

//     //         if (!combinedData[dateKey]) {
//     //             combinedData[dateKey] = {
//     //                 income: 0,
//     //                 totalExpense: 0,
//     //                 totalPurchase: 0,
//     //                 totalSale: 0,
//     //                 salaryExpense: 0,
//     //                 ...initializeCategories()
//     //             };
//     //         }

//     //         combinedData[dateKey].income += sub_total_income;
//     //         if (income_category === "Sale") {
//     //             combinedData[dateKey].totalSale += sub_total_income;
//     //         }

//     //         if (!combinedData[dateKey].incomeCategories[income_category]) {
//     //             combinedData[dateKey].incomeCategories[income_category] = 0;
//     //         }
//     //         combinedData[dateKey].incomeCategories[income_category] += sub_total_income;
//     //     });

//     //     // Create headers for income and expense categories
//     //     const incomeCategoriesHeaders = Object.keys(incomes.reduce((acc, { income_category }) => {
//     //         acc[income_category] = true;
//     //         return acc;
//     //     }, {}));

//     //     const expenseCategoriesHeaders = Object.keys(expenses.reduce((acc, { expense_category }) => {
//     //         acc[expense_category] = true;
//     //         return acc;
//     //     }, {}));

//     //     const headers = [
//     //         'Date', 'Opening Balance', ...incomeCategoriesHeaders, 'Total Sale', 'Total Income', ...expenseCategoriesHeaders, 'Total Purchase', 'Total Expense', 'Salary Expense', 'Closing Balance'
//     //     ];

//     //     // Format table rows
//     //     let previousBalance = 0;
//     //     const tableRows = Object.keys(combinedData).sort((a, b) => {
//     //         if (type === 'daily') {
//     //             const [dayA, monthA, yearA] = a.split('-').map(Number);
//     //             const [dayB, monthB, yearB] = b.split('-').map(Number);
//     //             return yearA - yearB || monthA - monthB || dayA - dayB;
//     //         } else {
//     //             const [monthA, yearA] = a.split('-');
//     //             const [monthB, yearB] = b.split('-');
//     //             const monthIndexA = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthA);
//     //             const monthIndexB = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthB);
//     //             return yearA - yearB || monthIndexA - monthIndexB;
//     //         }
//     //     }).map((date, index) => {
//     //         const data = combinedData[date];
//     //         const total = data.income - (data.totalExpense + data.salaryExpense);
//     //         const openingBalance = previousBalance;
//     //         const closingBalance = openingBalance + total;
//     //         previousBalance = closingBalance;

//     //         const incomeCategoryValues = incomeCategoriesHeaders.map(category => data.incomeCategories[category].toFixed(2));
//     //         const expenseCategoryValues = expenseCategoriesHeaders.map(category => data.expenseCategories[category].toFixed(2));

//     //         return (
//     //             <tr key={date}>
//     //                 <td>{index + 1}</td>
//     //                 <td>{date}</td> {/* Display formatted date or month */}
//     //                 <td>{openingBalance.toFixed(2)}</td> {/* Opening balance */}
//     //                 {incomeCategoryValues.map((value, i) => <td key={i}>{value}</td>)}
//     //                 <td>{data.totalSale.toFixed(2)}</td>
//     //                 <td>{data.income.toFixed(2)}</td>
//     //                 {expenseCategoryValues.map((value, i) => <td key={i}>{value}</td>)}
//     //                 <td>{data.totalPurchase.toFixed(2)}</td>
//     //                 <td>{data.totalExpense.toFixed(2)}</td>
//     //                 <td>{data.salaryExpense.toFixed(2)}</td>
//     //                 <td>{total.toFixed(2)}</td> {/* Total income - total expenses */}
//     //             </tr>
//     //         );
//     //     });

//     //     setFormattedRows(tableRows);
//     // };




//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card mb-4'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Search</h5>
//                                 </div>
//                                 <div className="card-body">
//                                     <form>
//                                         <div className="col-md-10 offset-md-1">
//                                             <div className="form-group row student">
//                                                 <label className="col-form-label col-md-2 font-weight-bold">Year:</label>
//                                                 <div className="col-md-4">
//                                                     <select
//                                                         required
//                                                         value={yearName}
//                                                         onChange={(e) => setYearName(e.target.value)}
//                                                         name="year"
//                                                         className="form-control form-control-sm mb-2"
//                                                         id="year"
//                                                     >
//                                                         <option value="">Select Year</option>
//                                                         {years.map(year => (
//                                                             <option key={year} value={year}>{year}</option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                                 <label className="col-form-label col-md-2 font-weight-bold">Type:</label>
//                                                 <div className="col-md-4">
//                                                     <select name="type"
//                                                         value={type}
//                                                         onChange={(e) => setType(e.target.value)}
//                                                         className="form-control form-control-sm type">
//                                                         {/* <option value="">Select Option</option> */}
//                                                         <option value="daily">Daily</option>
//                                                         <option value="monthly">Monthly</option>
//                                                     </select>
//                                                 </div>
//                                             </div>

//                                             <div className="form-group row">
//                                                 <div className="offset-md-2 col-md-10 float-left">
//                                                     <input
//                                                         type="button"
//                                                         name="search"
//                                                         className="btn btn-sm btn-info search_btn mr-2"
//                                                         value="Search"
//                                                         onClick={expense_search}
//                                                     />

//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="">
//                         {loading ? (
//                             <div className='text-center'>
//                                 <FontAwesomeIcon style={{ height: '33px', width: '33px' }} icon={faSpinner} spin />
//                             </div>
//                         ) : (
//                             (searchResults.length > 0 || incomeSearch.length > 0) ? (
//                                 <div className='card mb-4'>
//                                     <div className="body-content bg-light">
//                                         <div className="border-primary shadow-sm border-0">
//                                             <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                                 <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Account Report</h5>
//                                             </div>
//                                             <div className="card-body">
//                                                 <div className="table-responsive">
//                                                     <table className="table table-bordered table-hover table-striped table-sm">

//                                                         <thead>
//                                                             <tr>
//                                                                 {results.map((header, index) => (
//                                                                     <th key={index}>{header}</th>
//                                                                 ))}
//                                                             </tr>
//                                                         </thead>

//                                                         <tbody>
//                                                             {formattedRows.length > 0 ? formattedRows : (
//                                                                 <tr>
//                                                                     <td colSpan="7">No data available</td>
//                                                                 </tr>
//                                                             )}
//                                                         </tbody>
//                                                     </table>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className='alert alert-danger'>No records found</div>
//                             )
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AccountReports;

















