'use client' 
 //ismile
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const GeneralLedger = () => {

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [incomeCategory, setIncomeCategory] = useState([]);
    const [expenseCategory, setExpenseCategory] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [incomeSearch, setIncomeSearch] = useState([]);
    const [subTotal, setSubTotal] = useState(0); // Track active tab
    const [subTotalIncome, setSubTotalIncome] = useState(0); // Track active tab

    const formatDate = (date) => {
        const day = String(date?.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        return `${day}-${month}-${year}`;
    };

    const handleDateChangeFrom = (event) => {
        const selectedDate = new Date(event.target.value);
        const formattedDate = formatDate(selectedDate);
        setFromDate(selectedDate);
    };

    const handleDateChangeTo = (event) => {
        const selectedDate = new Date(event.target.value);
        const formattedDate = formatDate(selectedDate);
        setToDate(selectedDate);
    };

    const handleTextInputClick = () => {
        document.getElementById('dateInputFrom').showPicker();
    };

    const handleTextInputClicks = () => {
        document.getElementById('dateInputTo').showPicker();
    };

    useEffect(() => {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        setFromDate(firstDayOfMonth);
        setToDate(lastDayOfMonth);
    }, []);

    const { data: incomeCategorys = [], isLoading, refetch } = useQuery({
        queryKey: ['incomeCategorys'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/income_category/income_category_all`)

            const data = await res.json()
            return data
        }
    })

    const { data: expenseCategorys = [], } = useQuery({
        queryKey: ['expenseCategorys'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expence_category/expence_category_all`)

            const data = await res.json()
            return data
        }
    })


    const [expenseCategorySubTotal, setExpenseCategorySubTotal] = useState([])
    const [incomeCategorySubTotal, setIncomeCategorySubTotal] = useState([])

    const expense_search = async () => {
        setLoading(true);

        try {
            // Make the first request for expense search
            const expenseResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/expense_search_account_reports`, {
                fromDate, toDate, expenseCategory
            });

            // Make the second request for income search
            const incomeResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/account_report_income`, {
                fromDate, toDate, incomeCategory
            });

            // Combine results from both searches
            const combinedResults = expenseResponse.data.results;
            const combinedResultsIncome = incomeResponse.data.results;


            if (combinedResults.length === 0 && combinedResultsIncome.length === 0) {
                // alert('Nothing found!');
            } else {
                const sortedResults = combinedResults; // Sort if necessary
                const sortedResultIncome = combinedResultsIncome; // Sort if necessary
                setSearchResults(sortedResults);
                setIncomeSearch(sortedResultIncome)


                const sub_total = combinedResults.reduce((sum, result) => sum + result.sub_total, 0);
                const sub_totalIncome = combinedResultsIncome.reduce((sum, result) => sum + result.sub_total, 0);

                setSubTotalIncome(sub_totalIncome)
                setSubTotal(sub_total);

                const expenseCategoryWiseSubTotal = combinedResults.reduce((acc, result) => {
                    const { expense_category_id, sub_total } = result;
                    acc[expense_category_id] = (acc[expense_category_id] || 0) + sub_total;
                    return acc;
                }, {});
                setExpenseCategorySubTotal(expenseCategoryWiseSubTotal)
                // Income Category-wise Subtotals
                const incomeCategoryWiseSubTotal = combinedResultsIncome.reduce((acc, result) => {
                    const { income_category_id, sub_total } = result;
                    acc[income_category_id] = (acc[income_category_id] || 0) + sub_total;
                    return acc;
                }, {});
                setIncomeCategorySubTotal(incomeCategoryWiseSubTotal)

                setError(null);
            }
        } catch (error) {
            setError("An error occurred during search.");
            setSearchResults([]);
        } finally {
            setLoading(false); // Ensure loading is turned off
        }
    };

    // useEffect(() => {
    //     // Call the search function whenever fromDate or toDate changes
    //     if (fromDate && toDate) {
    //         expense_search();
    //     }
    // }, [fromDate, toDate]);

    console.log(incomeCategorySubTotal)
    const totalIncome = Object.values(incomeCategorySubTotal).reduce((sum, value) => {
        return sum + (value || 0); // Ensure null or undefined values are treated as 0
    }, 0);
    console.log(expenseCategorySubTotal)
    const totalExpense = Object.values(expenseCategorySubTotal).reduce((sum, value) => {
        return sum + (value || 0); // Ensure null or undefined values are treated as 0
    }, 0);





    console.log(error)

    // const [data, setData] = useState([])
    // useEffect(() => {
    //     fetch(`http://localhost/:5002/api/account_report`)
    //         .then(res => res.json())
    //         .then(data => setData(data))
    // }, [])

    // const processedIncome = data?.incomeSearch?.map(income => ({
    //     title: income.income_category,
    //     amount: income.amount,
    //     categoryId: income.income_category_id,
    //     subTotal: incomeCategorySubTotal[income.income_category_id] || 0,
    // }));

    // // Process the expense data
    // const processedExpenses = data?.searchResults?.map(expense => ({
    //     title: expense.expense_category,
    //     amount: expense.sub_total,
    //     categoryId: expense.expense_category_id,
    //     subTotal: expenseCategorySubTotal[expense.expense_category_id] || 0,
    // }));

    // // Calculate total income and expense
    // const totalIncomes = processedIncome?.reduce((sum, income) => sum + income.amount, 0);
    // const totalExpenses = processedExpenses?.reduce((sum, expense) => sum + expense.amount, 0);
    // const totalBalance = totalIncomes - totalExpenses;

    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`http://localhost/:5002/api/account_report`)
            .then(res => res.json())
            .then(data => setData(data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    // Process income data
    const processedIncome = (() => {
        if (!Array.isArray(data?.incomeSearch)) return []; // Ensure incomeSearch is an array

        const groupedIncome = data.incomeSearch.reduce((acc, income) => {
            const { income_category_id, income_category, sub_total } = income;

            if (!acc[income_category_id]) {
                acc[income_category_id] = {
                    title: income_category,
                    amount: 0,
                    categoryId: income_category_id,
                    subTotal: 0,
                };
            }

            acc[income_category_id].amount += sub_total; // Sum the amounts for the same category
            acc[income_category_id].subTotal += incomeCategorySubTotal[income_category_id] || 0; // Sum the subTotals

            return acc;
        }, {});

        // Convert the grouped income object back to an array
        return Object.values(groupedIncome);
    })();

    // Process the expense data
    const processedExpenses = (() => {
        if (!Array.isArray(data?.searchResults)) return []; // Ensure searchResults is an array

        const groupedExpenses = data.searchResults.reduce((acc, expense) => {
            const { expense_category_id, expense_category, sub_total } = expense;

            if (!acc[expense_category_id]) {
                acc[expense_category_id] = {
                    title: expense_category,
                    amount: 0,
                    categoryId: expense_category_id,
                    subTotal: 0,
                };
            }

            acc[expense_category_id].amount += sub_total; // Sum the amounts for the same category
            acc[expense_category_id].subTotal += expenseCategorySubTotal[expense_category_id] || 0; // Sum the subTotals

            return acc;
        }, {});

        // Convert the grouped expenses object back to an array
        return Object.values(groupedExpenses);
    })();

    // Calculate total income and expense
    const totalIncomes = processedIncome?.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = processedExpenses?.reduce((sum, expense) => sum + expense.amount, 0);
    const totalBalance = totalIncomes - totalExpenses;
    console.log(totalIncomes)
    console.log(totalExpenses)


    const general_ledgers_print = async () => {
        try {



            const expenseResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/expense_search_account_reports`, {
                fromDate, toDate, expenseCategory
            });

            // Make the second request for income search
            const incomeResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/account_report_income`, {
                fromDate, toDate, incomeCategory
            });

            // Combine results from both searches
            const combinedResults = expenseResponse.data.results;
            const combinedResultsIncome = incomeResponse.data.results;



            const sortedResults = combinedResults; // Sort if necessary
            const sortedResultIncome = combinedResultsIncome; // Sort if necessary
            // setSearchResults(sortedResults);
            // setIncomeSearch(sortedResultIncome)


            const sub_total = combinedResults.reduce((sum, result) => sum + result.sub_total, 0);
            const sub_totalIncome = combinedResultsIncome.reduce((sum, result) => sum + result.sub_total, 0);

            // setSubTotalIncome(sub_totalIncome)
            // setSubTotal(sub_total);

            const expenseCategoryWiseSubTotal = combinedResults.reduce((acc, result) => {
                const { expense_category_id, sub_total } = result;
                acc[expense_category_id] = (acc[expense_category_id] || 0) + sub_total;
                return acc;
            }, {});

            // Income Category-wise Subtotals
            const incomeCategoryWiseSubTotal = combinedResultsIncome.reduce((acc, result) => {
                const { income_category_id, sub_total } = result;
                acc[income_category_id] = (acc[income_category_id] || 0) + sub_total;
                return acc;
            }, {});



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

            const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/general_ledgers_print`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orientation, selectedPrintSize, fontSize, expenseCategorySubTotal: expenseCategoryWiseSubTotal,
                    incomeCategorys,
                    incomeCategorySubTotal: incomeCategoryWiseSubTotal,
                    expenseCategorys,
                    totalIncome,
                    totalExpense,
                    orientation,
                    selectedPrintSize,
                    fontSize,
                    totalExpensess: totalExpenses,totalIncomes
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


    const general_ledgers_pdf = async () => {

       

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


            const expenseResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/expense_search_account_reports`, {
                fromDate, toDate, expenseCategory
            });

            // Make the second request for income search
            const incomeResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/account_report_income`, {
                fromDate, toDate, incomeCategory
            });

            // Combine results from both searches
            const combinedResults = expenseResponse.data.results;
            const combinedResultsIncome = incomeResponse.data.results;



            const sortedResults = combinedResults; // Sort if necessary
            const sortedResultIncome = combinedResultsIncome; // Sort if necessary
            // setSearchResults(sortedResults);
            // setIncomeSearch(sortedResultIncome)


            const sub_total = combinedResults.reduce((sum, result) => sum + result.sub_total, 0);
            const sub_totalIncome = combinedResultsIncome.reduce((sum, result) => sum + result.sub_total, 0);

            // setSubTotalIncome(sub_totalIncome)
            // setSubTotal(sub_total);

            const expenseCategoryWiseSubTotal = combinedResults.reduce((acc, result) => {
                const { expense_category_id, sub_total } = result;
                acc[expense_category_id] = (acc[expense_category_id] || 0) + sub_total;
                return acc;
            }, {});

            // Income Category-wise Subtotals
            const incomeCategoryWiseSubTotal = combinedResultsIncome.reduce((acc, result) => {
                const { income_category_id, sub_total } = result;
                acc[income_category_id] = (acc[income_category_id] || 0) + sub_total;
                return acc;
            }, {});



            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/general_ledgers_pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orientation, selectedPrintSize, fontSize, expenseCategorySubTotal: expenseCategoryWiseSubTotal,
                    incomeCategorys,
                    incomeCategorySubTotal: incomeCategoryWiseSubTotal,
                    expenseCategorys,
                    totalIncome,
                    totalExpense,
                    orientation,
                    selectedPrintSize,
                    fontSize,
                    totalExpensess: totalExpenses,totalIncomes
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
                                                <label htmlFor="fromDate" className="col-form-label col-md-2"><strong>Start Date:</strong></label>
                                                <div className="col-md-4">
                                                    <input
                                                        className="form-control form-control-sm"
                                                        type="text"
                                                        id="fromDate"
                                                        value={fromDate ? formatDate(fromDate) : ''}
                                                        onClick={handleTextInputClick}
                                                        readOnly
                                                    />
                                                    <input
                                                        type="date"
                                                        id="dateInputFrom"
                                                        value={fromDate ? fromDate.toString().split('T')[0] : ''}
                                                        onChange={handleDateChangeFrom}
                                                        style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
                                                    />
                                                </div>

                                                <label htmlFor="toDate" className="col-form-label col-md-2"><strong>End Date:</strong></label>
                                                <div className="col-md-4">

                                                    <input
                                                        type="text"
                                                        id="toDate"
                                                        className="form-control form-control-sm"
                                                        value={toDate ? formatDate(toDate) : ''}
                                                        onClick={handleTextInputClicks}
                                                        readOnly
                                                    />
                                                    <input
                                                        type="date"
                                                        id="dateInputTo"
                                                        value={toDate ? toDate.toString().split('T')[0] : ''}
                                                        onChange={handleDateChangeTo}
                                                        style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
                                                    />
                                                </div>

                                            </div>
                                            <div class="form-group row student">




                                            </div>
                                            <div class="form-group row student">

                                                <label class="col-form-label col-md-2"><strong>Income Category:
                                                </strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        value={incomeCategory}
                                                        onChange={(e) => setIncomeCategory(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero lshift"

                                                    >
                                                        <option value="">Select Income Category </option>
                                                        {
                                                            incomeCategorys.map(income_category =>

                                                                <>
                                                                    <option value={income_category.id}>{income_category.income_category_name}</option>
                                                                </>
                                                            )
                                                        }



                                                    </select>
                                                </div>
                                                <label class="col-form-label col-md-2"><strong>Expense Category:
                                                </strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        value={expenseCategory}
                                                        onChange={(e) => setExpenseCategory(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero lshift"

                                                    >
                                                        <option value="">Select Expense Category </option>
                                                        <option value="salary">Salary</option>
                                                        {
                                                            expenseCategorys.map(expense_category =>

                                                                <>
                                                                    <option value={expense_category.id}>{expense_category.expense_category_name}</option>
                                                                </>
                                                            )
                                                        }



                                                    </select>
                                                </div>

                                            </div>
                                            {/* <div class="form-group row student">

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


                                            </div> */}
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
                                                        name="search"
                                                        class="btn btn-sm btn-success print_btn mr-2"
                                                        value="Print"
                                                        onClick={general_ledgers_print}
                                                    />
                                                    <input

                                                        type="button"
                                                        onClick={general_ledgers_pdf}
                                                        name="search"
                                                        className="btn btn-sm btn-secondary excel_btn mr-2"
                                                        value="Download PDF"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='card mb-4'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">
                                        General Ledger From {fromDate ? formatDate(fromDate) : ''} to {toDate ? formatDate(toDate) : ''}
                                    </h5>
                                </div>
                                <div class="card-body">
                                    {loading ? (
                                        <div className='text-center'>
                                            <FontAwesomeIcon style={{ height: '33px', width: '33px' }} icon={faSpinner} spin />
                                        </div>
                                    ) : (
                                        searchResults?.length > 0 || incomeSearch?.length > 0 ? (
                                            <div class="table-responsive">
                                                <table class="table table-bordered table-hover table-striped table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th class="text-center" rowspan="2">SL</th>
                                                            <th class="text-center" colspan="2">Income</th>
                                                            <th class="text-center" colspan="3">Expense</th>
                                                        </tr>
                                                        <tr>
                                                            <th class="text-center">Title</th>
                                                            <th class="text-center">Amount</th>
                                                            <th class="text-center">Title</th>
                                                            <th class="text-center" colspan="2">Amount</th>
                                                        </tr>
                                                    </thead>
                                                    {/* <tbody>
                                          
                                                        {Object.keys(expenseCategorySubTotal).map((categoryId, index) => (
                                                            <tr key={categoryId}>
                                            
                                                                <td className="text-center">{index + 1}</td>
                                                                <td className="text-center">
                                                                    {
                                                                        incomeCategorys.find(
                                                                            (incomeCategory) => incomeCategory.id === parseInt(categoryId)
                                                                        )?.income_category_name || ''
                                                                    }
                                                                </td>
                                                                <td className="text-center">{incomeCategorySubTotal[categoryId] || ''}</td>

                                          
                                                                <td className="text-center">
                                                                    {
                                                                        expenseCategorys.find(
                                                                            (expenseCategory) => expenseCategory.id === parseInt(categoryId)
                                                                        )?.expense_category_name || 'Employee Salary'
                                                                    }
                                                                </td>
                                                                <td className="text-center" colSpan="2">
                                                                    {expenseCategorySubTotal[categoryId] || ''}
                                                                </td>
                                                            </tr>
                                                        ))}

                                                        {Object.keys(incomeCategorySubTotal).filter(categoryId => !expenseCategorySubTotal[categoryId]).map((categoryId, index) => (
                                                            <tr key={categoryId}>
                                                
                                                                <td className="text-center">{Object.keys(expenseCategorySubTotal).length + index + 1}</td>
                                                                <td className="text-center">
                                                                    {
                                                                        incomeCategorys.find(
                                                                            (incomeCategory) => incomeCategory.id === parseInt(categoryId)
                                                                        )?.income_category_name || ''
                                                                    }
                                                                </td>
                                                                <td className="text-center">{incomeCategorySubTotal[categoryId] || ''}</td>

                                                          
                                                                <td className="text-center"></td>
                                                                <td className="text-center" colSpan="2"></td>
                                                            </tr>
                                                        ))}
                                                    </tbody> */}

                                                    <tbody>
                                                        {/* Loop through expense subtotals first */}
                                                        {Object.keys(expenseCategorySubTotal).map((categoryId, index) => {
                                                            const expenseSubTotal = expenseCategorySubTotal[categoryId] || '';
                                                            const expenseCategoryName = expenseCategorys.find(
                                                                (expenseCategory) => expenseCategory.id === parseInt(categoryId)
                                                            )?.expense_category_name || 'Employee Salary';

                                                            return (
                                                                <tr key={categoryId}>
                                                                    {/* Income Data */}
                                                                    <td className="text-center">{index + 1}</td>
                                                                    <td className="text-center">
                                                                        {
                                                                            incomeCategorys.find(
                                                                                (incomeCategory) => incomeCategory.id === parseInt(categoryId)
                                                                            )?.income_category_name || ''
                                                                        }
                                                                    </td>
                                                                    <td className="text-center">{incomeCategorySubTotal[categoryId] || ''}</td>

                                                                    {/* Expense Data */}
                                                                    <td className="text-center">
                                                                        {expenseSubTotal ? expenseCategoryName : ''}
                                                                    </td>
                                                                    <td className="text-center" colSpan="2">
                                                                        {expenseSubTotal}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}

                                                        {/* Handling extra income categories not in expenses */}
                                                        {Object.keys(incomeCategorySubTotal).filter(categoryId => !expenseCategorySubTotal[categoryId]).map((categoryId, index) => (
                                                            <tr key={categoryId}>
                                                                {/* Income Data */}
                                                                <td className="text-center">{Object.keys(expenseCategorySubTotal).length + index + 1}</td>
                                                                <td className="text-center">
                                                                    {
                                                                        incomeCategorys.find(
                                                                            (incomeCategory) => incomeCategory.id === parseInt(categoryId)
                                                                        )?.income_category_name || ''
                                                                    }
                                                                </td>
                                                                <td className="text-center">{incomeCategorySubTotal[categoryId] || ''}</td>

                                                                {/* Expense Data (Empty for unmatched expense categories) */}
                                                                <td className="text-center"></td>
                                                                <td className="text-center" colSpan="2"></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>

                                                    <tfoot>
                                                        <tr>
                                                            <th class="text-center" colspan="1"></th>
                                                            <th class="text-center">Total</th>
                                                            <th class="text-center">{totalIncome}</th>
                                                            <th class="text-center">Total</th>
                                                            <th class="text-center" colspan="2">{totalExpense}</th>
                                                        </tr>
                                                        <tr>
                                                            <th class="text-center" colspan="4"></th>
                                                            <th class="text-center">Total Income</th>
                                                            <th class="text-center">{totalIncome}</th>
                                                        </tr>
                                                        <tr>
                                                            <th class="text-center" colspan="4"></th>
                                                            <th class="text-center">Total Expense</th>
                                                            <th class="text-center">{totalExpense}</th>
                                                        </tr>
                                                        <tr>
                                                            <th class="text-center" colspan="4"></th>
                                                            <th class="text-center">Total Balance</th>
                                                            <th class="text-center">{totalIncome - totalExpense}</th>
                                                        </tr>
                                                    </tfoot>

                                                </table>
                                            </div>
                                        ) : (
                                            // <div class="table-responsive">

                                            //     <table class="table table-bordered table-hover table-striped table-sm  ">

                                            //         <thead>

                                            //             <tr>

                                            //                 <th class="text-center" rowspan="2">SL</th>



                                            //                 <th class="text-center" colspan="2">Income</th>

                                            //                 <th class="text-center" colspan="3">Expense</th>



                                            //             </tr>

                                            //             <tr>



                                            //                 <th class="text-center">Title</th>

                                            //                 <th class="text-center">Amount</th>

                                            //                 <th class="text-center">Title</th>

                                            //                 <th class="text-center" colspan="2">Amount</th>



                                            //             </tr>

                                            //         </thead>

                                            //         <tbody>


                                            //             <tr>

                                            //                 <td class="text-center">1</td>


                                            //                 <td class="text-center">Admission Form Fees</td>

                                            //                 <td class="text-center">400.00</td>



                                            //                 <td class="text-center"></td>

                                            //                 <td class="text-center" colspan="2"></td>






                                            //             </tr>



                                            //         </tbody><tfoot>

                                            //             <tr>

                                            //                 <th class="text-center" colspan="1"></th>

                                            //                 <th class="text-center">Total</th>

                                            //                 <th class="text-center">155750</th>

                                            //                 <th class="text-center">Total</th>

                                            //                 <th class="text-center" colspan="2">0</th>

                                            //             </tr>



                                            //             <tr>

                                            //                 <th class="text-center" colspan="4"></th>

                                            //                 <th class="text-center">Total Income</th>

                                            //                 <th class="text-center">155750</th>

                                            //             </tr>



                                            //             <tr>

                                            //                 <th class="text-center" colspan="4"></th>

                                            //                 <th class="text-center">Total Expense</th>

                                            //                 <th class="text-center">0</th>

                                            //             </tr>



                                            //             <tr>

                                            //                 <th class="text-center" colspan="4"></th>

                                            //                 <th class="text-center">Total Balance</th>

                                            //                 <th class="text-center">155750</th>

                                            //             </tr>

                                            //         </tfoot>



                                            //     </table>

                                            // </div>
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-hover table-striped table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th className="text-center" rowSpan="2">SL</th>
                                                            <th className="text-center" colSpan="2">Income</th>
                                                            <th className="text-center" colSpan="3">Expense</th>
                                                        </tr>
                                                        <tr>
                                                            <th className="text-center">Title</th>
                                                            <th className="text-center">Amount</th>
                                                            <th className="text-center">Title</th>
                                                            <th className="text-center" colSpan="2">Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {processedIncome?.map((income, index) => (
                                                            <tr key={income.categoryId}>
                                                                <td className="text-center">{index + 1}</td>
                                                                <td className="text-center">{income.title}</td>
                                                                <td className="text-center">{income.amount}</td>
                                                                <td className="text-center"></td>
                                                                <td className="text-center" colSpan="2"></td>
                                                            </tr>
                                                        ))}

                                                        {processedExpenses?.map((expense, index) => (
                                                            <tr key={expense.categoryId}>
                                                                <td className="text-center">{processedIncome.length + index + 1}</td>
                                                                <td className="text-center"></td>
                                                                <td className="text-center"></td>
                                                                <td className="text-center">{expense.title}</td>
                                                                <td className="text-center">{expense.amount}</td>
                                                                <td className="text-center"></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th className="text-center" colSpan="1"></th>
                                                            <th className="text-center">Total</th>
                                                            <th className="text-center">{totalIncomes}</th>
                                                            <th className="text-center">Total</th>
                                                            <th className="text-center" colSpan="2">{totalExpenses}</th>
                                                        </tr>
                                                        <tr>
                                                            <th className="text-center" colSpan="4"></th>
                                                            <th className="text-center">Total Income</th>
                                                            <th className="text-center">{totalIncomes}</th>
                                                        </tr>
                                                        <tr>
                                                            <th className="text-center" colSpan="4"></th>
                                                            <th className="text-center">Total Expense</th>
                                                            <th className="text-center">{totalExpenses}</th>
                                                        </tr>
                                                        <tr>
                                                            <th className="text-center" colSpan="4"></th>
                                                            <th className="text-center">Total Balance</th>
                                                            <th className="text-center">{totalBalance}</th>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    );
};

export default GeneralLedger;





{/* <div class="table-responsive">

    <table class="table table-bordered table-hover table-striped table-sm  ">

        <thead>

            <tr>

                <th class="text-center" rowspan="2">SL</th>



                <th class="text-center" colspan="2">Credit</th>

                <th class="text-center" colspan="3">Debit</th>



            </tr>

            <tr>



                <th class="text-center">Title</th>

                <th class="text-center">Amount</th>

                <th class="text-center">Title</th>

                <th class="text-center" colspan="2">Amount</th>



            </tr>

        </thead>

        <tbody>


            <tr>

                <td class="text-center">1</td>


                <td class="text-center">Admission Form Fees</td>

                <td class="text-center">400.00</td>



                <td class="text-center"></td>

                <td class="text-center" colspan="2"></td>






            </tr>



        </tbody><tfoot>

            <tr>

                <th class="text-center" colspan="1"></th>

                <th class="text-center">Total</th>

                <th class="text-center">155750</th>

                <th class="text-center">Total</th>

                <th class="text-center" colspan="2">0</th>

            </tr>



            <tr>

                <th class="text-center" colspan="4"></th>

                <th class="text-center">Total Income</th>

                <th class="text-center">155750</th>

            </tr>



            <tr>

                <th class="text-center" colspan="4"></th>

                <th class="text-center">Total Expense</th>

                <th class="text-center">0</th>

            </tr>



            <tr>

                <th class="text-center" colspan="4"></th>

                <th class="text-center">Total Balance</th>

                <th class="text-center">155750</th>

            </tr>

        </tfoot>



    </table>

</div> */}



// <tfoot>
//                                                     <tr>
//                                                         <th class="text-center" colspan="1"></th>
//                                                         <th class="text-center">Total</th>
//                                                         <th class="text-center">1752750</th>
//                                                         <th class="text-center">Total</th>
//                                                         <th class="text-center" colspan="2">9000</th>
//                                                     </tr>
//                                                     <tr>
//                                                         <th class="text-center" colspan="4"></th>
//                                                         <th class="text-center">Total Income</th>
//                                                         <th class="text-center">1752750</th>
//                                                     </tr>
//                                                     <tr>
//                                                         <th class="text-center" colspan="4"></th>
//                                                         <th class="text-center">Total Expense</th>
//                                                         <th class="text-center">9000</th>
//                                                     </tr>
//                                                     <tr>
//                                                         <th class="text-center" colspan="4"></th>
//                                                         <th class="text-center">Total Balance</th>
//                                                         <th class="text-center">1743750</th>
//                                                     </tr>
//                                                 </tfoot>