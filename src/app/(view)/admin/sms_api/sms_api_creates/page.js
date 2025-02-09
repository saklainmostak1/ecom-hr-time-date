'use client' 
 //ismile;

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const SmsApiCreate = () => {

    const [branch_id, setBranch_id] = useState('')

    useEffect(() => {
        setFields(prev => ({
            ...prev,
            branch_name: branch_id
        }));
    }, [branch_id]);


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

    const [userId, setUserId] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setUserId(storedUserId);
        }
    }, []);

    const [fields, setFields] = useState({
        created_by: userId,
        balance_url: '',
        balance_param: '',
        balance_rate: '',
        branch_name: branch_id,
        api_name: '',
        main_url: '',
        api_url: '',
        method_name: '',
        api_type: '',
        status_url: '',
        sms_api_params: [
            { api_key: '', api_value: '', options: '' }
        ]
    });
    console.log(branch_id)
    const [numToAdd, setNumToAdd] = useState(1);

    const handleAddMore = () => {
        const numToAddInt = parseInt(numToAdd);
        if (!isNaN(numToAddInt) && numToAddInt > 0) {
            const newParams = Array.from({ length: numToAddInt }, () => ({
                api_key: '',
                api_value: '',
                options: '',

            }));
            setFields(prev => ({
                ...prev,
                sms_api_params: [...prev.sms_api_params, ...newParams]
            }));
            setNumToAdd(1);
        }
    };

    // const handleInputChange = (event) => {
    //     const { name, value } = event.target;
    //     setFields(prev => ({
    //         ...prev,
    //         [name]: value
    //     }));
    // };
    const [api_name, setapi_name] = useState('')
    const [api_url, setapi_url] = useState('')
    const [status_url, setstatus_url] = useState('')
    const [balance_url, setbalance_url] = useState('')
    const [balance_rate, setbalance_rate] = useState('')
    const [balance_param, setbalance_param] = useState('')


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFields(prev => {
            const updatedFields = { ...prev, [name]: value };

            const experience = updatedFields['api_name'];
            if (experience) {
                setapi_name(""); // Clear the error message
            }

            const api_url = updatedFields['api_url'];
            if (api_url) {
                setapi_url(""); // Clear the error message
            }

            const status_url = updatedFields['status_url'];
            if (status_url) {
                setstatus_url(""); // Clear the error message
            }
            const balance_url = updatedFields['balance_url'];
            if (balance_url) {
                setbalance_url(""); // Clear the error message
            }

            const balance_rate = updatedFields['balance_rate'];
            if (balance_rate) {
                setbalance_rate(""); // Clear the error message
            }

            const balance_param = updatedFields['balance_param'];
            if (balance_param) {
                setbalance_param(""); // Clear the error message
            }

            // Update main_url if api_url is changed
            if (name === 'api_url') {
                const mainUrl = value.includes('?') ? value.slice(0, value.indexOf('?') + 1) : value;
                updatedFields.main_url = mainUrl;
            }

            return updatedFields;
        });
    };


    const [result, setResult] = useState('')
    const [passingYear, setPassingYear] = useState('')

    const handleChange = (index, event) => {
        const { name, value, type, files } = event.target;




        setFields(prev => {
            const updatedParams = [...prev.sms_api_params];
            if (type === 'file') {
                updatedParams[index][name] = files[0];
            } else {
                updatedParams[index][name] = value;
            }

            const education = updatedParams[index]['api_key'];
            if (education) {
                setResult('')
            }
            const educations = updatedParams[index]['api_value'];
            if (educations) {
                setPassingYear('')
            }

            // Check if "Number" option (value 1) is selected and update api_value with branch mobile
            if (name === 'options' && value === '1') {
                const branchId = document.querySelector('select[name="options"]').value;
                const selectedBranch = branchAll.find(branch => branch.id === parseInt(branchId));
                if (selectedBranch && selectedBranch.mobile) {
                    updatedParams[index]['api_value'] = selectedBranch.mobile;
                }
            } else if (name === 'options' && value === '2') {
                updatedParams[index]['api_value'] = 'hello';
            } else if (name === 'options' && value !== '1') {
                updatedParams[index]['api_value'] = '';
            }

            return { ...prev, sms_api_params: updatedParams };
        });
    };

    const handleRemoveField = (index) => {
        setFields(prev => {
            const updatedParams = prev.sms_api_params.filter((_, i) => i !== index);
            return { ...prev, sms_api_params: updatedParams };
        });
    };



    const handleBranchChange = (e) => {
        const newBranchId = e.target.value;
        setBranch_id(newBranchId)
        setFields(prev => {
            const updatedParams = prev.sms_api_params.map(param => {
                if (param.options === '1') {
                    const selectedBranch = branchAll.find(branch => branch.id === parseInt(newBranchId));
                    return {
                        ...param,
                        api_value: selectedBranch ? selectedBranch.mobile : ''
                    };
                }
                return param;
            });
            return { ...prev, sms_api_params: updatedParams };
        });
    };

    const { data: branchAll = [] } = useQuery({
        queryKey: ['branchAll'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`);
            const data = await res.json();
            return data;
        }
    });

    console.log(fields);



    const router = useRouter()
    const sms_api_create = (event) => {
        event.preventDefault();

        if (!fields.api_name) {
            setapi_name(' Must Be filled')
            return
        }
        if (!fields.api_url) {
            setapi_url(' Must Be filled')
            return
        }
        if (!fields.status_url) {
            setstatus_url(' Must Be filled')
            return
        }
        if (!fields.balance_url) {
            setbalance_url(' Must Be filled')
            return
        }
        if (!fields.balance_rate) {
            setbalance_rate(' Must Be filled')
            return
        }
        if (!fields.balance_param) {
            setbalance_param(' Must Be filled')
            return
        }

        const newErrorName = new Array(fields.sms_api_params.length).fill('');
        const isValidsName = fields.sms_api_params.every((inputValue, index) => {
            if (!inputValue?.api_key) {
                newErrorName[index] = 'Must be filled.';
                return false;
            }
            return true;
        });

        if (!isValidsName) {
            setResult(newErrorName);
            return;
        }
        setResult(new Array(fields.length).fill(''));


        const newErrorGender = new Array(fields.sms_api_params.length).fill('');
        const isValidsGender = fields.sms_api_params.every((inputValue, index) => {
            if (!inputValue?.api_value) {
                newErrorGender[index] = 'Must be filled.';
                return false;
            }
            return true;
        });

        if (!isValidsGender) {
            setPassingYear(newErrorGender);
            return;
        }
        setPassingYear(new Array(fields.length).fill(''));


        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sms_api/sms_api_create`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(fields),
        })
            .then((Response) => {
                Response.json();
                if (Response.ok === true) {
                    console.log(Response)
                    if (typeof window !== 'undefined') {
                        sessionStorage.setItem("message", "Data saved successfully!");
                    }
                    router.push('/Admin/sms_api/sms_api_all?page_group=sms_management');
                }
            })
            .catch((error) => console.error(error));
    };



    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-12 p-4'>
                    <div className='card mb-4'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">
                                        Sms API Create
                                    </h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/sms_api/sms_api_all?page_group=${page_group}`} className="btn btn-sm btn-info">
                                            Back To Sms API List
                                        </Link>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={sms_api_create} className="form-horizontal" method="post" autoComplete="off">
                                        <div className="form-group row">
                                            <label className="control-label font-weight-bold col-md-2">
                                                API Name: <small><sup><i className="text-danger fas fa-star"></i></sup></small>
                                            </label>
                                            <div className="col-md-8">
                                                <input
                                                    name='api_name'
                                                    value={fields.api_name}
                                                    onChange={handleInputChange}
                                                    type="text" className="form-control form-control-sm required" placeholder="Enter SMS Name" />
                                                {
                                                    api_name && <p className='text-danger'>{api_name}</p>
                                                }
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="control-label font-weight-bold col-md-2">
                                                SMS API URL: <small><sup><i className="text-danger fas fa-star"></i></sup></small>
                                            </label>
                                            <div className="col-md-8">
                                                <input
                                                    name='api_url'
                                                    value={fields.api_url}
                                                    onChange={handleInputChange}
                                                    type="text" className="form-control form-control-sm required" placeholder="Enter SMS API URL" />
                                                {
                                                    api_url && <p className='text-danger'>{api_url}</p>
                                                }
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="control-label font-weight-bold col-md-2">
                                                Branch Name:
                                            </label>
                                            <div className="col-md-8">
                                                <select
                                                    onChange={handleBranchChange}
                                                    // value={fields.branch_name}
                                                    name="options" className="form-control form-control-sm">
                                                    <option value="0">Select A Branch</option>
                                                    {
                                                        branchAll.map(branch =>
                                                            <option key={branch.id} value={branch.id}>{branch.branch_name}</option>
                                                        )
                                                    }
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <div className="col-md-8 offset-md-2">
                                                <div className="card border-primary shadow-sm border-0">
                                                    <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                                                        <h5 className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">SMS API Param</h5>
                                                        <div className="card-title card-header-color font-weight-bold mb-0 float-right">
                                                            <div className="input-group">
                                                                <input
                                                                    value={numToAdd}
                                                                    onChange={(event) => setNumToAdd(event.target.value)}
                                                                    type="number" className="form-control form-control-sm add_text" min="1" />
                                                                <span className="input-group-btn">
                                                                    <button className="btn btn-info btn-sm add_more" type="button" onClick={handleAddMore}>
                                                                        Add
                                                                    </button>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="form-group row px-3">
                                                            <table className="table table-bordered table-hover table-striped table-sm">
                                                                <thead>
                                                                    <tr>
                                                                        <th>SMS API Param <small><sup><i className="text-danger fas fa-star"></i></sup></small></th>
                                                                        <th>SMS API Param Value <small><sup><i className="text-danger fas fa-star"></i></sup></small></th>
                                                                        <th>Options</th>
                                                                        <th>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {fields.sms_api_params.map((param, index) => (
                                                                        <tr key={index}>
                                                                            <td>
                                                                                <input
                                                                                    value={param.api_key}
                                                                                    onChange={(e) => handleChange(index, e)}
                                                                                    type="text" name="api_key" className="form-control form-control-sm required" placeholder="Enter API Key" />
                                                                                {
                                                                                    result[index] && <p className='text-danger'>{result}</p>
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    disabled={param.options === '1' || param.options === '2'}
                                                                                    value={param.api_value}
                                                                                    onChange={(e) => handleChange(index, e)}
                                                                                    type="text" name="api_value" className="form-control form-control-sm required" placeholder="Enter API Value" />
                                                                                {
                                                                                    passingYear[index] && <p className='text-danger'>{passingYear}</p>
                                                                                }
                                                                            </td>

                                                                            <td>
                                                                                <select
                                                                                    value={param.options}
                                                                                    onChange={(e) => handleChange(index, e)}
                                                                                    name="options"
                                                                                    className="form-control form-control-sm"
                                                                                >
                                                                                    <option value="">Select Option</option>
                                                                                    <option value="1">Number</option>
                                                                                    <option value="2">Message</option>

                                                                                </select>
                                                                            </td>

                                                                            <td>
                                                                                <button onClick={() => handleRemoveField(index)} type="button" className="btn btn-sm btn-danger"><i className="fas fa-trash-alt"></i></button>
                                                                                {/* <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveField(index)}>Remove</button> */}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="control-label font-weight-bold col-md-2">API Balance URL: <small><sup><i className="text-danger fas fa-star"></i></sup></small></label>
                                            <div className="col-md-8">
                                                <div className="input-group input-group-sm">
                                                    <input onChange={handleInputChange} value={fields.balance_url} type="text" name="balance_url" className="form-control form-control-sm" placeholder="Enter API Balance URL" />
                                                    <br />
                                                    {
                                                        balance_url && <p className='text-danger'>{balance_url}</p>
                                                    }
                                                    <input onChange={handleInputChange} value={fields.balance_rate} type="text" name="balance_rate" className="form-control form-control-sm" placeholder="SMS Rate" /> <br />
                                                    {
                                                        balance_rate && <p className='text-danger'>{balance_rate}</p>
                                                    }
                                                    <input onChange={handleInputChange} value={fields.balance_param} type="text" name="balance_param" className="form-control form-control-sm" placeholder="Response Param" /> <br />
                                                    {
                                                        balance_param && <p className='text-danger'>{balance_param}</p>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="control-label font-weight-bold col-md-2">Method Name:</label>
                                            <div className="col-md-8">
                                                <select name='method_name'
                                                    value={fields.method_name}
                                                    onChange={handleInputChange} className="form-control form-control-sm required">
                                                    <option value="">Select Method Name</option>
                                                    <option value="get">GET</option>
                                                    <option value="post">POST</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="control-label font-weight-bold col-md-2">SMS API Type:</label>
                                            <div className="col-md-8">
                                                <select name='api_type'
                                                    value={fields.api_type}
                                                    onChange={handleInputChange} className="form-control form-control-sm required">
                                                    <option value="0">Select SMS API Type</option>
                                                    <option value="3">Non Masking/Non Branding</option>
                                                    <option value="4">Masking/Branding</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="control-label font-weight-bold col-md-2">
                                                API Status:<small><sup><i className="text-danger fas fa-star"></i></sup></small>
                                            </label>
                                            <div className="col-md-8">
                                                <select name="status_url"
                                                    value={fields.status_url}
                                                    onChange={handleInputChange} className="form-control form-control-sm required">
                                                    <option value="0">Select Status</option>
                                                    <option value="1">Active</option>
                                                    <option value="2">Inactive</option>
                                                </select>
                                                {
                                                    status_url && <p className='text-danger'>{status_url}</p>
                                                }

                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-md-8 offset-md-2">
                                                <button type="submit" className="btn btn-success btn-sm">Submit</button>

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

export default SmsApiCreate;

