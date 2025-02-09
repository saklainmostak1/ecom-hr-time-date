
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



const EditIncome = ({ id }) => {

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

    const prev_due = supplierLastDue?.payable_amount - supplierLastDue?.paid_amount




    const [modified, setModified] = useState(() => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem('userId') || '';
        }
        return '';
      });
    
      useEffect(() => {
        if (typeof window !== 'undefined') {
          const storedUserId = localStorage.getItem('userId');
          setModified(storedUserId);
        }
      }, []);
    const { data: incomeSingle = []
    } = useQuery({
        queryKey: ['incomeSingle'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/income/income_all/${id}`)

            const data = await res.json()
            return data
        }
    })
    console.log(incomeSingle)


    const [incomeData, setincomeData] = useState({
        supplier_id: '',
        income_category: '',
        amount: '',
        payment_type: '',
        discount: '',
        short_note: '',
        previous_due: '',
        sub_total: '',
        payable_amount: '',
        due_amount: '',
        paid_amount: '',
        bank_check_no: '',
        items: [],
        quantity: '',
        due: '',
        discount: '',
        amount: '',
        item_name: ''

    });


    useEffect(() => {

        setincomeData({
            // category_name: brandSingle[0]?.category_name || '',
            supplier_id: incomeSingle.supplier_id || '',
            income_category: incomeSingle.income_category || '',
            amount: incomeSingle.amount || '',
            payment_type: incomeSingle.payment_type || '',
            discount: incomeSingle.discount || '',
            short_note: incomeSingle.short_note || '',
            previous_due: incomeSingle.previous_due || '',
            sub_total: incomeSingle.sub_total || '',
            payable_amount: incomeSingle.payable_amount || '',
            due_amount: incomeSingle.due_amount || '',
            paid_amount: incomeSingle.paid_amount || '',
            bank_check_no: incomeSingle.bank_check_no || '',
            item_name: incomeSingle.item_name || '',
            amount: incomeSingle.amount || '',
            discount: incomeSingle.discount || '',
            due: incomeSingle.due || '',
            items: incomeSingle?.items?.map(item => ({
                item_name: item.item_name || '',
                amount: item.amount || '',
                discount: item.discount || '',
                due: item.due || ''
            })),
            quantity: incomeSingle.quantity || '',

            modified_by: modified
        });
    }, [modified, incomeSingle]);



    // Inside your component function
    const [discountAmount, setDiscountAmount] = useState(0);
    const [dueAmount, setDueAmount] = useState(0);

    const [quantity, setQuantity] = useState('');
    const [amount, setAmount] = useState('');
    const [totalAmounts, setTotalAmount] = useState('');

    const handleQuantityChange = (e) => {
        const newQuantity = e.target.value;
        setQuantity(newQuantity);
        calculateTotalAmount(newQuantity, amount);
    };

    const handleAmountChange = (e) => {
        const newAmount = e.target.value;
        setAmount(newAmount);
        calculateTotalAmount(quantity, newAmount);
    };

    const calculateTotalAmount = (newQuantity, newAmount) => {
        const total = parseFloat(newQuantity) * parseFloat(newAmount);
        setTotalAmount(isNaN(total) ? '' : total.toFixed(2)); // Handle NaN or unexpected values
    };

    // Other state variables and useEffect remain the same

    const calculateTotals = () => {
        let totalAmount = 0;
        let totalDiscount = parseFloat(discountAmount);
        let totalDueAmount = parseFloat(dueAmount);
        let totalPaidAmount = 0;
        let preDueAmount = prev_due;
        let totalPayAbleAmount = 0;
        totalAmount = parseFloat(incomeData.amount * incomeData.quantity);
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
        if (event.target.name === 'discount') {
            setDiscountAmount(parseFloat(event.target.value));
        } else if (event.target.name === 'due_amount') {
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


    const income_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value

        const attribute = {}
        for (let key in incomeData) {
            attribute[key] = incomeData[key];
        }

        attribute[name] = value;
        setincomeData(attribute);
    };
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
                    amount: (item.amount || 0) + (totalAmount - incomeData.discount - incomeData.previous_due - incomeData.due_amount) // Add 100 to amount, 
                };
                setSelectedData(updatedItem); // Set only the matching item
            } else {
                setSelectedData(null); // Clear if no match
            }
        }
    }, [selectedEntryType, account_head, totalAmount, incomeData.discount,incomeData.previous_due, incomeData.due_amount ]); // Trigger when selectedEntryType changes

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


    const income_update = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get form data
        const formData = new FormData(event.target);

        // Convert form data to JSON object
        const incomeData = {};
        formData.forEach((value, key) => {
            incomeData[key] = value;
        });

        // Make a POST request to your API endpoint
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/income/income_update/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(incomeData),
        })
            .then(response => {
                if (response.ok) {

                    if (response.ok === true) {
                        sessionStorage.setItem("message", "Data Update successfully!");
                        router.push('/Admin/income/income_all')
                    }

                    // Handle success
                    console.log('income data updated successfully');
                    // Optionally, you can redirect the user or perform any other action here
                } else {
                    // Handle error
                    console.error('Failed to update income data');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        // event.preventDefault();
        // try {
        //     // Perform API call to update income details
        //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/income/income_update/${id}`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(incomeData)
        //     });
        //     console.log(incomeData)

        //     if (!res.ok) {
        //         throw new Error('Failed to update income');
        //     }

        //     // Handle success, maybe show a success message or redirect
        //     console.log('income updated successfully');
        //     // income_input_change()
        // } catch (error) {
        //     // Handle error, maybe show an error message
        //     console.error('Error updating income:', error.message);
        // }
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
    const decimal_digit = module_setting[0]?.decimal_digit;




    return (

        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    <div className='card'>

                        <div className="card-default">


                            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Update income</h5>
                                <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
                                    <Link href={`/Admin/income/income_all?page_group=${page_group}`} className="btn btn-sm btn-info">Back to income List</Link>
                                </div>
                            </div>
                            <>
                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={income_update} >

                                    <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                        (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                                    </div>

                                    <div className="card-body">
                                        <div>
                                            <div className="card-header custom-card-header py-1 clearfix  bg-gradient-primary text-white">
                                                <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
                                                    <strong>income</strong>
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
                                                                <>
                                                                    <>

                                                                        <tr>
                                                                            <td>
                                                                                <select
                                                                                    required=""
                                                                                    name="income_category"
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    value={incomeData.income_category}
                                                                                    onChange={income_input_change}
                                                                                >
                                                                                    <option value="">Select One</option>
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
                                                                                    onChange={income_input_change}
                                                                                    value={incomeData.item_name}
                                                                                    type="text"
                                                                                    required
                                                                                    name="item_name"
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    placeholder="income Title"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="text"
                                                                                    required
                                                                                    name="quantity"
                                                                                    value={quantity ? quantity : incomeData.quantity}
                                                                                    onChange={(e) => {
                                                                                        handleQuantityChange(e);
                                                                                        income_input_change(e)
                                                                                    }}
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    placeholder="Enter Quantity"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="text"
                                                                                    required
                                                                                    name="amount"
                                                                                    value={amount ? amount : incomeData.amount}
                                                                                    onChange={(e) => {
                                                                                        handleAmountChange(e);
                                                                                        income_input_change(e)
                                                                                    }}
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    placeholder="Enter Amount"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="text"
                                                                                    required
                                                                                    value={totalAmount ? totalAmount.toFixed(decimal_digit) : (incomeData.amount * incomeData.quantity).toFixed(decimal_digit)}
                                                                                    onChange={income_input_change}
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    placeholder="Total Amount"
                                                                                />
                                                                                <input
                                                                                    type="text"
                                                                                    required
                                                                                    name="total_amount"
                                                                                    hidden
                                                                                    value={totalAmount ? totalAmount.toFixed(3) : (incomeData.amount * incomeData.quantity).toFixed(3)}
                                                                                    onChange={income_input_change}
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    placeholder="Total Amount"
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                </>
                                                            }
                                                        </tbody>

                                                    </table>


                                                    <div className='col-lg-12 border'>
                                                        <label className='font-weight-bold'>Short Note:</label>
                                                        <textarea
                                                            value={incomeData.short_note}
                                                            onChange={income_input_change}
                                                            rows={'2'}
                                                            name="short_note"
                                                            className="form-control form-control-sm mb-2"
                                                            placeholder="Enter Short Note"


                                                        ></textarea>

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
                                            {
                                                selectedEntryType == 23 ?


                                                    <div class="form-group row student d-flex justify-content-end ">
                                                        <label class="col-form-label col-md-2">
                                                            <strong>Bank Check No:</strong>
                                                        </label>


                                                        <div class="col-md-3">
                                                            <input
                                                                onChange={income_input_change}
                                                                type="text"
                                                                required
                                                                name="bank_check_no"
                                                                className="form-control form-control-sm mb-2"
                                                                placeholder="Enter Bank Check No"

                                                            />
                                                        </div>

                                                    </div>
                                                    :
                                                    <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}>



                                                    </div>
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
                                                    onChange={(e) => {
                                                        calculateTotalAmount(e);
                                                        income_input_change(e)
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    name="sub_total"
                                                    hidden
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="totalAmount"
                                                    placeholder="Enter Total Amount"
                                                    value={totalAmount.toFixed(3)}
                                                    onChange={(e) => {
                                                        calculateTotalAmount(e);
                                                        income_input_change(e)
                                                    }}
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
                                                    value={incomeData.previous_due ? (incomeData.previous_due) : preDueAmount.toFixed(decimal_digit)}
                                                    onChange={income_input_change}
                                                />
                                                <input
                                                    type="text"
                                                    hidden
                                                    name="previous_due"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="totalAmount"
                                                    placeholder="Enter Total Amount"
                                                    value={incomeData.previous_due ? Number(incomeData.previous_due).toFixed(3) : preDueAmount.toFixed(3)}
                                                    onChange={income_input_change}
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
                                                    value={(totalAmount - incomeData.previous_due).toFixed(decimal_digit)}
                                                    onChange={income_input_change}
                                                />

                                                <input
                                                    type="text"
                                                    hidden
                                                    name="net_amount"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="netAmount"
                                                    placeholder="Enter Net Amount"
                                                    value={(totalAmount - incomeData.previous_due).toFixed(3)}
                                                    onChange={income_input_change}
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
                                                    name="discount"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="discount"
                                                    placeholder="Enter Discount Amount"
                                                    value={incomeData.discount ? incomeData.discount : discountAmount.toFixed(3)}
                                                    onChange={(e) => {
                                                        handleInputChange(e);
                                                        income_input_change(e)
                                                    }}
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
                                                    value={(totalAmount - incomeData.discount - incomeData.previous_due).toFixed(decimal_digit)}
                                                    // value={incomeData.payable_amount ? incomeData.payable_amount : (totalPayAbleAmount + preDueAmount).toFixed(2)}
                                                    onChange={() => {
                                                        income_input_change(e);
                                                        handleInputChange(e);
                                                    }}
                                                />

                                                <input
                                                    type="text"
                                                    hidden
                                                    name="payable_amount"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="paidAmount"
                                                    placeholder="Enter Paid Amount"
                                                    value={(totalAmount - incomeData.discount - incomeData.previous_due).toFixed(3)}
                                                    // value={incomeData.payable_amount ? incomeData.payable_amount : (totalPayAbleAmount + preDueAmount).toFixed(2)}
                                                    onChange={() => {
                                                        income_input_change(e);
                                                        handleInputChange(e);
                                                    }}

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
                                                    value={(totalAmount - incomeData.discount - incomeData.previous_due - incomeData.due_amount).toFixed(decimal_digit)}
                                                    onChange={(e) => {
                                                        income_input_change(e);
                                                        handleInputChange(e)
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    hidden
                                                    name="paid_amount"
                                                    class="form-control form-control-sm  alpha_space student_id"
                                                    id="paidAmount"
                                                    placeholder="Enter Paid Amount"
                                                    value={(totalAmount - incomeData.discount - incomeData.previous_due - incomeData.due_amount).toFixed(3)}
                                                    onChange={(e) => {
                                                        income_input_change(e);
                                                        handleInputChange(e)
                                                    }}

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
                                                    name="due_amount" // Make sure the name matches the state variable name
                                                    className="form-control form-control-sm alpha_space student_id" // Use className instead of class
                                                    id="due_amount"
                                                    placeholder="Enter Due Amount"
                                                    value={(incomeData.due_amount ? incomeData.due_amount : dueAmount)} // Use value attribute to bind the state variable
                                                    onChange={(e) => {
                                                        handleInputChange(e);
                                                        income_input_change(e)
                                                    }} // Call handleInputChange function on change
                                                />
                                            </div>
                                        </div>

                                        <div class="form-group row d-flex justify-content-end">
                                            <div class="offset-md-2  ">

                                                <input  type="submit" name="Print" class="btn btn-sm btn-success print_btn mr-2" value="Update" />
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

export default EditIncome;
