'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';



const EmployeLoanPayment = () => {

    const [page_group, setPageGroup] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pageGroup') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('pageGroup');
            setPageGroup(storedUserId);
        }
    }, []);


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

    const [fromDate, setFromDate] = useState('');


    const [assetInfo, setAssetInfo] = useState({
        loan: '', account: '', reference: '', amount: '', interest: '', aviable_balance: '', due: '', payable_amount: '', payment_date: '', note: '', status: '', created_by: created, img: '', employee_id: '', remaining_balance: ''
    });



    const { data: employeeList = [], } = useQuery({
        queryKey: ['employeeList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_all_list`);
            const data = await res.json();
            // Filter out the brand with id 
            // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return data;
        }
    });



    const { data: loanAll = [], isLoading, refetch
    } = useQuery({
        queryKey: ['loanAll'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employe_loan/employe_loan_all`)

            const data = await res.json()
            return data
        }
    })


    const totalPayableForAccount6 = loanAll
        .filter(item => item.account == assetInfo.account && item.employee_id == assetInfo.employee_id)  // Filter the data for account '6'
        .reduce((sum, curr) => sum + curr.payable_amount, 0);  // Sum up payable_amount

    console.log(totalPayableForAccount6);

    useEffect(() => {


        setAssetInfo(prevState => ({
            ...prevState,
            amount: totalPayableForAccount6
        }));
    }, [totalPayableForAccount6]);


    useEffect(() => {
        const amount = parseFloat(assetInfo.amount) || 0;
        const payable_amount = parseFloat(assetInfo.interest) || 0;

        setAssetInfo(prevState => ({
            ...prevState,
            payable_amount: amount + payable_amount
        }));
    }, [assetInfo.amount, assetInfo.interest]);


    useEffect(() => {
        const amount = parseFloat(assetInfo.amount) || 0;
        const interest = parseFloat(assetInfo.interest) || 0;
        const payable_amount = parseFloat(assetInfo.payable_amount) || 0;

        setAssetInfo(prevState => ({
            ...prevState,
            due: (amount + interest) - payable_amount
        }));
    }, [assetInfo.amount, assetInfo.payable_amount, assetInfo.interest]);



    const { data: loanPaymentList = [],
    } = useQuery({
        queryKey: ['loanPaymentList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employe_loan_payment/employe_loan_payment_all`)

            const data = await res.json()
            return data
        }
    })



    const totalPayableForLoanPaymentList = loanPaymentList
        .filter(item => item.account == assetInfo.account && item.employe_id == assetInfo.employee_id)  // Filter the data for account '6'
        .reduce((sum, curr) => sum + curr.payable_amount, 0);  // Sum up payable_amount

    console.log(totalPayableForLoanPaymentList);



    useEffect(() => {
        // parseFloat(assetInfo.payable_amount) 

        setAssetInfo(prevState => ({
            ...prevState,
            remaining_balance: totalPayableForAccount6 - totalPayableForLoanPaymentList
        }));
    }, [totalPayableForAccount6, totalPayableForLoanPaymentList]);


    const { data: account_head = [], } = useQuery({
        queryKey: ['account_head'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_head/account_head_list`);
            const data = await res.json();
            // Filter out the brand with id 
            // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return data;
        }
    });




    const [selectedFile, setSelectedFile] = useState(Array(assetInfo.length).fill(null));

    // const brand_file_change = (e) => {
    //     const files = e.target.files[0];
    //     setSelectedFile(files);
    // };


    const [fileNames, setFileNames] = useState([]);


    let [file_size_error, set_file_size_error] = useState(null);
    const brand_file_change = (e) => {
        // e?.preventDefault();
        let files = e.target.files[0];
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const fileName = files?.name?.split('.')[0]
        const extension = files?.name?.split('.').pop();
        const newName = `${fileName}.${extension}`;
        const time = `${year}/${month}/${day}/${hours}/${minutes}`;
        const _path = 'employe_loan_payment/' + time + '/' + newName;

        const newSelectedFiles = [...selectedFile];
        newSelectedFiles[0] = files; // Assuming you are updating the first element
        newSelectedFiles[0].path = _path;


        if (Number(files.size) <= 2097152) {
            console.log('checking the file size is okay');
            set_file_size_error("");
            setFileNames(newName);
            setSelectedFile(newSelectedFiles);
            setAssetInfo((prevAssetInfo) => ({
                ...prevAssetInfo,
                img: newSelectedFiles[0]?.path
            }));
            upload(files);
        } else {
            console.log('checking the file size is High');
            set_file_size_error("Max file size 2 MB");
            // newSelectedFiles[index] = null;
            // setSelectedFile(newSelectedFiles);
            // setFileNames(null);
        }


        // setFileNames(newName);
        // setSelectedFile(newSelectedFiles);
        // upload(files);
    };

    console.log(fileNames);

    const upload = (file) => {
        const formData = new FormData();
        const extension = file.name.split('.').pop();
        const fileName = file.name.split('.')[0];
        const newName = `${fileName}.${extension}`;
        formData.append('files', file, newName);
        console.log(file);
        setFileNames(newName);

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/employe_loan_payment/employe_loan_payment_image`, formData)
            .then(res => {
                console.log(res);
            })
            .catch(er => console.log(er));
    };




    console.log(assetInfo)

    const [error, setError] = useState([]);
    const [loan, setLoan] = useState('');
    const [account, setAccount] = useState('');
    const [reference, setReference] = useState('');
    const [amount, setAmount] = useState('');
    const [interest, setInterest] = useState('');
    const [aviable_balance, setAviable_balance] = useState('');
    const [due, setDue] = useState('');
    const [payable_amount, setPayable_amount] = useState('');
    const [payment_date, setPayment_date] = useState('');

    const brand_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...assetInfo }
        attribute[name] = value
        setAssetInfo(attribute)
        // setSameBrandName('')

        const status = attribute['status'];
        if (status) {
            setError(""); // Clear the error message
        }
        const loan = attribute['loan'];
        if (loan) {
            setLoan(""); // Clear the error message
        }
        const account = attribute['account'];
        if (account) {
            setAccount(""); // Clear the error message
        }
        const reference = attribute['reference'];
        if (reference) {
            setReference(""); // Clear the error message
        }
        const amount = attribute['amount'];
        if (amount) {
            setAmount(""); // Clear the error message
        }
        const interest = attribute['interest'];
        if (interest) {
            setInterest(""); // Clear the error message
        }
        const aviable_balance = attribute['aviable_balance'];
        if (aviable_balance) {
            setAviable_balance(""); // Clear the error message
        }
        const due = attribute['due'];
        if (due) {
            setDue(""); // Clear the error message
        }
        const payable_amount = attribute['payable_amount'];
        if (payable_amount) {
            setPayable_amount(""); // Clear the error message
        }
        const payment_date = attribute['payment_date'];
        if (payment_date) {
            setPayment_date(""); // Clear the error message
        }

    };

    const router = useRouter()



    const brand_combined_change = (e) => {


        brand_file_change(e);
    };



    const brand_image_remove = (index) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this?');
        if (confirmDelete) {
            const newSelectedFiles = [...selectedFile];
            newSelectedFiles[0] = null;
            setSelectedFile(newSelectedFiles);
            const filePathToDelete = assetInfo.img;
            if (filePathToDelete) {
                axios.delete(`${process.env.NEXT_PUBLIC_API_URL}:5003/${filePathToDelete}`)
                    .then(res => {
                        console.log(`File ${filePathToDelete} deleted successfully`);
                        // Update assetInfo to remove the file path
                        setAssetInfo(prevData => ({
                            ...prevData,
                            img: '',
                        }));
                    })
                    .catch(err => {
                        console.error(`Error deleting file ${filePathToDelete}:`, err);
                    });
            }
        }
    };



    const [status, setStatus] = useState([]);
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
            .then(res => res.json())
            .then(data => setStatus(data))
    }, [])


    const [formattedDisplayDate, setFormattedDisplayDate] = useState('');


    const handleDateSelection = (event) => {
        const inputDate = event.target.value; // Directly get the value from the input

        const day = String(inputDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
        const month = String(inputDate.split('-')[1]).padStart(2, '0');
        const year = String(inputDate.split('-')[0]);
        const formattedDate = `${day}-${month}-${year}`;
        const formattedDatabaseDate = `${year}-${month}-${day}`;
        setFromDate(formattedDate);
        setAssetInfo(prevData => ({
            ...prevData,
            payment_date: formattedDatabaseDate // Update the dob field in the state
        }));
        if (formattedDatabaseDate) {
            setPayment_date('')
        }
    };

    useEffect(() => {
        const dob = assetInfo.payment_date;
        const formattedDate = dob?.split('T')[0];

        if (formattedDate?.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            setFormattedDisplayDate(`${day}-${month}-${year}`);
        } else {
            console.log("Date format is incorrect:", formattedDate);
        }
    }, [assetInfo]);



    const loan_payment_create = (e) => {
        e.preventDefault();
        const form = e.target; // Access the form

        // if (!assetInfo.asset_name) {
        //     setBrandName('Please enter a brand name.');
        //     return; // Prevent further execution
        // }

        // if (!assetInfo.status) {
        //     setError('Please select a status.');
        //     return; // Prevent further execution
        // }
        // if (!assetInfo.status) {

        //     return setError("Select A status"); // Clear the error message
        // }

        // if (!assetInfo.loan) {

        //     return setLoan("Select Loan"); // Clear the error message
        // }

        // if (!assetInfo.account) {

        //     return setAccount("Select A Account"); // Clear the error message
        // }

        // if (!assetInfo.reference) {

        //     return setReference("Enter A reference"); // Clear the error message
        // }

        // if (!assetInfo.amount) {

        //     return setAmount("Enter A amount"); // Clear the error message
        // }

        // if (!assetInfo.interest) {

        //     return setInterest("Enter Interest"); // Clear the error message
        // }

        // if (!assetInfo.aviable_balance) {

        //     return setAviable_balance("Enter Aviable Balance"); // Clear the error message
        // }

        // // if (!assetInfo.due) {
        // //     return setDue("Enter "); // Clear the error message
        // // }

        // if (!assetInfo.payable_amount) {

        //     return setPayable_amount("Enter PAyable Amount"); // Clear the error message
        // }

        // if (!assetInfo.payment_date) {

        //     return setPayment_date("Enter Payment Date"); // Clear the error message
        // }

        // Retrieve the form's image value

        // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/loan_payment/loan_payment_create
        // Make the fetch request
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employe_loan_payment/employe_loan_payment_create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(assetInfo)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data) {
                    sessionStorage.setItem("message", "Data Update successfully!");
                    router.push(`/Admin/employe_loan_payment/employe_loan_payment_all?page_group=${page_group}`);
                }
            })
            .catch(error => {
                console.error('Error updating brand:', error);
            });
    };


    // const employeeIdForId1 = loanAll?.filter(item => item.id == (assetInfo.loan)).map(item => item.employee_id);

    // console.log(employeeIdForId1); // Output: [14013]

    const employeeDetails = loanAll
        .filter(item => item.id == (assetInfo.loan))
        .map(item => ({
            employee_id: item.employee_id,
            full_name: item.full_name
        }));

    console.log(employeeDetails);



    const [selectedData, setSelectedData] = useState({ amount: 0 }); // Example data

    useEffect(() => {
        if (assetInfo.account) {
            const item = account_head.find(item => item.id === parseInt(assetInfo.account));
            if (item) {
                const updatedItem = {
                    ...item,
                    amount: (item.amount || 0) + parseFloat(assetInfo.payable_amount) // Add 100 to amount, 
                };
                setSelectedData(updatedItem); // Set only the matching item
            } else {
                setSelectedData(null); // Clear if no match
            }
        }
    }, [account_head, assetInfo.payable_amount, assetInfo.account]); // Trigger when selectedEntryType changes

    console.log(selectedData)
    console.log(assetInfo.account)




    const account_head_amount_update = (e) => {
        e.preventDefault();

        const payload = {
            selectedData: selectedData,
            selectedEntryType: assetInfo.account
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




    return (
        // col-md-12
        // <div class=" body-content bg-light">
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>
                        <div class=" border-primary shadow-sm border-0">
                            <div class="card-header py-1  custom-card-header clearfix bg-gradient-primary text-white">
                                <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create Employe Loan Payment</h5>
                                <div class="card-title font-weight-bold mb-0 card-header-color float-right">
                                    <Link href={`/Admin/employe_loan_payment/employe_loan_payment_all?page_group=${page_group}`} class="btn btn-sm btn-info">Employe Loan Payment List</Link></div>
                            </div>
                            <form action="" onSubmit={(e) => { account_head_amount_update(e); loan_payment_create(e); }} >
                                <div class="card-body">

                                    <div class=" row no-gutters">
                                        <div class="col-md-6">
                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Loan Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <select
                                                        value={assetInfo.loan}
                                                        onChange={
                                                            brand_input_change
                                                        }
                                                        name='loan'

                                                        class="form-control form-control-sm " placeholder="Enter Role Name">
                                                        <option value=''>Select Loan</option>
                                                        {
                                                            loanAll.map(sta =>
                                                                <>

                                                                    <option value={sta.id}>{sta.loan_name}</option>
                                                                </>

                                                            )
                                                        }
                                                    </select>
                                                    {
                                                        loan && <p className='text-danger'>{loan}</p>
                                                    }
                                                </div>
                                            </div>

                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Employee Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <select
                                                        value={assetInfo.employee_id} onChange={brand_input_change}
                                                        name='employee_id'

                                                        class="form-control form-control-sm " placeholder="Enter Role Name">
                                                        <option value=''>Select Employee Name</option>
                                                        {
                                                            employeeDetails.map(sta =>
                                                                <>

                                                                    <option value={sta.employee_id}>{sta.full_name}</option>
                                                                </>

                                                            )
                                                        }
                                                    </select>

                                                </div>
                                            </div>

                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Account:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <select
                                                        value={assetInfo.account} onChange={brand_input_change}
                                                        name='account'

                                                        class="form-control form-control-sm " placeholder="Enter Role Name">
                                                        <option value=''>Select Account</option>
                                                        {
                                                            account_head.map(sta =>
                                                                <>

                                                                    <option value={sta.id}>{sta.account_head_name}</option>
                                                                </>

                                                            )
                                                        }
                                                    </select>
                                                    {
                                                        account && <p className='text-danger'>{account}</p>
                                                    }
                                                </div>
                                            </div>


                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Reference<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <input type="text" name="reference" value={assetInfo.reference} onChange={brand_input_change}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter  Reference'
                                                        maxLength={256}
                                                    />
                                                    {
                                                        reference && <p className='text-danger'>{reference}</p>
                                                    }

                                                </div>
                                            </div>
                                            {/* <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Aviable Balance<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <input type="number" name="aviable_balance" value={assetInfo.aviable_balance} onChange={brand_input_change}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter  Aviable Balance'
                                                        maxLength={256}
                                                    />
                                                    {
                                                        aviable_balance && <p className='text-danger'>{aviable_balance}</p>
                                                    }


                                                </div>
                                            </div> */}

                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Amount<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <input type="number" name="amount" value={assetInfo.amount} onChange={brand_input_change}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter  Amount'
                                                        maxLength={256}
                                                    />
                                                    {
                                                        amount && <p className='text-danger'>{amount}</p>
                                                    }

                                                </div>
                                            </div>

                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Interest<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <input type="number" name="interest" value={assetInfo.interest} onChange={brand_input_change}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter  Interest'
                                                        maxLength={256}
                                                    />
                                                    {
                                                        interest && <p className='text-danger'>{interest}</p>
                                                    }

                                                </div>
                                            </div>

                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Payable Amount:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <input type="number" name="payable_amount" value={assetInfo.payable_amount} onChange={brand_input_change}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter  Payable Amount'
                                                        maxLength={256}
                                                    />

                                                    {
                                                        payable_amount && <p className='text-danger'>{payable_amount}</p>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Due:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <input readOnly type="number" name="due" value={assetInfo.due} onChange={brand_input_change}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter  Interest'
                                                        maxLength={256}
                                                    />
                                                    {/* {
                                                due && <p className='text-danger'>{due}</p>
                                            } */}

                                                </div>
                                            </div>

                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Remaining Balance:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <input readOnly type="number" name="remaining_balance" value={assetInfo.remaining_balance} onChange={brand_input_change}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter  Interest'
                                                        maxLength={256}
                                                    />
                                                    {/* {
                                                due && <p className='text-danger'>{due}</p>
                                            } */}

                                                </div>
                                            </div>









                                            {/* date  */}


                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Description:</strong></label>
                                                <div className='form-group col-md-8'>

                                                    <textarea
                                                        value={assetInfo.note} onChange={brand_input_change}
                                                        name="note"
                                                        className="form-control form-control-sm"
                                                        placeholder="Enter note"
                                                        rows={5}
                                                        cols={73}
                                                        // style={{ width: '550px', height: '100px' }}
                                                        maxLength={500}
                                                    ></textarea>
                                                    <small className="text-muted">{assetInfo.note.length} / 500</small>
                                                </div>
                                            </div>


                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong> Image:</strong></label>
                                                <div class="col-md-8">

                                                    <div>
                                                        <span class="btn btn-success btn-sm " >
                                                            <label for="fileInput" className='mb-0' ><FaUpload></FaUpload><span className='ml-1'>Select Image</span></label>
                                                            <input
                                                                // multiple
                                                                // name="img"
                                                                onChange={brand_combined_change}
                                                                type="file" id="fileInput" style={{ display: "none" }} />
                                                        </span>
                                                    </div>

                                                    {selectedFile[0] &&
                                                        <>
                                                            <img className="w-100 mb-2 img-thumbnail" onChange={(e) => brand_file_change(e)} src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${selectedFile[0].path}`} alt="Uploaded File" />

                                                            <input type="hidden" name="img" value={selectedFile[0].path} />
                                                            <button onClick={brand_image_remove} type="button" className="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
                                                        </>


                                                    }
                                                    {
                                                        file_size_error && (
                                                            <p className='text-danger'>{file_size_error}</p>
                                                        )
                                                    }

                                                </div>
                                            </div>

                                            <div className="form-group row student">
                                                <label className="col-form-label col-md-3 font-weight-bold">Payment Date:</label>
                                                <div className="col-md-8">

                                                    <input
                                                        type="text"
                                                        readOnly

                                                        defaultValue={formattedDisplayDate}
                                                        onClick={() => document.getElementById(`dateInput-nt`).showPicker()}
                                                        placeholder="dd-mm-yyyy"
                                                        className="form-control form-control-sm mb-2"
                                                        style={{ display: 'inline-block', }}
                                                    />
                                                    <input
                                                        name='payment_date'
                                                        type="date"
                                                        id={`dateInput-nt`}
                                                        onChange={(e) => handleDateSelection(e)}
                                                        style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                                    />
                                                    {
                                                        payment_date && <p className='text-danger'>{payment_date}</p>
                                                    }

                                                </div>


                                            </div>

                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <select
                                                        value={assetInfo.status} onChange={brand_input_change}
                                                        name='status'

                                                        class="form-control form-control-sm " placeholder="Enter Role Name">
                                                        <option value=''>Select</option>
                                                        {
                                                            status.map(sta =>
                                                                <>

                                                                    <option value={sta.id}>{sta.status_name}</option>
                                                                </>

                                                            )
                                                        }
                                                    </select>
                                                    {
                                                        error && <p className='text-danger'>{error}</p>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="offset-md-3 col-sm-6">

                                                <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeLoanPayment;
