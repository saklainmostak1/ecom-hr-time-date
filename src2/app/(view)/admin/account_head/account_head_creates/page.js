'use client' 
 //ismile
import React, { useState, useEffect } from 'react';
import '../../../../(view)/admin_layout/modal/fa.css'
import axios from 'axios';
import Link from 'next/link';
import { FaDownload, FaTimes, FaUpload } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import '../../../admin_layout/modal/fa.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const AccountHeadCreate = () => {



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


    const { data: accountHeadTypes = [], isLoading, refetch
    } = useQuery({
        queryKey: ['accountHeadTypes'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_head_type/account_head_type_all`)

            const data = await res.json()
            return data
        }
    })


    const { data: brands = []
    } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_head/account_head_all`)

            const data = await res.json()
            return data
        }
    })

    console.log(accountHeadTypes)


    let [fields, setFields] = useState([{
        account_type_id: '',
        account_head_name: '', opening_balance: '',
        created_by: created
    }]);

    const [numToAdd, setNumToAdd] = useState(1);

    const [selectedFile, setSelectedFile] = useState(Array(fields.length).fill(null));






    const [account_type_id, setCompany_id] = useState([])


    const [brance_name, setBrance_name] = useState([])
    const [brandName, setSameBrandName] = useState([])
    const [opening_balance, setOffice_address] = useState([])






    const barnd_change = (index, event) => {

        const newFields = [...fields];

        if (event.target.type === 'file') {
            newFields[index][event.target.name] = event.target.files[0];

        } else {
            newFields[index][event.target.name] = event.target.value;

        }
        const brance_name = newFields[index]['account_head_name'];
        if (brance_name) {
            setBrance_name(""); // Clear the error message

        }

        const account_type_id = newFields[index]['account_type_id'];
        if (account_type_id) {
            setCompany_id(""); // Clear the error message

        }



        const opening_balance = newFields[index]['opening_balance'];
        if (opening_balance) {
            setOffice_address(""); // Clear the error message

        }




        const matchingBrand = brands.find(item => item?.account_head_name?.toLowerCase() === brance_name?.toLowerCase());
        if (matchingBrand) {
            setSameBrandName('Account Head name already exists!');
            // You can also set an error state to show the message in the UI instead of using alert
        }
        else {
            setSameBrandName("")
        }


        setFields(newFields);


    };

    // add one more form
    const brand_add_more = () => {
        const numToAddInt = parseInt(numToAdd);
        if (!isNaN(numToAddInt) && numToAddInt > 0) {
            const newInputValues = [...fields];
            for (let i = 0; i < numToAddInt; i++) {
                newInputValues.push({
                    account_type_id: '',

                    account_head_name: '', opening_balance: '',
                    created_by: created
                });
            }
            setFields(newInputValues);
            setNumToAdd(1);
        }
    };


    // remove one form
    const brand_remove_field = (index) => {

        const confirmDelete = window.confirm('Sure you want to delete this?');

        if (confirmDelete) {
            const newSelectedFiles = [...selectedFile];
            const newFields = [...fields];

            newFields.splice(index, 1);
            setFields(newFields);

            newSelectedFiles.splice(index, 1);
            setSelectedFile(newSelectedFiles);
        }


    };



    const brand_create = (event) => {

        event.preventDefault();



        const newErrors = new Array(fields.length).fill('');
        const isValid = fields.every((inputValue, index) => {
            if (!inputValue.account_head_name.trim()) {
                newErrors[index] = 'Account Head Name must be filled.';
                return false;
            }
            return true;
        });

        if (!isValid) {
            setBrance_name(newErrors);
            return;
        }
        setBrance_name(new Array(fields.length).fill(''));

        const newError = new Array(fields.length).fill('');
        const isValids = fields.every((inputValue, index) => {
            if (!inputValue?.account_type_id?.trim()) {
                newError[index] = 'Account Type Name must be filled.';
                return false;
            }
            return true;
        });

        if (!isValids) {
            setCompany_id(newError);
            return;
        }
        setCompany_id(new Array(fields.length).fill(''));




        const newErrorAdress = new Array(fields.length).fill('');
        const isValidsAdress = fields.every((inputValue, index) => {
            if (!inputValue?.opening_balance?.trim()) {
                newErrorAdress[index] = 'Opening Balance  must be filled.';
                return false;
            }
            return true;
        });

        if (!isValidsAdress) {
            setOffice_address(newErrorAdress);
            return;
        }
        setOffice_address(new Array(fields.length).fill(''));



        const normalizebrandName = (name) => {
            return name?.trim().replace(/\s+/g, '');
        };

        if (fields.length === 1) {
            const newErrorSamebrandName = new Array(fields.length).fill('');
            const isValidsSamebrand = fields.every((inputValue, index) => {
                const isExistingbrand = brands.find(item => normalizebrandName(item?.account_head_name?.toLowerCase()) === normalizebrandName(inputValue?.account_head_name?.toLowerCase()));
                if (isExistingbrand) {
                    newErrorSamebrandName[index] = 'Account Head name already exists!';
                    return false;
                }
                return true;
            });

            if (!isValidsSamebrand) {
                setSameBrandName(newErrorSamebrandName);
                return;
            }
            setSameBrandName(new Array(fields.length).fill(''));
        } else if (fields.length > 1) {
            const newErrorSamebrandName = new Array(fields.length).fill('');
            let errorMessageSet = false;

            fields.forEach((inputValue, index) => {
                const isExistingbrand = brands.find(item => normalizebrandName(item?.account_head_name?.toLowerCase()) === normalizebrandName(inputValue?.account_head_name?.toLowerCase()));
                if (isExistingbrand && !errorMessageSet) {
                    newErrorSamebrandName[index] = 'Brance name already exists!';
                    errorMessageSet = true;
                }
            });

            setSameBrandName(newErrorSamebrandName);
        }

        const normalizedBrandNames = fields.map(inputValue => normalizebrandName(inputValue?.account_head_name?.toLowerCase()));
        const uniqueBrandNames = Array.from(new Set(normalizedBrandNames));
        const uniqueFields = uniqueBrandNames.map(brandName => {
            const index = normalizedBrandNames.indexOf(brandName);
            return fields[index];
        });

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_head/account_head_create`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(uniqueFields),
        })
            .then((Response) =>
                Response.json()
            )
            .then((data) => {
                if (data[0]?.affectedRows > 0) {
                    sessionStorage.setItem("message", "Data saved successfully!");
                    router.push('/Admin/account_head/account_head_all');
                }
                console.log(data)

            })
            .catch((error) => console.error(error));
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


    const router = useRouter();






    return (
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="card-default">
                            <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Create Account Head</h5>
                                <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
                                    <Link href={`/Admin/account_head/account_head_all?page_group=${page_group}`} className="btn btn-sm btn-info h-50">Back to Account Head List</Link>
                                </div>
                            </div>

                            <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                            </div>
                            <div className="card-body">


                                <div>
                                    <form className="form-horizontal" onSubmit={brand_create}>

                                        <div>
                                            <div className="card-header custom-card-header py-1 clearfix  bg-gradient-primary text-white">

                                                <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
                                                    <strong>Account Head Create</strong>
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
                                                                onClick={brand_add_more}
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
                                                                <th>Account Head Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                                <th>Account Head Type Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                                <th>Opening Balance<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                                <th>Action</th>
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
                                                                                        <input
                                                                                            value={field.account_head_name}
                                                                                            onChange={(e) => barnd_change(index, e)}
                                                                                            type="text" name="account_head_name" class="form-control form-control-sm  required row_unique_institute" id="institute" placeholder="Enter account head name" />
                                                                                        {
                                                                                            brance_name[index] && <p className='text-danger'>{brance_name}</p>
                                                                                        }
                                                                                        {
                                                                                            brandName[index] && <p className='text-danger'>{brandName}</p>
                                                                                        }

                                                                                    </td>

                                                                                    <td>
                                                                                        <select
                                                                                            value={field.account_type_id}
                                                                                            onChange={(e) => barnd_change(index, e)}
                                                                                            name="account_type_id" class="form-control form-control-sm  trim integer_no_zero row_unique_education" id="education" placeholder="Enter Education">
                                                                                            <option >Select Account Head Type Name</option>
                                                                                            {
                                                                                                accountHeadTypes.map(company =>
                                                                                                    <>
                                                                                                        <option value={company.id}>
                                                                                                            {company.account_head_type_name}
                                                                                                        </option>
                                                                                                    </>

                                                                                                )
                                                                                            }

                                                                                        </select>
                                                                                        {
                                                                                            account_type_id[index] && <p className='text-danger'>{account_type_id[index]}</p>
                                                                                        }

                                                                                    </td>


                                                                                    <td>
                                                                                        <input
                                                                                            value={field.opening_balance}
                                                                                            onChange={(e) => barnd_change(index, e)}
                                                                                            type="text" name="opening_balance" class="form-control form-control-sm  required row_unique_institute" id="institute" placeholder="Enter Opening Balance" />
                                                                                        {
                                                                                            opening_balance[index] && <p className='text-danger'>{opening_balance[index]}</p>
                                                                                        }
                                                                                    </td>



                                                                                    <td>
                                                                                        <button
                                                                                            onClick={() => brand_remove_field(index)}
                                                                                            type="button" class="btn btn-sm btn-danger btn-sm remove delete"><i class="fas fa-trash-alt"></i></button>
                                                                                    </td>


                                                                                </tr>
                                                                            </>
                                                                        ))
                                                                    }
                                                                </>
                                                            }
                                                        </tbody>

                                                    </table>


                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="offset-md-3 col-sm-6">
                                                <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
                                            </div>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default AccountHeadCreate;


