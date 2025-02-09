'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';



const EmployeeLoadEdit = ({ id }) => {

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
        account: '', employee_id: '', reference: '', amount: '', interest: '', payable_amount: '', payment_type: '', loan_date: '', duration: '', per_month: '', note: '', status: '', modified_by: created, img: '', loan_reason: '', loan_type: '', per_month_amount: '', loan_name: ''
    });

    useEffect(() => {
        const amount = parseFloat(assetInfo.amount) || 0;
        const payable_amount = parseFloat(assetInfo.interest) || 0;

        setAssetInfo(prevState => ({
            ...prevState,
            payable_amount: amount + payable_amount
        }));
    }, [assetInfo.amount, assetInfo.interest]);

    const { data: loanPaymentList = [],
    } = useQuery({
        queryKey: ['loanPaymentList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employe_loan/employe_loan_all/${id}`)

            const data = await res.json()
            return data
        }
    })

    useEffect(() => {

        setAssetInfo({
            account: loanPaymentList[0]?.account || '',
            employee_id: loanPaymentList[0]?.employee_id || '',
            reference: loanPaymentList[0]?.reference || '',
            amount: loanPaymentList[0]?.amount || '',
            interest: loanPaymentList[0]?.interest || '',
            payable_amount: loanPaymentList[0]?.payable_amount || '',
            payment_type: loanPaymentList[0]?.payment_type || '',
            loan_date: loanPaymentList[0]?.loan_date || '',
            duration: loanPaymentList[0]?.duration || '',
            per_month: loanPaymentList[0]?.per_month || '',
            img: loanPaymentList[0]?.img || '',
            loan_reason: loanPaymentList[0]?.loan_reason || '',
            loan_type: loanPaymentList[0]?.loan_type || '',
            status: loanPaymentList[0]?.status || '',
            note: loanPaymentList[0]?.note || '',
            per_month_amount: loanPaymentList[0]?.per_month_amount || '',
            loan_name: loanPaymentList[0]?.loan_name || '',
            modified_by: created
        });

    }, [loanPaymentList, created]);



    const [selectedEntryType, setSelectedEntryType] = useState('');

    // useEffect(() => {
    //     setSelectedEntryType(assetInfo.payment_type)
    // }, [assetInfo])

    const handleEntryTypeChange = (event) => {
        setSelectedEntryType(event.target.value);
    };

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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/loan/loan_all`)

            const data = await res.json()
            return data
        }
    })

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

    const { data: payment_type = [], } = useQuery({
        queryKey: ['payment_type'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/loan_payment/loan_payment_type_list`);
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
        const _path = 'employe_loan/' + time + '/' + newName;

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

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/employe_loan/employe_loan_image`, formData)
            .then(res => {
                console.log(res);
            })
            .catch(er => console.log(er));
    };




    console.log(assetInfo)


    const [brandName, setBrandName] = useState('')
    const [error, setError] = useState([]);

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
        const brandName = attribute['asset_name']
        if (!brandName || brandName === '') {
            setBrandName('Please enter a brand name.');
        } else {
            setBrandName("");
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
            loan_date: formattedDatabaseDate // Update the dob field in the state
        }));
    };

    useEffect(() => {
        const dob = assetInfo.loan_date;
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

        // Retrieve the form's image value

        // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/loan_payment/loan_payment_create
        // Make the fetch request
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employe_loan/employe_loan_update/${id}`, {
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
                    router.push(`/Admin/employe_loan/employe_loan_all?page_group=${page_group}`);
                }
            })
            .catch(error => {
                console.error('Error updating brand:', error);
            });
    };


    console.log(assetInfo)


    const [selectedData, setSelectedData] = useState({ amount: 0 }); // Example data

    useEffect(() => {
        if (assetInfo.account) {
            const item = account_head.find(item => item.id === parseInt(assetInfo.account));
            if (item) {
                const updatedItem = {
                    ...item,
                    amount: ((item.amount || 0) + parseFloat(loanPaymentList[0]?.payable_amount)) - parseFloat(assetInfo.payable_amount) // Add 100 to amount, 
                };
                setSelectedData(updatedItem); // Set only the matching item
            } else {
                setSelectedData(null); // Clear if no match
            }
        }
    }, [selectedEntryType, account_head, assetInfo.payable_amount, assetInfo.account, loanPaymentList]); // Trigger when selectedEntryType changes

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
            
                if(data){
                    router.push('/Admin/employe_loan_payment/employe_loan_payment_all?page_group=loan_management')
                }
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
                                <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Update Employe Loan</h5>
                                <div class="card-title font-weight-bold mb-0 card-header-color float-right">
                                    <Link href={`/Admin/employe_loan/employe_loan_all?page_group=${page_group}`} class="btn btn-sm btn-info">Back Employe Loan List</Link></div>
                            </div>
                            <form action="" onSubmit={(e) => { account_head_amount_update(e); loan_payment_create(e); }}>
                                <div class="card-body">
                                    <div class=" row no-gutters">
                                        <div class="col-md-6">
                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Loan Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <input type="text" name="loan_name" value={assetInfo.loan_name} onChange={brand_input_change}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter  Loan Name'
                                                        maxLength={256}
                                                    />
                                                    {/* {
                                                        reference && <p className='text-danger'>{reference}</p>
                                                    } */}

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
                                                            employeeList.map(sta =>
                                                                <>

                                                                    <option value={sta.user_id}>{sta.full_name}</option>
                                                                </>

                                                            )
                                                        }
                                                    </select>
                                                    {
                                                        error && <p className='text-danger'>{error}</p>
                                                    }
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Payment Type <small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <select
                                                        value={assetInfo.payment_type} onChange={brand_input_change}
                                                        name='payment_type'

                                                        class="form-control form-control-sm " placeholder="Enter Role Name">
                                                        <option value=''>Select Payment Type</option>
                                                        {
                                                            payment_type.map(sta =>
                                                                <>

                                                                    <option value={sta.id}>{sta.payment_type_name}</option>
                                                                </>

                                                            )
                                                        }
                                                    </select>
                                                    {
                                                        error && <p className='text-danger'>{error}</p>
                                                    }
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

                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Loan Reasone:</strong></label>
                                                <div className='form-group col-md-8'>

                                                    <textarea
                                                        value={assetInfo.loan_reason} onChange={brand_input_change}
                                                        name="loan_reason"
                                                        className="form-control form-control-sm"
                                                        placeholder="Enter Loan Reasone"
                                                        rows={2}
                                                        cols={73}
                                                        // style={{ width: '550px', height: '100px' }}
                                                        maxLength={500}
                                                    ></textarea>
                                                    <small className="text-muted">{assetInfo.loan_reason.length} / 500</small>
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


                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Loan Amount<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <input type="number" name="amount" value={assetInfo.amount} onChange={brand_input_change}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter  Amount'
                                                        maxLength={256}
                                                    />


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


                                                </div>
                                            </div>




                                        </div>
                                        <div class="col-md-6">



                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Payable Amount:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <input type="number" name="payable_amount" value={assetInfo.payable_amount} onChange={brand_input_change}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter  Payable Amount'
                                                        maxLength={256}
                                                    />


                                                </div>
                                            </div>




                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Loan Type:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <select
                                                        value={assetInfo.loan_type} onChange={brand_input_change}
                                                        name='loan_type'

                                                        class="form-control form-control-sm " placeholder="Enter Loan Type Name">
                                                        <option value=''>Select Loan Type</option>
                                                        <option value='term'>Term</option>
                                                        <option value='cash'>Cash</option>

                                                    </select>

                                                </div>
                                            </div>

                                            {assetInfo.loan_type === 'term' ?

                                                <>





                                                    <div class="form-group row">
                                                        <label class="col-form-label col-md-3"><strong>Duration<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                        <div class="col-md-8">
                                                            <input type="number" name="duration" value={assetInfo.duration} onChange={brand_input_change}
                                                                class="form-control form-control-sm  required "
                                                                placeholder='Enter  Duration'
                                                                maxLength={256}
                                                            />


                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label class="col-form-label col-md-3"><strong>Per Month<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                        <div class="col-md-8">
                                                            <input type="number" name="per_month" value={assetInfo.per_month} onChange={brand_input_change}
                                                                class="form-control form-control-sm  required "
                                                                placeholder='Enter  Per Month'
                                                                maxLength={256}
                                                            />


                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label class="col-form-label col-md-3"><strong>Per Month Amount<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                        <div class="col-md-8">
                                                            <input type="number" name="per_month_amount" value={assetInfo.per_month_amount} onChange={brand_input_change}
                                                                class="form-control form-control-sm  required "
                                                                placeholder='Enter  Per Month'
                                                                maxLength={256}
                                                            />


                                                        </div>
                                                    </div>
                                                </>
                                                :

                                                // assetInfo.loan_type == 'cash' ?
                                                //     <div className="form-group row student">
                                                //         <label className="col-form-label col-md-3 font-weight-bold">Payment Date:</label>
                                                //         <div className="col-md-8">

                                                //             <input
                                                //                 type="text"
                                                //                 readOnly

                                                //                 defaultValue={formattedDisplayDate}
                                                //                 onClick={() => document.getElementById(`dateInput-nt`).showPicker()}
                                                //                 placeholder="dd-mm-yyyy"
                                                //                 className="form-control form-control-sm mb-2"
                                                //                 style={{ display: 'inline-block', }}
                                                //             />
                                                //             <input
                                                //                 name='loan_date'
                                                //                 type="date"
                                                //                 id={`dateInput-nt`}
                                                //                 onChange={(e) => handleDateSelection(e)}
                                                //                 style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                                //             />


                                                //         </div>
                                                //     </div>
                                                //     :
                                                <>
                                                </>
                                            }



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
                                                        name='loan_date'
                                                        type="date"
                                                        id={`dateInput-nt`}
                                                        onChange={(e) => handleDateSelection(e)}
                                                        style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                                    />


                                                </div>
                                            </div>
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
                                                <label class="col-form-label col-md-3"><strong>Image:</strong></label>
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

                                                    {selectedFile[0] ?
                                                        <>
                                                            <img className="w-100 mb-2 img-thumbnail" onChange={(e) => brand_file_change(e)} src={URL.createObjectURL(selectedFile[0])} alt="Uploaded File" />

                                                            <input type="hidden" name="file_path" value={selectedFile[0].path} />
                                                            <button onClick={brand_image_remove} type="button" className="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
                                                        </>
                                                        :
                                                        <>
                                                            {
                                                                assetInfo.img ?
                                                                    <>

                                                                        <img
                                                                            className="w-100"
                                                                            src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${assetInfo.img}`}
                                                                            alt="Uploaded File"
                                                                        />
                                                                        <button
                                                                            onClick={brand_image_remove}
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
                                            </div>



                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <select
                                                        value={assetInfo.status} onChange={brand_input_change}
                                                        name='status'

                                                        class="form-control form-control-sm " placeholder="Enter Role Name">
                                                        <option value=''>Select Status</option>
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

export default EmployeeLoadEdit;
