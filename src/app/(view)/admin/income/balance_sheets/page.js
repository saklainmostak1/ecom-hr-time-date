'use client' 
 //ismile
import React, { useEffect, useState } from 'react';
import './balanceSheet.css'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const SheetBalances = () => {



    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [subTotalIncome, setSubTotalIncome] = useState([]);
    const [subTotal, setSubTotal] = useState([]);
    const [incomeSearch, setIncomeSearch] = useState({});
    const [searchResults, setSearchResults] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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





    // const expense_search = async () => {
    //     setLoading(true);

    //     try {
    //         // Make the first request for expense search
    //         const expenseResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/expense_search_account_reports`, {
    //             fromDate, toDate
    //         });

    //         // Make the second request for income search
    //         const incomeResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/account_report_income`, {
    //             fromDate, toDate
    //         });

    //         // Combine results from both searches
    //         const combinedResults = expenseResponse.data.results;
    //         const combinedResultsIncome = incomeResponse.data.results;


    //         if (combinedResults.length === 0 && combinedResultsIncome.length === 0) {
    //             // alert('Nothing found!');
    //         } else {
    //             const sortedResults = combinedResults; // Sort if necessary
    //             const sortedResultIncome = combinedResultsIncome; // Sort if necessary
    //             setSearchResults(sortedResults);
    //             setIncomeSearch(sortedResultIncome)


    //             const sub_total = combinedResults.reduce((sum, result) => sum + result.sub_total, 0);
    //             const sub_totalIncome = combinedResultsIncome.reduce((sum, result) => sum + result.sub_total, 0);

    //             setSubTotalIncome(sub_totalIncome)
    //             setSubTotal(sub_total);


    //             setError(null);
    //         }
    //     } catch (error) {
    //         setError("An error occurred during search.");
    //         setSearchResults([]);
    //     } finally {
    //         setLoading(false); // Ensure loading is turned off
    //     }
    // };

    const expense_search = async () => {
        setLoading(true);

        try {
            // Make the first request for expense search
            const expenseResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/expense_search_account_reports`, {
                fromDate, toDate
            });

            // Make the second request for income search
            const incomeResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/account_report_income`, {
                fromDate, toDate
            });

            // Combine results from both searches
            const combinedResults = expenseResponse.data.results;
            const combinedResultsIncome = incomeResponse.data.results;

            if (combinedResults.length === 0 && combinedResultsIncome.length === 0) {
                // alert('Nothing found!');
            } else {
                // Group by 'paid_by' for expense results
                const expenseByPaidBy = combinedResults.reduce((acc, result) => {
                    if (!acc[result.paid_by]) {
                        acc[result.paid_by] = 0;
                    }
                    acc[result.paid_by] += result.sub_total;
                    return acc;
                }, {});

                // Group by 'paid_by' for income results
                const incomeByPaidBy = combinedResultsIncome.reduce((acc, result) => {
                    if (!acc[result.paid_by]) {
                        acc[result.paid_by] = 0;
                    }
                    acc[result.paid_by] += result.sub_total;
                    return acc;
                }, {});

                // Set the grouped results
                setSearchResults(expenseByPaidBy);
                setIncomeSearch(incomeByPaidBy);

                // Calculate the total sub_totals
                const sub_total = Object.values(expenseByPaidBy).reduce((sum, value) => sum + value, 0);
                const sub_totalIncome = Object.values(incomeByPaidBy).reduce((sum, value) => sum + value, 0);

                setSubTotalIncome(sub_totalIncome);
                setSubTotal(sub_total);

                setError(null);
            }
        } catch (error) {
            setError("An error occurred during search.");
            setSearchResults([]);
        } finally {
            setLoading(false); // Ensure loading is turned off
        }
    };


    const { data: account_head = []
    } = useQuery({
        queryKey: ['account_head'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_head/account_head_list`)

            const data = await res.json()
            return data
        }
    })


    const { data: totals = []
    } = useQuery({
        queryKey: ['totals'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/account_report_combined`)

            const data = await res.json()
            return data
        }
    })


    console.log(searchResults)
    console.log(incomeSearch)



    const balance_sheet_print = async () => {
        try {

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

            const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/balance_sheet_print`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orientation, selectedPrintSize, fontSize, incomeSearch, searchResults, totals, account_head
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


    const balance_sheet_pdf = async () => {



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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_report/balance_sheet_pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orientation, selectedPrintSize, fontSize, incomeSearch, searchResults, totals, account_head
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
                                                        onClick={balance_sheet_print}
                                                    />
                                                    <input

                                                        type="button"
                                                        onClick={balance_sheet_pdf}
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

                    <div class="col-md-12">
                        <div class="table-responsive">
                            <table class="table table-bordered ">

                                {loading ? (
                                    <div className='text-center'>
                                        <FontAwesomeIcon style={{ height: '33px', width: '33px' }} icon={faSpinner} spin />
                                    </div>
                                ) : (
                                    Object.keys(searchResults).length > 0 || Object.keys(incomeSearch).length > 0 ? (

                                        <>
                                            <thead>
                                                <tr class="report-bg w-100">
                                                    <th>Accounts Title</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="report-bg">
                                                    <th>Asset</th>
                                                    <th></th>
                                                </tr>

                                                {(() => {
                                                    let totalAmountSum = 0; // Declare totalAmountSum here

                                                    // Render the account rows and accumulate totalAmountSum
                                                    const accountRows = account_head.map((account) => {
                                                        // Get the corresponding values from searchResults and incomeSearch
                                                        const expenseAmount = searchResults[account.id] || 0; // Default to 0 if no match
                                                        const incomeAmount = incomeSearch[account.id] || 0; // Default to 0 if no match
                                                        // const totalAmount = expenseAmount + incomeAmount;
                                                        const totalAmount =incomeAmount -  expenseAmount ;

                                                        // Accumulate the total amount
                                                        totalAmountSum += totalAmount;

                                                        return (
                                                            <tr key={account.id}>
                                                                <th>{account.account_head_name}</th>
                                                                <th>{totalAmount.toLocaleString()}</th>
                                                            </tr>
                                                        );
                                                    });

                                                    // Return both the rows and the accumulated totalAmountSum for rendering
                                                    return (
                                                        <>
                                                            {accountRows}
                                                            <tr className="report-bg">
                                                                <td>Subtotal</td>
                                                                <td>{totalAmountSum.toLocaleString()}</td>
                                                            </tr>

                                                            <tr className="report-bg">
                                                                <th>Liability</th>
                                                                <th></th>
                                                            </tr>
                                                            <tr>
                                                                <th>Bank Loan</th>
                                                                <th>0</th>
                                                            </tr>

                                                            <tr className="report-bg">
                                                                <td>Subtotal</td>
                                                                <td>0</td>
                                                            </tr>

                                                            <tr className="report-bg">
                                                                <th>Owner's Equity</th>
                                                                <th></th>
                                                            </tr>
                                                            <tr>
                                                                <th>Capital</th>
                                                                <th>0</th>
                                                            </tr>

                                                            <tr>
                                                                <th>Withdraw</th>
                                                                <th>0</th>
                                                            </tr>

                                                            <tr className="report-bg">
                                                                <td>Subtotal</td>
                                                                <td>0</td>
                                                            </tr>

                                                            <tr className="report-bg">
                                                                <td>Net Profit/Loss</td>
                                                                <td>{totalAmountSum.toLocaleString()}</td>
                                                            </tr>

                                                            <tr className="report-bg">
                                                                <td>Net Liability and Owner’s Equity</td>
                                                                <td>{totalAmountSum.toLocaleString()}</td>
                                                            </tr>

                                                            <tr className="report-bg">
                                                                <td>Net Asset</td>
                                                                <td>{totalAmountSum.toLocaleString()}</td>
                                                            </tr>
                                                        </>
                                                    );
                                                })()}
                                            </tbody>

                                        </>
                                    ) : (

                                        <>
                                            <>
                                                <thead>
                                                    <tr class="report-bg w-100">
                                                        <th>Accounts Title</th>
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="report-bg">
                                                        <th>Asset</th>
                                                        <th></th>
                                                    </tr>

                                                    {(() => {
                                                        let totalAmountSum = totals.totalAmountSum || 0; // Get totalAmountSum from the 'totals' object

                                                        // Render the account rows using the 'accountRows' from the 'totals' object
                                                        return (
                                                            <>
                                                                {totals?.accountRows?.map((account, index) => (
                                                                    <tr key={index}>
                                                                        <th>{account.account_head_name}</th>
                                                                        <th>{account.totalAmount}</th>
                                                                    </tr>
                                                                ))}

                                                                {/* Subtotal section */}
                                                                <tr className="report-bg">
                                                                    <td>Subtotal</td>
                                                                    <td>{totalAmountSum}</td>
                                                                </tr>

                                                                {/* Liability section */}
                                                                <tr className="report-bg">
                                                                    <th>Liability</th>
                                                                    <th></th>
                                                                </tr>
                                                                <tr>
                                                                    <th>Bank Loan</th>
                                                                    <th>0</th>
                                                                </tr>

                                                                <tr className="report-bg">
                                                                    <td>Subtotal</td>
                                                                    <td>0</td>
                                                                </tr>

                                                                {/* Owner's Equity section */}
                                                                <tr className="report-bg">
                                                                    <th>Owner's Equity</th>
                                                                    <th></th>
                                                                </tr>
                                                                <tr>
                                                                    <th>Capital</th>
                                                                    <th>0</th>
                                                                </tr>

                                                                <tr>
                                                                    <th>Withdraw</th>
                                                                    <th>0</th>
                                                                </tr>

                                                                <tr className="report-bg">
                                                                    <td>Subtotal</td>
                                                                    <td>0</td>
                                                                </tr>

                                                                {/* Net Profit/Loss */}
                                                                <tr className="report-bg">
                                                                    <td>Net Profit/Loss</td>
                                                                    <td>{totalAmountSum}</td>
                                                                </tr>

                                                                {/* Net Liability and Owner's Equity */}
                                                                <tr className="report-bg">
                                                                    <td>Net Liability and Owner’s Equity</td>
                                                                    <td>{totalAmountSum}</td>
                                                                </tr>

                                                                {/* Net Asset */}
                                                                <tr className="report-bg">
                                                                    <td>Net Asset</td>
                                                                    <td>{totalAmountSum}</td>
                                                                </tr>
                                                            </>
                                                        );
                                                    })()}
                                                </tbody>
                                            </>

                                        </>
                                    )
                                )}




                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SheetBalances;




{/* <tbody>
                                    <tr className="report-bg">
                                        <th>Asset</th>
                                        <th></th>
                                    </tr>

                                    {account_head.map((account) => {
                                        // Get the corresponding values from searchResults and incomeSearch
                                        const expenseAmount = searchResults[account.id] || 0; // Default to 0 if no match
                                        const incomeAmount = incomeSearch[account.id] || 0; // Default to 0 if no match
                                        const totalAmount = expenseAmount + incomeAmount;

                                        return (
                                            <>

                                                <tr key={account.id}>
                                                    <th>{account.account_head_name}</th>
                                                    <th>{totalAmount.toLocaleString()}</th>
                                                </tr>

                                            </>

                                        );
                                    })}
                                    <tr class="report-bg">
                                        <td>Subtotal</td>
                                        <td>

                                        {totalAmount.toLocaleString()} </td>
                                    </tr>
                                    <tr class="report-bg">
                                        <th>Liability</th>
                                        <th></th>
                                    </tr>
                                    <tr>
                                        <th>Bank Loan</th>
                                        <th>
                                            0                                    </th>
                                    </tr>
                                    <tr class="report-bg">
                                        <td>Subtotal</td>
                                        <td>

                                            0 </td>
                                    </tr>
                                    <tr class="report-bg">
                                        <th>Owner's Equity</th>
                                        <th></th>
                                    </tr>
                                    <tr>
                                        <th>Capital</th>
                                        <th>
                                            0                                    </th>
                                    </tr>

                                    <tr>
                                        <th>Withdraw</th>
                                        <th>
                                            0                                    </th>
                                    </tr>
                                    <tr class="report-bg">
                                        <td>Subtotal</td>
                                        <td>

                                            0 </td>
                                    </tr>

                                    <tr class="report-bg">
                                        <td>Net Profit/Loss</td>
                                        <td>
                                        {totalAmount.toLocaleString()} </td>
                                    </tr>
                                    <tr class="report-bg">
                                        <td>Net Liability and Owner’s Equity</td>
                                        <td>
                                        {totalAmount.toLocaleString()} </td>
                                    </tr>
                                    <tr class="report-bg">
                                        <td>Net Asset</td>
                                        <td>
                                        {totalAmount.toLocaleString()} </td>
                                    </tr>
                                </tbody> */}

{/* <tr class="report-bg">
<td>Subtotal</td>
<td>

    7799300 </td>
</tr>
<tr class="report-bg">
<th>Liability</th>
<th></th>
</tr>
<tr>
<th>Bank Loan</th>
<th>
    0                                    </th>
</tr>
<tr class="report-bg">
                                        <td>Subtotal</td>
                                        <td>

                                            0 </td>
                                    </tr>
                                    <tr class="report-bg">
                                        <th>Owner's Equity</th>
                                        <th></th>
                                    </tr>
                                    <tr>
                                        <th>Capital</th>
                                        <th>
                                            0                                    </th>
                                    </tr>

                                    <tr>
                                        <th>Withdraw</th>
                                        <th>
                                            0                                    </th>
                                    </tr>



                                    <tr class="report-bg">
                                        <td>Subtotal</td>
                                        <td>

                                            0 </td>
                                    </tr>

                                    <tr class="report-bg">
                                        <td>Net Profit/Loss</td>
                                        <td>
                                            7799300 </td>
                                    </tr>
                                    <tr class="report-bg">
                                        <td>Net Liability and Owner’s Equity</td>
                                        <td>
                                            7799300 </td>
                                    </tr>
                                    <tr class="report-bg">
                                        <td>Net Asset</td>
                                        <td>
                                            7799300 </td>
                                    </tr> */}