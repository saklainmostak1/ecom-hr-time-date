// 'use client' 
 //ismile
// import React, { useState } from 'react';
// import axios from 'axios';

// const ExpenseUpdateForm = ({id}) => {
//     const [formData, setFormData] = useState({
//         item_name: '',
//         supplier_id: '',
//         expense_category: '',
//         amount: '',
//         quantity: '',
//         payment_type: '',
//         expense_date: '',
//         discount: '',
//         short_note: '',
//         created_by: '',
//         bank_check_no: '',
//         previous_due: '',
//         sub_total: '',
//         payable_amount: '',
//         due_amount: '',
//         paid_amount: '',
//         expenseId: '' // assuming you have a way to get the expense ID
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:689088/Admin/expense/expense_update/${id}`, formData);
//             console.log(res.data); // handle success response
//         } catch (error) {
//             console.error('Error updating expense:', error.response.data);
//             // handle error response
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <label>Item Name</label>
//             <input type="text" name="item_name" value={formData.item_name} onChange={handleChange} />

//             <label>Supplier ID</label>
//             <input type="text" name="supplier_id" value={formData.supplier_id} onChange={handleChange} />

//             <label>Expense Category</label>
//             <input type="text" name="expense_category" value={formData.expense_category} onChange={handleChange} />

//             <label>Amount</label>
//             <input type="text" name="amount" value={formData.amount} onChange={handleChange} />

//             <label>Quantity</label>
//             <input type="text" name="quantity" value={formData.quantity} onChange={handleChange} />

//             <label>Payment Type</label>
//             <input type="text" name="payment_type" value={formData.payment_type} onChange={handleChange} />

//             <label>Expense Date</label>
//             <input type="date" name="expense_date" value={formData.expense_date} onChange={handleChange} />

//             <label>Discount</label>
//             <input type="text" name="discount" value={formData.discount} onChange={handleChange} />

//             <label>Short Note</label>
//             <input type="text" name="short_note" value={formData.short_note} onChange={handleChange} />

//             <label>Created By</label>
//             <input type="text" name="created_by" value={formData.created_by} onChange={handleChange} />

//             <label>Bank Check No</label>
//             <input type="text" name="bank_check_no" value={formData.bank_check_no} onChange={handleChange} />

//             <label>Previous Due</label>
//             <input type="text" name="previous_due" value={formData.previous_due} onChange={handleChange} />

//             <label>Sub Total</label>
//             <input type="text" name="sub_total" value={formData.sub_total} onChange={handleChange} />

//             <label>Payable Amount</label>
//             <input type="text" name="payable_amount" value={formData.payable_amount} onChange={handleChange} />

//             <label>Due Amount</label>
//             <input type="text" name="due_amount" value={formData.due_amount} onChange={handleChange} />

//             <label>Paid Amount</label>
//             <input type="text" name="paid_amount" value={formData.paid_amount} onChange={handleChange} />

//             <button type="submit">Update Expense</button>
//         </form>
//     );
// };

// export default ExpenseUpdateForm;


// 'use client' 
 //ismile
// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import Swal from "sweetalert2";
// import { FaTrash } from 'react-icons/fa';
// import { useQuery } from '@tanstack/react-query';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { useRouter } from 'next/navigation';



// const EditExpense = ({ id }) => {

//     const [supplierId, setSupplierId] = useState('');

//     const supplier_id = (id) => {
//         setSupplierId(id);
//         console.log("Selected supplier id:", id);
//     };

//     // Dynamically generate API endpoint based on selected supplierId
//     const api = supplierId ? `/Admin/supplier/due_amount/${supplierId}` : '';

//     const { data: supplierLastDue } = useQuery({
//         queryKey: ['supplierLastDue', api], // Include api in queryKey to trigger refetch when api changes
//         queryFn: async () => {
//             if (api) {
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:689088${api}`);
//                 const data = await res.json();
//                 return data;
//             }
//         },
//         enabled: !!api, // Enable the query only if api is truthy (supplierId is selected)
//     });

//     console.log(supplierLastDue?.payable_amount)

//     const prev_due = supplierLastDue?.payable_amount - supplierLastDue?.paid_amount



//     const [modified, setModified] = useState(() => {
//         if (typeof window !== 'undefined') {
//           return localStorage.getItem('userId') || '';
//         }
//         return '';
//       });

//       useEffect(() => {
//         if (typeof window !== 'undefined') {
//           const storedUserId = localStorage.getItem('userId');
//           setModified(storedUserId);
//         }
//       }, []);
//     const { data: expenseSingle = []
//     } = useQuery({
//         queryKey: ['expenseSingle'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:689088/Admin/expense/expense_all/${id}`)

//             const data = await res.json()
//             return data
//         }
//     })
//     console.log(expenseSingle)


//     const [expenseData, setExpenseData] = useState({
//         supplier_id: '',
//         expense_category: '',
//         amount: '',
//         payment_type: '',
//         discount: '',
//         short_note: '',
//         previous_due: '',
//         sub_total: '',
//         payable_amount: '',
//         due_amount: '',
//         paid_amount: '',
//         bank_check_no: '',
//         items: [],
//         quantity: '',
//         due: '',
//         discount: '',
//         amount: '',
//         item_name: ''

//     });


//     useEffect(() => {

//         setExpenseData({
//             // category_name: brandSingle[0]?.category_name || '',
//             supplier_id: expenseSingle.supplier_id || '',
//             expense_category: expenseSingle.expense_category || '',
//             amount: expenseSingle.amount || '',
//             payment_type: expenseSingle.payment_type || '',
//             discount: expenseSingle.discount || '',
//             short_note: expenseSingle.short_note || '',
//             previous_due: expenseSingle.previous_due || '',
//             sub_total: expenseSingle.sub_total || '',
//             payable_amount: expenseSingle.payable_amount || '',
//             due_amount: expenseSingle.due_amount || '',
//             paid_amount: expenseSingle.paid_amount || '',
//             bank_check_no: expenseSingle.bank_check_no || '',
//             item_name: expenseSingle.item_name || '',
//             amount: expenseSingle.amount || '',
//             discount: expenseSingle.discount || '',
//             due: expenseSingle.due || '',
//             items: expenseSingle?.items?.map(item => ({
//                 item_name: item.item_name || '',
//                 amount: item.amount || '',
//                 discount: item.discount || '',
//                 due: item.due || ''
//             })),
//             quantity: expenseSingle.quantity || '',

//             modified_by: modified
//         });
//     }, [modified, expenseSingle]);



//     // Inside your component function
//     const [discountAmount, setDiscountAmount] = useState(0);
//     const [dueAmount, setDueAmount] = useState(0);

//     const [quantity, setQuantity] = useState('');
//     const [amount, setAmount] = useState('');
//     const [totalAmounts, setTotalAmount] = useState('');

//     const handleQuantityChange = (e) => {
//         const newQuantity = e.target.value;
//         setQuantity(newQuantity);
//         calculateTotalAmount(newQuantity, amount);
//     };

//     const handleAmountChange = (e) => {
//         const newAmount = e.target.value;
//         setAmount(newAmount);
//         calculateTotalAmount(quantity, newAmount);
//     };

//     const calculateTotalAmount = (newQuantity, newAmount) => {
//         const total = parseFloat(newQuantity) * parseFloat(newAmount);
//         setTotalAmount(isNaN(total) ? '' : total.toFixed(2)); // Handle NaN or unexpected values
//     };

//     // Other state variables and useEffect remain the same

//     const calculateTotals = () => {
//         let totalAmount = 0;
//         let totalDiscount = parseFloat(discountAmount);
//         let totalDueAmount = parseFloat(dueAmount);
//         let totalPaidAmount = 0;
//         let preDueAmount = prev_due;
//         let totalPayAbleAmount = 0;
//         totalAmount = parseFloat(expenseData.amount * expenseData.quantity);
//         totalPayAbleAmount = totalAmount - totalDiscount;
//         // Calculate totalPaidAmount
//         totalPaidAmount = totalPayAbleAmount - totalDueAmount;
//         return {
//             netAmount: totalAmount + preDueAmount,
//             totalAmount,
//             totalDiscount,
//             totalPaidAmount,
//             totalDueAmount,
//             totalPayAbleAmount,
//         };
//     };

//     // Other functions remain the same

//     const handleInputChange = (event) => {
//         if (event.target.name === 'discount') {
//             setDiscountAmount(parseFloat(event.target.value));
//         } else if (event.target.name === 'due_amount') {
//             setDueAmount(parseFloat(event.target.value));
//         }
//     };
//     const {
//         totalAmount,
//         totalPaidAmount,
//         preDueAmount = prev_due,
//         netAmount,
//         totalPayAbleAmount
//     } = calculateTotals();


//     const expense_input_change = (event) => {
//         const name = event.target.name
//         const value = event.target.value

//         const attribute = {}
//         for (let key in expenseData) {
//             attribute[key] = expenseData[key];
//         }

//         attribute[name] = value;
//         setExpenseData(attribute);
//     };
//     const router = useRouter()
//     const expense_update = async (event) => {
//         event.preventDefault(); // Prevent the default form submission behavior

//         // Get form data
//         const formData = new FormData(event.target);

//         // Convert form data to JSON object
//         const expenseData = {};
//         formData.forEach((value, key) => {
//             expenseData[key] = value;
//         });

//         // Make a POST request to your API endpoint
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:689088/Admin/expense/expense_update/${id}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(expenseData),
//         })
//             .then(response => {
//                 if (response.ok) {
//                     // Handle success

//                     if (response.ok === true) {
//                         sessionStorage.setItem("message", "Data saved successfully!");
//                         router.push('/Admin/expense/expense_all')
//                     }

//                     console.log('Expense data updated successfully');

//                     // Optionally, you can redirect the user or perform any other action here
//                 } else {
//                     // Handle error
//                     console.error('Failed to update expense data');
//                 }
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//             });
//         // event.preventDefault();
//         // try {
//         //     // Perform API call to update expense details
//         //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:689088/Admin/expense/expense_update/${id}`, {
//         //         method: 'POST',
//         //         headers: {
//         //             'Content-Type': 'application/json'
//         //         },
//         //         body: JSON.stringify(expenseData)
//         //     });
//         //     console.log(expenseData)

//         //     if (!res.ok) {
//         //         throw new Error('Failed to update expense');
//         //     }

//         //     // Handle success, maybe show a success message or redirect
//         //     console.log('Expense updated successfully');
//         //     // expense_input_change()
//         // } catch (error) {
//         //     // Handle error, maybe show an error message
//         //     console.error('Error updating expense:', error.message);
//         // }
//     }



//     const [page_group, setPage_group] = useState(() => {
//         if (typeof window !== 'undefined') {
//           return localStorage.getItem('pageGroup') || '';
//         }
//         return '';
//       });

//       useEffect(() => {
//         if (typeof window !== 'undefined') {
//           const storedUserId = localStorage.getItem('pageGroup');
//           setPage_group(storedUserId);
//         }
//       }, []);

//     const [selectedEntryType, setSelectedEntryType] = useState('');

//     const handleEntryTypeChange = (event) => {
//         setSelectedEntryType(event.target.value);
//     };


//     const [currentDate, setCurrentDate] = useState('');
//     const [formattedDate, setFormattedDate] = useState('');
//     // useEffect to update the current date when the component mounts
//     useEffect(() => {
//         const getCurrentDate = () => {
//             // Get the current date
//             const now = new Date();
//             // Format the date to YYYY-MM-DD (required format for type="date" input)
//             const formattedDate = now.toISOString().split('T')[0];
//             const options = { day: 'numeric', month: 'long', year: 'numeric' };
//             const formatted = new Intl.DateTimeFormat('en-US', options).format(now);
//             setFormattedDate(formatted);
//             // Set the state with the current date
//             setCurrentDate(formattedDate);
//         };

//         // Call the function to get the current date
//         getCurrentDate();
//     }, []);



//     const { data: expenseCategories = [], isLoading, refetch
//     } = useQuery({
//         queryKey: ['expenseCategories'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:689088/Admin/expence_category/expence_category_all`)

//             const data = await res.json()
//             return data
//         }
//     })


//     const { data: supplierList = []
//     } = useQuery({
//         queryKey: ['supplierList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:689088/Admin/supplier/supplier_list`)

//             const data = await res.json()
//             return data
//         }
//     })



//     const { data: module_settings = []
//     } = useQuery({
//         queryKey: ['module_settings'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:689088/Admin/module_settings/module_settings_all`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const module_setting = module_settings.filter(moduleI => moduleI.table_name === 'expense');
//     const decimal_digit = module_setting[0]?.decimal_digit;


//     const [text, setText] = useState('');
//     const maxLength = 500;

//     const handleChangeTextarea = (event) => {
//         const inputText = event.target.value;
//         if (inputText.length <= maxLength) {
//             setText(inputText);
//         }
//     };

//     const handlePaste = (event) => {
//         const pastedText = event.clipboardData.getData('text/plain');
//         const newText = text + pastedText;
//         if (newText.length > maxLength) {
//             event.preventDefault();
//         } else {
//             setText(newText);
//         }
//     };


//     return (
//         <div class="container-fluid">
//             <div class=" row ">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="card-default">


//                             <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
//                                 <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Update Expense</h5>
//                                 <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
//                                     <Link href={`/Admin/expense/expense_all?page_group=${page_group}`} className="btn btn-sm btn-info">Back to Expense List</Link>
//                                 </div>
//                             </div>
//                             <>
//                                 <form className="form-horizontal" method="post" autoComplete="off" onSubmit={expense_update} >
//                                     <div class="d-lg-flex md:d-md-flex justify-content-between px-3 mt-3">
//                                         <div class=" ">
//                                             <h5>From,</h5>
//                                             <div>
//                                                 <select

//                                                     required="" onChange={(e) => {
//                                                         supplier_id(e.target.value)
//                                                         expense_input_change(e)
//                                                     }} name="supplier_id" className="form-control form-control-sm mb-2" id="supplier_id"
//                                                     value={expenseData.supplier_id}

//                                                 >
//                                                     <option value=''>Select Supplier</option>
//                                                     {
//                                                         supplierList.map((supplier) => (
//                                                             <>
//                                                                 <option value={supplier.id}>{supplier.name}</option>

//                                                             </>

//                                                         ))
//                                                     }

//                                                 </select>
//                                             </div>
//                                             {/* <p>{prev_due}</p> */}

//                                             <div >
//                                                 <label className='font-weight-bold'>Expense Purches Date:</label>

//                                                 <input type="date" required="" name="expense_date" className="form-control form-control-sm mb-2" id="purchase_invoice" placeholder="Enter Purchase Invoice" defaultValue={currentDate} />
//                                             </div>
//                                         </div>
//                                         <div class="">

//                                             <span >{formattedDate}</span>
//                                         </div>
//                                     </div>

//                                     <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                         (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                                     </div>

//                                     <div className="card-body">
//                                         <div>
//                                             <div className="card-header custom-card-header py-1 clearfix  bg-gradient-primary text-white">
//                                                 <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
//                                                     <strong>Expense</strong>
//                                                 </div>


//                                             </div>
//                                             <div>
//                                                 <div className="form-group row px-3 ">
//                                                     <table className="table table-bordered  table-hover table-striped table-sm">
//                                                         <thead>
//                                                             <tr>
//                                                                 <th>

//                                                                     Expense Category
//                                                                 </th>
//                                                                 <th>
//                                                                     Item Name
//                                                                 </th>
//                                                                 <th>
//                                                                     Quantity
//                                                                 </th>
//                                                                 <th>
//                                                                     Amount
//                                                                 </th>
//                                                                 <th>
//                                                                     Total Amount
//                                                                 </th>


//                                                             </tr>

//                                                         </thead>

//                                                         <tbody>
//                                                             {isLoading ? <div className='text-center'>
//                                                                 <div className='  text-center text-dark'
//                                                                 >
//                                                                     <FontAwesomeIcon style={{
//                                                                         height: '33px',
//                                                                         width: '33px',
//                                                                     }} icon={faSpinner} spin />
//                                                                 </div>
//                                                             </div>
//                                                                 :
//                                                                 <>
//                                                                     <>

//                                                                         <tr>
//                                                                             <td>
//                                                                                 <select
//                                                                                     required=""
//                                                                                     name="expense_category"
//                                                                                     className="form-control form-control-sm mb-2"
//                                                                                     value={expenseData.expense_category}
//                                                                                     onChange={expense_input_change}
//                                                                                 >
//                                                                                     <option value="">Select One</option>
//                                                                                     {
//                                                                                         expenseCategories.map((expense) => (
//                                                                                             <>

//                                                                                                 <option value={expense.id}>{expense.expense_category_name}</option>
//                                                                                             </>
//                                                                                         ))
//                                                                                     }

//                                                                                 </select>
//                                                                             </td>
//                                                                             <td>
//                                                                                 <input
//                                                                                     onChange={expense_input_change}
//                                                                                     value={expenseData.item_name}
//                                                                                     type="text"
//                                                                                     required
//                                                                                     name="item_name"
//                                                                                     className="form-control form-control-sm mb-2"
//                                                                                     placeholder="Expense Title"
//                                                                                 />
//                                                                             </td>
//                                                                             <td>
//                                                                                 <input
//                                                                                     type="text"
//                                                                                     required
//                                                                                     name="quantity"
//                                                                                     value={quantity ? quantity : expenseData.quantity}
//                                                                                     onChange={(e) => {
//                                                                                         handleQuantityChange(e);
//                                                                                         expense_input_change(e)
//                                                                                     }}
//                                                                                     className="form-control form-control-sm mb-2"
//                                                                                     placeholder="Enter Quantity"
//                                                                                 />
//                                                                             </td>
//                                                                             <td>
//                                                                                 <input
//                                                                                     type="text"
//                                                                                     required
//                                                                                     name="amount"
//                                                                                     value={amount ? amount : expenseData.amount}
//                                                                                     onChange={(e) => {
//                                                                                         handleAmountChange(e);
//                                                                                         expense_input_change(e)
//                                                                                     }}
//                                                                                     className="form-control form-control-sm mb-2"
//                                                                                     placeholder="Enter Amount"
//                                                                                 />
//                                                                             </td>
//                                                                             <td>
//                                                                                 <input
//                                                                                     type="text"
//                                                                                     required
//                                                                                     value={totalAmount ? totalAmount.toFixed(decimal_digit) : (expenseData.amount * expenseData.quantity).toFixed(decimal_digit)}
//                                                                                     onChange={expense_input_change}
//                                                                                     className="form-control form-control-sm mb-2"
//                                                                                     placeholder="Total Amount"
//                                                                                 />
//                                                                                 <input
//                                                                                     type="text"
//                                                                                     required
//                                                                                     name="total_amount"
//                                                                                     hidden
//                                                                                     value={totalAmount ? totalAmount.toFixed(3) : (expenseData.amount * expenseData.quantity).toFixed(3)}
//                                                                                     onChange={expense_input_change}
//                                                                                     className="form-control form-control-sm mb-2"
//                                                                                     placeholder="Total Amount"
//                                                                                 />
//                                                                             </td>
//                                                                         </tr>
//                                                                     </>
//                                                                 </>
//                                                             }
//                                                         </tbody>

//                                                     </table>


//                                                     <div className='col-lg-12 border'>
//                                                         <label className='font-weight-bold'>Short Note:</label>
//                                                         <textarea
//                                                             rows={2}
//                                                             value={text}
//                                                             onChange={handleChangeTextarea}
//                                                             onPaste={handlePaste}
//                                                             className={`form-control form-control-sm mb-2 ${text.length > maxLength ? 'is-invalid' : ''}`}
//                                                             placeholder="Enter Short Note"
//                                                             name='short_note'
//                                                         ></textarea>
//                                                         <div>{text.length}/{maxLength}</div>
//                                                         {text.length > maxLength && (
//                                                             <div className="invalid-feedback">Exceeded character limit</div>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                     </div>



//                                     <div className="container mx-auto ">


//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Payment Type:</strong>
//                                             </label>


//                                             <div class="col-md-3">
//                                                 <select

//                                                     required=""
//                                                     name="payment_type"
//                                                     className="form-control form-control-sm mb-2"

//                                                     value={selectedEntryType ? selectedEntryType : expenseData.payment_type}
//                                                     onChange={(e) => {
//                                                         handleEntryTypeChange(e);
//                                                         expense_input_change(e)
//                                                     }}
//                                                 >
//                                                     <option value="">Select Type Of Payment</option>
//                                                     <option value="1">Cash</option>

//                                                     <option value="2">Check</option>

//                                                 </select>
//                                             </div>

//                                         </div>


//                                         <div class="">
//                                             {
//                                                 selectedEntryType === '2' ?


//                                                     <div class="form-group row student d-flex justify-content-end ">
//                                                         <label class="col-form-label col-md-2">
//                                                             <strong>Bank Check No:</strong>
//                                                         </label>


//                                                         <div class="col-md-3">
//                                                             <input
//                                                                 onChange={expense_input_change}
//                                                                 type="text"
//                                                                 required
//                                                                 name="bank_check_no"
//                                                                 className="form-control form-control-sm mb-2"
//                                                                 placeholder="Enter Bank Check No"

//                                                             />
//                                                         </div>

//                                                     </div>
//                                                     :
//                                                     <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}>



//                                                     </div>
//                                             }

//                                         </div>








//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Sub Total:</strong>
//                                             </label>

//                                             <div class="col-md-3">
//                                                 <input
//                                                     type="text"

//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="totalAmount"
//                                                     placeholder="Enter Total Amount"
//                                                     value={totalAmount.toFixed(decimal_digit)}
//                                                     onChange={(e) => {
//                                                         calculateTotalAmount(e);
//                                                         expense_input_change(e)
//                                                     }}
//                                                 />
//                                                 <input
//                                                     type="text"
//                                                     name="sub_total"
//                                                     hidden
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="totalAmount"
//                                                     placeholder="Enter Total Amount"
//                                                     value={totalAmount.toFixed(3)}
//                                                     onChange={(e) => {
//                                                         calculateTotalAmount(e);
//                                                         expense_input_change(e)
//                                                     }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Previous Due:</strong>
//                                             </label>
//                                             <div class="col-md-3">
//                                                 <input
//                                                     type="text"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="totalAmount"
//                                                     placeholder="Enter Total Amount"
//                                                     value={expenseData.previous_due ? (expenseData.previous_due) : preDueAmount.toFixed(decimal_digit)}
//                                                     onChange={expense_input_change}
//                                                 />
//                                                 <input
//                                                     type="text"
//                                                     hidden
//                                                     name="previous_due"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="totalAmount"
//                                                     placeholder="Enter Total Amount"
//                                                     value={expenseData.previous_due ? Number(expenseData.previous_due).toFixed(3) : preDueAmount.toFixed(3)}
//                                                     onChange={expense_input_change}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Net Amount:</strong>
//                                             </label>
//                                             <div class="col-md-3">
//                                                 <input
//                                                     type="text"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="netAmount"
//                                                     placeholder="Enter Net Amount"
//                                                     value={(totalAmount - expenseData.previous_due).toFixed(decimal_digit)}
//                                                     onChange={expense_input_change}
//                                                 />

//                                                 <input
//                                                     type="text"
//                                                     hidden
//                                                     name="net_amount"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="netAmount"
//                                                     placeholder="Enter Net Amount"
//                                                     value={(totalAmount - expenseData.previous_due).toFixed(3)}
//                                                     onChange={expense_input_change}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Discount:</strong>
//                                             </label>
//                                             <div class="col-md-3">
//                                                 <input
//                                                     type="text"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="discount"
//                                                     placeholder="Enter Discount Amount"
//                                                     // value={expenseData.discount ? expenseData.discount : discountAmount}
//                                                     value={expenseData.discount ? expenseData.discount : discountAmount.toFixed(decimal_digit)}
//                                                     onChange={(e) => {
//                                                         handleInputChange(e);
//                                                         expense_input_change(e)
//                                                     }}
//                                                 />

//                                                 <input
//                                                     type="text"
//                                                     name="discount"
//                                                     hidden
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="discount"
//                                                     placeholder="Enter Discount Amount"
//                                                     value={expenseData.discount ? expenseData.discount : discountAmount.toFixed(3)}
//                                                     onChange={(e) => {
//                                                         handleInputChange(e);
//                                                         expense_input_change(e)
//                                                     }}
//                                                 />

//                                             </div>
//                                         </div>
//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Payable Amount:</strong>
//                                             </label>
//                                             <div class="col-md-3">
//                                                 <input
//                                                     type="text"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="paidAmount"
//                                                     placeholder="Enter Paid Amount"
//                                                     value={(totalAmount - expenseData.discount - expenseData.previous_due).toFixed(decimal_digit)}
//                                                     // value={expenseData.payable_amount ? expenseData.payable_amount : (totalPayAbleAmount + preDueAmount).toFixed(2)}
//                                                     onChange={() => {
//                                                         expense_input_change(e);
//                                                         handleInputChange(e);
//                                                     }}
//                                                 />

//                                                 <input
//                                                     type="text"
//                                                     hidden
//                                                     name="payable_amount"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="paidAmount"
//                                                     placeholder="Enter Paid Amount"
//                                                     value={(totalAmount - expenseData.discount - expenseData.previous_due).toFixed(3)}
//                                                     // value={expenseData.payable_amount ? expenseData.payable_amount : (totalPayAbleAmount + preDueAmount).toFixed(2)}
//                                                     onChange={() => {
//                                                         expense_input_change(e);
//                                                         handleInputChange(e);
//                                                     }}

//                                                 />
//                                             </div>
//                                         </div>




//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Paid Amount:</strong>
//                                             </label>
//                                             <div class="col-md-3">
//                                                 <input
//                                                     type="text"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="paidAmount"
//                                                     placeholder="Enter Paid Amount"
//                                                     value={(totalAmount - expenseData.discount - expenseData.previous_due - expenseData.due_amount).toFixed(decimal_digit)}
//                                                     onChange={(e) => {
//                                                         expense_input_change(e);
//                                                         handleInputChange(e)
//                                                     }}
//                                                 />
//                                                 <input
//                                                     type="text"
//                                                     hidden
//                                                     name="paid_amount"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="paidAmount"
//                                                     placeholder="Enter Paid Amount"
//                                                     value={(totalAmount - expenseData.discount - expenseData.previous_due - expenseData.due_amount).toFixed(3)}
//                                                     onChange={(e) => {
//                                                         expense_input_change(e);
//                                                         handleInputChange(e)
//                                                     }}

//                                                 />
//                                             </div>
//                                         </div>
//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Due Amount:</strong>
//                                             </label>
//                                             <div class="col-md-3">
//                                                 <input
//                                                     type="text"
//                                                     name="due_amount" // Make sure the name matches the state variable name
//                                                     className="form-control form-control-sm alpha_space student_id" // Use className instead of class
//                                                     id="due_amount"
//                                                     placeholder="Enter Due Amount"
//                                                     value={(expenseData.due_amount ? expenseData.due_amount : dueAmount)} // Use value attribute to bind the state variable
//                                                     onChange={(e) => {
//                                                         handleInputChange(e);
//                                                         expense_input_change(e)
//                                                     }} // Call handleInputChange function on change
//                                                 />
//                                             </div>
//                                         </div>

//                                         <div class="form-group row d-flex justify-content-end">
//                                             <div class="offset-md-2  ">

//                                                 <input type="submit" name="Print" class="btn btn-sm btn-success print_btn mr-2" value="Update" />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </>



//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>



//     );
// };

// export default EditExpense;
// Original
// 'use client' 
 //ismile
// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import Swal from "sweetalert2";
// import { FaTimes, FaTrash, FaUpload } from 'react-icons/fa';
// import { useQuery } from '@tanstack/react-query';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';



// const EditExpense = ({ id }) => {

//     const [supplierId, setSupplierId] = useState('');
//     const [supplier, setSupplier] = useState('');

//     const supplier_id = (id) => {
//         setSupplierId(id);
//         if (!id) {
//             setSupplier('Supplier be filled')
//         }
//         else {
//             setSupplier('')
//         }
//         console.log("Selected supplier id:", id);
//     };

//     // Dynamically generate API endpoint based on selected supplierId
//     const api = supplierId ? `/Admin/supplier/due_amount/${supplierId}` : '';

//     const { data: supplierLastDue } = useQuery({
//         queryKey: ['supplierLastDue', api], // Include api in queryKey to trigger refetch when api changes
//         queryFn: async () => {
//             if (api) {
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002${api}`);
//                 const data = await res.json();
//                 return data;
//             }
//         },
//         enabled: !!api, // Enable the query only if api is truthy (supplierId is selected)
//     });

//     console.log(supplierLastDue?.payable_amount)

//     const prev_due = supplierLastDue?.payable_amount - supplierLastDue?.paid_amount


//     const modified = localStorage.getItem('userId')
//     const { data: expenseSingle = []
//     } = useQuery({
//         queryKey: ['expenseSingle'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_all/${id}`)

//             const data = await res.json()
//             return data
//         }
//     })
//     console.log(expenseSingle)


//     const [expenseData, setExpenseData] = useState({
//         supplier_id: '',
//         expense_category: '',
//         amount: '',
//         payment_type: '',
//         discount: '',
//         short_note: '',
//         previous_due: '',
//         sub_total: '',
//         payable_amount: '',
//         due_amount: '',
//         paid_amount: '',
//         bank_check_no: '',
//         items: [],
//         quantity: '',
//         due: '',
//         discount: '',
//         amount: '',
//         item_name: '',
//         file_path: '',
//         voucher_id: '',
//         expense_date: ''

//     });

//     const [selectedFile, setSelectedFile] = useState(Array(expenseData.length).fill(null));

//     // const period_file_change = (e) => {
//     //     const files = e.target.files[0];
//     //     setSelectedFile(files);
//     // };


//     const [fileNames, setFileNames] = useState([]);
//     let [file_size_error, set_file_size_error] = useState(null);

//     const period_file_change = (e) => {
//         // e?.preventDefault();
//         let files = e.target.files[0];
//         const now = new Date();
//         const year = now.getFullYear();
//         const month = String(now.getMonth() + 1).padStart(2, '0');
//         const day = String(now.getDate()).padStart(2, '0');
//         const hours = String(now.getHours()).padStart(2, '0');
//         const minutes = String(now.getMinutes()).padStart(2, '0');

//         const fileName = files.name.split('.')[0]
//         const extension = files.name.split('.').pop();
//         const newName = `${fileName}.${extension}`;
//         const time = `${year}/${month}/${day}/${hours}/${minutes}`;
//         const _path = 'period/' + time + '/' + newName;

//         const newSelectedFiles = [...selectedFile];
//         newSelectedFiles[0] = files; // Assuming you are updating the first element
//         newSelectedFiles[0].path = _path;
//         // setFileNames(newName);
//         // setSelectedFile(newSelectedFiles);
//         // upload(files);
//         if (Number(files.size) <= 2097152) {
//             console.log('checking the file size is okay');
//             set_file_size_error("");
//             setFileNames(newName);
//             setSelectedFile(newSelectedFiles);
//             upload(files);
//         } else {
//             console.log('checking the file size is High');
//             set_file_size_error("Max file size 2 MB");
//             // newSelectedFiles[index] = null;
//             // setSelectedFile(newSelectedFiles);
//             // setFileNames(null);
//         }
//     };

//     console.log(fileNames);
//     console.log(selectedFile[0]?.path);

//     const upload = (file) => {
//         const formData = new FormData();
//         const extension = file.name.split('.').pop();
//         const fileName = file.name.split('.')[0];
//         const newName = `${fileName}.${extension}`;
//         formData.append('files', file, newName);
//         console.log(file);
//         setFileNames(newName);

//         axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/period/period_image`, formData)
//             .then(res => {
//                 console.log(res);
//             })
//             .catch(er => console.log(er));
//     };

//     const period_combined_change = (e) => {

//         expense_input_change(e);
//         period_file_change(e);
//     };


//     useEffect(() => {

//         setExpenseData({
//             file_path: selectedFile[0]?.path ? selectedFile[0]?.path : expenseSingle.file_path,
//             voucher_id: expenseSingle.voucher_id,
//             expense_date: expenseSingle.expense_date,
//             // category_name: brandSingle[0]?.category_name || '',
//             supplier_id: expenseSingle.supplier_id || '',
//             expense_category: expenseSingle.expense_category || '',
//             amount: expenseSingle.amount || '',
//             payment_type: expenseSingle.payment_type || '',
//             discount: expenseSingle.discount || '',
//             short_note: expenseSingle.short_note || '',
//             previous_due: expenseSingle.previous_due || '',
//             sub_total: expenseSingle.sub_total || '',
//             payable_amount: expenseSingle.payable_amount || '',
//             due_amount: expenseSingle.due_amount || '',
//             paid_amount: expenseSingle.paid_amount || '',
//             bank_check_no: expenseSingle.bank_check_no || '',
//             item_name: expenseSingle.item_name || '',
//             amount: expenseSingle.amount || '',
//             discount: expenseSingle.discount || '',
//             due: expenseSingle.due || '',
//             items: expenseSingle?.items?.map(item => ({
//                 item_name: item.item_name || '',
//                 amount: item.amount || '',
//                 discount: item.discount || '',
//                 due: item.due || ''
//             })),
//             quantity: expenseSingle.quantity || '',

//             modified_by: modified
//         });
//     }, [modified, expenseSingle, selectedFile]);



//     // Inside your component function
//     const [discountAmount, setDiscountAmount] = useState(0);
//     const [dueAmount, setDueAmount] = useState(0);

//     const [quantity, setQuantity] = useState('');
//     const [amount, setAmount] = useState('');
//     const [totalAmounts, setTotalAmount] = useState('');

//     const handleQuantityChange = (e) => {
//         const newQuantity = e.target.value;
//         setQuantity(newQuantity);
//         calculateTotalAmount(newQuantity, amount);
//     };

//     const handleAmountChange = (e) => {
//         const newAmount = e.target.value;
//         setAmount(newAmount);
//         calculateTotalAmount(quantity, newAmount);
//     };

//     const calculateTotalAmount = (newQuantity, newAmount) => {
//         const total = parseFloat(newQuantity) * parseFloat(newAmount);
//         setTotalAmount(isNaN(total) ? '' : total.toFixed(2)); // Handle NaN or unexpected values
//     };

//     // Other state variables and useEffect remain the same

//     const calculateTotals = () => {
//         let totalAmount = 0;
//         let totalDiscount = parseFloat(discountAmount);
//         let totalDueAmount = parseFloat(dueAmount);
//         let totalPaidAmount = 0;
//         let preDueAmount = prev_due;
//         let totalPayAbleAmount = 0;
//         totalAmount = parseFloat(expenseData.amount * expenseData.quantity);
//         totalPayAbleAmount = totalAmount - totalDiscount;
//         // Calculate totalPaidAmount
//         totalPaidAmount = totalPayAbleAmount - totalDueAmount;
//         return {
//             netAmount: totalAmount + preDueAmount,
//             totalAmount,
//             totalDiscount,
//             totalPaidAmount,
//             totalDueAmount,
//             totalPayAbleAmount,
//         };
//     };

//     // Other functions remain the same

//     const handleInputChange = (event) => {
//         if (event.target.name === 'discount') {
//             setDiscountAmount(parseFloat(event.target.value));
//         } else if (event.target.name === 'due_amount') {
//             setDueAmount(parseFloat(event.target.value));
//         }
//     };
//     const {
//         totalAmount,
//         totalPaidAmount,
//         preDueAmount = prev_due,
//         netAmount,
//         totalPayAbleAmount
//     } = calculateTotals();

//     const [expense_date, setExpense_date] = useState([])
//     const [expense_category, setexpense_category] = useState([])
//     const [item_name, setitem_name] = useState([])
//     const [quantitys, setquantity] = useState([])
//     const [amounts, setamount] = useState([])
//     const [paid_amount, setpaid_amount] = useState([])
   
//     const expense_input_change = (event) => {
//         const name = event.target.name
//         const value = event.target.value

//         const attribute = {}
//         for (let key in expenseData) {
//             attribute[key] = expenseData[key];
//         }

//         attribute[name] = value;

//         const expense_date = attribute['expense_date']
//         if (expense_date) {
//             setExpense_date('')
//         }
        
//         const expense_category = attribute['expense_category']
//         if (expense_category) {
//             setexpense_category('')
//         }
//         const item_name = attribute['item_name']
//         if (item_name) {
//             setitem_name('')
//         }
//         const quantity = attribute['quantity']
//         if (quantity) {
//             setquantity('')
//         }

//         const amount = attribute['amount']
//         if (amount) {
//             setamount('')
//         }
//         const paid_amount = attribute['paid_amount']
//         if (paid_amount) {
//             setpaid_amount('')
//         }


//         setExpenseData(attribute);
//     };
//     const router = useRouter()
//     const expense_update = async (event) => {
//         event.preventDefault(); // Prevent the default form submission behavior


        
//         // Get form data
//         const formData = new FormData(event.target);

//         // Convert form data to JSON object
//         const expenseData = {};
//         formData.forEach((value, key) => {
//             expenseData[key] = value;
//         });

//         if (!expenseData.supplier_id) {
//             setSupplier('Supplier be filled')
//             return
//         }

//         if (!expenseData.expense_date) {
//             setExpense_date('Expense Date Must be filled')
//             return
//         }
//         if (!expenseData.expense_category) {
//             setexpense_category('Expense category must be filled')
//             return
//         }
//         if (!expenseData.item_name) {
//             setitem_name('Item Name must be filled')
//             return
//         }
//         if (!expenseData.quantity) {
//             setquantity('Quantity must be filled')
//             return
//         }
//         if (!expenseData.amount) {
//             setamount('Amount must be filled')
//             return
//         }
//         if (!expenseData.paid_amount) {
//             setpaid_amount('Paid Amount must be filled')
//             return
//         }

//         // Make a POST request to your API endpoint
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_update/${id}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(expenseData),
//         })
//             .then(response => {
//                 if (response.ok) {
//                     // Handle success

//                     if (response.ok === true) {
//                         sessionStorage.setItem("message", "Data saved successfully!");
//                         router.push('/Admin/expense/expense_all')
//                     }

//                     console.log('Expense data updated successfully');

//                     // Optionally, you can redirect the user or perform any other action here
//                 } else {
//                     // Handle error
//                     console.error('Failed to update expense data');
//                 }
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//             });
       
//     }

//     const page_group = localStorage.getItem('pageGroup')




//     const [selectedEntryType, setSelectedEntryType] = useState('');

//     const handleEntryTypeChange = (event) => {
//         setSelectedEntryType(event.target.value);
//     };


//     const [expenseDate, setExpenseDate] = useState('');
//     const [formattedDate, setFormattedDate] = useState('');
//     const [currentDate, setCurrentDate] = useState('');
//     const [error, setError] = useState('');


//     const handleDateChange = (event) => {
//         const selectedDate = event.target.value; // Directly get the value from the input

//         const day = String(selectedDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
//         const month = String(selectedDate.split('-')[1]).padStart(2, '0');
//         const year = String(selectedDate.split('-')[0]);
//         const formattedDate = `${day}-${month}-${year}`;
//         const formattedDatabaseDate = `${year}-${month}-${day}`;


//         if(!formattedDatabaseDate){
//             setExpense_date('Expense Date Must be filled')
//         }
//         else{
//             setExpense_date('')
//         }
//         // Check if the selected date is in the future
//         const today = new Date();
//         const selected = new Date(selectedDate);

//         if (selected > today) {
//             setError('Expense date cannot be in the future.');
//             setCurrentDate('');
//             setExpenseDate('');
//         } else {
//             setError('');
//             setCurrentDate(formattedDate);
//             setExpenseDate(formattedDatabaseDate);
//         }
//     };

//     useEffect(() => {
//         if (expenseDate.includes('-')) {
//             const [year, month, day] = expenseDate.split('-');
//             setFormattedDate(`${day}-${month}-${year}`);
//         } else {
//             console.log("Date format is incorrect:", expenseDate);
//         }
//     }, [expenseDate]);

//     const [currentDates, setCurrentDates] = useState('');
//     const [formattedDates, setFormattedDates] = useState('');
//     // useEffect to update the current date when the component mounts
//     useEffect(() => {
//         const getCurrentDate = () => {
//             // Get the current date
//             const now = new Date();
//             // Format the date to YYYY-MM-DD (required format for type="date" input)
//             const formattedDate = now.toISOString().split('T')[0];
//             const options = { day: 'numeric', month: 'long', year: 'numeric' };
//             const formatted = new Intl.DateTimeFormat('en-US', options).format(now);
//             setFormattedDates(formatted);
//             // Set the state with the current date
//             setCurrentDates(formattedDate);
//         };

//         // Call the function to get the current date
//         getCurrentDate();
//     }, []);

//     const { data: expenseCategories = [], isLoading, refetch
//     } = useQuery({
//         queryKey: ['expenseCategories'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expence_category/expence_category_all`)

//             const data = await res.json()
//             return data
//         }
//     })


//     const { data: supplierList = []
//     } = useQuery({
//         queryKey: ['supplierList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/supplier/supplier_list`)

//             const data = await res.json()
//             return data
//         }
//     })



//     const { data: module_settings = []
//     } = useQuery({
//         queryKey: ['module_settings'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_all`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const module_setting = module_settings.filter(moduleI => moduleI.table_name === 'expense');
//     const decimal_digit = module_setting[0]?.decimal_digit;


//     const [text, setText] = useState('');
//     const maxLength = 500;

//     const handleChangeTextarea = (event) => {
//         const inputText = event.target.value;
//         if (inputText.length <= maxLength) {
//             setText(inputText);
//         }
//     };

//     const handlePaste = (event) => {
//         const pastedText = event.clipboardData.getData('text/plain');
//         const newText = text + pastedText;
//         if (newText.length > maxLength) {
//             event.preventDefault();
//         } else {
//             setText(newText);
//         }
//     };

//     console.log(expenseData)


//     return (
//         <div class="container-fluid">
//             <div class=" row ">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="card-default">


//                             <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
//                                 <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Update Expense</h5>
//                                 <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
//                                     <Link href={`/Admin/expense/expense_all?page_group=${page_group}`} className="btn btn-sm btn-info">Back to Expense List</Link>
//                                 </div>
//                             </div>
//                             <>
//                                 <form className="form-horizontal" method="post" autoComplete="off" onSubmit={expense_update} >
//                                     <div class="d-lg-flex md:d-md-flex justify-content-between px-3 mt-3">
//                                         <div class=" ">
//                                             <h5 className='ml-3'>From,</h5>
//                                             <div className='col-md-12'>
//                                                 <select

//                                                     required="" onChange={(e) => {
//                                                         supplier_id(e.target.value)
//                                                         expense_input_change(e)
//                                                     }} name="supplier_id" className="form-control form-control-sm mb-2" id="supplier_id"
//                                                     value={expenseData.supplier_id}

//                                                 >
//                                                     <option value=''>Select Supplier</option>
//                                                     {
//                                                         supplierList.map((supplier) => (
//                                                             <>
//                                                                 <option value={supplier.id}>{supplier.name}</option>

//                                                             </>

//                                                         ))
//                                                     }


//                                                 </select>
//                                                 {
//                                                     supplier && <p className='text-danger'>{supplier}</p>
//                                                 }
//                                             </div>
//                                             {/* <p>{prev_due}</p> */}
//                                             <div className="col-md-12">
//                                                 <label className='font-weight-bold'>Expense Purches Date:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     // onChange={(e) => handleDateChange(e)}
//                                                     value={formattedDate ? formattedDate : expenseData?.expense_date?.slice(0, 10)}
//                                                     onClick={() => document.getElementById(`dateInput-n`).showPicker()}
//                                                     placeholder="dd-mm-yyyy"
//                                                     className="form-control form-control-sm mb-2"
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     name='expense_date'
//                                                     type="date"
//                                                     id={`dateInput-n`}
//                                                     onChange={(e) => handleDateChange(e)}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                                 {error && <div className="text-danger">{error}</div>}
//                                                 {expense_date && <p className="text-danger">{expense_date}</p>}
//                                             </div>
//                                             {/* <div >
//                                                 <label className='font-weight-bold'>Expense Purches Date:</label>

//                                                 <input type="date" required="" name="expense_date" className="form-control form-control-sm mb-2" id="purchase_invoice" placeholder="Enter Purchase Invoice" defaultValue={currentDate} />
//                                             </div> */}
//                                         </div>
//                                         {/* <div class="">

//                                             <span >{formattedDate}</span>
//                                         </div> */}
//                                         <div class="">

//                                             <span >{formattedDates}</span>
//                                         </div>
//                                     </div>

//                                     <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                         (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                                     </div>

//                                     <div className="card-body">
//                                         <div>
//                                             <div className="card-header custom-card-header py-1 clearfix  bg-gradient-primary text-white">
//                                                 <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
//                                                     <strong>Expense</strong>
//                                                 </div>


//                                             </div>
//                                             <div>
//                                                 <div className="form-group row px-3 ">
//                                                     <table className="table table-bordered  table-hover table-striped table-sm">
//                                                         <thead>
//                                                             <tr>
//                                                                 <th>

//                                                                     Expense Category
//                                                                 </th>
//                                                                 <th>
//                                                                     Item Name
//                                                                 </th>
//                                                                 <th>
//                                                                     Quantity
//                                                                 </th>
//                                                                 <th>
//                                                                     Amount
//                                                                 </th>
//                                                                 <th>
//                                                                     Total Amount
//                                                                 </th>
//                                                                 <th>
//                                                                     Voucher Id
//                                                                 </th>

//                                                                 <th>
//                                                                     File
//                                                                 </th>


//                                                             </tr>

//                                                         </thead>

//                                                         <tbody>
//                                                             {isLoading ? <div className='text-center'>
//                                                                 <div className='  text-center text-dark'
//                                                                 >
//                                                                     <FontAwesomeIcon style={{
//                                                                         height: '33px',
//                                                                         width: '33px',
//                                                                     }} icon={faSpinner} spin />
//                                                                 </div>
//                                                             </div>
//                                                                 :
//                                                                 <>
//                                                                     <>

//                                                                         <tr>
//                                                                             <td>
//                                                                                 <select
//                                                                                     required=""
//                                                                                     name="expense_category"
//                                                                                     className="form-control form-control-sm mb-2"
//                                                                                     value={expenseData.expense_category}
//                                                                                     onChange={expense_input_change}
//                                                                                 >
//                                                                                     <option value="">Select One</option>
//                                                                                     {
//                                                                                         expenseCategories.map((expense) => (
//                                                                                             <>

//                                                                                                 <option value={expense.id}>{expense.expense_category_name}</option>
//                                                                                             </>
//                                                                                         ))
//                                                                                     }

//                                                                                 </select>
//                                                                                 {
//                                                                                     expense_category && <p className='text-danger'>{expense_category}</p>
//                                                                                 }
//                                                                             </td>
//                                                                             <td>
//                                                                                 <input
//                                                                                     onChange={expense_input_change}
//                                                                                     value={expenseData.item_name}
//                                                                                     type="text"
                                                                                    
//                                                                                     name="item_name"
//                                                                                     className="form-control form-control-sm mb-2"
//                                                                                     placeholder="Expense Title"
//                                                                                 />
//                                                                                 {
//                                                                                     item_name && <p className='text-danger'>{item_name}</p>
//                                                                                 }
//                                                                             </td>
//                                                                             <td>
//                                                                                 <input
//                                                                                     type="text"
                                                                                    
//                                                                                     name="quantity"
//                                                                                     value={quantity ? quantity : expenseData.quantity}
//                                                                                     onChange={(e) => {
//                                                                                         handleQuantityChange(e);
//                                                                                         expense_input_change(e)
//                                                                                     }}
//                                                                                     className="form-control form-control-sm mb-2"
//                                                                                     placeholder="Enter Quantity"
//                                                                                 />
//                                                                                 {
//                                                                                     quantitys && <p className='text-danger'>{quantitys}</p>
//                                                                                 }
//                                                                             </td>
//                                                                             <td>
//                                                                                 <input
//                                                                                     type="text"
                                                                                    
//                                                                                     name="amount"
//                                                                                     value={amount ? amount : expenseData.amount}
//                                                                                     onChange={(e) => {
//                                                                                         handleAmountChange(e);
//                                                                                         expense_input_change(e)
//                                                                                     }}
//                                                                                     className="form-control form-control-sm mb-2"
//                                                                                     placeholder="Enter Amount"
//                                                                                 />
//                                                                                 {
//                                                                                     amounts && <p className='text-danger'>{amounts}</p>
//                                                                                 }
//                                                                             </td>
//                                                                             <td>
//                                                                                 <input
//                                                                                     type="text"
                                                                                    
//                                                                                     value={totalAmount ? totalAmount.toFixed(decimal_digit) : (expenseData.amount * expenseData.quantity).toFixed(decimal_digit)}
//                                                                                     onChange={expense_input_change}
//                                                                                     className="form-control form-control-sm mb-2"
//                                                                                     placeholder="Total Amount"
//                                                                                 />
//                                                                                 <input
//                                                                                     type="text"
                                                                                    
//                                                                                     name="total_amount"
//                                                                                     hidden
//                                                                                     value={totalAmount ? totalAmount.toFixed(3) : (expenseData.amount * expenseData.quantity).toFixed(3)}
//                                                                                     onChange={expense_input_change}
//                                                                                     className="form-control form-control-sm mb-2"
//                                                                                     placeholder="Total Amount"
//                                                                                 />
//                                                                             </td>
//                                                                             <td>
//                                                                                 <input
//                                                                                     type="text"
//                                                                                     name="voucher_id"

//                                                                                     onChange={expense_input_change}
//                                                                                     className="form-control form-control-sm mb-2"
//                                                                                     placeholder="Voucher Number"
//                                                                                     value={expenseData.voucher_id}
//                                                                                 />
//                                                                                 <input
//                                                                                     type="text"


//                                                                                     hidden
//                                                                                     name="voucher_id"
//                                                                                     className="form-control form-control-sm mb-2"
//                                                                                     placeholder="total amount"
//                                                                                     value={expenseData.voucher_id}
//                                                                                 />
//                                                                             </td>
//                                                                             <td style={{ width: '180px' }}>




//                                                                                 <div>

//                                                                                     <div>
//                                                                                         <span class="btn btn-success btn-sm " >
//                                                                                             <label for="fileInput" className='mb-0' ><FaUpload></FaUpload> Select Image </label>
//                                                                                             <input
//                                                                                                 // multiple
//                                                                                                 name="file_path"
//                                                                                                 onChange={period_combined_change}
//                                                                                                 type="file" id="fileInput" style={{ display: "none" }} />
//                                                                                         </span>
//                                                                                     </div>

//                                                                                     {selectedFile[0] ?
//                                                                                         <>
//                                                                                             <img className="w-100 mb-2 img-thumbnail" onChange={(e) => period_file_change(e)} src={URL.createObjectURL(selectedFile[0])} alt="Uploaded File" />

//                                                                                             <input type="hidden" name="file_path" value={selectedFile[0].path} />
//                                                                                             <button
//                                                                                                 // onClick={period_image_remove}
//                                                                                                 type="button" className="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
//                                                                                         </>
//                                                                                         :
//                                                                                         <>
//                                                                                             {
//                                                                                                 expenseData.file_path ?
//                                                                                                     <>

//                                                                                                         <img
//                                                                                                             className="w-100"
//                                                                                                             src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${expenseData.file_path}`}
//                                                                                                             alt="Uploaded File"
//                                                                                                         />
//                                                                                                         <button
//                                                                                                             // onClick={period_image_remove}
//                                                                                                             type="button"
//                                                                                                             className="btn btn-danger btn-sm position-absolute float-right ml-n4"
//                                                                                                         >
//                                                                                                             <FaTimes />
//                                                                                                         </button>
//                                                                                                     </>
//                                                                                                     :
//                                                                                                     ''
//                                                                                             }
//                                                                                         </>
//                                                                                     }
//                                                                                     {
//                                                                                         file_size_error && (
//                                                                                             <p className='text-danger'>{file_size_error}</p>
//                                                                                         )
//                                                                                     }



//                                                                                 </div>




//                                                                             </td>
//                                                                         </tr>
//                                                                     </>
//                                                                 </>
//                                                             }
//                                                         </tbody>

//                                                     </table>


//                                                     <div className='col-lg-12 border'>
//                                                         <label className='font-weight-bold'>Short Note:</label>
//                                                         <textarea
//                                                             rows={2}
//                                                             value={text}
//                                                             onChange={handleChangeTextarea}
//                                                             onPaste={handlePaste}
//                                                             className={`form-control form-control-sm mb-2 ${text.length > maxLength ? 'is-invalid' : ''}`}
//                                                             placeholder="Enter Short Note"
//                                                             name='short_note'
//                                                         ></textarea>
//                                                         <div>{text.length}/{maxLength}</div>
//                                                         {text.length > maxLength && (
//                                                             <div className="invalid-feedback">Exceeded character limit</div>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                     </div>



//                                     <div className="container mx-auto ">











//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Sub Total:</strong>
//                                             </label>

//                                             <div class="col-md-3">
//                                                 {/* <input
//                                                     type="text"

//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="totalAmount"
//                                                     placeholder="Enter Total Amount"
//                                                     value={totalAmount.toFixed(decimal_digit)}
//                                                     onChange={(e) => {
//                                                         calculateTotalAmount(e);
//                                                         expense_input_change(e)
//                                                     }}
//                                                 /> */}
//                                                 <p className='text-right'>
//                                                     <strong>
//                                                         {totalAmount.toFixed(decimal_digit)}

//                                                         <span className=''> TK</span>
//                                                     </strong>
//                                                 </p>
//                                                 <input
//                                                     type="text"
//                                                     name="sub_total"
//                                                     hidden
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="totalAmount"
//                                                     placeholder="Enter Total Amount"
//                                                     value={totalAmount.toFixed(3)}
//                                                     onChange={(e) => {
//                                                         calculateTotalAmount(e);
//                                                         expense_input_change(e)
//                                                     }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Previous Due:</strong>
//                                             </label>
//                                             <div class="col-md-3">
//                                                 {/* <input
//                                                     type="text"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="totalAmount"
//                                                     placeholder="Enter Total Amount"
//                                                     value={expenseData.previous_due ? (expenseData.previous_due) : preDueAmount.toFixed(decimal_digit)}
//                                                     onChange={expense_input_change}
//                                                 /> */}
//                                                 <p className='text-right'>
//                                                     <strong>
//                                                         {preDueAmount ? preDueAmount.toFixed(decimal_digit) : 0}
//                                                         <span className=''> TK</span>
//                                                     </strong>
//                                                 </p>
//                                                 <input
//                                                     type="text"
//                                                     hidden
//                                                     name="previous_due"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="totalAmount"
//                                                     placeholder="Enter Total Amount"
//                                                     value={expenseData.previous_due ? Number(expenseData.previous_due).toFixed(3) : preDueAmount.toFixed(3)}
//                                                     onChange={expense_input_change}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Net Amount:</strong>
//                                             </label>
//                                             <div class="col-md-3">
//                                                 {/* <input
//                                                     type="text"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="netAmount"
//                                                     placeholder="Enter Net Amount"
//                                                     value={(totalAmount - expenseData.previous_due).toFixed(decimal_digit)}
//                                                     onChange={expense_input_change}
//                                                 /> */}
//                                                 <p className='text-right'>
//                                                     <strong>
//                                                         {netAmount ? netAmount.toFixed(decimal_digit) : 0}
//                                                         <span className=''> TK</span>
//                                                     </strong>
//                                                 </p>

//                                                 <input
//                                                     type="text"
//                                                     hidden
//                                                     name="net_amount"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="netAmount"
//                                                     placeholder="Enter Net Amount"
//                                                     value={(totalAmount - expenseData.previous_due).toFixed(3)}
//                                                     onChange={expense_input_change}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Payable Amount:</strong>
//                                             </label>
//                                             <div class="col-md-3">
//                                                 {/* <input
//                                                     type="text"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="paidAmount"
//                                                     placeholder="Enter Paid Amount"
//                                                     value={(totalAmount - expenseData.discount - expenseData.previous_due).toFixed(decimal_digit)}
//                                                     // value={expenseData.payable_amount ? expenseData.payable_amount : (totalPayAbleAmount + preDueAmount).toFixed(2)}
//                                                     onChange={() => {
//                                                         expense_input_change(e);
//                                                         handleInputChange(e);
//                                                     }}
//                                                 /> */}
//                                                 <p className='text-right'>
//                                                     <strong>
//                                                         {(totalAmount - expenseData.discount - expenseData.previous_due).toFixed(decimal_digit)}
//                                                         <span className=''> TK</span>
//                                                     </strong>
//                                                 </p>
//                                                 <input
//                                                     type="text"
//                                                     hidden
//                                                     name="payable_amount"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="paidAmount"
//                                                     placeholder="Enter Paid Amount"
//                                                     value={(totalAmount - expenseData.discount - expenseData.previous_due).toFixed(3)}
//                                                     // value={expenseData.payable_amount ? expenseData.payable_amount : (totalPayAbleAmount + preDueAmount).toFixed(2)}
//                                                     onChange={() => {
//                                                         expense_input_change(e);
//                                                         handleInputChange(e);
//                                                     }}

//                                                 />
//                                             </div>
//                                         </div>
//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Discount:</strong>
//                                             </label>
//                                             <div class="col-md-3">
//                                                 <input
//                                                     type="text"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="discount"
//                                                     placeholder="Enter Discount Amount"
//                                                     // value={expenseData.discount ? expenseData.discount : discountAmount}
//                                                     value={expenseData.discount ? expenseData.discount : discountAmount.toFixed(decimal_digit)}
//                                                     onChange={(e) => {
//                                                         handleInputChange(e);
//                                                         expense_input_change(e)
//                                                     }}
//                                                 />

//                                                 <input
//                                                     type="text"
//                                                     name="discount"
//                                                     hidden
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="discount"
//                                                     placeholder="Enter Discount Amount"
//                                                     value={expenseData.discount ? expenseData.discount : discountAmount.toFixed(3)}
//                                                     onChange={(e) => {
//                                                         handleInputChange(e);
//                                                         expense_input_change(e)
//                                                     }}
//                                                 />

//                                             </div>
//                                         </div>




//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Paid Amount:</strong>
//                                             </label>
//                                             <div class="col-md-3">
//                                                 <input
//                                                     type="text"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="paidAmount"
//                                                     placeholder="Enter Paid Amount"
//                                                     value={(totalAmount - expenseData.discount - expenseData.previous_due - expenseData.due_amount).toFixed(decimal_digit)}
//                                                     onChange={(e) => {
//                                                         expense_input_change(e);
//                                                         handleInputChange(e)
//                                                     }}
//                                                 />
//                                                 <input
//                                                     type="text"
//                                                     hidden
//                                                     name="paid_amount"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="paidAmount"
//                                                     placeholder="Enter Paid Amount"
//                                                     value={(totalAmount - expenseData.discount - expenseData.previous_due - expenseData.due_amount).toFixed(3)}
//                                                     onChange={(e) => {
//                                                         expense_input_change(e);
//                                                         handleInputChange(e)
//                                                     }}

//                                                 />
//                                                 {
//                                                     paid_amount && <p className='text-danger'>{paid_amount}</p>
//                                                 }
//                                             </div>
//                                         </div>
//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Payment Type:</strong>
//                                             </label>


//                                             <div class="col-md-3">
//                                                 <select

//                                                     required=""
//                                                     name="payment_type"
//                                                     className="form-control form-control-sm mb-2"

//                                                     value={selectedEntryType ? selectedEntryType : expenseData.payment_type}
//                                                     onChange={(e) => {
//                                                         handleEntryTypeChange(e);
//                                                         expense_input_change(e)
//                                                     }}
//                                                 >
//                                                     <option value="">Select Type Of Payment</option>
//                                                     <option value="1">Cash</option>

//                                                     <option value="2">Check</option>

//                                                 </select>
//                                             </div>

//                                         </div>


//                                         <div class="">
//                                             {
//                                                 selectedEntryType === '2' ?


//                                                     <div class="form-group row student d-flex justify-content-end ">
//                                                         <label class="col-form-label col-md-2">
//                                                             <strong>Bank Check No:</strong>
//                                                         </label>


//                                                         <div class="col-md-3">
//                                                             <input
//                                                                 onChange={expense_input_change}
//                                                                 type="text"
//                                                                 required
//                                                                 name="bank_check_no"
//                                                                 className="form-control form-control-sm mb-2"
//                                                                 placeholder="Enter Bank Check No"

//                                                             />
//                                                         </div>

//                                                     </div>
//                                                     :
//                                                     <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}>



//                                                     </div>
//                                             }

//                                         </div>
//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Due Amount:</strong>
//                                             </label>
//                                             <div class="col-md-3">
//                                                 {/* <input
//                                                     type="text"
//                                                     name="due_amount" // Make sure the name matches the state variable name
//                                                     className="form-control form-control-sm alpha_space student_id" // Use className instead of class
//                                                     id="due_amount"
//                                                     placeholder="Enter Due Amount"
//                                                     value={(expenseData.due_amount ? expenseData.due_amount : dueAmount)} // Use value attribute to bind the state variable
//                                                     onChange={(e) => {
//                                                         handleInputChange(e);
//                                                         expense_input_change(e)
//                                                     }} // Call handleInputChange function on change
//                                                 /> */}
//                                                 <p className='text-right' onChange={handleInputChange}>
//                                                     <strong>
//                                                         {(expenseData.due_amount ? expenseData.due_amount : dueAmount)}
//                                                         <span className=''> TK</span>
//                                                     </strong>
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         <div class="form-group row d-flex justify-content-end">
//                                             <div class="offset-md-2  ">

//                                                 <input type="submit" name="Print" class="btn btn-sm btn-success print_btn mr-2" value="Update" />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>



//     );
// };

// export default EditExpense;






// Original
'use client' 
 //ismile
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Swal from "sweetalert2";
import { FaTimes, FaTrash, FaUpload } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import axios from 'axios';



const EditExpense = ({ id }) => {

    const [supplierId, setSupplierId] = useState('');
    const [supplier, setSupplier] = useState('');

    const supplier_id = (id) => {
        setSupplierId(id);
        if (!id) {
            setSupplier('Supplier be filled')
        }
        else {
            setSupplier('')
        }
        console.log("Selected supplier id:", id);
    };
console.log(supplierId)
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




    const [modified, setCreated] = useState(() => {
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


    const { data: expenseSingle = []
    } = useQuery({
        queryKey: ['expenseSingle'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_all/${id}`)

            const data = await res.json()
            return data
        }
    })
    console.log(expenseSingle)


    const [expenseData, setExpenseData] = useState({
        supplier_id: '',
        expense_category: '',
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
        item_name: '',
        file_path: '',
        voucher_id: '',
        expense_date: ''

    });

    const [selectedFile, setSelectedFile] = useState(Array(expenseData.length).fill(null));

    // const period_file_change = (e) => {
    //     const files = e.target.files[0];
    //     setSelectedFile(files);
    // };


    const [fileNames, setFileNames] = useState([]);
    let [file_size_error, set_file_size_error] = useState(null);

    const period_file_change = (e) => {
        // e?.preventDefault();
        let files = e.target.files[0];
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const fileName = files.name.split('.')[0]
        const extension = files.name.split('.').pop();
        const newName = `${fileName}.${extension}`;
        const time = `${year}/${month}/${day}/${hours}/${minutes}`;
        const _path = 'period/' + time + '/' + newName;

        const newSelectedFiles = [...selectedFile];
        newSelectedFiles[0] = files; // Assuming you are updating the first element
        newSelectedFiles[0].path = _path;
        // setFileNames(newName);
        // setSelectedFile(newSelectedFiles);
        // upload(files);
        if (Number(files.size) <= 2097152) {
            console.log('checking the file size is okay');
            set_file_size_error("");
            setFileNames(newName);
            setSelectedFile(newSelectedFiles);
            upload(files);
        } else {
            console.log('checking the file size is High');
            set_file_size_error("Max file size 2 MB");
            // newSelectedFiles[index] = null;
            // setSelectedFile(newSelectedFiles);
            // setFileNames(null);
        }
    };

    console.log(fileNames);
    console.log(selectedFile[0]?.path);

    const upload = (file) => {
        const formData = new FormData();
        const extension = file.name.split('.').pop();
        const fileName = file.name.split('.')[0];
        const newName = `${fileName}.${extension}`;
        formData.append('files', file, newName);
        console.log(file);
        setFileNames(newName);

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/period/period_image`, formData)
            .then(res => {
                console.log(res);
            })
            .catch(er => console.log(er));
    };

    const period_combined_change = (e) => {

        expense_input_change(e);
        period_file_change(e);
    };


    useEffect(() => {

        setExpenseData({
            file_path: selectedFile[0]?.path ? selectedFile[0]?.path : expenseSingle.file_path,
            voucher_id: expenseSingle.voucher_id,
            expense_date: expenseSingle.expense_date,
            // category_name: brandSingle[0]?.category_name || '',
            supplier_id: expenseSingle.supplier_id || '',
            expense_category: expenseSingle.expense_category || '',
            amount: expenseSingle.amount || '',
            payment_type: expenseSingle.payment_type || '',
            discount: expenseSingle.discount || '',
            short_note: expenseSingle.short_note || '',
            previous_due: expenseSingle.previous_due || '',
            sub_total: expenseSingle.sub_total || '',
            payable_amount: expenseSingle.payable_amount || '',
            due_amount: expenseSingle.due_amount || '',
            paid_amount: expenseSingle.paid_amount || '',
            bank_check_no: expenseSingle.bank_check_no || '',
            item_name: expenseSingle.item_name || '',
            amount: expenseSingle.amount || '',
            discount: expenseSingle.discount || '',
            due: expenseSingle.due || '',
            quantity: expenseSingle.quantity || '',
            modified_by: modified
        });
    }, [modified, expenseSingle, selectedFile]);



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

    const [paidAmount, setPaidAmount] = useState(expenseData.paid_amount || 0);

    const calculateTotals = () => {
        const totalAmount = parseFloat(expenseData.amount * expenseData.quantity) || 0;
        const totalDiscount = parseFloat(discountAmount) || 0;
        const totalDueAmount = parseFloat(dueAmount) || 0;
        const totalPaidAmount = parseFloat(paidAmount) || 0;
        const preDueAmount = prev_due || 0;
        const totalPayAbleAmount = totalAmount - totalDiscount;

        return {
            totalAmount,
            totalDiscount,
            totalPaidAmount,
            totalDueAmount,
            totalPayAbleAmount,
            netAmount: totalAmount + preDueAmount
        };
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'discount') {
            setDiscountAmount(parseFloat(value) || 0);
        } else if (name === 'due_amount') {
            setDueAmount(parseFloat(value) || 0);
        } else if (name === 'paid_amount') {
            setPaidAmount(parseFloat(value) || 0);
        }

        setExpenseData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    
    const { totalAmount, totalPaidAmount, netAmount, totalPayAbleAmount } = calculateTotals();

    const [expense_date, setExpense_date] = useState([])
    const [expense_category, setexpense_category] = useState([])
    const [item_name, setitem_name] = useState([])
    const [quantitys, setquantity] = useState([])
    const [amounts, setamount] = useState([])
    const [paid_amount, setpaid_amount] = useState([])

 
    
    
    





    

    const expense_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value

        const attribute = {}
        for (let key in expenseData) {
            attribute[key] = expenseData[key];
        }

        attribute[name] = value;


        const expense_date = attribute['expense_date']
        if (expense_date) {
            setExpense_date('')
        }
        
        const expense_category = attribute['expense_category']
        if (expense_category) {
            setexpense_category('')
        }
        const item_name = attribute['item_name']
        if (item_name) {
            setitem_name('')
        }
        const quantity = attribute['quantity']
        if (quantity) {
            setquantity('')
        }

        const amount = attribute['amount']
        if (amount) {
            setamount('')
        }
        const paid_amount = attribute['paid_amount']
        if (paid_amount) {
            setpaid_amount('')
        }

        setExpenseData(attribute);
    };


    const [selectedEntryType, setSelectedEntryType] = useState('');

    useEffect(() => {
        setSelectedEntryType(expenseData.payment_type)
    },[expenseData])

    const handleEntryTypeChange = (event) => {
        setSelectedEntryType(event.target.value);
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


const [selectedData, setSelectedData] = useState({ amount: 0 }); // Example data

    useEffect(() => {
        if (selectedEntryType) {
            const item = account_head.find(item => item.id == parseInt(selectedEntryType));
            if (item) {
                const updatedItem = {
                    ...item,
                    amount: (item.amount || 0) - (paidAmount || (netAmount - discountAmount)) // Add 100 to amount, 
                };
                setSelectedData(updatedItem); // Set only the matching item
            } else {
                setSelectedData(null); // Clear if no match
            }
        }
    }, [selectedEntryType, account_head, paidAmount, netAmount, discountAmount]); // Trigger when selectedEntryType changes

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

    
    const router = useRouter()
    const expense_update = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior


        
        // // Get form data
        // const formData = new FormData(event.target);

        // // Convert form data to JSON object
        // const expenseData = {};
        // formData.forEach((value, key) => {
        //     expenseData[key] = value;
        // });

        if (!expenseData.supplier_id) {
            setSupplier('Supplier be filled')
            return
        }

        if (!expenseData.expense_date) {
            setExpense_date('Expense Date Must be filled')
            return
        }
        if (!expenseData.expense_category) {
            setexpense_category('Expense category must be filled')
            return
        }
        if (!expenseData.item_name) {
            setitem_name('Item Name must be filled')
            return
        }
        if (!expenseData.quantity) {
            setquantity('Quantity must be filled')
            return
        }
        if (!expenseData.amount) {
            setamount('Amount must be filled')
            return
        }
        if (!expenseData.paid_amount) {
            setpaid_amount('Paid Amount must be filled')
            return
        }
console.log(expenseData)
        // Make a POST request to your API endpoint
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_update/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expenseData),
        })
            .then(response => {
                if (response.ok) {
                    // Handle success

                    if (response) {
                        sessionStorage.setItem("message", "Data saved successfully!");
                        router.push('/Admin/expense/expense_all')
                    }

                    console.log('Expense data updated successfully');

                    // Optionally, you can redirect the user or perform any other action here
                } else {
                    // Handle error
                    console.error('Failed to update expense data');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
       
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






    const [expenseDate, setExpenseDate] = useState('');
    const [formattedDate, setFormattedDate] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [error, setError] = useState('');


    const handleDateChange = (event) => {
        const selectedDate = event.target.value; // Directly get the value from the input

        const day = String(selectedDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
        const month = String(selectedDate.split('-')[1]).padStart(2, '0');
        const year = String(selectedDate.split('-')[0]);
        const formattedDate = `${day}-${month}-${year}`;
        const formattedDatabaseDate = `${year}-${month}-${day}`;


        if(!formattedDatabaseDate){
            setExpense_date('Expense Date Must be filled')
        }
        else{
            setExpense_date('')
        }
        // Check if the selected date is in the future
        const today = new Date();
        const selected = new Date(selectedDate);

        if (selected > today) {
            setError('Expense date cannot be in the future.');
            setCurrentDate('');
            setExpenseDate('');
        } else {
            setError('');
            setCurrentDate(formattedDate);
            setExpenseDate(formattedDatabaseDate);
        }
    };

    useEffect(() => {
        if (expenseDate.includes('-')) {
            const [year, month, day] = expenseDate.split('-');
            setFormattedDate(`${day}-${month}-${year}`);
        } else {
            console.log("Date format is incorrect:", expenseDate);
        }
    }, [expenseDate]);

    const [currentDates, setCurrentDates] = useState('');
    const [formattedDates, setFormattedDates] = useState('');
    // useEffect to update the current date when the component mounts
    useEffect(() => {
        const getCurrentDate = () => {
            // Get the current date
            const now = new Date();
            // Format the date to YYYY-MM-DD (required format for type="date" input)
            const formattedDate = now.toISOString().split('T')[0];
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            const formatted = new Intl.DateTimeFormat('en-US', options).format(now);
            setFormattedDates(formatted);
            // Set the state with the current date
            setCurrentDates(formattedDate);
        };

        // Call the function to get the current date
        getCurrentDate();
    }, []);

    const { data: expenseCategories = [], isLoading, refetch
    } = useQuery({
        queryKey: ['expenseCategories'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expence_category/expence_category_all`)

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

    const module_setting = module_settings.filter(moduleI => moduleI.table_name === 'expense');
    const decimal_digit = module_setting[0]?.decimal_digit;


    const [text, setText] = useState('');
    useEffect(() =>{
        setText(expenseSingle.short_note)
    },[expenseSingle])
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

    console.log(parseInt(prev_due))





    return (
        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="card-default">


                            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Update Expense</h5>
                                <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
                                    <Link href={`/Admin/expense/expense_all?page_group=${page_group}`} className="btn btn-sm btn-info">Back to Expense List</Link>
                                </div>
                            </div>
                            <>
                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={expense_update} >
                                    <div class="d-lg-flex md:d-md-flex justify-content-between px-3 mt-3">
                                        <div class=" ">
                                            <h5 className='ml-3'>From,</h5>
                                            <div className='col-md-12'>
                                                <select

                                                    required="" onChange={(e) => {
                                                        supplier_id(e.target.value)
                                                        expense_input_change(e)
                                                    }} name="supplier_id" className="form-control form-control-sm mb-2" id="supplier_id"
                                                    value={expenseData.supplier_id}

                                                >
                                                    <option value=''>Select Supplier</option>
                                                    {
                                                        supplierList.map((supplier) => (
                                                            <>
                                                                <option value={supplier.id}>{supplier.name}</option>

                                                            </>

                                                        ))
                                                    }


                                                </select>
                                                {
                                                    supplier && <p className='text-danger'>{supplier}</p>
                                                }
                                            </div>
                                            {/* <p>{prev_due}</p> */}
                                            <div className="col-md-12">
                                                <label className='font-weight-bold'>Expense Purches Date:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    // onChange={(e) => handleDateChange(e)}
                                                    value={formattedDate ? formattedDate : expenseData?.expense_date?.slice(0, 10)}
                                                    onClick={() => document.getElementById(`dateInput-n`).showPicker()}
                                                    placeholder="dd-mm-yyyy"
                                                    className="form-control form-control-sm mb-2"
                                                    style={{ display: 'inline-block' }}
                                                />
                                                <input
                                                    name='expense_date'
                                                    type="date"
                                                    id={`dateInput-n`}
                                                    onChange={(e) => handleDateChange(e)}
                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
                                                />
                                                {error && <div className="text-danger">{error}</div>}
                                                {expense_date && <p className="text-danger">{expense_date}</p>}
                                            </div>
                                            {/* <div >
                                                <label className='font-weight-bold'>Expense Purches Date:</label>

                                                <input type="date" required="" name="expense_date" className="form-control form-control-sm mb-2" id="purchase_invoice" placeholder="Enter Purchase Invoice" defaultValue={currentDate} />
                                            </div> */}
                                        </div>
                                        {/* <div class="">

                                            <span >{formattedDate}</span>
                                        </div> */}
                                        <div class="">

                                            <span >{formattedDates}</span>
                                        </div>
                                    </div>

                                    <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                        (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                                    </div>

                                    <div className="card-body">
                                        <div>
                                            <div className="card-header custom-card-header py-1 clearfix  bg-gradient-primary text-white">
                                                <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
                                                    <strong>Expense</strong>
                                                </div>


                                            </div>
                                            <div>
                                                <div className="form-group row px-3 ">
                                                    <table className="table table-bordered  table-hover table-striped table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th>

                                                                    Expense Category
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
                                                                    Voucher Id
                                                                </th>

                                                                <th>
                                                                    File
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
                                                                                    name="expense_category"
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    value={expenseData.expense_category}
                                                                                    onChange={expense_input_change}
                                                                                >
                                                                                    <option value="">Select One</option>
                                                                                    {
                                                                                        expenseCategories.map((expense) => (
                                                                                            <>

                                                                                                <option value={expense.id}>{expense.expense_category_name}</option>
                                                                                            </>
                                                                                        ))
                                                                                    }

                                                                                </select>
                                                                                {
                                                                                    expense_category && <p className='text-danger'>{expense_category}</p>
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    onChange={expense_input_change}
                                                                                    value={expenseData.item_name}
                                                                                    type="text"
                                                                                    
                                                                                    name="item_name"
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    placeholder="Expense Title"
                                                                                />
                                                                                {
                                                                                    item_name && <p className='text-danger'>{item_name}</p>
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="text"
                                                                                    
                                                                                    name="quantity"
                                                                                    value={quantity ? quantity : expenseData.quantity}
                                                                                    onChange={(e) => {
                                                                                        handleQuantityChange(e);
                                                                                        expense_input_change(e)
                                                                                    }}
                                                                                    min='1'
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    placeholder="Enter Quantity"
                                                                                />
                                                                                {
                                                                                    quantitys && <p className='text-danger'>{quantitys}</p>
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="text"
                                                                                    
                                                                                    name="amount"
                                                                                    value={amount ? amount : expenseData.amount}
                                                                                    onChange={(e) => {
                                                                                        handleAmountChange(e);
                                                                                        expense_input_change(e)
                                                                                    }}
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    placeholder="Enter Amount"
                                                                                />
                                                                                {
                                                                                    amounts && <p className='text-danger'>{amounts}</p>
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="text"
                                                                                    
                                                                                    value={totalAmount ? totalAmount.toFixed(decimal_digit) : (expenseData.amount * expenseData.quantity).toFixed(decimal_digit)}
                                                                                    onChange={expense_input_change}
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    placeholder="Total Amount"
                                                                                />
                                                                                <input
                                                                                    type="text"
                                                                                    
                                                                                    name="total_amount"
                                                                                    hidden
                                                                                    value={totalAmount ? totalAmount.toFixed(3) : (expenseData.amount * expenseData.quantity).toFixed(3)}
                                                                                    onChange={expense_input_change}
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    placeholder="Total Amount"
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    type="text"
                                                                                    name="voucher_id"

                                                                                    onChange={expense_input_change}
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    placeholder="Voucher Number"
                                                                                    value={expenseData.voucher_id}
                                                                                />
                                                                                <input
                                                                                    type="text"


                                                                                    hidden
                                                                                    name="voucher_id"
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    placeholder="total amount"
                                                                                    value={expenseData.voucher_id}
                                                                                />
                                                                            </td>
                                                                            <td style={{ width: '180px' }}>




                                                                                <div>

                                                                                    <div>
                                                                                        <span class="btn btn-success btn-sm " >
                                                                                            <label for="fileInput" className='mb-0' ><FaUpload></FaUpload> Select Image </label>
                                                                                            <input
                                                                                                // multiple
                                                                                                name="file_path"
                                                                                                onChange={period_combined_change}
                                                                                                type="file" id="fileInput" style={{ display: "none" }} />
                                                                                        </span>
                                                                                    </div>

                                                                                    {selectedFile[0] ?
                                                                                        <>
                                                                                            <img className="w-100 mb-2 img-thumbnail" onChange={(e) => period_file_change(e)} src={URL.createObjectURL(selectedFile[0])} alt="Uploaded File" />

                                                                                            <input type="hidden" name="file_path" value={selectedFile[0].path} />
                                                                                            <button
                                                                                                // onClick={period_image_remove}
                                                                                                type="button" className="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
                                                                                        </>
                                                                                        :
                                                                                        <>
                                                                                            {
                                                                                                expenseData.file_path ?
                                                                                                    <>

                                                                                                        <img
                                                                                                            className="w-100"
                                                                                                            src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${expenseData.file_path}`}
                                                                                                            alt="Uploaded File"
                                                                                                        />
                                                                                                        <button
                                                                                                            // onClick={period_image_remove}
                                                                                                            type="button"
                                                                                                            className="btn btn-danger btn-sm position-absolute float-right ml-n4"
                                                                                                        >
                                                                                                            <FaTimes />
                                                                                                        </button>
                                                                                                    </>
                                                                                                    :
                                                                                                    ''
                                                                                            }
                                                                                        </>
                                                                                    }
                                                                                    {
                                                                                        file_size_error && (
                                                                                            <p className='text-danger'>{file_size_error}</p>
                                                                                        )
                                                                                    }



                                                                                </div>




                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                </>
                                                            }
                                                        </tbody>

                                                    </table>


                                                    <div className='col-lg-12 border'>
                                                        <label className='font-weight-bold'>Short Note:</label>
                                                        {/* <textarea
                                                            rows={2}
                                                            value={expenseData.short_note}
                                                            onChange={expense_input_change}
                                                            onPaste={handlePaste}
                                                            className={`form-control form-control-sm mb-2 ${text.length > maxLength ? 'is-invalid' : ''}`}
                                                            placeholder="Enter Short Note"
                                                            name='short_note'
                                                        ></textarea>
                                                        <div>{text.length}/{maxLength}</div>
                                                        {text.length > maxLength && (
                                                            <div className="invalid-feedback">Exceeded character limit</div>
                                                        )} */}
                                                         <textarea
                                                            rows={2}
                                                            value={expenseData.short_note}
                                                            onChange={expense_input_change}
                                                            onPaste={handlePaste}
                                                            // className={`form-control form-control-sm mb-2 ${text.length > maxLength ? 'is-invalid' : ''}`}
                                                            className={`form-control form-control-sm mb-2 `}
                                                            placeholder="Enter Short Note"
                                                            name='short_note'
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>



                                    <div className="container mx-auto">
                                    <div className="form-group row student d-flex justify-content-end m-0">
                                        <label className="col-form-label col-md-2">
                                            <strong>Sub Total:</strong>
                                        </label>
                                        <div className="col-md-3">
                                            <p className='text-right'>
                                                <strong>
                                                    {totalAmount.toFixed(decimal_digit)}<span className=''> TK</span>
                                                </strong>
                                            </p>
                                            <input
                                                type="text"
                                                name="sub_total"
                                                hidden
                                                className="form-control form-control-sm"
                                                id="totalAmount"
                                                value={totalAmount.toFixed(decimal_digit)}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row student d-flex justify-content-end m-0">
                                        <label className="col-form-label col-md-2">
                                            <strong>Previous Due:</strong>
                                        </label>
                                        <div className="col-md-3">
                                            <p className='text-right'>
                                                <strong>{parseFloat(prev_due ? prev_due : 0)} TK</strong>
                                            </p>
                                            <input
                                                type="text"
                                                hidden
                                                name="previous_due"
                                                className="form-control form-control-sm"
                                                id="previous_due"
                                                value={prev_due}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row student d-flex justify-content-end m-0">
                                        <label className="col-form-label col-md-2">
                                            <strong>Net Amount:</strong>
                                        </label>
                                        <div className="col-md-3">
                                            <p className='text-right'>
                                                <strong>
                                                {netAmount.toFixed(decimal_digit)} <span className=''>TK</span>
                                                </strong>
                                            </p>
                                            <input
                                                type="text"
                                                name="payable_amount"
                                                hidden
                                                className="form-control form-control-sm"
                                                id="payable_amount"
                                                value={netAmount.toFixed(decimal_digit)}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                 

                                    <div className="form-group row student d-flex justify-content-end m-0">
                                        <label className="col-form-label col-md-2">
                                            <strong>Payable Amount:</strong>
                                        </label>
                                        <div className="col-md-3">
                                            <p className='text-right'>
                                                <strong>{netAmount.toFixed(decimal_digit)} TK</strong>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="form-group row student d-flex justify-content-end m-0">
                                        <label className="col-form-label col-md-2">
                                            <strong>Discount:</strong>
                                        </label>
                                        <div className="col-md-3">
                                            <input
                                                type="text"
                                                name="discount"
                                                required
                                                className="form-control form-control-sm"
                                                id="discount"
                                                value={discountAmount}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                  
                                   
                                    <div className="form-group row student d-flex justify-content-end m-0">
                                        <label className="col-form-label col-md-2">
                                            <strong>Paid Amount:</strong>
                                        </label>
                                        <div className="col-md-3">
                                            <input
                                                type="text"
                                                name="paid_amount"
                                                required
                                                className="form-control form-control-sm"
                                                id="paid_amount"
                                                value={(paidAmount || (netAmount - discountAmount))}
                                                onChange={handleInputChange}
                                            />
                                            {
                                                paid_amount && <p className='text-danger'>{paid_amount}</p>
                                            }
                                        </div>
                                    </div>
                                    <div class="form-group row student d-flex justify-content-end m-0">
                                           <label class="col-form-label col-md-2">
                                               <strong>Paid By:</strong>
                                           </label>
                                           <div class="col-md-3">
                                               <select

                                                    required=""
                                                    name="payment_type"
                                                    className="form-control form-control-sm mb-2"

                                                    value={selectedEntryType ? selectedEntryType : expenseData.payment_type}
                                                    onChange={(e) => {
                                                        handleEntryTypeChange(e);
                                                        expense_input_change(e)
                                                    }}
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
                                                                onChange={expense_input_change}
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
                                        {/* <div class="">
                                            {
                                                selectedEntryType === '6' ?


                                                    <div class="form-group row student d-flex justify-content-end ">
                                                        <label class="col-form-label col-md-2">
                                                            <strong>Bank Check No:</strong>
                                                        </label>


                                                        <div class="col-md-3">
                                                            <input
                                                                onChange={expense_input_change}
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

                                        </div> */}
                                    <div className="form-group row student d-flex justify-content-end m-0">
                                        <label className="col-form-label col-md-2">
                                            <strong>Due Amount:</strong>
                                        </label>
                                        <div className="col-md-3">
                                            <input
                                                type="text"
                                                hidden
                                                name="due_amount"
                                                className="form-control form-control-sm"
                                                id="due_amount"
                                                value={dueAmount}
                                            />
                                            <p className='text-right'>
                                                {/* <strong>{dueAmount.toFixed(decimal_digit)} TK</strong> */}
                                                <strong>{parseFloat(netAmount - paidAmount)} TK</strong>
                                            </p>
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

export default EditExpense;




// 'use client' 
 //ismile
// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import Swal from "sweetalert2";
// import { FaTimes, FaTrash, FaUpload } from 'react-icons/fa';
// import { useQuery } from '@tanstack/react-query';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';



// const EditExpense = ({ id }) => {

//     const [supplierId, setSupplierId] = useState('');
//     const [supplier, setSupplier] = useState('');

//     const supplier_id = (id) => {
//         setSupplierId(id);
//         if (!id) {
//             setSupplier('Supplier be filled')
//         }
//         else {
//             setSupplier('')
//         }
//         console.log("Selected supplier id:", id);
//     };

//     // Dynamically generate API endpoint based on selected supplierId
//     const api = supplierId ? `/Admin/supplier/due_amount/${supplierId}` : '';

//     const { data: supplierLastDue } = useQuery({
//         queryKey: ['supplierLastDue', api], // Include api in queryKey to trigger refetch when api changes
//         queryFn: async () => {
//             if (api) {
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002${api}`);
//                 const data = await res.json();
//                 return data;
//             }
//         },
//         enabled: !!api, // Enable the query only if api is truthy (supplierId is selected)
//     });

//     console.log(supplierLastDue?.payable_amount)

//     const prev_due = supplierLastDue?.payable_amount - supplierLastDue?.paid_amount


//     const modified = localStorage.getItem('userId')
//     const { data: expenseSingle = []
//     } = useQuery({
//         queryKey: ['expenseSingle'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_all/${id}`)

//             const data = await res.json()
//             return data
//         }
//     })
//     console.log(expenseSingle)


//     const [expenseData, setExpenseData] = useState({
//         supplier_id: '',
//         expense_category: '',
//         amount: '',
//         payment_type: '',
//         discount: '',
//         short_note: '',
//         previous_due: '',
//         sub_total: '',
//         payable_amount: '',
//         due_amount: '',
//         paid_amount: '',
//         bank_check_no: '',
//         items: [],
//         quantity: '',
//         due: '',
//         discount: '',
//         amount: '',
//         item_name: '',
//         file_path: '',
//         voucher_id: '',
//         expense_date: ''

//     });

//     const [selectedFile, setSelectedFile] = useState(Array(expenseData.length).fill(null));



//     const [fileNames, setFileNames] = useState([]);

//     console.log(fileNames);
//     console.log(selectedFile[0]?.path);

//     useEffect(() => {

//         setExpenseData({
//             file_path: selectedFile[0]?.path ? selectedFile[0]?.path : expenseSingle.file_path,
//             voucher_id: expenseSingle.voucher_id,
//             expense_date: expenseSingle.expense_date,
//             // category_name: brandSingle[0]?.category_name || '',
//             supplier_id: expenseSingle.supplier_id || '',
//             expense_category: expenseSingle.expense_category || '',
//             amount: expenseSingle.amount || '',
//             payment_type: expenseSingle.payment_type || '',
//             discount: expenseSingle.discount || '',
//             short_note: expenseSingle.short_note || '',
//             previous_due: expenseSingle.previous_due || '',
//             sub_total: expenseSingle.sub_total || '',
//             payable_amount: expenseSingle.payable_amount || '',
//             due_amount: expenseSingle.due_amount || '',
//             paid_amount: expenseSingle.paid_amount || '',
//             bank_check_no: expenseSingle.bank_check_no || '',
//             item_name: expenseSingle.item_name || '',
//             amount: expenseSingle.amount || '',
//             discount: expenseSingle.discount || '',
//             due: expenseSingle.due || '',
//             items: expenseSingle?.items?.map(item => ({
//                 item_name: item.item_name || '',
//                 amount: item.amount || '',
//                 discount: item.discount || '',
//                 due: item.due || ''
//             })),
//             quantity: expenseSingle.quantity || '',

//             modified_by: modified
//         });
//     }, [modified, expenseSingle, selectedFile]);



//     // Inside your component function
//     const [discountAmount, setDiscountAmount] = useState(0);
//     const [dueAmount, setDueAmount] = useState(0);

//     const [totalAmounts, setTotalAmount] = useState('');

  
//     const calculateTotalAmount = (newQuantity, newAmount) => {
//         const total = parseFloat(newQuantity) * parseFloat(newAmount);
//         setTotalAmount(isNaN(total) ? '' : total.toFixed(2)); // Handle NaN or unexpected values
//     };

//     // Other state variables and useEffect remain the same

//     const calculateTotals = () => {
//         let totalAmount = 0;
//         let totalDiscount = parseFloat(discountAmount);
//         let totalDueAmount = parseFloat(dueAmount);
//         let totalPaidAmount = 0;
//         let preDueAmount = prev_due;
//         let totalPayAbleAmount = 0;
//         totalAmount = parseFloat(expenseData.amount * expenseData.quantity);
//         totalPayAbleAmount = totalAmount - totalDiscount;
//         // Calculate totalPaidAmount
//         totalPaidAmount = totalPayAbleAmount - totalDueAmount;
//         return {
//             netAmount: totalAmount + preDueAmount,
//             totalAmount,
//             totalDiscount,
//             totalPaidAmount,
//             totalDueAmount,
//             totalPayAbleAmount,
//         };
//     };

//     // Other functions remain the same

//     const handleInputChange = (event) => {
//         if (event.target.name === 'discount') {
//             setDiscountAmount(parseFloat(event.target.value));
//         } else if (event.target.name === 'due_amount') {
//             setDueAmount(parseFloat(event.target.value));
//         }
//     };
//     const {
//         totalAmount,
//         totalPaidAmount,
//         preDueAmount = prev_due,
//         netAmount,
//         totalPayAbleAmount
//     } = calculateTotals();

   
//     const expense_input_change = (event) => {
//         const name = event.target.name
//         const value = event.target.value

//         const attribute = {}
//         for (let key in expenseData) {
//             attribute[key] = expenseData[key];
//         }

//         attribute[name] = value;

      

//         setExpenseData(attribute);
//     };

//     const page_group = localStorage.getItem('pageGroup')

//     const [selectedEntryType, setSelectedEntryType] = useState('');

//     const handleEntryTypeChange = (event) => {
//         setSelectedEntryType(event.target.value);
//     };

//     const { data: supplierList = []
//     } = useQuery({
//         queryKey: ['supplierList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/supplier/supplier_list`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: module_settings = []
//     } = useQuery({
//         queryKey: ['module_settings'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_all`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const module_setting = module_settings.filter(moduleI => moduleI.table_name === 'expense');
//     const decimal_digit = module_setting[0]?.decimal_digit;


//     return (
//         <div class="container-fluid">
//             <div class=" row ">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="card-default">


//                             <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
//                                 <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Update Expense</h5>
//                                 <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
//                                     <Link href={`/Admin/expense/expense_all?page_group=${page_group}`} className="btn btn-sm btn-info">Back to Expense List</Link>
//                                 </div>
//                             </div>
//                             <>
//                                 <form className="form-horizontal" method="post" autoComplete="off"  >
//                                     <div class="d-lg-flex md:d-md-flex justify-content-between px-3 mt-3">
//                                         <div class=" ">
//                                             <h5 className='ml-3'>From,</h5>
//                                             <div className='col-md-12'>
//                                                 <select

//                                                     required="" onChange={(e) => {
//                                                         supplier_id(e.target.value)
//                                                         expense_input_change(e)
//                                                     }} name="supplier_id" className="form-control form-control-sm mb-2" id="supplier_id"
//                                                     value={expenseData.supplier_id}

//                                                 >
//                                                     <option value=''>Select Supplier</option>
//                                                     {
//                                                         supplierList.map((supplier) => (
//                                                             <>
//                                                                 <option value={supplier.id}>{supplier.name}</option>

//                                                             </>

//                                                         ))
//                                                     }


//                                                 </select>
//                                                 {
//                                                     supplier && <p className='text-danger'>{supplier}</p>
//                                                 }
//                                             </div>
                                           
//                                         </div>
                                                                             
//                                     </div>

//                                     <div className="container mx-auto ">
//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Sub Total:</strong>
//                                             </label>

//                                             <div class="col-md-3">
                                               
//                                                 <p className='text-right'>
//                                                     <strong>
//                                                         {totalAmount.toFixed(decimal_digit)}

//                                                         <span className=''> TK</span>
//                                                     </strong>
//                                                 </p>
//                                                 <input
//                                                     type="text"
//                                                     name="sub_total"
//                                                     hidden
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="totalAmount"
//                                                     placeholder="Enter Total Amount"
//                                                     value={totalAmount.toFixed(3)}
//                                                     onChange={(e) => {
//                                                         calculateTotalAmount(e);
//                                                         expense_input_change(e)
//                                                     }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Previous Due:</strong>
//                                             </label>
//                                             <div class="col-md-3">
                                               
//                                                 <p className='text-right'>
//                                                     <strong>
//                                                         {preDueAmount ? preDueAmount.toFixed(decimal_digit) : 0}
//                                                         <span className=''> TK</span>
//                                                     </strong>
//                                                 </p>
//                                                 <input
//                                                     type="text"
//                                                     hidden
//                                                     name="previous_due"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="totalAmount"
//                                                     placeholder="Enter Total Amount"
//                                                     value={expenseData.previous_due ? Number(expenseData.previous_due).toFixed(3) : preDueAmount.toFixed(3)}
//                                                     onChange={expense_input_change}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Net Amount:</strong>
//                                             </label>
//                                             <div class="col-md-3">
                                               
//                                                 <p className='text-right'>
//                                                     <strong>
//                                                         {netAmount ? netAmount.toFixed(decimal_digit) : 0}
//                                                         <span className=''> TK</span>
//                                                     </strong>
//                                                 </p>

//                                                 <input
//                                                     type="text"
//                                                     hidden
//                                                     name="net_amount"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="netAmount"
//                                                     placeholder="Enter Net Amount"
//                                                     value={(totalAmount - expenseData.previous_due).toFixed(3)}
//                                                     onChange={expense_input_change}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Payable Amount:</strong>
//                                             </label>
//                                             <div class="col-md-3">
                                               
//                                                 <p className='text-right'>
//                                                     <strong>
//                                                         {(totalAmount - expenseData.discount - expenseData.previous_due).toFixed(decimal_digit)}
//                                                         <span className=''> TK</span>
//                                                     </strong>
//                                                 </p>
//                                                 <input
//                                                     type="text"
//                                                     hidden
//                                                     name="payable_amount"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="paidAmount"
//                                                     placeholder="Enter Paid Amount"
//                                                     value={(totalAmount - expenseData.discount - expenseData.previous_due).toFixed(3)}
                                                  
//                                                     onChange={() => {
//                                                         expense_input_change(e);
//                                                         handleInputChange(e);
//                                                     }}

//                                                 />
//                                             </div>
//                                         </div>
//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Discount:</strong>
//                                             </label>
//                                             <div class="col-md-3">
//                                                 <input
//                                                     type="text"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="discount"
//                                                     placeholder="Enter Discount Amount"
                                                   
//                                                     value={expenseData.discount ? expenseData.discount : discountAmount.toFixed(decimal_digit)}
//                                                     onChange={(e) => {
//                                                         handleInputChange(e);
//                                                         expense_input_change(e)
//                                                     }}
//                                                 />

//                                                 <input
//                                                     type="text"
//                                                     name="discount"
//                                                     hidden
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="discount"
//                                                     placeholder="Enter Discount Amount"
//                                                     value={expenseData.discount ? expenseData.discount : discountAmount.toFixed(3)}
//                                                     onChange={(e) => {
//                                                         handleInputChange(e);
//                                                         expense_input_change(e)
//                                                     }}
//                                                 />

//                                             </div>
//                                         </div>




//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Paid Amount:</strong>
//                                             </label>
//                                             <div class="col-md-3">
//                                                 <input
//                                                     type="text"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="paidAmount"
//                                                     placeholder="Enter Paid Amount"
//                                                     value={(totalAmount - expenseData.discount - expenseData.previous_due - expenseData.due_amount).toFixed(decimal_digit)}
//                                                     onChange={(e) => {
//                                                         expense_input_change(e);
//                                                         handleInputChange(e)
//                                                     }}
//                                                 />
//                                                 <input
//                                                     type="text"
//                                                     hidden
//                                                     name="paid_amount"
//                                                     class="form-control form-control-sm  alpha_space student_id"
//                                                     id="paidAmount"
//                                                     placeholder="Enter Paid Amount"
//                                                     value={(totalAmount - expenseData.discount - expenseData.previous_due - expenseData.due_amount).toFixed(3)}
//                                                     onChange={(e) => {
//                                                         expense_input_change(e);
//                                                         handleInputChange(e)
//                                                     }}

//                                                 />
                                                
//                                             </div>
//                                         </div>
//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Payment Type:</strong>
//                                             </label>


//                                             <div class="col-md-3">
//                                                 <select

//                                                     required=""
//                                                     name="payment_type"
//                                                     className="form-control form-control-sm mb-2"

//                                                     value={selectedEntryType ? selectedEntryType : expenseData.payment_type}
//                                                     onChange={(e) => {
//                                                         handleEntryTypeChange(e);
//                                                         expense_input_change(e)
//                                                     }}
//                                                 >
//                                                     <option value="">Select Type Of Payment</option>
//                                                     <option value="1">Cash</option>

//                                                     <option value="2">Check</option>

//                                                 </select>
//                                             </div>

//                                         </div>


//                                         <div class="">
//                                             {
//                                                 selectedEntryType === '2' ?


//                                                     <div class="form-group row student d-flex justify-content-end ">
//                                                         <label class="col-form-label col-md-2">
//                                                             <strong>Bank Check No:</strong>
//                                                         </label>


//                                                         <div class="col-md-3">
//                                                             <input
//                                                                 onChange={expense_input_change}
//                                                                 type="text"
//                                                                 required
//                                                                 name="bank_check_no"
//                                                                 className="form-control form-control-sm mb-2"
//                                                                 placeholder="Enter Bank Check No"

//                                                             />
//                                                         </div>

//                                                     </div>
//                                                     :
//                                                     <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}>



//                                                     </div>
//                                             }

//                                         </div>
//                                         <div class="form-group row student d-flex justify-content-end ">
//                                             <label class="col-form-label col-md-2">
//                                                 <strong>Due Amount:</strong>
//                                             </label>
//                                             <div class="col-md-3">
                                              
//                                                 <p className='text-right' onChange={handleInputChange}>
//                                                     <strong>
//                                                         {(expenseData.due_amount ? expenseData.due_amount : dueAmount)}
//                                                         <span className=''> TK</span>
//                                                     </strong>
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         <div class="form-group row d-flex justify-content-end">
//                                             <div class="offset-md-2  ">

//                                                 <input type="submit" name="Print" class="btn btn-sm btn-success print_btn mr-2" value="Update" />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>



//     );
// };

// export default EditExpense;


// 'use client' 
 //ismile
// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';

// const EditExpense = ({ id }) => {

//     const [supplierId, setSupplierId] = useState('');
//     const [supplier, setSupplier] = useState('');

//     const supplier_id = (id) => {
//         setSupplierId(id);
//         setSupplier(id ? '' : 'Supplier be filled');
//         console.log("Selected supplier id:", id);
//     };

//     const api = supplierId ? `/Admin/supplier/due_amount/${supplierId}` : '';

//     const { data: supplierLastDue } = useQuery({
//         queryKey: ['supplierLastDue', api],
//         queryFn: async () => {
//             if (api) {
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002${api}`);
//                 return await res.json();
//             }
//         },
//         enabled: !!api,
//     });

//     const prev_due = supplierLastDue?.payable_amount - supplierLastDue?.paid_amount;

//     const modified = localStorage.getItem('userId');
//     const { data: expenseSingle = [] } = useQuery({
//         queryKey: ['expenseSingle'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_all/${id}`);
//             return await res.json();
//         }
//     });

//     const [expenseData, setExpenseData] = useState({
//         supplier_id: '',
//         expense_category: '',
//         amount: '',
//         payment_type: '',
//         discount: '',
//         short_note: '',
//         previous_due: '',
//         sub_total: '',
//         payable_amount: '',
//         due_amount: '',
//         paid_amount: '',
//         bank_check_no: '',
//         items: [],
//         quantity: '',
//         due: '',
//         discount: '',
//         amount: '',
//         item_name: '',
//         file_path: '',
//         voucher_id: '',
//         expense_date: ''
//     });

//     const [selectedFile, setSelectedFile] = useState(null);

//     useEffect(() => {
//         setExpenseData({
//             file_path: selectedFile?.path || expenseSingle.file_path,
//             voucher_id: expenseSingle.voucher_id,
//             expense_date: expenseSingle.expense_date,
//             supplier_id: expenseSingle.supplier_id || '',
//             expense_category: expenseSingle.expense_category || '',
//             amount: expenseSingle.amount || '',
//             payment_type: expenseSingle.payment_type || '',
//             discount: expenseSingle.discount || '',
//             short_note: expenseSingle.short_note || '',
//             previous_due: expenseSingle.previous_due || '',
//             sub_total: expenseSingle.sub_total || '',
//             payable_amount: expenseSingle.payable_amount || '',
//             due_amount: expenseSingle.due_amount || '',
//             paid_amount: expenseSingle.paid_amount || '',
//             bank_check_no: expenseSingle.bank_check_no || '',
//             item_name: expenseSingle.item_name || '',
//             amount: expenseSingle.amount || '',
//             discount: expenseSingle.discount || '',
//             due: expenseSingle.due || '',
//             items: expenseSingle?.items?.map(item => ({
//                 item_name: item.item_name || '',
//                 amount: item.amount || '',
//                 discount: item.discount || '',
//                 due: item.due || ''
//             })),
//             quantity: expenseSingle.quantity || '',
//             modified_by: modified
//         });
//     }, [modified, expenseSingle, selectedFile]);

//     const [discountAmount, setDiscountAmount] = useState(expenseData.discount || 0);
//     const [dueAmount, setDueAmount] = useState(expenseData.due_amount || 0);
//     const [paidAmount, setPaidAmount] = useState(expenseData.paid_amount || 0);

//     const calculateTotals = () => {
//         const totalAmount = parseFloat(expenseData.amount * expenseData.quantity) || 0;
//         const totalDiscount = parseFloat(discountAmount) || 0;
//         const totalDueAmount = parseFloat(dueAmount) || 0;
//         const totalPaidAmount = parseFloat(paidAmount) || 0;
//         const preDueAmount = prev_due || 0;
//         const totalPayAbleAmount = totalAmount - totalDiscount;

//         return {
//             totalAmount,
//             totalDiscount,
//             totalPaidAmount,
//             totalDueAmount,
//             totalPayAbleAmount,
//             netAmount: totalAmount + preDueAmount
//         };
//     };

//     const handleInputChange = (event) => {
//         const { name, value } = event.target;

//         if (name === 'discount') {
//             setDiscountAmount(parseFloat(value) || 0);
//         } else if (name === 'due_amount') {
//             setDueAmount(parseFloat(value) || 0);
//         } else if (name === 'paid_amount') {
//             setPaidAmount(parseFloat(value) || 0);
//         }

//         setExpenseData(prevState => ({
//             ...prevState,
//             [name]: value,
//         }));
//     };

//     const { totalAmount, totalPaidAmount, netAmount, totalPayAbleAmount } = calculateTotals();

//     const page_group = localStorage.getItem('pageGroup');
//     const [selectedEntryType, setSelectedEntryType] = useState('');

//     const handleEntryTypeChange = (event) => {
//         setSelectedEntryType(event.target.value);
//     };

//     const { data: supplierList = [] } = useQuery({
//         queryKey: ['supplierList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/supplier/supplier_list`);
//             return await res.json();
//         }
//     });

//     const { data: module_settings = [] } = useQuery({
//         queryKey: ['module_settings'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_all`);
//             return await res.json();
//         }
//     });

//     const module_setting = module_settings.find(moduleI => moduleI.table_name === 'expense');
//     const decimal_digit = module_setting?.decimal_digit || 2;

//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="card-default">
//                             <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
//                                 <h5 className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">Update Expense</h5>
//                                 <div className="card-title card-header-color font-weight-bold mb-0 float-right">
//                                     <Link href={`/Admin/expense/expense_all?page_group=${page_group}`} className="btn btn-sm btn-info">Back to Expense List</Link>
//                                 </div>
//                             </div>
//                             <form className="form-horizontal" method="post" autoComplete="off">
//                                 <div className="d-lg-flex md:d-md-flex justify-content-between px-3 mt-3">
//                                     <div>
//                                         <h5 className='ml-3'>From,</h5>
//                                         <div className='col-md-12'>
//                                             <select
//                                                 required
//                                                 onChange={(e) => {
//                                                     supplier_id(e.target.value);
//                                                     handleInputChange(e);
//                                                 }}
//                                                 name="supplier_id"
//                                                 className="form-control form-control-sm mb-2"
//                                                 id="supplier_id"
//                                                 value={expenseData.supplier_id}
//                                             >
//                                                 <option value=''>Select Supplier</option>
//                                                 {supplierList.map((supplier) => (
//                                                     <option value={supplier.id} key={supplier.id}>{supplier.name}</option>
//                                                 ))}
//                                             </select>
//                                             {supplier && <p className='text-danger'>{supplier}</p>}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="container mx-auto">
//                                     <div className="form-group row student d-flex justify-content-end">
//                                         <label className="col-form-label col-md-2">
//                                             <strong>Sub Total:</strong>
//                                         </label>
//                                         <div className="col-md-3">
//                                             <p className='text-right'>
//                                                 <strong>
//                                                     {totalAmount.toFixed(decimal_digit)}<span className=''> TK</span>
//                                                 </strong>
//                                             </p>
//                                             <input
//                                                 type="text"
//                                                 name="sub_total"
//                                                 hidden
//                                                 className="form-control form-control-sm"
//                                                 id="totalAmount"
//                                                 value={totalAmount.toFixed(decimal_digit)}
//                                                 onChange={handleInputChange}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="form-group row student d-flex justify-content-end">
//                                         <label className="col-form-label col-md-2">
//                                             <strong>Discount:</strong>
//                                         </label>
//                                         <div className="col-md-3">
//                                             <input
//                                                 type="text"
//                                                 name="discount"
//                                                 required
//                                                 className="form-control form-control-sm"
//                                                 id="discount"
//                                                 value={discountAmount}
//                                                 onChange={handleInputChange}
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="form-group row student d-flex justify-content-end">
//                                         <label className="col-form-label col-md-2">
//                                             <strong>Due:</strong>
//                                         </label>
//                                         <div className="col-md-3">
//                                             <input
//                                                 type="text"
//                                                 name="due_amount"
//                                                 required
//                                                 className="form-control form-control-sm"
//                                                 id="due_amount"
//                                                 value={dueAmount}
//                                                 onChange={handleInputChange}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="form-group row student d-flex justify-content-end">
//                                         <label className="col-form-label col-md-2">
//                                             <strong>Payable Amount:</strong>
//                                         </label>
//                                         <div className="col-md-3">
//                                             <p className='text-right'>
//                                                 <strong>
//                                                     {totalPayAbleAmount.toFixed(decimal_digit)} <span className=''>TK</span>
//                                                 </strong>
//                                             </p>
//                                             <input
//                                                 type="text"
//                                                 name="payable_amount"
//                                                 hidden
//                                                 className="form-control form-control-sm"
//                                                 id="payable_amount"
//                                                 value={totalPayAbleAmount.toFixed(decimal_digit)}
//                                                 onChange={handleInputChange}
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="form-group row student d-flex justify-content-end">
//                                         <label className="col-form-label col-md-2">
//                                             <strong>Previous Due:</strong>
//                                         </label>
//                                         <div className="col-md-3">
//                                             <p className='text-right'>
//                                                 <strong>{prev_due ? prev_due.toFixed(decimal_digit) : 0} TK</strong>
//                                             </p>
//                                             <input
//                                                 type="text"
//                                                 hidden
//                                                 name="previous_due"
//                                                 className="form-control form-control-sm"
//                                                 id="previous_due"
//                                                 value={prev_due}
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="form-group row student d-flex justify-content-end">
//                                         <label className="col-form-label col-md-2">
//                                             <strong>Total Payable Amount:</strong>
//                                         </label>
//                                         <div className="col-md-3">
//                                             <p className='text-right'>
//                                                 <strong>{netAmount.toFixed(decimal_digit)} TK</strong>
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="form-group row student d-flex justify-content-end">
//                                         <label className="col-form-label col-md-2">
//                                             <strong>Paid Amount:</strong>
//                                         </label>
//                                         <div className="col-md-3">
//                                             <input
//                                                 type="text"
//                                                 name="paid_amount"
//                                                 required
//                                                 className="form-control form-control-sm"
//                                                 id="paid_amount"
//                                                 value={parseFloat(paidAmount || (netAmount - discountAmount))}
//                                                 onChange={handleInputChange}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="form-group row student d-flex justify-content-end">
//                                         <label className="col-form-label col-md-2">
//                                             <strong>Due Amount:</strong>
//                                         </label>
//                                         <div className="col-md-3">
//                                             <input
//                                                 type="text"
//                                                 hidden
//                                                 name="due_amount"
//                                                 className="form-control form-control-sm"
//                                                 id="due_amount"
//                                                 value={dueAmount}
//                                             />
//                                             <p className='text-right'>
//                                                 {/* <strong>{dueAmount.toFixed(decimal_digit)} TK</strong> */}
//                                                 <strong>{parseFloat(netAmount - paidAmount)} TK</strong>
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </form>
//                             <div className="card-footer text-center">
//                                 <div className="col">
//                                     <Link href="/Admin/expense/expense_all" className="btn btn-warning mr-2">Cancel</Link>
//                                     <button className="btn btn-success" type="submit" id="submit">Submit</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditExpense;


// 'use client' 
 //ismile
// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import Swal from "sweetalert2";
// import { FaTrash } from 'react-icons/fa';
// import { useQuery } from '@tanstack/react-query';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { useRouter } from 'next/navigation';

// const EditExpense = ({ id }) => {
//     const [supplierId, setSupplierId] = useState('');
//     const [expenseData, setExpenseData] = useState({
//         supplier_id: '',
//         expense_category: '',
//         amount: '',
//         payment_type: '',
//         discount: '',
//         short_note: '',
//         previous_due: '',
//         sub_total: '',
//         payable_amount: '',
//         due_amount: '',
//         paid_amount: '',
//         bank_check_no: '',
//         items: [],
//         quantity: '',
//         item_name: '',
//         modified_by: localStorage.getItem('userId'),
//     });

//     const [selectedEntryType, setSelectedEntryType] = useState('');
//     const [discountAmount, setDiscountAmount] = useState(0);
//     const [dueAmount, setDueAmount] = useState(0);
//     const [paidAmount, setPaidAmount] = useState(0);
//     const [totalAmounts, setTotalAmount] = useState('');

//     const supplier_id = (id) => {
//         setSupplierId(id);
//         console.log("Selected supplier id:", id);
//     };

//     const api = supplierId ? `/Admin/supplier/due_amount/${supplierId}` : '';

//     const { data: supplierLastDue } = useQuery({
//         queryKey: ['supplierLastDue', api],
//         queryFn: async () => {
//             if (api) {
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002${api}`);
//                 const data = await res.json();
//                 return data;
//             }
//         },
//         enabled: !!api,
//     });

//     const prev_due = supplierLastDue?.payable_amount - supplierLastDue?.paid_amount;

//     const { data: expenseSingle = [] } = useQuery({
//         queryKey: ['expenseSingle'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_all/${id}`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     useEffect(() => {
//         setExpenseData({
//             supplier_id: expenseSingle.supplier_id || '',
//             expense_category: expenseSingle.expense_category || '',
//             amount: expenseSingle.amount || '',
//             payment_type: expenseSingle.payment_type || '',
//             discount: expenseSingle.discount || '',
//             short_note: expenseSingle.short_note || '',
//             previous_due: expenseSingle.previous_due || '',
//             sub_total: expenseSingle.sub_total || '',
//             payable_amount: expenseSingle.payable_amount || '',
//             due_amount: expenseSingle.due_amount || '',
//             paid_amount: expenseSingle.paid_amount || '',
//             bank_check_no: expenseSingle.bank_check_no || '',
//             items: expenseSingle?.items?.map(item => ({
//                 item_name: item.item_name || '',
//                 amount: item.amount || '',
//                 discount: item.discount || '',
//                 due: item.due || ''
//             })),
//             quantity: expenseSingle.quantity || '',
//             modified_by: localStorage.getItem('userId')
//         });

//         setDiscountAmount(expenseSingle.discount || 0);
//         setDueAmount(expenseSingle.due_amount || 0);
//         setPaidAmount(expenseSingle.paid_amount || 0);
//     }, [expenseSingle]);

//     const calculateTotals = () => {
//         let totalAmount = parseFloat(expenseData.amount) * parseFloat(expenseData.quantity);
//         let totalDiscount = parseFloat(discountAmount);
//         let totalDueAmount = parseFloat(dueAmount);
//         let totalPaidAmount = parseFloat(paidAmount);
//         let preDueAmount = prev_due;
//         let totalPayAbleAmount = totalAmount - totalDiscount;
//         return {
//             netAmount: totalAmount + preDueAmount,
//             totalAmount,
//             totalDiscount,
//             totalPaidAmount,
//             totalDueAmount,
//             totalPayAbleAmount,
//         };
//     };

//     const handleInputChange = (event) => {
//         const { name, value } = event.target;
//         if (name === 'discount') {
//             setDiscountAmount(parseFloat(value));
//         } else if (name === 'due_amount') {
//             setDueAmount(parseFloat(value));
//         } else if (name === 'paid_amount') {
//             setPaidAmount(parseFloat(value));
//         }
//         setExpenseData({ ...expenseData, [name]: value });
//     };

//     const { totalAmount, totalPaidAmount, preDueAmount = prev_due, netAmount, totalPayAbleAmount } = calculateTotals();

//     const handleEntryTypeChange = (event) => {
//         setSelectedEntryType(event.target.value);
//     };

//     const { data: module_settings = [] } = useQuery({
//         queryKey: ['module_settings'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_all`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const module_setting = module_settings.filter(moduleI => moduleI.table_name === 'expense');
//     const decimal_digit = module_setting[0]?.decimal_digit;

//     const router = useRouter();
//     const page_group = localStorage.getItem('pageGroup');

//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="card-default">
//                             <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
//                                 <h5 className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">Update Expense</h5>
//                                 <div className="card-title card-header-color font-weight-bold mb-0 float-right">
//                                     <Link href={`/Admin/expense/expense_all?page_group=${page_group}`} className="btn btn-sm btn-info">Back to Expense List</Link>
//                                 </div>
//                             </div>
//                             <>
//                                 <form className="form-horizontal" method="post" autoComplete="off">
//                                     <div className="container mx-auto">
//                                         <div className="form-group row student d-flex justify-content-end">
//                                             <label className="col-form-label col-md-2">
//                                                 <strong>Sub Total:</strong>
//                                             </label>
//                                             <div className="col-md-3">
//                                                 <p className='text-right'>
//                                                     <strong>
//                                                         {totalAmount.toFixed(decimal_digit)}
//                                                         <span> TK</span>
//                                                     </strong>
//                                                 </p>
//                                                 <input
//                                                     type="text"
//                                                     name="sub_total"
//                                                     hidden
//                                                     className="form-control form-control-sm alpha_space student_id"
//                                                     id="totalAmount"
//                                                     placeholder="Enter Total Amount"
//                                                     value={totalAmount.toFixed(3)}
//                                                     onChange={handleInputChange}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row student d-flex justify-content-end">
//                                             <label className="col-form-label col-md-2">
//                                                 <strong>Previous Due:</strong>
//                                             </label>
//                                             <div className="col-md-3">
//                                                 <p className='text-right'>
//                                                     <strong>
//                                                         {preDueAmount ? preDueAmount.toFixed(decimal_digit) : 0}
//                                                         <span> TK</span>
//                                                     </strong>
//                                                 </p>
//                                                 <input
//                                                     type="text"
//                                                     hidden
//                                                     name="previous_due"
//                                                     className="form-control form-control-sm alpha_space student_id"
//                                                     id="totalAmount"
//                                                     placeholder="Enter Total Amount"
//                                                     value={expenseData.previous_due ? Number(expenseData.previous_due).toFixed(3) : preDueAmount.toFixed(3)}
//                                                     onChange={handleInputChange}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row student d-flex justify-content-end">
//                                             <label className="col-form-label col-md-2">
//                                                 <strong>Net Amount:</strong>
//                                             </label>
//                                             <div className="col-md-3">
//                                                 <p className='text-right'>
//                                                     <strong>
//                                                         {netAmount ? netAmount.toFixed(decimal_digit) : 0}
//                                                         <span> TK</span>
//                                                     </strong>
//                                                 </p>
//                                                 <input
//                                                     type="text"
//                                                     hidden
//                                                     name="net_amount"
//                                                     className="form-control form-control-sm alpha_space student_id"
//                                                     id="netAmount"
//                                                     placeholder="Enter Net Amount"
//                                                     value={netAmount.toFixed(3)}
//                                                     onChange={handleInputChange}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row student d-flex justify-content-end">
//                                             <label className="col-form-label col-md-2">
//                                                 <strong>Payable Amount:</strong>
//                                             </label>
//                                             <div className="col-md-3">
//                                                 <p className='text-right'>
//                                                     <strong>
//                                                         {totalPayAbleAmount.toFixed(decimal_digit)}
//                                                         <span> TK</span>
//                                                     </strong>
//                                                 </p>
//                                                 <input
//                                                     type="text"
//                                                     hidden
//                                                     name="payable_amount"
//                                                     className="form-control form-control-sm alpha_space student_id"
//                                                     id="totalAmount"
//                                                     placeholder="Enter Total Amount"
//                                                     value={totalPayAbleAmount.toFixed(3)}
//                                                     onChange={handleInputChange}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row student d-flex justify-content-end">
//                                             <label className="col-form-label col-md-2">
//                                                 <strong>Discount:</strong>
//                                             </label>
//                                             <div className="col-md-3">
//                                                 <input
//                                                     type="number"
//                                                     name="discount"
//                                                     className="form-control form-control-sm alpha_space student_id"
//                                                     id="discountAmount"
//                                                     placeholder="Enter Discount Amount"
//                                                     value={discountAmount}
//                                                     onChange={handleInputChange}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row student d-flex justify-content-end">
//                                             <label className="col-form-label col-md-2">
//                                                 <strong>Paid Amount:</strong>
//                                             </label>
//                                             <div className="col-md-3">
//                                                 <input
//                                                     type="number"
//                                                     name="paid_amount"
//                                                     className="form-control form-control-sm alpha_space student_id"
//                                                     id="paidAmount"
//                                                     placeholder="Enter Paid Amount"
//                                                     value={paidAmount - discountAmount}
//                                                     onChange={handleInputChange}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row student d-flex justify-content-end">
//                                             <label className="col-form-label col-md-2">
//                                                 <strong>Due Amount:</strong>
//                                             </label>
//                                             <div className="col-md-3">
//                                                 <input
//                                                     type="number"
//                                                     name="due_amount"
//                                                     className="form-control form-control-sm alpha_space student_id"
//                                                     id="dueAmount"
//                                                     placeholder="Enter Due Amount"
//                                                     value={dueAmount}
//                                                     onChange={handleInputChange}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                                 <div className="card-body">
//                                     <div className='text-center'>
//                                         <button
//                                             className="btn btn-success btn-sm"
//                                             type="button"
//                                             onClick={() => {
//                                                 fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expense/expense_update/${id}`, {
//                                                     method: "POST",
//                                                     headers: {
//                                                         "Content-Type": "application/json",
//                                                     },
//                                                     body: JSON.stringify(expenseData),
//                                                 })
//                                                     .then((res) => res.json())
//                                                     .then((data) => {
//                                                         Swal.fire({
//                                                             title: "Updated!",
//                                                             text: "Expense has been updated.",
//                                                             icon: "success",
//                                                             confirmButtonText: "OK",
//                                                         });
//                                                         router.push(`/Admin/expense/expense_all?page_group=${page_group}`);
//                                                     })
//                                                     .catch((error) => {
//                                                         console.error("Error updating expense:", error);
//                                                         Swal.fire({
//                                                             title: "Error!",
//                                                             text: "There was an error updating the expense.",
//                                                             icon: "error",
//                                                             confirmButtonText: "OK",
//                                                         });
//                                                     });
//                                             }}
//                                         >
//                                             Save
//                                         </button>
//                                     </div>
//                                 </div>
//                             </>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditExpense;