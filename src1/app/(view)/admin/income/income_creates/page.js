'use client' 
 //ismile
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Swal from "sweetalert2";
import { FaTrash } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';



const CreateIncome = () => {

    const [supplierId, setSupplierId] = useState('');

    const supplier_id = (id) => {
        setSupplierId(id);
        console.log("Selected supplier id:", id);
    };



    // Dynamically generate API endpoint based on selected supplierId
    const api = supplierId ? `/Admin/supplier/due_amount/${supplierId}` : '';

    const { data: supplierLastDue } = useQuery({
        queryKey: ['supplierLastDue', api], // Include api in queryKey to trigger refetch when api changes
        queryFn: async () => {
            if (api) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002${api}`);
                const data = await res.json();
                return data;
            }
        },
        enabled: !!api, // Enable the query only if api is truthy (supplierId is selected)
    });


    console.log(supplierLastDue?.payable_amount)

    const prev_due = 0;
    const [numToAdd, setNumToAdd] = useState(1);
    const [fields, setFields] = useState([{ income_category: '', item_name: '', amount: '', quantity: '', total_amount: '' }]);




    const handleChange = (index, event) => {

        const newFields = [...fields];

        if (event.target.type === 'file') {
            newFields[index][event.target.name] = event.target.files[0];
        } else {
            newFields[index][event.target.name] = event.target.value;

            // Calculate total_amount when quantity or amount changes

            if (event.target.name === 'quantity' || event.target.name === 'amount') {
                const quantity = parseFloat(newFields[index].quantity || 0);
                const amount = parseFloat(newFields[index].amount || 0);

                newFields[index].total_amount = (quantity * amount).toFixed(3); // Assuming you want 2 decimal places
            }
        }
        setFields(newFields);
    };




    const handleAddMore = () => {
        const numToAddInt = parseInt(numToAdd);
        if (!isNaN(numToAddInt) && numToAddInt > 0) {
            const newInputValues = [...fields];
            for (let i = 0; i < numToAddInt; i++) {
                newInputValues.push({
                    income_category: '', item_name: '', amount: '', quantity: '', total_amount: ''
                });
            }
            setFields(newInputValues);
            setNumToAdd(1);
        }
    };

    const handleRemoveField = (index) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        setFields(newFields);
    };



    const [created, setCreated] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setCreated(storedUserId);
        }
    }, []);

    // Inside your component function
    const [discountAmount, setDiscountAmount] = useState(0);
    const [dueAmount, setDueAmount] = useState(0);

    // Other state variables and useEffect remain the same

    const calculateTotals = () => {
        let totalAmount = 0;
        let totalDiscount = parseFloat(discountAmount);
        let totalDueAmount = parseFloat(dueAmount);
        let totalPaidAmount = 0;
        let preDueAmount = 0;
        let totalPayAbleAmount = 0;

        fields.forEach((field) => {
            totalAmount += parseFloat(field.total_amount || 0);
        });

        totalPayAbleAmount = totalAmount - totalDiscount;

        // Calculate totalPaidAmount
        totalPaidAmount = totalPayAbleAmount - totalDueAmount;

        return {
            netAmount: totalAmount + preDueAmount,
            totalAmount,
            totalDiscount,
            totalPaidAmount,
            totalDueAmount,
            totalPayAbleAmount,
        };
    };

    // Other functions remain the same

    const handleInputChange = (event) => {

        if (event.target.name === 'discountAmount') {
            setDiscountAmount(parseFloat(event.target.value));
        } else if (event.target.name === 'dueAmount') {
            setDueAmount(parseFloat(event.target.value));
        }
    };



    const {
        totalAmount,

        totalPaidAmount,
        preDueAmount = prev_due,

        netAmount,
        totalPayAbleAmount
    } = calculateTotals();

    const router = useRouter()

    const { data: account_head = []
    } = useQuery({
        queryKey: ['account_head'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_head/account_head_list`)

            const data = await res.json()
            return data
        }
    })



    const [selectedEntryType, setSelectedEntryType] = useState('');

    const handleEntryTypeChange = (event) => {
        setSelectedEntryType(event.target.value);
    };


    const [selectedData, setSelectedData] = useState({ amount: 0 }); // Example data

    useEffect(() => {
        if (selectedEntryType) {
            const item = account_head.find(item => item.id === parseInt(selectedEntryType));
            if (item) {
                const updatedItem = {
                    ...item,
                    amount: (item.amount || 0) + (totalPaidAmount + preDueAmount) // Add 100 to amount, 
                };
                setSelectedData(updatedItem); // Set only the matching item
            } else {
                setSelectedData(null); // Clear if no match
            }
        }
    }, [selectedEntryType, account_head, totalPaidAmount, preDueAmount]); // Trigger when selectedEntryType changes

    console.log(selectedData)


   

    const loan_payment_create = (e) => {
        e.preventDefault();

        const payload = {
            selectedData: selectedData,
            selectedEntryType: selectedEntryType
        };

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/income/update_income_amount`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload) // Send both selectedData and selectedEntryType
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Update successful:', data);
        })
        .catch(error => {
            console.error('Error updating income amount:', error);
        });
    };

    const income_create = (event) => {

        event.preventDefault();
        const form = event.target


        for (let index = 0; index < fields.length; index++) {
            const item_name = form.item_name.value || form?.item_name[index]?.value
            const income_category = form.income_category.value || form?.income_category[index]?.value
            const amount = form.amount.value || form?.amount[index]?.value
            // const voucher_id = form.voucher_id.value || form?.voucher_id[index]?.value
            const payment = form.payment.value || form?.payment[index]?.value

            const discount = form.discountAmount.value || form?.discountAmount[index]?.value
            const short_note = form.short_note.value || form?.short_note[index]?.value || null
            const quantity = form.quantity.value || form?.quantity[index]?.value
            const previous_due = form.previous_due.value || ''

            const payable_amount = form.payable_amount.value || ''
            const due_amount = form.dueAmount.value || ''
            const paid_amount = form.paid_amount.value || ''
            const sub_total = form.sub_total.value || ''
            let bank_check_no = '';


            if (selectedEntryType === '2') {
                bank_check_no = form.bank_check_no.value || '';
            }



            const productData = {
                income_category,
                amount,
                payment_type: payment,
                income_date: currentDate,
                discount,
                short_note,
                created_by: created,
                bank_check_no, sub_total, previous_due,
                payable_amount,
                due_amount,
                paid_amount,
                quantity,
                item_name

            }

            console.log(productData);

            // /Admin/income/income_create
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/income/income_create`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(productData),


            })
                .then((Response) => {
                    Response.json()
                    console.log(Response)
                    if (Response.ok === true) {
                        sessionStorage.setItem("message", "Data saved successfully!");
                        // router.push('/Admin/income/income_all')
                    }
                })
                .then((data) => {

                    console.log(data);

                    // if (data?.affectedRows) {
                    //     Swal.fire({
                    //         title: 'Success!',
                    //         text: 'admin page list edit Successful !!',
                    //         icon: 'success',
                    //         confirmButtonText: 'Ok'
                    //     })
                    // }

                }).catch((error) => console.error(error));



        }
    }



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


    const [currentDate, setCurrentDate] = useState('');
    const [formattedDate, setFormattedDate] = useState('');
    // useEffect to update the current date when the component mounts
    useEffect(() => {
        const getCurrentDate = () => {
            // Get the current date
            const now = new Date();
            // Format the date to YYYY-MM-DD (required format for type="date" input)
            const formattedDate = now.toISOString().split('T')[0];
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            const formatted = new Intl.DateTimeFormat('en-US', options).format(now);
            setFormattedDate(formatted);
            // Set the state with the current date
            setCurrentDate(formattedDate);
        };

        // Call the function to get the current date
        getCurrentDate();
    }, []);



    const { data: incomeCategories = [], isLoading, refetch
    } = useQuery({
        queryKey: ['incomeCategories'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/income_category/income_category_all`)

            const data = await res.json()
            return data
        }
    })


    const { data: supplierList = []
    } = useQuery({
        queryKey: ['supplierList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/supplier/supplier_list`)

            const data = await res.json()
            return data
        }
    })

    const { data: module_settings = []
    } = useQuery({
        queryKey: ['module_settings'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_all`)

            const data = await res.json()
            return data
        }
    })

    const module_setting = module_settings.filter(moduleI => moduleI.table_name === 'income');

    console.log(module_setting[0]?.decimal_digit, '-------------------------------------');

    const decimal_digit = module_setting[0]?.decimal_digit;




    const handlePrint = () => {

        // Open a new window for printing
        const printWindow = window.open('', '_blank');

        // Start building the HTML content for printing
        let htmlContent = `
        <html>
            <head>
                <title>Pathshala School & College income Form</title>
                <style>
                   
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: left;
                    }
                    thead {
                        background-color: gray; /* Set background color for table header */
                    }
                 
                    body {
                        text-align: center; /* Center align text within the body */
                    }
                </style>
            </head>
            <body>
            <h2 style="margin: 0; padding: 0;">Pathshala School & College income Form</h2>
            <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
            <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
            <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>


            <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">income income Copy</h3>
            <div style="display: flex; justify-content: space-between;">
            <p style="margin: 0; padding: 0;">Receipt No: 829</p>
            <p style="margin: 0; padding: 0;">Collected By: পাঠশালা স্কুল এন্ড কলেজ</p>
            <p style="margin: 0; padding: 0;">Date: ${currentDate}</p>
        </div>
                <table>
                    <thead>
                        <tr>
                           
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                            <th>Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
    `;


        // Collect data from form fields and construct the rows for printing
        const form = document.querySelector('.form-horizontal');
        const formData = new FormData(form);

        // Initialize total amount variable
        let totalAmount = 0;

        // Get the number of rows (assuming item names determine the number of rows)
        const rowCount = formData.getAll('item_name').length;

        // Iterate over each row and print the corresponding data
        for (let i = 0; i < rowCount; i++) {
            // Get the data for the current row
            const itemName = formData.getAll('item_name')[i];
            const quantity = formData.getAll('quantity')[i];
            const amount = formData.getAll('amount')[i];
            const currentTotalAmount = formData.getAll('total_amount')[i];

            // Add a table row with the data
            htmlContent += `
                <tr>
                    <td>${itemName}</td>
                    <td>${quantity}</td>
                    <td>${amount}</td>
                    <td>${currentTotalAmount}</td>
                </tr>
            `;

            // Accumulate total amount
            totalAmount += parseFloat(currentTotalAmount);
        }

        // Finish building HTML content
        htmlContent += `
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3">Paid Amount:</td>
                                <td>${(totalPaidAmount + preDueAmount).toFixed(3)}</td>
                            </tr>
                            <tr>
                                <td colspan="3">Due Amount:</td>
                                <td>${dueAmount}</td>
                            </tr>
                            
                            </tfoot>
                            </table>
                            <footer>
                            <p>a</p>
                            
                            </footer>
                </body>
            </html>
        `;

        // Write HTML content to the print window and print it
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
    };






    // Modified formatString function to capitalize each word
    const formatString = () => {
        handlePrint()
        income_create()
    };

    const [text, setText] = useState('');
    const maxLength = 500;

    const handleChangeTextarea = (event) => {
        const inputText = event.target.value;
        if (inputText.length <= maxLength) {
            setText(inputText);
        }
    };

    const handlePaste = (event) => {
        const pastedText = event.clipboardData.getData('text/plain');
        const newText = text + pastedText;
        if (newText.length > maxLength) {
            event.preventDefault();
        } else {
            setText(newText);
        }
    };




    return (
        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    <div className='card'>

                        <div className="card-default">


                            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Create income</h5>
                                <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
                                    <Link href={`/Admin/income/income_all?page_group=${page_group}`} className="btn btn-sm btn-info">Back to income List</Link>
                                </div>
                            </div>
                            <>
                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={income_create}>


                                    <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                        (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                                    </div>



                                    <div className="card-body">
                                        <div>
                                            <div className="card-header custom-card-header py-1 clearfix  bg-gradient-primary text-white">

                                                <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
                                                    <strong>income</strong>
                                                </div>

                                                <div className="card-title card-header-color font-weight-bold mb-0 float-right">
                                                    <div className="input-group printable">
                                                        <input
                                                            style={{ width: '80px' }}
                                                            type="number"
                                                            min="1"
                                                            className="form-control "
                                                            placeholder="Enter number of forms to add"
                                                            value={numToAdd}
                                                            onChange={(event) => setNumToAdd(event.target.value)}
                                                        />
                                                        <div className="input-group-append">
                                                            <button
                                                                type="button"
                                                                className="btn btn-info btn-sm py-1 add_more "
                                                                onClick={handleAddMore}
                                                            >
                                                                Add More
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="form-group row px-3 ">
                                                    <table className="table table-bordered  table-hover table-striped table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th>
                                                                    income Category
                                                                </th>
                                                                <th>
                                                                    Item Name
                                                                </th>
                                                                <th>
                                                                    Quantity
                                                                </th>
                                                                <th>
                                                                    Amount
                                                                </th>
                                                                <th>
                                                                    Total Amount
                                                                </th>

                                                                <th>
                                                                    Action
                                                                </th>
                                                            </tr>

                                                        </thead>

                                                        <tbody>

                                                            {isLoading ? <div className='text-center'>
                                                                <div className='  text-center text-dark'>

                                                                    <FontAwesomeIcon style={{
                                                                        height: '33px',
                                                                        width: '33px',
                                                                    }} icon={faSpinner} spin />

                                                                </div>
                                                            </div>

                                                                :


                                                                <>

                                                                    {
                                                                        fields.map((field, index) => (
                                                                            <>

                                                                                <tr >
                                                                                    <td>
                                                                                        <select
                                                                                            required=""
                                                                                            name="income_category"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            value={field.income_category}
                                                                                            onChange={(e) => handleChange(index, e)}>

                                                                                            <option value="1">Select One</option>
                                                                                            {
                                                                                                incomeCategories.map((income) => (
                                                                                                    <>
                                                                                                        <option value={income.id}>{income.income_category_name}</option>
                                                                                                    </>
                                                                                                ))
                                                                                            }

                                                                                        </select>
                                                                                    </td>

                                                                                    <td>
                                                                                        <input
                                                                                            type="text"
                                                                                            required
                                                                                            name="item_name"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            placeholder="income Title"
                                                                                            value={field.item_name}
                                                                                            onChange={(e) => handleChange(index, e)}
                                                                                        />

                                                                                    </td>

                                                                                    <td>
                                                                                        <input
                                                                                            type="text"
                                                                                            required
                                                                                            name="quantity"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            placeholder="Enter Quantity "
                                                                                            value={field.quantity}
                                                                                            onChange={(e) => handleChange(index, e)}
                                                                                        />
                                                                                    </td>

                                                                                    <td>
                                                                                        <input
                                                                                            type="text"
                                                                                            required
                                                                                            name="amount"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            placeholder="Enter Amount "
                                                                                            value={field.amount}
                                                                                            onChange={(e) => handleChange(index, e)}
                                                                                        />
                                                                                    </td>

                                                                                    <td>
                                                                                        <input
                                                                                            type="text"
                                                                                            required
                                                                                            readOnly
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            placeholder="total amount"
                                                                                            value={Number(field.total_amount).toFixed(decimal_digit)}
                                                                                        />
                                                                                        <input
                                                                                            type="text"
                                                                                            required
                                                                                            readOnly
                                                                                            hidden
                                                                                            name="total_amount"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            placeholder="total amount"
                                                                                            value={Number(field.total_amount).toFixed(3)}
                                                                                        />
                                                                                    </td>
                                                                                    <td> <button type="button" onClick={() => handleRemoveField(index)} className="btn btn-danger btn-sm float-lg-right float-md-right" ><FaTrash></FaTrash></button></td>

                                                                                </tr>
                                                                            </>
                                                                        ))
                                                                    }
                                                                </>
                                                            }
                                                        </tbody>

                                                    </table>


                                                    <div className='col-lg-12 border'>
                                                        <label className='font-weight-bold'>Short Note:</label>
                                                        <textarea
                                                            rows={2}
                                                            value={text}
                                                            onChange={handleChangeTextarea}
                                                            onPaste={handlePaste}
                                                            className={`form-control form-control-sm mb-2 ${text.length > maxLength ? 'is-invalid' : ''}`}
                                                            placeholder="Enter Short Note"
                                                            name='short_note'
                                                        ></textarea>
                                                        <div>{text.length}/{maxLength}</div>
                                                        {text.length > maxLength && (
                                                            <div className="invalid-feedback">Exceeded character limit</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>



                                    <div className="container mx-auto ">


                                        <div class="form-group row student d-flex justify-content-end ">
                                            <label class="col-form-label col-md-2">
                                                <strong>Paid By:</strong>
                                            </label>


                                            <div class="col-md-3">
                                                <select
                                                    required=""
                                                    name="payment"
                                                    className="form-control form-control-sm mb-2"
                                                    value={selectedEntryType}
                                                    onChange={handleEntryTypeChange}

                                                >
                                                    {
                                                        account_head.map(account =>

                                                            <>
                                                                <option value={account.id}>{account.account_head_name}</option>
                                                            </>
                                                        )
                                                    }

                                                </select>
                                            </div>

                                        </div>

                                        <div class="">

                                            {selectedEntryType == 23 ?

                                                <div class="form-group row student d-flex justify-content-end ">
                                                    <label class="col-form-label col-md-2">
                                                        <strong>Bank Check No:</strong>
                                                    </label>

                                                    <div class="col-md-3">
                                                        <input
                                                            type="text"
                                                            required
                                                            name="bank_check_no"
                                                            className="form-control form-control-sm mb-2"
                                                            placeholder="Enter Bank Check No"
                                                        />
                                                    </div>
                                                </div>

                                                :

                                                <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}></div>
                                            }

                                        </div>






                                        <div class="form-group row student d-flex justify-content-end ">
                                            <label class="col-form-label col-md-2">
                                                <strong>Sub Total:</strong>
                                            </label>

                                            <div class="col-md-3">
                                                <input
                                                    type="text"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="totalAmount"
                                                    placeholder="Enter Total Amount"
                                                    value={totalAmount.toFixed(decimal_digit)}
                                                />
                                                <input
                                                    type="text"
                                                    hidden
                                                    name="sub_total"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="totalAmount"
                                                    placeholder="Enter Total Amount"
                                                    value={totalAmount.toFixed(3)}
                                                />
                                            </div>
                                        </div>

                                        <div class="form-group row student d-flex justify-content-end ">
                                            <label class="col-form-label col-md-2 d-none">
                                                <strong>Previous Due:</strong>
                                            </label>
                                            <div class="col-md-3">
                                                <input
                                                    type="text"
                                                    class="form-control form-control-sm  alpha_space student_id d-none"
                                                    id="totalAmount"
                                                    placeholder="Enter Total Amount"
                                                    value={preDueAmount.toFixed(decimal_digit)}
                                                />

                                                <input
                                                    type="text"
                                                    hidden
                                                    name="previous_due"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="totalAmount"
                                                    placeholder="Enter Total Amount"
                                                    value={preDueAmount.toFixed(3)}
                                                />
                                            </div>
                                        </div>

                                        <div class="form-group row student d-flex justify-content-end ">
                                            <label class="col-form-label col-md-2">
                                                <strong>Net Amount:</strong>
                                            </label>
                                            <div class="col-md-3">
                                                <input
                                                    type="text"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="netAmount"
                                                    placeholder="Enter Net Amount"
                                                    value={netAmount.toFixed(decimal_digit)}
                                                />
                                                <input
                                                    type="text"
                                                    hidden
                                                    name="net_amount"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="netAmount"
                                                    placeholder="Enter Net Amount"
                                                    value={netAmount.toFixed(3)}
                                                />
                                            </div>
                                        </div>

                                        <div class="form-group row student d-flex justify-content-end ">
                                            <label class="col-form-label col-md-2">
                                                <strong>Discount:</strong>
                                            </label>
                                            <div class="col-md-3">
                                                <input
                                                    type="text"
                                                    name="discountAmount"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="discountAmount"
                                                    placeholder="Enter Discount Amount"
                                                    value={discountAmount}
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                        </div>
                                        <div class="form-group row student d-flex justify-content-end ">
                                            <label class="col-form-label col-md-2">
                                                <strong>Payable Amount:</strong>
                                            </label>
                                            <div class="col-md-3">
                                                <input
                                                    type="text"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="paidAmount"
                                                    placeholder="Enter Paid Amount"
                                                    value={(totalPayAbleAmount + preDueAmount).toFixed(decimal_digit)}
                                                />
                                                <input
                                                    type="text"
                                                    hidden
                                                    name="payable_amount"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="paidAmount"
                                                    placeholder="Enter Paid Amount"
                                                    value={(totalPayAbleAmount + preDueAmount).toFixed(3)}
                                                />
                                            </div>
                                        </div>




                                        <div class="form-group row student d-flex justify-content-end ">
                                            <label class="col-form-label col-md-2">
                                                <strong>Paid Amount:</strong>
                                            </label>
                                            <div class="col-md-3">
                                                <input
                                                    type="text"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="paidAmount"
                                                    placeholder="Enter Paid Amount"
                                                    value={(totalPaidAmount + preDueAmount).toFixed(decimal_digit)}
                                                />
                                                <input
                                                    type="text"
                                                    hidden
                                                    name="paid_amount"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="paidAmount"
                                                    placeholder="Enter Paid Amount"
                                                    value={(totalPaidAmount + preDueAmount).toFixed(3)}
                                                />
                                            </div>
                                        </div>


                                        <div class="form-group row student d-flex justify-content-end ">
                                            <label class="col-form-label col-md-2">
                                                <strong>Due Amount:</strong>
                                            </label>
                                            <div class="col-md-3">

                                                <input
                                                    type="text"

                                                    name="dueAmount" // Make sure the name matches the state variable name
                                                    className="form-control form-control-sm alpha_space student_id" // Use className instead of class
                                                    id="dueAmount"
                                                    placeholder="Enter Due Amount"
                                                    value={dueAmount} // Use value attribute to bind the state variable
                                                    onChange={handleInputChange} // Call handleInputChange function on change
                                                />
                                            </div>
                                        </div>

                                        <div class="form-group row d-flex justify-content-end">
                                            <div class="offset-md-2  ">
                                                <input type='submit' onClick={handlePrint} name="search" class="btn btn-sm btn-info search_btn mr-2" value="Print" />
                                                <input onClick={loan_payment_create} type="submit" name="Print" class="btn btn-sm btn-success print_btn mr-2" value="Save" />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </>


                        </div>
                    </div>
                </div>
            </div>
        </div>



    );
};

export default CreateIncome;