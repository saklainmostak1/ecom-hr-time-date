'use client'
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

const BrandCreate = () => {

    

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


    const { data: companys = [], isLoading, refetch
    } = useQuery({
        queryKey: ['companys'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company/company_all`)

            const data = await res.json()
            return data
        }
    })

    const { data: companysType = []
    } = useQuery({
        queryKey: ['companysType'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company_type/company_type_all`)

            const data = await res.json()
            return data
        }
    })

    console.log(companys)


    const { data: brands = []
    } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`)

            const data = await res.json()
            return data
        }
    })

    console.log(companys)


    let [fields, setFields] = useState([{
        company_id: '', company_type_id: '',
        branch_name: '', status_id: '', office_address: '', mobile: '', email: '', phone: '',
        created_by: created
    }]);

    const [numToAdd, setNumToAdd] = useState(1);

    const [selectedFile, setSelectedFile] = useState(Array(fields.length).fill(null));






    const [company_id, setCompany_id] = useState([])
    const [company_type_id, setCompany_type_id] = useState([])
    const [brance_name, setBrance_name] = useState([])
    const [brandName, setSameBrandName] = useState([])
    const [status_id, setStatus_id] = useState([])
    const [office_address, setOffice_address] = useState([])
    const [mobile, setMobile] = useState([])
    const [email, setEmail] = useState([])
    const [phone, setPhone] = useState([])





    const barnd_change = (index, event) => {

        const newFields = [...fields];

        if (event.target.type === 'file') {
            newFields[index][event.target.name] = event.target.files[0];

        } else {
            newFields[index][event.target.name] = event.target.value;

        }
        const brance_name = newFields[index]['branch_name'];
        if (brance_name) {
            setBrance_name(""); // Clear the error message

        }

        const company_id = newFields[index]['company_id'];
        if (company_id) {
            setCompany_id(""); // Clear the error message

        }

        const company_type_id = newFields[index]['company_type_id'];
        if (company_type_id) {
            setCompany_type_id(""); // Clear the error message

        }

        const status_id = newFields[index]['status_id'];
        if (status_id) {
            setStatus_id(""); // Clear the error message

        }

        const office_address = newFields[index]['office_address'];
        if (office_address) {
            setOffice_address(""); // Clear the error message

        }

        const mobile = newFields[index]['mobile'];
        if (mobile) {
            setMobile(""); // Clear the error message

        }
        const email = newFields[index]['email'];
        if (email) {
            setEmail(""); // Clear the error message

        }
        const phone = newFields[index]['phone'];
        if (phone) {
            setPhone(""); // Clear the error message

        }


        // const matchingBrand = brands.find(item => item?.branch_name?.toLowerCase() === brandName?.toLowerCase());
        // if (matchingBrand) {
        //     setSameBrandName('Branch name already exists!');
        //     // You can also set an error state to show the message in the UI instead of using alert
        // }
        // else {
        //     setSameBrandName("")
        // }


        setFields(newFields);


    };

    // add one more form
    const brand_add_more = () => {
        const numToAddInt = parseInt(numToAdd);
        if (!isNaN(numToAddInt) && numToAddInt > 0) {
            const newInputValues = [...fields];
            for (let i = 0; i < numToAddInt; i++) {
                newInputValues.push({
                    company_id: '', company_type_id: '',
                    branch_name: '', status_id: '', office_address: '', mobile: '', email: '', phone: '',
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
            if (!inputValue.branch_name.trim()) {
                newErrors[index] = 'Brance Name must be filled.';
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
            if (!inputValue?.company_id?.trim()) {
                newError[index] = 'Company Name must be filled.';
                return false;
            }
            return true;
        });

        if (!isValids) {
            setCompany_id(newError);
            return;
        }
        setCompany_id(new Array(fields.length).fill(''));


        const newErrorCompanyType = new Array(fields.length).fill('');
        const isValidsCompanyType = fields.every((inputValue, index) => {
            if (!inputValue?.company_type_id?.trim()) {
                newErrorCompanyType[index] = 'Company Type Name must be filled.';
                return false;
            }
            return true;
        });

        if (!isValidsCompanyType) {
            setCompany_type_id(newErrorCompanyType);
            return;
        }
        setCompany_type_id(new Array(fields.length).fill(''));


        const newErrorStatus = new Array(fields.length).fill('');
        const isValidsStatus = fields.every((inputValue, index) => {
            if (!inputValue?.status_id?.trim()) {
                newErrorStatus[index] = 'Status Name must be filled.';
                return false;
            }
            return true;
        });

        if (!isValidsStatus) {
            setStatus_id(newErrorStatus);
            return;
        }
        setStatus_id(new Array(fields.length).fill(''));



        const newErrorAdress = new Array(fields.length).fill('');
        const isValidsAdress = fields.every((inputValue, index) => {
            if (!inputValue?.office_address?.trim()) {
                newErrorAdress[index] = 'Office Adress  must be filled.';
                return false;
            }
            return true;
        });

        if (!isValidsAdress) {
            setOffice_address(newErrorAdress);
            return;
        }
        setOffice_address(new Array(fields.length).fill(''));


        const newErrorMobile = new Array(fields.length).fill('');
        const isValidsMobile = fields.every((inputValue, index) => {
            if (!inputValue?.mobile?.trim()) {
                newErrorMobile[index] = 'Mobile  must be filled.';
                return false;
            }
            return true;
        });

        if (!isValidsMobile) {
            setMobile(newErrorMobile);
            return;
        }
        setMobile(new Array(fields.length).fill(''));


        const newErrorEmail = new Array(fields.length).fill('');
        const isValidsEmail = fields.every((inputValue, index) => {
            if (!inputValue?.email?.trim()) {
                newErrorEmail[index] = 'Email  must be filled.';
                return false;
            }
            return true;
        });

        if (!isValidsEmail) {
            setEmail(newErrorEmail);
            return;
        }
        setEmail(new Array(fields.length).fill(''));


        const newErrorPhone = new Array(fields.length).fill('');
        const isValidsPhone = fields.every((inputValue, index) => {
            if (!inputValue?.phone?.trim()) {
                newErrorPhone[index] = 'Phone  must be filled.';
                return false;
            }
            return true;
        });

        if (!isValidsPhone) {
            setPhone(newErrorPhone);
            return;
        }
        setPhone(new Array(fields.length).fill(''));












        const normalizebrandName = (name) => {
            return name?.trim().replace(/\s+/g, '');
        };

        if (fields.length === 1) {
            const newErrorSamebrandName = new Array(fields.length).fill('');
            const isValidsSamebrand = fields.every((inputValue, index) => {
                const isExistingbrand = brands.find(item => normalizebrandName(item?.branch_name?.toLowerCase()) === normalizebrandName(inputValue?.branch_name?.toLowerCase()));
                if (isExistingbrand) {
                    newErrorSamebrandName[index] = 'Brance name already exists!';
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
                const isExistingbrand = brands.find(item => normalizebrandName(item?.branch_name?.toLowerCase()) === normalizebrandName(inputValue?.branch_name?.toLowerCase()));
                if (isExistingbrand && !errorMessageSet) {
                    newErrorSamebrandName[index] = 'Brance name already exists!';
                    errorMessageSet = true;
                }
            });

            setSameBrandName(newErrorSamebrandName);
        }

        const normalizedBrandNames = fields.map(inputValue => normalizebrandName(inputValue?.branch_name?.toLowerCase()));
        const uniqueBrandNames = Array.from(new Set(normalizedBrandNames));
        const uniqueFields = uniqueBrandNames.map(brandName => {
            const index = normalizedBrandNames.indexOf(brandName);
            return fields[index];
        });

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_create`, {
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
                    router.push('/Admin/branch/branch_all');
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


    const [status, setStatus] = useState([]);
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
            .then(res => res.json())
            .then(data => setStatus(data))
    }, [])










    return (
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="card-default">
                            <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Create Brance</h5>
                                <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
                                    <Link href={`/Admin/branch/branch_all?page_group=${page_group}`} className="btn btn-sm btn-info h-50">Back to Brance List</Link>
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
                                                    <strong>Brance Create</strong>
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
                                                <div className="form-group row px-3 table-responsive">
                                                    <table className="table table-bordered  table-hover table-striped table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th>Brance Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                                <th>Company Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                                <th>Company Type Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                                <th>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                                <th>Brance Address<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                                <th>Mobile<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                                <th>Email<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                                <th>Phone<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>

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
                                                                                            value={field.branch_name}
                                                                                            onChange={(e) => barnd_change(index, e)}
                                                                                            type="text" name="branch_name" class="form-control form-control-sm  required row_unique_institute" id="institute" placeholder="Enter Branch Name" />
                                                                                        {
                                                                                            brance_name[index] && <p>{brance_name[index]}</p>
                                                                                        }
                                                                                        {
                                                                                            brandName[index] && <p className='text-danger'>{brandName[index]}</p>
                                                                                        }

                                                                                    </td>

                                                                                    <td>
                                                                                        <select
                                                                                            value={field.company_id}
                                                                                            onChange={(e) => barnd_change(index, e)}
                                                                                            name="company_id" class="form-control form-control-sm  trim integer_no_zero row_unique_education" id="education" placeholder="Enter Education">
                                                                                            <option >Select Company Name</option>
                                                                                            {
                                                                                                companys.map(company =>
                                                                                                    <>
                                                                                                        <option value={company.id}>
                                                                                                            {company.company_name}
                                                                                                        </option>
                                                                                                    </>

                                                                                                )
                                                                                            }

                                                                                        </select>
                                                                                        {
                                                                                            company_id[index] && <p className='text-danger'>{company_id[index]}</p>
                                                                                        }

                                                                                    </td>
                                                                                    <td>
                                                                                        <select
                                                                                            value={field.company_type_id}
                                                                                            onChange={(e) => barnd_change(index, e)}
                                                                                            name="company_type_id" class="form-control form-control-sm  trim integer_no_zero row_unique_education" id="education" placeholder="Enter Education">
                                                                                            <option >Select Company Type</option>
                                                                                            {
                                                                                                companysType.map(company_type =>
                                                                                                    <>
                                                                                                        <option value={company_type.id}>
                                                                                                            {company_type.company_type_name}
                                                                                                        </option>
                                                                                                    </>

                                                                                                )
                                                                                            }

                                                                                        </select>
                                                                                        {
                                                                                            company_type_id[index] && <p className='text-danger'>{company_type_id[index]}</p>
                                                                                        }

                                                                                    </td>
                                                                                    <td>
                                                                                        <select
                                                                                            value={field.status_id}
                                                                                            onChange={(e) => barnd_change(index, e)}
                                                                                            name="status_id" class="form-control form-control-sm  trim integer_no_zero row_unique_education" id="education" placeholder="Enter Education">
                                                                                            <option >Select Status</option>
                                                                                            {
                                                                                                status.map(status =>
                                                                                                    <>
                                                                                                        <option value={status.id}>
                                                                                                            {status.status_name}
                                                                                                        </option>
                                                                                                    </>

                                                                                                )
                                                                                            }

                                                                                        </select>
                                                                                        {
                                                                                            status_id[index] && <p className='text-danger'>{status_id[index]}</p>
                                                                                        }

                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            value={field.office_address}
                                                                                            onChange={(e) => barnd_change(index, e)}
                                                                                            type="text" name="office_address" class="form-control form-control-sm  required row_unique_institute" id="institute" placeholder="Enter Branch Address" />
                                                                                        {
                                                                                            office_address[index] && <p className='text-danger'>{office_address[index]}</p>
                                                                                        }
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            value={field.mobile}
                                                                                            onChange={(e) => barnd_change(index, e)}
                                                                                            type="text" name="mobile" class="form-control form-control-sm  required row_unique_institute" id="institute" placeholder="Enter Mobile Number" />
                                                                                        {
                                                                                            mobile[index] && <p className='text-danger'>{mobile[index]}</p>
                                                                                        }
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            value={field.email}
                                                                                            onChange={(e) => barnd_change(index, e)}
                                                                                            type="text" name="email" class="form-control form-control-sm  required row_unique_result" id="result" placeholder="Enter Email" />
                                                                                        {
                                                                                            email[index] && <p className='text-danger'>{email[index]}</p>
                                                                                        }
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            value={field.phone}
                                                                                            onChange={(e) => barnd_change(index, e)}
                                                                                            type="text" name="phone" class="form-control form-control-sm  required row_unique_passing_year" id="passing_year" placeholder="Enter Phone Number" />
                                                                                        {
                                                                                            phone[index] && <p className='text-danger'>{phone[index]}</p>
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

export default BrandCreate;


